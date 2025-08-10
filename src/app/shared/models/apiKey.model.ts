export interface ApiKeyResponse {
  API_KEY_GEMINI: string,
  API_KEY_DEEPSEEK: string,
  API_KEY_MISTRAL: string,
  API_KEY_CHATGPT: string
}


export interface FeatureFlagModel {
        ChatGPT?: boolean,
        Gemini?: boolean,
        Deepseek?: boolean,
        Mistral?: boolean,
        PromptSampleText?: boolean
}

