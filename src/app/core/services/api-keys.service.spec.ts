import { TestBed } from '@angular/core/testing';
import { ApiKeysService } from './api-keys.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockApiService } from './mocks/mock-api-service';

describe('ApiKeysService', () => {
  let service: ApiKeysService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{provide: ApiKeysService, useValue: MockApiService}]
    });
    service = TestBed.inject(ApiKeysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});