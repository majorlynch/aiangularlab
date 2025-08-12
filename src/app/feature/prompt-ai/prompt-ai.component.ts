import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize, tap } from 'rxjs';
import { formatResponse } from '@utils/format-response.util';
import { FeatureFlagService } from 'src/app/core/services/feature-flag.service';
import { HttpClient } from '@angular/common/http';
import { FEATURE_FLAGS } from '@enums/featureFlags.enum';
import { ChatService } from '@services/chat-services';
import { ChatHistory } from '@models/chat.models';

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
  promptSampleText: boolean = false;

  constructor(private featureFlagService: FeatureFlagService,
              private chatService: ChatService) {}

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
    this.promptSampleText = this.featureFlagService.getFlag(FEATURE_FLAGS.PROMPTSAMPLETEXT);
    const chatHistory:ChatHistory[] = [{
                                  role: 'user',
                                  content: this.prompt
                                  }];

    this.chatService.getGeminiChat(this.prompt, [], [], this.promptSampleText)
    .pipe(finalize(() => {this.isLoadingGemini = false,
                        this.geminiPosition = (this.position++) % 4}))
    .subscribe(res => this.aiGeminiResponse = formatResponse(res.response) );

    this.chatService.getDeepseekChat(chatHistory, this.promptSampleText)
    .pipe(finalize(() => {this.isLoadingDeepseek = false,
                          this.deepseekPosition = (this.position++) % 4,
                        console.log(this.aiDeepSeekResponse)}))
    .subscribe(res => this.aiDeepSeekResponse = formatResponse(res.response));

    this.chatService.getMistralChat(chatHistory, this.promptSampleText)
    .pipe(finalize(() => {this.isLoadingMistral = false,
                          this.mistralPosition = (this.position++) % 4}))
    .subscribe(res => this.aiMistralResponse = formatResponse(res.response));

    this.chatService.getChatGPTResponse(chatHistory, this.promptSampleText)
    .pipe(finalize(() => {this.isLoadingChatGPT = false,
                          this.chatGPTPosition = (this.position++) % 4}))
    .subscribe(res => this.aiChatGPTResponse = formatResponse(res.response));
  }
}
