import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import { ChatService } from "../chat-services";
import { ChatHistory, TextPrompt } from "src/app/shared/models/chat.models";


@Injectable({
    providedIn: 'root'
})

export class MockChatService {

    constructor() {
    }

    getMockResponse()
    {
      const sampleText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
      return from([sampleText]);
    }
}
