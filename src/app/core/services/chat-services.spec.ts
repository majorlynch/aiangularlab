import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpHeaders } from '@angular/common/http';
import { of, from } from 'rxjs';
import { ChatService } from './chat-services'; // Replace with actual service name
import { environment } from '@environment/environment'; // Adjust path
import { MockChatService } from './mocks/mock-chat-service'; // Adjust path
import { ChatHistory, ChatResponseType, TextPrompt } from '@models/chat.models';

describe('ChatService', () => {
  let service: ChatService;
  let httpMock: HttpTestingController;
  let mockChatService: jasmine.SpyObj<MockChatService>;

  const mockResponse:ChatResponseType = { response: 'Hello from Gemini!' };
  const mockText = 'Mock response text';

  beforeEach(() => {
    const mockChatSpy = jasmine.createSpyObj('MockChatService', ['getMockResponse']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ChatService,
        { provide: MockChatService, useValue: mockChatSpy }
      ]
    });

    service = TestBed.inject(ChatService);
    httpMock = TestBed.inject(HttpTestingController);
    mockChatService = TestBed.inject(MockChatService) as jasmine.SpyObj<MockChatService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should send POST request in getGeminiChatPromise', () => {
    const chatPrompt = 'Hello';
    //const userHistory: ChatHistory[] = [{role: 'user', content: 'Hi there'}];
    //const aiHistory: ChatHistory[] = [{role: 'assistant', content: 'Hi there'}];
    const userHistory: TextPrompt[] = [{text: 'Hi there'}];
    const aiHistory: TextPrompt[] = [{text: 'Hi there'}];

    service.getGeminiChatPromise(chatPrompt, userHistory, aiHistory).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(environment.apiUrlGeminiChat);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ chatPrompt, userHistory, aiHistory });
    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    req.flush(mockResponse);
  });

  it('should call getGeminiChatPromise when returnMockText is false', (done) => {
    spyOn(service, 'getGeminiChatPromise').and.returnValue(of(mockResponse));

    service.getGeminiChat('Hello', [], [], false).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(service.getGeminiChatPromise).toHaveBeenCalled();
      done();
    });
  });

  it('should return mock response when returnMockText is true', (done) => {
    service.getGeminiChat('Hello', [], [], true).subscribe((res) => {
      expect(mockChatService.getMockResponse).toHaveBeenCalled();
      done();
    });
  });
});