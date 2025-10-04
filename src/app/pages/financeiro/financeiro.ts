import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { AddTransaction } from '../../components/add-transaction/add-transaction';
import { DailyClosing } from '../../components/daily-closing/daily-closing';
import { Transactions } from '../../components/transactions/transactions';

@Component({
  selector: 'app-financeiro',
  imports: [
    Header,
    AddTransaction,
    DailyClosing,
    Transactions
  ],
  templateUrl: './financeiro.html',
  styleUrl: './financeiro.scss'
})
export class Financeiro {

}
