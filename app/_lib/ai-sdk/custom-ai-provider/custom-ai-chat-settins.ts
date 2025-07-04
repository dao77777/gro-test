import { OpenAICompatibleChatSettings } from '@ai-sdk/openai-compatible';

export type CustomAIChatModelId =
  | "deepseek-chat"
  | "deepseek-reasoner"
  | "qwq-32b"
  | "gemma-3-27b-it"
  | "glm-4-plus"
  | "glm-4-air"
  | "glm-4-air-0111"
  | "glm-4-airx"
  | "glm-4-air-long"
  | "glm-4-flash-x"
  | "glm-4-flash"
  | "glm-4v-plus-0111"
  | "glm-4v-flash"
  | "glm-zero-preview"
  | "glm-4-voice"
  | "glm-4-alltools"
  | "codegeex-4"
  | (string & {});

export type CustomAIChatMatrix = {
  baseURL: string;
  apiKey?: string;
  modelId: CustomAIChatModelId;
}[]

export interface CustomAIChatSettings extends OpenAICompatibleChatSettings {
  // Add any custom settings here
}

export const customAIChatMatrix: CustomAIChatMatrix = [
  {
    baseURL: "https://api.deepseek.com",
    apiKey: process.env.DEEPSEEK_API_KEY,
    modelId: "deepseek-chat",
  },
  {
    baseURL: "https://api.deepseek.com",
    apiKey: process.env.DEEPSEEK_API_KEY,
    modelId: "deepseek-reasoner",
  },
  {
    baseURL: "https://open.bigmodel.cn/api/paas/v4",
    apiKey: process.env.BIGMODEL_API_KEY,
    modelId: "glm-4-plus"
  },
  {
    baseURL: "https://open.bigmodel.cn/api/paas/v4",
    apiKey: process.env.BIGMODEL_API_KEY,
    modelId: "glm-4-air"
  },
  {
    baseURL: "https://open.bigmodel.cn/api/paas/v4",
    apiKey: process.env.BIGMODEL_API_KEY,
    modelId: "glm-4-air-0111"
  },
  {
    baseURL: "https://open.bigmodel.cn/api/paas/v4",
    apiKey: process.env.BIGMODEL_API_KEY,
    modelId: "glm-4-airx"
  },
  {
    baseURL: "https://open.bigmodel.cn/api/paas/v4",
    apiKey: process.env.BIGMODEL_API_KEY,
    modelId: "glm-4-air-long"
  },
  {
    baseURL: "https://open.bigmodel.cn/api/paas/v4",
    apiKey: process.env.BIGMODEL_API_KEY,
    modelId: "glm-4-flash-x"
  },
  {
    baseURL: "https://open.bigmodel.cn/api/paas/v4",
    apiKey: process.env.BIGMODEL_API_KEY,
    modelId: "glm-4-flash"
  },
  {
    baseURL: "https://open.bigmodel.cn/api/paas/v4",
    apiKey: process.env.BIGMODEL_API_KEY,
    modelId: "glm-4v-plus-0111"
  },
  {
    baseURL: "https://open.bigmodel.cn/api/paas/v4",
    apiKey: process.env.BIGMODEL_API_KEY,
    modelId: "glm-4v-flash"
  },
  {
    baseURL: "https://open.bigmodel.cn/api/paas/v4",
    apiKey: process.env.BIGMODEL_API_KEY,
    modelId: "glm-zero-preview"
  },
  {
    baseURL: "https://open.bigmodel.cn/api/paas/v4",
    apiKey: process.env.BIGMODEL_API_KEY,
    modelId: "glm-4-voice"
  },
  {
    baseURL: "https://open.bigmodel.cn/api/paas/v4",
    apiKey: process.env.BIGMODEL_API_KEY,
    modelId: "glm-4-alltools"
  },
  {
    baseURL: "https://open.bigmodel.cn/api/paas/v4",
    apiKey: process.env.BIGMODEL_API_KEY,
    modelId: "codegeex-4"
  }
]