import { Injectable } from "@angular/core";
import { of, from, Observable } from "rxjs";
import { ChatService } from "../chat-services";
import { ChatHistory, ChatResponseType, TextPrompt } from "src/app/shared/models/chat.models";


@Injectable({
    providedIn: 'root'
})

export class MockChatService {

    constructor() {
    }

    getMockResponse(): Observable<ChatResponseType>
    {
      const sampleText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
      return of({
    response: "I'm just a computer program, so I don't have feelings, but I'm here and ready to help you! How can I assist you today?"
});
    }
}
