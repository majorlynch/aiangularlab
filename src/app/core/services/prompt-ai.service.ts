import { ApiKeysService } from './api-keys.service';
import { environment } from '@environment/environment';
import { Injectable, OnInit } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { GenerateContentResponse, GoogleGenAI } from '@google/genai';
import { OpenAI } from 'openai';
import { Mistral } from '@mistralai/mistralai';
import { MockChatService } from './mocks/mock-chat-service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AI_KEYS } from '@enums/ainame.enum';
import { ChatResponseType } from '@models/chat.models';

@Injectable({
  providedIn: 'root',
})
export class PromptService {
  apiKeyGemini: string = '';
  apiKeyMistral: string = '';
  apiKeyChatGPT: string = '';
  chatGPTResponse!: ChatResponseType;

  geminiAI: GoogleGenAI | null = null;
  deepseekAI: OpenAI | null = null;
  mistralAI: Mistral | null = null;

  constructor(private http: HttpClient,
    private apiKeysService: ApiKeysService,
    private mockChatService: MockChatService) {
    this.apiKeysService.getApiKeys().subscribe((keys) => {
      if (keys) {
        this.apiKeyGemini = keys[AI_KEYS.GEMINI];
        this.apiKeyMistral = keys[AI_KEYS.MISTRAL];
        this.apiKeyChatGPT = keys[AI_KEYS.CHATGPT];
      }
      //Gemini
      this.geminiAI = new GoogleGenAI({
        apiKey: this.apiKeyGemini,
      });

      //Mistral
      this.mistralAI = new Mistral({ apiKey: this.apiKeyMistral });
    });
  }

  async getGeminiResponsePromise(prompt: string): Promise<string | undefined> {
    if (!this.geminiAI) {
      console.log('Gemini AI not set');
      return '';
    }
    const response: GenerateContentResponse = await this.geminiAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    return response.text;
  }

  getGeminiResponse(prompt: string, returnMockText?: boolean): Observable<string | undefined> {
    if (!returnMockText)
      return from(this.getGeminiResponsePromise(prompt));
    else
      return this.mockChatService.getMockResponse();
  }

  getDeepSeekResponsePromise(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = {
      messages:[{
        role:'user',
        content: prompt
      }]
    };
    return this.http.post<string>(environment.apiUrlDeepSeekChat, body, { headers });
  }

  getDeepseekResponse(prompt: string, returnMockText?: boolean): Observable<string> {
    if (!returnMockText)
      return this.getDeepSeekResponsePromise(prompt).pipe(
        map((res: any) => res.response));
    else
      return this.mockChatService.getMockResponse();
  }

  getMistralResponsePromise(prompt: string): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = {
      messages: [{
        role:'user',
        content: prompt
      }]
    };
    return this.http.post<string>(environment.apiUrlMistralChat, body, { headers });
    /*
    if (!this.mistralAI) {
      console.log('Gemini AI not set');
      return '';
    }
    const chatResponse = await this.mistralAI.chat.complete({
      model: "mistral-large-latest",
      messages: [{ role: 'user', content: prompt }]
    });
    return (chatResponse.choices?.[0]?.message?.content as string);
    */
  }

  getMistralResponse(prompt: string, returnMockText?: boolean): Observable<string> {
    if (!returnMockText)
      return this.getMistralResponsePromise(prompt);
    else
      return this.mockChatService.getMockResponse();

  }

  getChatGPTResponsePromise(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = {
      messages: [{
        role:'user',
        content: prompt
      }]
    };
    return this.http.post<string>(environment.apiUrlChatGPTChat, body, { headers });
    /*
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = {
      messages: [{ role: 'user', content: prompt }]
    };
    return this.http.post<ChatResponseType>(environment.apiUrlChatGPTChat, body, { headers });
    */
  }

  getChatGPTResponse(prompt: string, returnMockText?: boolean): Observable<string> {
    if (!returnMockText)
      return this.getChatGPTResponsePromise(prompt).pipe(
        map((res: any) => res.response));
    else
      return this.mockChatService.getMockResponse();
  }

}
