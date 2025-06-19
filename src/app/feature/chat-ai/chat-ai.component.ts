import { AfterViewChecked, Component, DoCheck } from '@angular/core';
import {
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';
import { ChatAiContacts } from './chat-contacts/chat-contacts';
import { HttpClient } from '@angular/common/http';
import { ChatService } from '../../services/chat-services';
import {
  ChatContent,
  ChatHistory,
  MessageDetail,
} from '../../shared/models/messageBase';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, finalize, throwError } from 'rxjs';
import { aiDetail } from '../../shared/models/messageBase';
import { AI_NAMES } from '@enums/ainame.enum';

@Component({
  selector: 'app-chat-ai',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatAiContacts],
  templateUrl: './chat-ai.component.html',
  styleUrl: './chat-ai.component.css',
  encapsulation: ViewEncapsulation.Emulated,
  providers: [HttpClient],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatAiComponent implements AfterViewChecked, DoCheck {
  chatPrompt: string = '';
  showInProgress = false;
  aiList: aiDetail[] = [];
  selectedAI: aiDetail | undefined;
  displayMessages: MessageDetail[] = [];
  chatContent: ChatContent[] = [];
  isChatLoading: boolean = false;
  useMock:boolean = false;
  errorMessage: string = '';

  constructor(
    private chatService: ChatService,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.cdRef.detach();
  }

  ngOnInit() {
    this.chatService.getContactData().subscribe((res) => (this.aiList = res));
    this.selectedAI = this.aiList.find((r) => r.aiName == AI_NAMES.GEMINI);
    this.chatContent = [
      {
        aiName: AI_NAMES.GEMINI,
        messageDetail: [],
      },
      {
        aiName: AI_NAMES.DEEPSEEK,
        messageDetail: [],
      },
    ];
    this.cdRef.detectChanges();
  }

  ngAfterViewChecked(): void {
    let div = document.getElementById('chatBody');
    div!.scrollTop = div!.scrollHeight - 100;
  }

  ngDoCheck(): void {
    console.log('Perform check');
  }

  sendMessage() {
    let chatResponse: string = '';
    this.isChatLoading = true;
    const newUserMessage: MessageDetail[] = [
      {
        userId: 1,
        userName: 'Conor',
        userImage: 'assets/images/avatar1.png',
        userStatus: 'online',
        userType: 'user',
        messageDetail: this.chatPrompt,
        messageTime: new Date(),
        messageTimeText: new Date().toLocaleString('en-GB'),
      },
    ];
    this.displayMessages = [...this.displayMessages, ...newUserMessage];
    this.cdRef.detectChanges();

    if (this.selectedAI?.aiName == AI_NAMES.GEMINI) {
      const userHistory = this.displayMessages
        .filter((r) => r.userType == 'user')
        .map((r) => ({ text: r.messageDetail }));
      const aiHistory = this.displayMessages
        .filter((r) => r.userType == 'assistant')
        .map((r) => ({ text: r.messageDetail }));

      this.chatService
        .getGeminiChat(this.chatPrompt, userHistory, aiHistory)
        .pipe(
          catchError((error) => {
            if (error.status === 0)
              this.errorMessage = 'Network or CORS error occurred.';
            else
              this.errorMessage = `Error ${error.status}: ${error.message}`;
            return throwError(() => error);
          }),
          finalize(() => {
            const newResponseMessage: MessageDetail[] = [
              {
                userId: 2,
                userName: this.selectedAI!.aiName,
                userImage: this.selectedAI!.aiImage,
                userStatus: 'online',
                userType: 'assistant',
                messageDetail: `${chatResponse}`,
                messageTime: new Date(),
                messageTimeText: new Date().toLocaleString('en-GB'),
              },
            ];
            this.displayMessages = [
              ...this.displayMessages,
              ...newResponseMessage,
            ];
            this.chatContent.filter(
              (r) => r.aiName == this.selectedAI!.aiName
            )[0].messageDetail = this.displayMessages;
            this.isChatLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe({
          next: (res) => {
            (chatResponse = this.chatService.formatGeminiContent(res)),
            this.ngZone.runOutsideAngular(() => console.log(res))
          },
          error: (err) => {
          console.log('there is an error', err);
        }
      }
          );

    } else if (this.selectedAI?.aiName == AI_NAMES.DEEPSEEK) {
      const chatHistory: ChatHistory[] = this.displayMessages.map(
        ({ userType, messageDetail }) => ({
          role: userType,
          content: messageDetail,
        })
      );

      this.chatService
        .getDeepseekChat(this.chatPrompt, chatHistory)
        .pipe(
          catchError((error) => {
            if (error.status === 0)
              this.errorMessage = 'Network or CORS error occurred.';
            else
              this.errorMessage = `Error ${error.status}: ${error.message}`;
            return throwError(() => error);
          }),
          finalize(() => {
            const newResponseMessage: MessageDetail[] = [
              {
                userId: 2,
                userName: this.selectedAI!.aiName,
                userImage: this.selectedAI!.aiImage,
                userStatus: 'online',
                userType: 'assistant',
                messageDetail: `${chatResponse}`,
                messageTime: new Date(),
                messageTimeText: new Date().toLocaleString('en-GB'),
              },
            ];
            this.displayMessages = [
              ...this.displayMessages,
              ...newResponseMessage,
            ];
            this.chatContent.filter(
              (r) => r.aiName == this.selectedAI!.aiName
            )[0].messageDetail = this.displayMessages;
            this.isChatLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(
          (res) => (chatResponse = this.chatService.formatGeminiContent(res))
        );
    }
  }

  setSelectedAi(newSelectedAI: string) {
    if (this.selectedAI!.aiName != newSelectedAI)
      this.displayMessages = this.chatContent
        .filter((a) => a.aiName == newSelectedAI)
        .flatMap((r) => r.messageDetail);
    this.selectedAI = this.aiList.filter((r) => r.aiName == newSelectedAI)[0];
    this.chatPrompt = '';
    this.cdRef.detectChanges();
  }

  onCloseError()
  {
    alert('closing that error');
  }


}

