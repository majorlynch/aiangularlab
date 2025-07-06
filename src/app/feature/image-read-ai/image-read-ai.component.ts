import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { finalize } from 'rxjs';
import { ChatService } from '@services/chat-services';
import { formatResponse } from '@utils/format-response.util';

@Component({
  selector: 'app-image-read-ai',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image-read-ai.component.html',
  styleUrl: './image-read-ai.component.css',
})
export class ImageReadAiComponent {
  constructor(private chatService: ChatService) {}
  imageSrc: string | ArrayBuffer | null = null;
  responseText: string = '';
  imageQuestion: string  = '';
  base64Image: string = '';
  isLoading: boolean = false;

  samplePrompts: string[] = [
    "What can you tell me about this image?",
    "Tell me as much as you can about this image",
    "Can you describe the setting and the people or objects?",
    "Is this image from a specific place or event?",
    "What text can you read in this image?",
    "Does this image seem edited or AI-generated?"
    ];


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result;
        this.base64Image = (this.imageSrc as string).split(',')[1];
      };
      reader.readAsDataURL(file);
    }
  }

  sendMessage()
  {
        this.isLoading = true;
        this.chatService.getGeminiImageRead(this.base64Image, this.imageQuestion)
                          .pipe(finalize(() => this.isLoading = false))
                          .subscribe(res => this.responseText = formatResponse(res || '') );
  }

  setSuggestedMessage(prompt: string) {
    this.imageQuestion = prompt;
  }

}
