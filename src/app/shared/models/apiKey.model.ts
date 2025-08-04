export interface ApiKeyResponse {
  API_KEY_GEMINI: string,
  API_KEY_DEEPSEEK: string,
  API_KEY_MISTRAL: string,
  API_KEY_CHATGPT: string
}


export interface FeatureFlagModel {
        Gemini?: boolean,
        Deepseek?: boolean,
        ChatGPT?: boolean,
        Mistral?: boolean,
        PromptSampleText?: boolean
}

