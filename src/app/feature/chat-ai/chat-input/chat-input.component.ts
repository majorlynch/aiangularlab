import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CHATSYMBOLGROUPS } from '@constants/chatSymbols';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.css'
})
export class ChatInputComponent {
  @Input() chatPrompt: string = '';
  @Input() isChatLoading: boolean = false;
  @Output() sendMessage = new EventEmitter<string>();

  chatSymbolGroups:string[][];

  constructor() {
    this.chatSymbolGroups = CHATSYMBOLGROUPS;
  }

  addSymbol(text: string)
  {
    this.chatPrompt += text;
  }

  sendInput()
  {
    console.log('sendInput '+ this.chatPrompt);
    this.sendMessage.emit(this.chatPrompt);
  }

}
