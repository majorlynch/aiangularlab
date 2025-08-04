import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import { ChatService } from "../chat-services";
import { ChatHistory, TextPrompt } from "src/app/shared/models/chat.models";


@Injectable({
    providedIn: 'root'
})

export class MockApiService {

    constructor() {
    }

    getMockResponse() {
        const apiKeys = {
            "API_KEY_GEMINI": "1",
            "API_KEY_DEEPSEEK": "2",
            "API_KEY_MISTRAL": "3",
            "API_KEY_CHATGPT": "4"
        }
        return from([apiKeys]);
    }
}
