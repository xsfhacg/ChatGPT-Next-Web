import * as crypto from "crypto";

interface TranslationResult {
  success: boolean;
  message: string;
}

function md5Hash(input: string): string {
  const hash = crypto.createHash("md5");
  hash.update(input, "utf8"); // 明确指定编码用以匹配服务端预期效果
  return hash.digest("hex");
}

function handleErrorCode(errorCode: string): string {
  // 错误代码的处理转移到这个函数中
  const errorMessages: { [key: string]: string } = {
    "52001": "请求超时, 请重试",
    "52002": "系统错误, 请重试",
    "52003": "未授权用户, 请检查appid是否正确或者服务是否开通",
    "54000": "必填参数为空, 请检查是否少传参数",
    "54001": "签名错误, 请检查您的签名生成方法",
    "54003":
      "访问频率受限, 请降低您的调用频率, 或进行身份认证后切换为高级版/尊享版",
    "54004": "账户余额不足, 请前往管理控制台为账户充值",
    "54005": "长query请求频繁, 请降低长query的发送频率, 3s后再试",
    "58000":
      " 客户端IP非法, 检查个人资料里填写的IP地址是否正确, 可前往开发者信息-基本信息修改",
    "58001": "译文语言方向不支持, 检查译文语言是否在语言列表里",
    "58002": "服务当前已关闭, 请前往管理控制台开启服务",
    "90107": " 认证未通过或未生效, 请前往我的认证查看认证进度",
  };
  return errorMessages[errorCode] || "未知错误";
}

export async function baiduTranslate(
  query: string,
): Promise<TranslationResult> {
  const myHeaders = new Headers();
  // myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Access-Control-Allow-Origin", "*");

  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const appid = "20231207001903460";
  const secret = "rrRYiF91WiOhm0x2CwAB";
  const salt = "202312081530";
  const encodedQ = encodeURIComponent(query);
  const sign = md5Hash(appid + query + salt + secret);

  // const url = `https://api.fanyi.baidu.com/api/trans/vip/translate?q=${encodedQ}&from=auto&to=en&appid=${appid}&salt=${salt}&sign=${sign}`;
  // const url = `https://fanyi-api.baidu.com/api/trans/vip/translate?q=${encodedQ}&from=auto&to=en&appid=${appid}&salt=${salt}&sign=${sign}`;
  const url = `/fanyi_api/api/trans/vip/translate?q=${encodedQ}&from=auto&to=en&appid=${appid}&salt=${salt}&sign=${sign}`;

  try {
    const response = await fetch(url, requestOptions);
    const data = await response.json();

    if (data.error_code) {
      const message = handleErrorCode(data.error_code);
      return { success: false, message: message };
    } else {
      const result = data.trans_result[0].dst;
      return { success: true, message: result };
    }
  } catch (error) {
    return {
      success: false,
      message: "中文绘图提示词翻译请求出错：" + error + ", 请尝试英文提示词！",
    };
  }
}
