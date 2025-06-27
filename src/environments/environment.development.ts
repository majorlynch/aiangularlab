export const environment = {
    production: false,
    apiKeyGemini: process.env["API_KEY_GEMINI"] || '${{env.API_KEY_GEMINI}}',
    apiKeyDeepSeek: process.env["API_KEY_DEEPSEEK"] || '${{env.API_KEY_DEEPSEEK}}',
    apiKeyMistral: process.env["API_KEY_MISTRAL"] || '${{env.API_KEY_MISTRAL}}',
    apiKeyChatGPT: process.env["API_KEY_CHATGPT"] || '${{env.API_KEY_CHATGPT}}',
    featureFlags: {
      Gemini: true,
      Deepseek: true,
      ChatGPT: true,
      Mistral: true,
    },
};
