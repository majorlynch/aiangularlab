import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import { ChatService } from "../chat-services";
import { ChatHistory, TextPrompt } from "@models/messageBase";


@Injectable({
    providedIn: 'root'
})

export class MockChatService {

    constructor() {
    }

    getGeminiChat(chatPrompt: string,userHistory: TextPrompt[],aiHistory: TextPrompt[])
    {
              const sampleText = 'This is sampletext';
              return from([sampleText]);
    }

      getDeepSeekChat(chatPrompt: string, chatHistory: ChatHistory[]): Observable<string> {
          const sampleText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
          return from([sampleText]);
      }
}
