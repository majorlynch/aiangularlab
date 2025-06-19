import { Routes } from '@angular/router';
import { ChatAiComponent } from './feature/chat-ai/chat-ai.component';
import { PromptAiComponent } from './feature/prompt-ai/prompt-ai.component';
import { ImageReadAiComponent } from './feature/image-read-ai/image-read-ai.component';

export const routes: Routes = [
  { path: 'aiangularlab', redirectTo: 'chat', pathMatch: 'full' },
  { path: 'chat', title: 'AI Chat', component: ChatAiComponent },
  { path: 'ai', title: 'AI Prompt', component: PromptAiComponent },
  { path: 'image', title: 'AI Image', component: ImageReadAiComponent },
  { path: '', redirectTo: '/chat', pathMatch: 'full' },
];
