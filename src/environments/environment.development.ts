const baseUrl= 'https://madebyconor.com/';

export const environment = {
    production: false,
    baseUrl: baseUrl,
    apiKeyUrl: baseUrl + 's1/apikey/',
    apiUrlChatGPTChat: baseUrl + 's1/chatgptchat',
    apiUrlChatGPTPrompt: baseUrl + 's1/chatgptprompt',
    apiUrlChatGPTGenImage: baseUrl + 's1/chatgptgenimage',
    featureFlags: {
      Gemini: true,
      Deepseek: true,
      ChatGPT: true,
      Mistral: true,
      PromptSampleText: false
    },
};
