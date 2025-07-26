const baseUrl= 'https://madebyconor.com/';

export const environment = {
    production: true,
    baseUrl: baseUrl,
    apiKeyUrl: baseUrl + 's1/apikey/',
    apiUrlChatpGPT: baseUrl + 's1/chat/',
    featureFlags: {
      Gemini: true,
      Deepseek: true,
      ChatGPT: true,
      Mistral: true,
      PromptSampleText: false
    },
};
