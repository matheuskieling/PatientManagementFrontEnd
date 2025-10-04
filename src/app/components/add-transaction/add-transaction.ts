import { Component } from '@angular/core';
import { GreetingService } from '../../services/greeting-service';
import { ButtonWithIcon } from '../button-with-icon/button-with-icon';
import { MatDialog } from '@angular/material/dialog';
import { NewEntryDialog } from '../new-entry-dialog/new-entry-dialog';
import { Dialog } from '../dialog/dialog';
import { NewSpendingDialog } from '../new-spending-dialog/new-spending-dialog';

@Component({
  selector: 'app-add-transaction',
  imports: [
    ButtonWithIcon
  ],
  templateUrl: './add-transaction.html',
  styleUrl: './add-transaction.scss'
})
export class AddTransaction {
  constructor(private greetingService: GreetingService, private dialog: MatDialog) {}
  greeting: string = "";


  ngOnInit() {
    this.greeting = this.greetingService.getGreeting();
  }

  openEntryDialog() {
    this.dialog.open(NewEntryDialog, {
      width: '572px',
      disableClose: true,
    }).afterClosed().subscribe(result => {
      if (result) {
        this.dialog.open(Dialog, {
          width: '416px',
          data: {
            title: 'Sucesso',
            subtitle: 'O pagamento foi registrado com sucesso',
            confirmText: 'Ok'
          }
        });
      }
    })
  }

  openSpendingDialog() {
    this.dialog.open(NewSpendingDialog, {
      width: '572px',
      disableClose: true,
    }).afterClosed().subscribe(result => {
      if (result) {
        this.dialog.open(Dialog, {
          width: '416px',
          data: {
            title: 'Sucesso',
            subtitle: 'O pagamento foi registrado com sucesso',
            confirmText: 'Ok'
          }
        });
      }
    })
  }
  //TODO fazer o formulário de despesa;
}
