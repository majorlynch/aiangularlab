export const environment = {
    production: false,
    apiKeyGemini: process.env["API_KEY_GEMINI"] || '${{env.API_KEY_GEMINI}}',
    apiKeyDeepSeek: process.env["API_KEY_DEEPSEEK"] || '${{env.API_KEY_DEEPSEEK}}',
};
