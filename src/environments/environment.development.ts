const baseUrl= 'https://madebyconor.com/';

export const environment = {
    production: false,
    baseUrl: baseUrl,
    apiKeyUrl: baseUrl + 'n1/apikey/',
    apiUrlGeminiChat: baseUrl + 'n1/geminichat',
    apiUrlDeepSeekChat: baseUrl + 'n1/deepseekchat',
    apiUrlMistralChat: baseUrl + 'n1/mistralchat',
    apiUrlChatGPTChat: baseUrl + 'n1/chatgptchat',
    apiUrlChatGPTPrompt: baseUrl + 'n1/chatgptprompt',
    apiUrlChatGPTGenImage: baseUrl + 'n1/chatgptgenimage',
    featureFlags: {
      ChatGPT: true,
      Gemini: true,
      Deepseek: true,
      Mistral: true,
      PromptSampleText: false
    },
};
