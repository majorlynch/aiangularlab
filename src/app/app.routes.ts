import { Routes } from '@angular/router';
import { ChatAiComponent } from './feature/chat-ai/chat-ai.component';
import { PromptAiComponent } from './feature/prompt-ai/prompt-ai.component';
import { ImageReadAiComponent } from './feature/image-read-ai/image-read-ai.component';
import { ImageGenAiComponent } from './feature/image-gen-ai/image-gen-ai.component';

export const routes: Routes = [
  { path: 'aiangularlab', redirectTo: 'chat', pathMatch: 'full' },
  { path: 'chat', title: 'AI Chat', component: ChatAiComponent },
  { path: 'ai', title: 'AI Prompt', component: PromptAiComponent },
  { path: 'imageread', title: 'Gemini Image Reader', component: ImageReadAiComponent },
  { path: 'imagegen', title: 'Gemini Image Generator', component: ImageGenAiComponent},
  { path: '', redirectTo: '/chat', pathMatch: 'full'},
];
