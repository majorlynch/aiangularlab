import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PromptService } from './prompt-ai.service';

describe('PromptService', () => {
  let service: PromptService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(PromptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
