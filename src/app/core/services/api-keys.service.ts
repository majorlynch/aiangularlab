import { ApiKeyResponse } from '../../shared/models/apiKey.model';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiKeysService{
  apiKeys : ApiKeyResponse | null = null;

  constructor(private http: HttpClient) { }

  getApiKeys(): Observable<ApiKeyResponse> {
    return this.http.get<ApiKeyResponse>(environment.apiKeyUrl);
  }

  loadApiKeys() {
    this.getApiKeys().subscribe(res => this.apiKeys = res);
  }
}
