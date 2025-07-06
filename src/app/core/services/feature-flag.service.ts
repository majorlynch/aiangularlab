import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  public flags = environment.featureFlags;

  getFlag(flag: keyof typeof this.flags): boolean {
    return this.flags[flag];
  }

  setflag(flag: keyof typeof this.flags, value: boolean) {
    this.flags[flag] = value;
  }

  getAllFlags() : typeof this.flags{
    return this.flags;
  }
}
