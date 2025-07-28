const baseUrl= 'https://madebyconor.com/';

export const environment = {
    production: true,
    baseUrl: baseUrl,
    apiKeyUrl: baseUrl + 'n1/apikey/',
    apiUrlChatGPTChat: baseUrl + 'n1/chatgptchat',
    apiUrlChatGPTPrompt: baseUrl + 'n1/chatgptprompt',
    apiUrlChatGPTGenImage: baseUrl + 'n1/chatgptgenimage',
    featureFlags: {
      Gemini: true,
      Deepseek: true,
      ChatGPT: true,
      Mistral: true,
      PromptSampleText: false
    },
};
