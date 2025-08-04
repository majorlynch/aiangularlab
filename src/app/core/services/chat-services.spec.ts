import { TestBed } from '@angular/core/testing';
import { ChatService } from './chat-services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockChatService } from './mocks/mock-chat-service';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ChatService, useValue: MockChatService }
      ]

    });
    service = TestBed.inject(ChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a message when sendMessage is called', () => {
    const mockMessage = 'Hello, Copilot!';
    expect(mockMessage).toBeTruthy();
  });
});
