import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  public flags = environment.featuireFlags;

  constructor() { }

}
