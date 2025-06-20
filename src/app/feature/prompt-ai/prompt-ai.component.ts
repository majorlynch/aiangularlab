import { CommonModule } from '@angular/common';
import { PromptService } from '../../services/prompt-ai.service';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize, tap } from 'rxjs';
import { formatResponse } from '@utils/format-response.util';

@Component({
  selector: 'app-google-ai',
  standalone: true,
  providers: [],
  imports: [CommonModule, FormsModule],
  templateUrl: './prompt-ai.component.html',
  styleUrl: './prompt-ai.component.css',
})
export class PromptAiComponent {
  prompt: string = '';
  aiGeminiResponse: string = '';
  aiDeepSeekResponse: string = '';
  aiMistralResponse: string = '';
  isLoadingGemini = false;
  isLoadingDeepseek = false;
  isLoadingMistral = false;
  geminiPosition: number = -1;
  deepseekPosition: number = -1;
  mistralPosition: number = -1;
  position: number = 0;
  medalArray:string[] = ['🥇','🥈','🥉'];


  constructor(private PromptService: PromptService) {}

  getResponse() {
    this.aiGeminiResponse = '';
    this.aiDeepSeekResponse = '';
    this.aiMistralResponse = '';
    this.isLoadingGemini = true;
    this.isLoadingDeepseek = true;
    this.isLoadingMistral = true;
    this.PromptService.getGeminiResponse(this.prompt)
    .pipe(finalize(() => {this.isLoadingGemini = false,
                        this.geminiPosition = (this.position++) % 3}))
    .subscribe(res => this.aiGeminiResponse = res || '');

    this.PromptService.getDeepseekResponse(this.prompt)
    .pipe(tap(res => console.log(res)),
          finalize(() => {this.isLoadingDeepseek = false,
                          this.deepseekPosition = (this.position++) % 3}))
    .subscribe(res => this.aiDeepSeekResponse = formatResponse(res)
    );

    this.PromptService.getMistralResponse(this.prompt)
    .pipe(tap(res => console.log(res)),
          finalize(() => {this.isLoadingMistral = false,
                          this.mistralPosition = (this.position++) % 3}))
    .subscribe(res => this.aiMistralResponse = formatResponse(res)
    );
  }
}
