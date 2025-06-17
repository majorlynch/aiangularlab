export const environment = {
    production: false,
    apiKeyGemini: 'AIzaSyDwoRM82oUXz85ML2Qs-hywfFjOxgIncs0',
    apiKeyDeepSeek: process.env["API_KEY_DEEPSEEK"] || '${{env.API_KEY_DEEPSEEK}}',
};
