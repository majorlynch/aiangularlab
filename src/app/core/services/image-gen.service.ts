import { Injectable, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { ApiKeysService } from './api-keys.service';
import { AI_KEYS } from '@enums/ainame.enum';
const { OpenAI } = require('openai');

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

  constructor(private apiKeysService: ApiKeysService) {}

  ngOnInit() {
    this.apiKeysService.getApiKeys().subscribe((keys) => {
      if (keys) {
        this.apiKeyGemini = keys[AI_KEYS.GEMINI];
      }
    });
  }

  async getChatGPTImageURLPromise(prompt: string): Promise<string> {
    /*
    const response = await this.chatAPTAI.images.generate({
      model: 'dall-e-3', // or 'dall-e-2'
      prompt: prompt,
      n: 1,
      size: '1024x1024'
    });

    return response.data[0].url;
    */
    return '';
  }

  getChatGPTImageURL(
    prompt: string,
    returnMockImage?: boolean
  ): Observable<string> {
    if (returnMockImage)
      return from([
        'https://oaidalleapiprodscus.blob.core.windows.net/private/org-dqak9dKIBMWg3T2oAMdaTLZW/user-E58dR2W4tsuNPC1dJIpVdSmX/img-JmawJIrawBZpHmiRgBp0R8XZ.png?st=2025-06-27T10%3A59%3A23Z&se=2025-06-27T12%3A59%3A23Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=cc612491-d948-4d2e-9821-2683df3719f5&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-27T02%3A54%3A12Z&ske=2025-06-28T02%3A54%3A12Z&sks=b&skv=2024-08-04&sig=D2YPsc2MZ4U1mx7OOQ0f0Ph%2BWQJKHy71jPrMuS8eDAY%3D',
      ]);
    else return from(this.getChatGPTImageURLPromise(prompt));
  }
}
