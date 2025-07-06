import { PromptService } from './services/prompt-ai.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureFlagService } from './services/feature-flag.service';
import { LogService } from './services/log-service.service';
import { ChatService } from './services/chat-services';
import { ImageGenService } from './services/image-gen.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [ChatService, PromptService, ImageGenService, LogService, FeatureFlagService]
})
export class CoreModule { }
