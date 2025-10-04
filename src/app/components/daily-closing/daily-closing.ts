import { Component, WritableSignal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { PaymentService } from '../../services/payment-service';
import { IClosing } from '../../interfaces/IPayment.model';

@Component({
  selector: 'app-daily-closing',
  imports: [
    CurrencyPipe
  ],
  templateUrl: './daily-closing.html',
  styleUrl: './daily-closing.scss'
})
export class DailyClosing {
  dailyClosing: WritableSignal<IClosing>;
  constructor(private paymentService: PaymentService) {
    this.dailyClosing = paymentService.getDailyClosing();
  }
  getFormattedDate() {
    const today = new Date();
    return today.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/^\w/, c => c.toUpperCase());;
  }

  protected readonly Math = Math;
}
