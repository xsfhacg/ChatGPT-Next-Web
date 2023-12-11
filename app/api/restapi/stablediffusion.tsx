// imageGeneration.ts
import { DEFAULT_DRAW_MODELS } from "../../constant";

interface ImageResult {
  success: boolean; // 绘图是否成功
  message: string; // 请求状态信息
  img_url?: string; // 绘图成功时的图片链接
  seed?: number; // 绘图成功时的图片种子
}
export async function generateImage(
  draw_prompt: string,
  draw_model: string = "默认模型",
  draw_size: string = "适配模型(推荐)",
): Promise<ImageResult> {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "3fe973a8-0d92-4af2-91db-02e28e98aedd");

  // 查找和传入的 draw_model_name 匹配的绘图模型对象
  const selectedModel = DEFAULT_DRAW_MODELS.find(
    (model) => model.name === draw_model,
  );
  if (!selectedModel) {
    return { success: false, message: "Invalid draw model name" };
  }
  // 处理绘图尺寸
  let width, height;
  if (draw_size === "适配模型(推荐)") {
    width = selectedModel.width;
    height = selectedModel.height;
  } else {
    [width, height] = draw_size.split("*").map(Number); // 从传入的draw_size中获取宽度和高度
  }

  const requestBody = JSON.stringify({
    prompt: draw_prompt,
    negative_prompt: selectedModel.negative_prompt,
    model_name: selectedModel.value,
    sampler_name: selectedModel.sampler,
    steps: selectedModel.steps,
    cfg_scale: selectedModel.cfg_scale,
    width: width,
    height: height,
    // seed: -1,
    clip_skip: 2,
    n_iter: 1,
    batch_size: 1,
  });
  const drawRequestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: requestBody,
    redirect: "follow",
  };
  const processRequestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  try {
    const response = await fetch(
      "https://api.omniinfer.io/v2/txt2img",
      drawRequestOptions,
    );
    const txt2imgRes = await response.json();
    if (txt2imgRes.code !== 0) {
      return { success: false, message: txt2imgRes.msg };
    }
    const task_id = txt2imgRes.data.task_id;
    return new Promise((resolve) => {
      const timer = setInterval(async () => {
        try {
          const progressResponse = await fetch(
            `https://api.omniinfer.io/v2/progress?task_id=${task_id}`,
            processRequestOptions,
          );
          const resultObj = await progressResponse.json();
          if (resultObj.code !== 0) {
            clearInterval(timer);
            resolve({ success: false, message: resultObj.msg });
            return;
          }
          const progressRes = resultObj.data;
          if (progressRes.status === 1) {
            console.log("progress:", progressRes.current_images);
          } else if (progressRes.status === 2) {
            clearInterval(timer);
            const info = JSON.parse(progressRes.info);
            resolve({
              success: true,
              message: "图像生成结束!",
              img_url: progressRes.imgs[0],
              seed: info.seed,
            });
          } else if (progressRes.status === 3 || progressRes.status === 4) {
            clearInterval(timer);
            resolve({ success: false, message: progressRes.failed_reason });
          }
        } catch (error) {
          clearInterval(timer);
          resolve({ success: false, message: `获取绘图进度失败: ${error}` });
        }
      }, 3000);
    });
  } catch (error) {
    return { success: false, message: `请求失败: ${error}` };
  }
}
