import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageGenService } from '@services/image-gen.service';
import { sleep } from 'openai/core';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-image-gen-ai',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image-gen-ai.component.html',
  styleUrl: './image-gen-ai.component.css'
})
export class ImageGenAiComponent {
  imageGenInstruction: string = '';
  imageSrc: string | undefined = '';
  chatGptImageModels :string[] = ['dall-e-2','dall-e-3'];
  selectedModel: string = 'dall-e-2';
  isLoadingAIResponse: boolean = false;

  constructor(private imageGenService: ImageGenService){}

  async generateImage() {
    this.isLoadingAIResponse = true;
        await sleep(2000);
    this.imageGenService.getChatGPTImageURL(this.imageGenInstruction, this.selectedModel)
    .pipe(finalize(() => {this.isLoadingAIResponse = false}))
    .subscribe(res => {this.imageSrc = res});
  }

}
