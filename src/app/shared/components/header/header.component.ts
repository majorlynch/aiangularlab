import { FeatureFlagService } from '@services/feature-flag.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AI_NAMES } from 'src/app/shared/enums/ainame.enum';
import { environment } from '@environment/environment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  aiGeminiEnable: boolean = false;
  aiChatGPTEnable: boolean = false;
  baseUrl: string = environment.baseUrl;

  constructor(private featureFlagService: FeatureFlagService) {}

  ngOnInit() {
    this.aiGeminiEnable = this.featureFlagService.getFlag(AI_NAMES.GEMINI);
    this.aiChatGPTEnable = this.featureFlagService.getFlag(AI_NAMES.CHATGPT);
  }

  toggleDarkMode() {
      if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
          document.documentElement.setAttribute('data-bs-theme','light')
      }
      else {
          document.documentElement.setAttribute('data-bs-theme','dark')
      }
  }

}
