import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { GoogleGenAI } from '@google/genai';
import { OpenAI } from 'openai';

@Injectable({
  providedIn: 'root',
})
export class PromptService {
  constructor() {}
  response: any;

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

  async getGeminiResponsePromise(prompt: string): Promise<string> {

    try {
      this.response = await this.ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });
    } catch (e) {
      console.log(e);
    }
    return this.response.text;
  }

  getGeminiResponse(prompt: string): Observable<string> {
    return from(this.getGeminiResponsePromise(prompt));
  }

  async getDeepSeekResponsePromise(prompt: string): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "deepseek-chat"
    });

    return (completion.choices[0].message.content!);
  }

  getDeepseekResponse(prompt: string, returnSampleText?: boolean): Observable<string> {
    if (returnSampleText) {
      const sampleText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
      return from([sampleText]);
    }
    else
      return from(this.getDeepSeekResponsePromise(prompt));
  }

}
