import { AfterViewChecked, Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatContactComponent } from './chat-contacts/chat-contacts.component';
import { HttpClient } from '@angular/common/http';
import { ChatService } from '@services/chat-services';
import { ChatInputComponent } from './chat-input/chat-input.component';
import {
  ChatContent,
  ChatHistory,
  MessageDetail,
} from '../../shared/models/chat.models';
import { catchError, finalize, throwError } from 'rxjs';
import { aiDetail } from '../../shared/models/chat.models';
import { AI_NAMES } from 'src/app/shared/enums/ainame.enum';
import { formatResponse } from '@utils/format-response.util';
import { LogService } from 'src/app/core/services/log-service.service';
import { FeatureFlagService } from 'src/app/core/services/feature-flag.service';
import { SoundService } from '@services/sound-service';

@Component({
  selector: 'app-chat-ai',
  standalone: true,
  imports: [ChatContactComponent, ChatInputComponent, CommonModule],
  templateUrl: './chat-ai.component.html',
  styleUrl: './chat-ai.component.css',
  encapsulation: ViewEncapsulation.Emulated,
  providers: [HttpClient],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatAiComponent implements AfterViewChecked{
  chatPrompt: string = '';
  showInProgress = false;
  aiList: aiDetail[] = [];
  selectedAI: aiDetail | undefined;
  displayMessages: MessageDetail[] = [];
  chatContent: ChatContent[] = [];
  isChatLoading: boolean = false;
  useMock:boolean = false;
  errorMessage: string = '';
  allowCarraigeReturn: boolean = false;
  featureFlags = {} = {};

  constructor(
    private chatService: ChatService,
    private logService: LogService,
    private featureFlagService: FeatureFlagService,
    private soundService: SoundService
    //private cdRef: ChangeDetectorRef,
  ) {

    //this.cdRef.detach();
  }

  ngOnInit() {
    this.featureFlags = this.featureFlagService.getAllFlags();
    this.chatService.getContactData().subscribe((res) => (this.aiList = res));
    this.selectedAI = this.aiList.find((r) => r.aiName == AI_NAMES.CHATGPT);
    this.chatContent = [
      {
        aiName: AI_NAMES.CHATGPT,
        messageDetail: [],
      },
      {
        aiName: AI_NAMES.GEMINI,
        messageDetail: [],
      },
      {
        aiName: AI_NAMES.DEEPSEEK,
        messageDetail: [],
      },
      {
        aiName: AI_NAMES.MISTRAL,
        messageDetail: [],
      },
    ];
    //this.cdRef.detectChanges();
  }

  ngAfterViewChecked(): void {
    let div = document.getElementById('chatBody');
    div!.scrollTop = div!.scrollHeight - 100;
  }

  sendMessage(chatPromptParam: string) {
    this.chatPrompt = chatPromptParam;
    let chatResponse: string = '';
    this.isChatLoading = true;
    const newUserMessage: MessageDetail[] = [
      {
        userId: 1,
        userName: 'User',
        userImage: 'assets/images/avatar1.png',
        userStatus: 'online',
        userType: 'user',
        messageDetail: this.chatPrompt,
        messageTime: new Date(),
        messageTimeText: new Date().toLocaleString('en-GB'),
      },
    ];
    this.displayMessages = [...this.displayMessages, ...newUserMessage];

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
            this.isChatLoading = false;
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
            this.chatPrompt = '';
            this.soundService.playSound();
          })
        )
        .subscribe({
          next: (res) => {(chatResponse = formatResponse(res.response))},
          error: (err) => {
          this.logService.error(err);
        }
      });
    }
    else if (this.selectedAI?.aiName == AI_NAMES.DEEPSEEK) {
      const chatHistory: ChatHistory[] = this.displayMessages.map(
        ({ userType, messageDetail }) => ({
          role: userType,
          content: messageDetail,
        })
      );

      this.chatService
        .getDeepseekChat(chatHistory)
        .pipe(
          catchError((error) => {
            if (error.status === 0)
              this.errorMessage = 'Network or CORS error occurred.';
            else
              this.errorMessage = `Error ${error.status}: ${error.message}`;
            this.isChatLoading = false;
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
            this.soundService.playSound();
          })
        )
        .subscribe(
          (res) => (chatResponse = formatResponse(res.response))
        );
    }
    else if (this.selectedAI?.aiName == AI_NAMES.MISTRAL) {
      const chatHistory: ChatHistory[] = this.displayMessages.map(
        ({ userType, messageDetail }) => ({
          role: userType,
          content: messageDetail,
        })
      );

      this.chatService
        .getMistralChat(chatHistory)
        .pipe(
          catchError((error) => {
            if (error.status === 0)
              this.errorMessage = 'Network or CORS error occurred.';
            else
              this.errorMessage = `Error ${error.status}: ${error.message}`;
            this.isChatLoading = false;
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
            this.soundService.playSound();
          })
        )
        .subscribe(
          (res) => (chatResponse = formatResponse(res.response))
        );
    }
    else if (this.selectedAI?.aiName == AI_NAMES.CHATGPT) {
      const chatHistory: ChatHistory[] = this.displayMessages.map(
        ({ userType, messageDetail }) => ({
          role: userType,
          content: messageDetail,
        })
      );

      this.chatService
        .getChatGPTResponse(chatHistory)
        .pipe(
          catchError((error) => {
            if (error.status === 0)
              this.errorMessage = 'Network or CORS error occurred.';
            else
              this.errorMessage = `Error ${error.status}: ${error.message}`;
            this.isChatLoading = false;
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
            this.soundService.playSound();
          })
        )
        .subscribe(
          (res) => (chatResponse = formatResponse(res.response))
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
    //this.cdRef.detectChanges();
  }

  closeErrorMessage()
  {
    this.errorMessage = '';
  }
}

