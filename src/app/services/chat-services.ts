import { FeatureFlagService } from 'src/app/core/services/feature-flag-service.service';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { of, from, Observable, throwError } from 'rxjs';
import { createPartFromBase64, createUserContent, GenerateContentResponse, GoogleGenAI } from '@google/genai';
import {
  aiDetail,
  ChatHistory,
  MessageDetail,
  TextPrompt,
} from '../shared/models/messageBase';
import { OpenAI } from 'openai';
import { MockChatService } from './mocks/mock-chat-service';
import { AI_NAMES } from '@enums/ainame.enum';
import { Mistral } from '@mistralai/mistralai';
import { ContentChunk } from '@mistralai/mistralai/models/components';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  docs: any;
  response: any;

  //Gemini
  ai = new GoogleGenAI({
    apiKey: environment.apiKeyGemini,
  });

  //Deepseek
  openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    dangerouslyAllowBrowser: true,
    apiKey: environment.apiKeyDeepSeek,
  });

  //Mistral
  mistralClient = new Mistral({apiKey: environment.apiKeyMistral});


  constructor(private featureFlagService: FeatureFlagService,
              private mockChatService: MockChatService){
  }
  async getGeminiChatPromise(
    chatPrompt: string,
    userHistory: TextPrompt[],
    aiHistory: TextPrompt[]
  ): Promise<string> {
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
    if (!returnMockText)
    {
      return from(
        this.getGeminiChatPromise(chatPrompt, userHistory, aiHistory)
      );
    }
    else
     {
      return from(
        this.mockChatService.getMockResponse()
      );
     }
  }

  async getGeminiImageReadPromise(imageContent: string, imageQuestion: string): Promise<string | undefined> {
    const response : GenerateContentResponse = await this.ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      createUserContent([
        imageQuestion,
        createPartFromBase64(imageContent, 'image/png'),
      ]),
    ]});
    return response.candidates?.[0]?.content?.parts?.[0]?.text;
  }

  getGeminiImageRead(imageContent: string, imageQuestion: string): Observable<string | undefined>{
     return from(this.getGeminiImageReadPromise(imageContent, imageQuestion));
  }


  async getDeepseekChatPromise(chatPrompt: string, chatHistory: ChatHistory[]
  ): Promise<string> {
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
  ): Promise<string>
  {
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
    ].filter(r => {return r.featured == true}));
  }

  getMessages(): Observable<MessageDetail[]> {
    return of([]);
  }
}
