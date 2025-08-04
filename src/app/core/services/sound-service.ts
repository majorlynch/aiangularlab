// message-sound.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private audio = new Audio('../../assets/sounds/wind.mp3');

  playSound(): void {
    this.audio.play();
  }
}
