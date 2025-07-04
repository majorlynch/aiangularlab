import { CommonModule } from '@angular/common';
import { PromptService } from '../../services/prompt-ai.service';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize, tap } from 'rxjs';
import { formatResponse } from '@utils/format-response.util';
import { FeatureFlagService } from 'src/app/core/services/feature-flag-service.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-google-ai',
  standalone: true,
  providers: [HttpClient],
  imports: [CommonModule, FormsModule],
  templateUrl: './prompt-ai.component.html',
  styleUrl: './prompt-ai.component.css',
})
export class PromptAiComponent implements OnInit{
  prompt: string = '';
  aiGeminiResponse: string = '';
  aiDeepSeekResponse: string = '';
  aiChatGPTResponse: string = '';
  aiMistralResponse: string = '';
  isLoadingGemini = false;
  isLoadingDeepseek = false;
  isLoadingChatGPT = false;
  isLoadingMistral = false;
  geminiPosition: number = -1;
  deepseekPosition: number = -1;
  chatGPTPosition: number = -1;
  mistralPosition: number = -1;
  position: number = 0;
  medalArray:string[] = ['🥇','🥈','🥉','🏅'];
  featureFlags: any;

  constructor(private featureFlagService: FeatureFlagService,
              private PromptService: PromptService) {}

  ngOnInit(): void {
    this.featureFlags = this.featureFlagService.getAllFlags();
  }

  getResponse() {

    this.aiGeminiResponse = '';
    this.aiDeepSeekResponse = '';
    this.aiChatGPTResponse = '';
    this.aiMistralResponse = '';
    this.isLoadingGemini = true;
    this.isLoadingDeepseek = true;
    this.isLoadingChatGPT = true;
    this.isLoadingMistral = true;
    this.PromptService.getGeminiResponse(this.prompt, true)
    .pipe(finalize(() => {this.isLoadingGemini = false,
                        this.geminiPosition = (this.position++) % 4}))
    .subscribe(res => this.aiGeminiResponse = res || '');

    this.PromptService.getDeepseekResponse(this.prompt, true)
    .pipe(tap(res => console.log(res)),
          finalize(() => {this.isLoadingDeepseek = false,
                          this.deepseekPosition = (this.position++) % 4}))
    .subscribe(res => this.aiDeepSeekResponse = formatResponse(res)
    );

    this.PromptService.getChatGPTResponse(this.prompt)
    .pipe(tap(res => console.log(res)),
          finalize(() => {this.isLoadingChatGPT = false,
                          this.chatGPTPosition = (this.position++) % 4}))
    .subscribe(res => {
      const response = res as any; // or as ChatResponse if you define it
      this.aiChatGPTResponse = response.choices?.[0]?.message.content;
    });

    this.PromptService.getMistralResponse(this.prompt, true)
    .pipe(tap(res => console.log(res)),
          finalize(() => {this.isLoadingMistral = false,
                          this.mistralPosition = (this.position++) % 4}))
    .subscribe(res => this.aiMistralResponse = formatResponse(res)
    );
  }
}
