import { GenerateContentResponse } from '@google/genai';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageGenService } from '@services/image-gen.service';

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
  isLoading: boolean = false;

  constructor(private imageGenService: ImageGenService){}

  generateImage() {
    console.log(this.imageGenInstruction);
    this.imageGenService.getChatGPTImageURL(this.imageGenInstruction, true)
    .subscribe(res => {this.imageSrc = res});
  }

}
