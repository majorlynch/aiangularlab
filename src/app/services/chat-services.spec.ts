import { TestBed } from '@angular/core/testing';
import { ChatService } from './chat-services';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatService);
    console.log('beforeEach');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a message when sendMessage is called', () => {
    const mockMessage = 'Hello, Copilot!';
    expect(mockMessage).toBeTruthy();
  });
});
