import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GreetingService {
  getGreeting(): string {
    const now = new Date().getHours();
    if (now < 12) {
      return "Bom dia!";
    } else if (now < 18) {
      return "Boa tarde!";
    } else {
      return "Boa noite!";
    }
  }

}
