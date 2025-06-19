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

  openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    dangerouslyAllowBrowser: true,
    apiKey: environment.apiKeyDeepSeek,
  });

  constructor(private mockChatService: MockChatService){
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

  formatGeminiContent(input: string): string {
    return input
      .replace(/\#\#\#\#\#\#(.*?)\n/g, '<h6>$1</h6>')
      .replace(/\#\#\#\#\#(.*?)\n/g, '<h5>$1</h5>')
      .replace(/\#\#\#\#(.*?)\n/g, '<h4>$1</h4>')
      .replace(/\#\#\#(.*?)\n/g, '<h3>$1</h3>')
      .replace(/\#\#(.*?)\n/g, '<h2>$1</h2>')
      .replace(/\#(.*?)\n/g, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.*?)\*/g, '<i>$1</i>')
      .replace(/\*\*\*(.*?)\*\*\*/g, '<b><i>$1</i></b>')
      .replace(/\*(.*?)\*/g, '<i>$1</i>')
      .replace('```', '');
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

  getContactData(): Observable<aiDetail[]> {
    return of([
      {
        aiName: AI_NAMES.GEMINI,
        aiImage: 'assets/images/gemini.png',
        aiOnlineStatus: 'online',
      },
      {
        aiName: AI_NAMES.DEEPSEEK,
        aiImage: 'assets/images/deepseek.png',
        aiOnlineStatus: 'online',
      },
      {
        aiName: AI_NAMES.MISTRAL,
        aiImage: 'assets/images/mistral.png',
        aiOnlineStatus: 'online',
      },
    ]);
  }

  getMessages(): Observable<MessageDetail[]> {
    return of([]);
  }
}
