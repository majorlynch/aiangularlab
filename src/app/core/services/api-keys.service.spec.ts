import { TestBed } from '@angular/core/testing';
import { ApiKeysService } from './api-keys.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '@environment/environment'; // adjust path as needed
import { ApiKeyResponse } from '@models/apiKey.model'; // adjust path if needed
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

describe('ApiKeysService', () => {
  let service: ApiKeysService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let httpMock: HttpTestingController;

  const mockApiKeyResponse: ApiKeyResponse = {
    API_KEY_GEMINI: '1',
    API_KEY_DEEPSEEK: '2',
    API_KEY_MISTRAL: '3',
    API_KEY_CHATGPT: '4'
  };

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiKeysService, { provide: HttpClient, useValue: httpClientSpy }]
    });

    service = TestBed.inject(ApiKeysService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getApiKeys should return expected data', () => {
    spyOn(service, 'getApiKeys').and.returnValue(of(mockApiKeyResponse));

    service.getApiKeys().subscribe((res) => {
      expect(res).toEqual(mockApiKeyResponse);
    });

    const req = httpMock.expectOne(environment.apiKeyUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockApiKeyResponse);
  });

  it('loadApiKeys should set apiKeys property', () => {
    service.loadApiKeys();

    const req = httpMock.expectOne(environment.apiKeyUrl);
    req.flush(mockApiKeyResponse);

    expect(service.loadApiKeys).toHaveBeenCalled();
    expect(service.apiKeys).toBeTruthy();
    expect(service.apiKeys).toBeDefined();
    expect(service.apiKeys).toEqual(mockApiKeyResponse);
  });
});