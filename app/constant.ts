export const OWNER = "Yidadaa";
export const REPO = "ChatGPT-Next-Web";
export const REPO_URL = `https://github.com/${OWNER}/${REPO}`;
export const ISSUE_URL = `https://github.com/${OWNER}/${REPO}/issues`;
export const UPDATE_URL = `${REPO_URL}#keep-updated`;
export const RELEASE_URL = `${REPO_URL}/releases`;
export const FETCH_COMMIT_URL = `https://api.github.com/repos/${OWNER}/${REPO}/commits?per_page=1`;
export const FETCH_TAG_URL = `https://api.github.com/repos/${OWNER}/${REPO}/tags?per_page=1`;
export const RUNTIME_CONFIG_DOM = "danger-runtime-config";

export const DEFAULT_CORS_HOST = "https://a.nextweb.fun";
export const DEFAULT_API_HOST = `${DEFAULT_CORS_HOST}/api/proxy`;
export const OPENAI_BASE_URL = "https://api.openai.com";

export enum Path {
  Home = "/",
  Chat = "/chat",
  Settings = "/settings",
  NewChat = "/new-chat",
  Masks = "/masks",
  Auth = "/auth",

  LoginRegister = "/login-register",
  Profile = "/profile",
  Pricing = "/pricing",
  // Balances = "/balances",
}

export enum ApiPath {
  Cors = "/api/cors",
  OpenAI = "/api/openai",
}

export enum SlotID {
  AppBody = "app-body",
  CustomModel = "custom-model",
}

export enum FileName {
  Masks = "masks.json",
  Prompts = "prompts.json",
}

export enum StoreKey {
  Chat = "chat-next-web-store",
  Access = "access-control",
  Config = "app-config",
  Mask = "mask-store",
  Prompt = "prompt-store",
  Update = "chat-update",
  Sync = "sync",
}

export const DEFAULT_SIDEBAR_WIDTH = 300;
export const MAX_SIDEBAR_WIDTH = 500;
export const MIN_SIDEBAR_WIDTH = 230;
export const NARROW_SIDEBAR_WIDTH = 100;

export const ACCESS_CODE_PREFIX = "nk-";

export const LAST_INPUT_KEY = "last-input";
export const UNFINISHED_INPUT = (id: string) => "unfinished-input-" + id;

export const STORAGE_KEY = "chatgpt-next-web";

export const REQUEST_TIMEOUT_MS = 60000;

export const EXPORT_MESSAGE_CLASS_NAME = "export-markdown";

export enum ServiceProvider {
  OpenAI = "OpenAI",
  Azure = "Azure",
}

export const OpenaiPath = {
  ChatPath: "v1/chat/completions",
  UsagePath: "dashboard/billing/usage",
  SubsPath: "dashboard/billing/subscription",
  ListModelPath: "v1/models",
};

export const Azure = {
  ExampleEndpoint: "https://{resource-url}/openai/deployments/{deploy-id}",
};

export const DEFAULT_INPUT_TEMPLATE = `{{input}}`; // input / time / model / lang
export const DEFAULT_SYSTEM_TEMPLATE = `
You are ChatGPT, a large language model trained by OpenAI.
Knowledge cutoff: {{cutoff}}
Current model: {{model}}
Current time: {{time}}
Latex inline: $x^2$ 
Latex block: $$e=mc^2$$
`;

export const SUMMARIZE_MODEL = "gpt-3.5-turbo";

export const KnowledgeCutOffDate: Record<string, string> = {
  default: "2021-09",
  "gpt-4-1106-preview": "2023-04",
  "gpt-4-vision-preview": "2023-04",
};

export const DEFAULT_MODELS = [
  {
    name: "gpt-4",
    available: true,
  },
  {
    name: "gpt-4-0314",
    available: true,
  },
  {
    name: "gpt-4-0613",
    available: true,
  },
  {
    name: "gpt-4-32k",
    available: true,
  },
  {
    name: "gpt-4-32k-0314",
    available: true,
  },
  {
    name: "gpt-4-32k-0613",
    available: true,
  },
  {
    name: "gpt-4-1106-preview",
    available: true,
  },
  {
    name: "gpt-4-vision-preview",
    available: true,
  },
  {
    name: "gpt-3.5-turbo",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-0301",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-0613",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-1106",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-16k",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-16k-0613",
    available: true,
  },
  {
    name: "stablediffusion",
    available: false,
  },
] as const;

export const DEFAULT_DRAW_MODELS = [
  {
    name: "默认模型",
    value: "sdXL_v10VAEFix_92696.safetensors",
    sampler: "Euler",
    negative_prompt:
      "(deformed iris, deformed pupils), text, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, (extra fingers), (mutated hands), poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, (fused fingers), (too many fingers), long neck, camera",
    width: 512,
    height: 768,
    steps: 50,
    cfg_scale: 8,
    available: true,
  },
  {
    name: "写实模型",
    value: "chilloutmix_NiPrunedFp32Fix.safetensors",
    sampler: "DPM++ SDE Karras",
    negative_prompt:
      "illustration, 3d, sepia, painting, cartoons, sketch, (worst quality:2), (low quality:2), (normal quality:2), lowres, bad anatomy, bad hands, normal quality, ((monochrome)), ((grayscale:1.2)), futanari, full-package_futanari, penis_from_girl, newhalf, collapsed eyeshadow, multiple eyebrows, vaginas in breasts,holes on breasts, fleckles, stretched nipples, gigantic penis, nipples on buttocks, analog, analogphoto, signatre, logo,2 faces",
    width: 512,
    height: 768,
    steps: 33,
    cfg_scale: 7,
    available: true,
  },
  {
    name: "国风模型",
    value: "3Guofeng3_v34_74831.safetensors",
    sampler: "Euler a",
    negative_prompt:
      "(((simple background))),monochrome ,lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, lowres, bad anatomy, bad hands, text, error, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, ugly,pregnant,vore,duplicate,morbid,mut ilated,tran nsexual, hermaphrodite,long neck,mutated hands,poorly drawn hands,poorly drawn face,mutation,deformed,blurry,bad anatomy,bad proportions,malformed limbs,extra limbs,cloned face,disfigured,gross proportions, (((missing arms))),(((missing legs))), (((extra arms))),(((extra legs))),pubic hair, plump,bad legs,error legs,username,blurry,bad feet",
    width: 640,
    height: 1024,
    steps: 30,
    cfg_scale: 7,
    available: true,
  },
  {
    name: "动漫模型",
    value: "meinapastel_v6Pastel_76316.safetensors",
    sampler: "DPM++ 2M Karras",
    negative_prompt:
      "(worst quality, low quality:1.4), monochrome, zombie, (interlocked fingers)",
    width: 512,
    height: 1024,
    steps: 20,
    cfg_scale: 7,
    available: true,
  },
  {
    name: "LOGO模型",
    value: "MAGIFACTORYTShirt_magifactoryTShirtModel_7624.safetensors",
    sampler: "DPM++ 2S a Karras",
    negative_prompt:
      "(woman:0.5), badly drawn, noisy, noise, blurred, ugly, cropped, out of frame, (double:1.4), (repeated:1.4), (repeating:1.2), signature, (text:1.2), (font:1.2), watermark, (white background:1.2), clothing structure",
    width: 512,
    height: 512,
    steps: 15,
    cfg_scale: 7,
    available: true,
  },
] as const;

export const DEFAULT_DRAW_SIZES = [
  {
    name: "适配模型(推荐)",
    available: true,
  },
  {
    name: "512*512",
    available: true,
  },
  {
    name: "512*768",
    available: true,
  },
  {
    name: "768*768",
    available: true,
  },
  {
    name: "768*1024",
    available: true,
  },
] as const;

export const CHAT_PAGE_SIZE = 15;
export const MAX_RENDER_MSG_COUNT = 45;
