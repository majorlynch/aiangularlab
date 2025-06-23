import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private ngZone: NgZone) {}

  log(message: string) {
    this.ngZone.runOutsideAngular(() => console.log(message));
  }

  warn(message: string) {
    this.ngZone.runOutsideAngular(() => console.warn(message));
  }
  error(message: string) {
    this.ngZone.runOutsideAngular(() => console.error(message));
  }

}
