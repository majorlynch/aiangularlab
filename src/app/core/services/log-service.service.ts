import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private ngZone: NgZone) {}

  log(message: string) {
    console.log(message);
  }

  warn(message: string) {
    console.log(message);
  }
  error(message: string) {
    console.error(message);
  }

}
