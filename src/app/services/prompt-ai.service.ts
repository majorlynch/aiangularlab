import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { GenerateContentResponse, GoogleGenAI } from '@google/genai';
import { OpenAI } from 'openai';
import { Mistral } from '@mistralai/mistralai';
import { MockChatService } from './mocks/mock-chat-service';

@Injectable({
  providedIn: 'root',
})
export class PromptService {

  //Gemini
  ai = new GoogleGenAI({
    apiKey: environment.apiKeyGemini,
  });

  //Deepseek
  openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    dangerouslyAllowBrowser: true,
    apiKey: environment.apiKeyDeepSeek
  });

  //Mistral
  mistralClient = new Mistral({apiKey: environment.apiKeyMistral});

  constructor(private mockChatService: MockChatService) {}

  async getGeminiResponsePromise(prompt: string): Promise<string | undefined> {
    const response: GenerateContentResponse = await this.ai.models.generateContent({
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
    const response = await this.openai.chat.completions.create({
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


  async getMistralResponsePromise(prompt: string): Promise<string> {
    const chatResponse = await this.mistralClient.chat.complete({
        model: "mistral-large-latest",
        messages: [{role: 'user', content: prompt}]
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
