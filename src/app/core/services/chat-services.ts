import { ApiKeysService } from './api-keys.service';
import { FeatureFlagService } from 'src/app/core/services/feature-flag.service';
import { Injectable, OnInit } from '@angular/core';
import { environment } from '@environment/environment';
import { of, from, Observable, map } from 'rxjs';
import { createPartFromBase64, createUserContent, GenerateContentResponse, GoogleGenAI } from '@google/genai';
import {
  aiDetail,
  ChatHistory,
  MessageDetail,
  TextPrompt,
} from '@models/chat.models';
import { OpenAI } from 'openai';
import { MockChatService } from './mocks/mock-chat-service';
import { AI_NAMES, AI_KEYS } from '@enums/ainame.enum';
import { Mistral } from '@mistralai/mistralai';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  docs: any;
  response: any;
  apiKeyGemini: string = '';
  apiKeyDeepSeek: string = '';
  apiKeyMistral: string = '';
  apiKeyChatGPT: string = '';

  //Gemini
  ai: GoogleGenAI | null = null;

  //Deepseek
  openai: OpenAI | null = null;

  //Mistral
  mistralClient: Mistral | null = null;

  constructor(private http: HttpClient,
    private featureFlagService: FeatureFlagService,
    private apiKeysService: ApiKeysService,
    private mockChatService: MockChatService) {
    this.apiKeysService.getApiKeys().subscribe(keys => {
      if (keys) {
        this.apiKeyGemini = keys[AI_KEYS.GEMINI];
        this.apiKeyDeepSeek = keys[AI_KEYS.DEEPSEEK];
        this.apiKeyMistral = keys[AI_KEYS.MISTRAL];
        this.apiKeyChatGPT = keys[AI_KEYS.CHATGPT];

        //Gemini
        this.ai = new GoogleGenAI({
          apiKey: this.apiKeyGemini,
        });

        //DeepSeek
        this.openai = new OpenAI({
          baseURL: 'https://api.deepseek.com',
          dangerouslyAllowBrowser: true,
          apiKey: this.apiKeyDeepSeek,
        });

        //Mistral
        this.mistralClient = new Mistral({ apiKey: this.apiKeyMistral });
      }
    });
  }

  async getGeminiChatPromise(
    chatPrompt: string,
    userHistory: TextPrompt[],
    aiHistory: TextPrompt[]
  ): Promise<string> {
    if (!this.ai) {
      console.log('Gemini AI not set');
      return '';
    }

    const chat = this.ai.chats.create({
      model: 'gemini-2.0-flash',
      history: [
        {
          role: 'user',
          parts: userHistory,
        },
        {
          role: 'model',
          parts: aiHistory,
        },
      ],
    });

    this.response = await chat.sendMessage({
      message: chatPrompt,
    });
    return this.response.text;
  }

  getGeminiChat(
    chatPrompt: string,
    userHistory: TextPrompt[],
    aiHistory: TextPrompt[],
    returnMockText?: boolean
  ): Observable<string> {
    if (!returnMockText) {
      return from(
        this.getGeminiChatPromise(chatPrompt, userHistory, aiHistory)
      );
    }
    else {
      return from(
        this.mockChatService.getMockResponse()
      );
    }
  }

  async getGeminiImageReadPromise(imageContent: string, imageQuestion: string): Promise<string | undefined> {
    if (!this.ai) {
      console.log('Gemini AI not set');
      return '';
    }
    const response: GenerateContentResponse = await this.ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        createUserContent([
          imageQuestion,
          createPartFromBase64(imageContent, 'image/png'),
        ]),
      ]
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.text;
  }

  getGeminiImageRead(imageContent: string, imageQuestion: string): Observable<string | undefined> {
    return from(this.getGeminiImageReadPromise(imageContent, imageQuestion));
  }


  async getDeepseekChatPromise(chatPrompt: string, chatHistory: ChatHistory[]
  ): Promise<string> {
    if (!this.openai) {
      console.log('Deepseek ai not set');
      return '';
    }
    chatHistory.push({ role: 'user', content: chatPrompt });
    const completion = await this.openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: chatHistory as any,
    });

    return completion.choices[0].message.content!;
  }

  getDeepseekChat(chatPrompt: string, chatHistory: ChatHistory[], returnMockText?: boolean
  ): Observable<string> {
    if (!returnMockText)
      return from(this.getDeepseekChatPromise(chatPrompt, chatHistory));
    else
      return this.mockChatService.getMockResponse()
  }

  async getMistralChatPromise(chatPrompt: string, chatHistory: ChatHistory[]
  ): Promise<string> {
    if (!this.mistralClient) {
      console.log('Mistral ai not set');
      return '';
    }
    let response: string = '';
    const result = await this.mistralClient.chat.stream({
      model: "mistral-large-latest",
      messages: chatHistory as any,
    });

    for await (const chunk of result) {
      let streamText = chunk.data.choices[0].delta.content;
      if (typeof streamText === "string") {
        response += streamText;
      }
    }
    return response;
  }

  getMistralChat(chatPrompt: string, chatHistory: ChatHistory[], returnMockText?: boolean
  ): Observable<string> {
    if (!returnMockText)
      return from(this.getMistralChatPromise(chatPrompt, chatHistory));
    else
      return this.mockChatService.getMockResponse()
  }


  getChatGPTResponsePromise(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = {
      prompt: prompt
    };
    return this.http.post(environment.apiUrlChatpGPT, body, { headers });
  }

  getChatGPTResponse(prompt: string, returnMockText?: boolean): Observable<any> {
    if (!returnMockText)
      return from(this.getChatGPTResponsePromise(prompt)).pipe(
        map(response => response.choices?.[0].message?.content));
    else
      return this.mockChatService.getMockResponse();
  }


  getContactData(): Observable<aiDetail[]> {
    return of([
      {
        aiName: AI_NAMES.GEMINI,
        aiImage: 'assets/images/gemini.png',
        aiOnlineStatus: 'online',
        featured: this.featureFlagService.getFlag(AI_NAMES.GEMINI)
      },
      {
        aiName: AI_NAMES.DEEPSEEK,
        aiImage: 'assets/images/deepseek.png',
        aiOnlineStatus: 'online',
        featured: this.featureFlagService.getFlag(AI_NAMES.DEEPSEEK)
      },
      {
        aiName: AI_NAMES.CHATGPT,
        aiImage: 'assets/images/chatgpt.png',
        aiOnlineStatus: 'online',
        featured: this.featureFlagService.getFlag(AI_NAMES.CHATGPT)
      },
      {
        aiName: AI_NAMES.MISTRAL,
        aiImage: 'assets/images/mistral.png',
        aiOnlineStatus: 'online',
        featured: this.featureFlagService.getFlag(AI_NAMES.MISTRAL)
      },
    ].filter(r => { return r.featured == true }));
  }

  getMessages(): Observable<MessageDetail[]> {
    return of([]);
  }
}
