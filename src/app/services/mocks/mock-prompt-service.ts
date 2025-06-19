import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})

export class MockPromptService {

    getGeminiResponse(prompt: string): Observable<string>
    {
      const sampleText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
      return from([sampleText]);
    }

    getDeepSeekResponse(prompt: string): Observable<string>
    {
      const sampleText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
      return from([sampleText]);
    }

    getMistralResponse(prompt: string): Observable<string>
    {
      const sampleText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
      return from([sampleText]);
    }
}
