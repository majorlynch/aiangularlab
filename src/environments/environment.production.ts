export const environment = {
    production: true,
    apiKeyGemini: process.env["API_KEY_GEMINI"] || '${{env.API_KEY_GEMINI}}',
    apiKeyDeepSeek: process.env["API_KEY_DEEPSEEK"] || '${{env.API_KEY_DEEPSEEK}}',
    apiKeyMistral: process.env["API_KEY_MISTRAL"] || '${{env.API_KEY_MISTRAL}}',
    featureFlags: {
      Gemini: true,
      Deepseek: true,
      Mistral: true,
    },
};
