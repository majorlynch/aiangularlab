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
import { Chat } from 'openai/resources/beta/chat/chat';

@Injectable({
  providedIn: 'root',
})
export class PromptService {
  apiKeyGemini: string = '';
  apiKeyDeepSeek: string = '';
  apiKeyMistral: string = '';
  apiKeyChatGPT: string = '';

  geminiAI: GoogleGenAI | null = null;
  deepseekAI: OpenAI | null = null;
  mistralAI: Mistral | null = null;
  chatpGPTApiUrl = environment.apiUrlChatpGPT;

  constructor(private http: HttpClient,
    private apiKeysService: ApiKeysService,
    private mockChatService: MockChatService) {
    this.apiKeysService.getApiKeys().subscribe((keys) => {
      if (keys) {
        this.apiKeyGemini = keys[AI_KEYS.GEMINI];
        this.apiKeyDeepSeek = keys[AI_KEYS.DEEPSEEK];
        this.apiKeyMistral = keys[AI_KEYS.MISTRAL];
        this.apiKeyChatGPT = keys[AI_KEYS.CHATGPT];
      }
      //Gemini
      this.geminiAI = new GoogleGenAI({
        apiKey: this.apiKeyGemini,
      });

      //DeepSeek
      this.deepseekAI = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        dangerouslyAllowBrowser: true,
        apiKey: this.apiKeyDeepSeek,
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

  async getDeepSeekResponsePromise(prompt: string): Promise<string> {
    if (!this.deepseekAI) {
      console.log('Gemini AI not set');
      return '';
    }
    const response = await this.deepseekAI.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "deepseek-chat"
    });

    return (response.choices[0].message.content!);
  }

  getDeepseekResponse(prompt: string, returnMockText?: boolean): Observable<string> {
    if (!returnMockText)
      return from(this.getDeepSeekResponsePromise(prompt));
    else
      return this.mockChatService.getMockResponse();
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

  async getMistralResponsePromise(prompt: string): Promise<string> {
    if (!this.mistralAI) {
      console.log('Gemini AI not set');
      return '';
    }
    const chatResponse = await this.mistralAI.chat.complete({
      model: "mistral-large-latest",
      messages: [{ role: 'user', content: prompt }]
    });
    return (chatResponse.choices?.[0]?.message?.content as string);
  }

  getMistralResponse(prompt: string, returnMockText?: boolean): Observable<string> {
    if (!returnMockText)
      return from(this.getMistralResponsePromise(prompt));
    else
      return this.mockChatService.getMockResponse();

  }
}
