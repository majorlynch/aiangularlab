import { Injectable, OnInit } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { ApiKeysService } from './api-keys.service';
import { AI_KEYS } from '@enums/ainame.enum';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChatResponseType } from '@models/chat.models';
import { OpenAI } from 'openai';

@Injectable({
  providedIn: 'root',
})
export class ImageGenService implements OnInit {
  apiKeyGemini: string = '';

  //ChatGPT
  chatAPTAI = new OpenAI({
    apiKey: '', //environment.apiKeyChatGPT,
    dangerouslyAllowBrowser: true,
  });

  constructor(private http: HttpClient,
              private apiKeysService: ApiKeysService) {}

  ngOnInit() {
    this.apiKeysService.getApiKeys().subscribe((keys) => {
      if (keys) {
        this.apiKeyGemini = keys[AI_KEYS.GEMINI];
      }
    });
  }

  getChatGPTImageURLPromise(prompt: string, model: string): Observable<ChatResponseType> {
    const headers = new HttpHeaders({
      'Content-Type':'application/json',
    });

    const body = {prompt: prompt, model: 'dall-e-2'};

    return this.http.post<ChatResponseType>(environment.apiUrlChatGPTGenImage, body, { headers });
  }

  getChatGPTImageURL(prompt: string, model: string, returnMockImage?: boolean): Observable<string> {
    if (!returnMockImage)
      return from(this.getChatGPTImageURLPromise(prompt, model).pipe(
        map((res: ChatResponseType) =>  res.response)));
    else
      return from([
        'https://madebyconor.com/assets/img/conor.jpg',
      ]);
  }
}
