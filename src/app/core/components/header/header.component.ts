import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FeatureFlagService } from '../../services/feature-flag-service.service';
import { AI_NAMES } from '@enums/ainame.enum';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  aiGeminiEnable: boolean = false;

  constructor(private featureFlagService: FeatureFlagService) {}

  ngOnInit() {
    this.aiGeminiEnable = this.featureFlagService.getFlag(AI_NAMES.GEMINI);
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
