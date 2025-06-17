import { CommonModule } from '@angular/common';
import { PromptService } from '../../services/prompt-ai.service';
import { Component } from '@angular/core';
import { HeaderComponent } from '../../core/components/header/header.component';
import { FormsModule } from '@angular/forms';
import { finalize, tap } from 'rxjs';

@Component({
  selector: 'app-google-ai',
  standalone: true,
  providers: [],
  imports: [CommonModule, HeaderComponent, FormsModule],
  templateUrl: './prompt-ai.component.html',
  styleUrl: './prompt-ai.component.css',
})
export class PromptAiComponent {
  prompt: string = '';
  aiGeminiResponse: string = '';
  aiDeepSeekResponse: string = '';
  isLoadingGemini = false;
  isLoadingDeepseek = false;

  constructor(private PromptService: PromptService) {}

  getResponse() {
    this.aiGeminiResponse = '';
    this.aiDeepSeekResponse = '';
    this.isLoadingGemini = true;
    this.isLoadingDeepseek = true;
    this.PromptService.getGeminiResponse(this.prompt)
    .pipe(finalize(() => this.isLoadingGemini = false))
    .subscribe(res => this.aiGeminiResponse = res
    );

    this.PromptService.getDeepseekResponse(this.prompt)
    .pipe(tap(res => console.log(res)),
          finalize(() => this.isLoadingDeepseek = false))
    .subscribe(res => this.aiDeepSeekResponse = res
    );
  }
}
