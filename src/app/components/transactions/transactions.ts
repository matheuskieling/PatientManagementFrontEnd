import { Component, Signal, WritableSignal } from '@angular/core';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { PaymentService } from '../../services/payment-service';
import { IClosing, IPayment } from '../../interfaces/IPayment.model';
import { IDoctor, IHealthPlan } from '../../interfaces/IPatient.model';
import { DoctorService } from '../../services/doctor-service';
import { HealthPlanService } from '../../services/health-plan-service';
import { NewHealthPlanDialog } from '../new-health-plan-dialog/new-health-plan-dialog';
import { NewDoctorDialog } from '../new-doctor-dialog/new-doctor-dialog';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzTableComponent, NzTableModule, NzTablePaginationType } from 'ng-zorro-antd/table';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { NzTagComponent } from 'ng-zorro-antd/tag';
import { presetColors } from 'ng-zorro-antd/core/color';
import { PAYMENT_METHOD_STRING } from '../../../constants';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { NzRangePickerComponent, NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { UpdateTransactionDialog } from '../update-transaction-dialog/update-transaction-dialog';
import { ButtonWithIcon } from '../button-with-icon/button-with-icon';

@Component({
  selector: 'app-transactions',
  imports: [
    NzSelectComponent,
    NzOptionComponent,
    NzTableModule,
    ReactiveFormsModule,
    NzTableComponent,
    DatePipe,
    NzDatePickerModule,
    CurrencyPipe,
    NzTagComponent,
    NzIconDirective,
    NzRangePickerComponent,
    ButtonWithIcon
  ],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss'
})
export class Transactions {
  paymentMethods;
  payments: WritableSignal<IPayment[]>;
  healthPlans: WritableSignal<IHealthPlan[]>
  doctors: WritableSignal<IDoctor[]>
  tableClosing: Signal<IClosing>
  filterForm: FormGroup;
  widthConfig: string[] = ['240px', '111px', '96px', '115px', '142px', '138px'];
  dateString: string = "";
  subscription: any;
  constructor(
    private paymentService: PaymentService,
    private doctorService: DoctorService,
    private healthPlanService: HealthPlanService,
    private dialog: MatDialog,
    private fb: FormBuilder,
  ) {
    this.paymentMethods = this.paymentService.paymentMethods;
    this.payments = this.paymentService.getPayments();
    this.healthPlans = this.healthPlanService.getHealthPlans();
    this.doctors = this.doctorService.getDoctors();
    this.tableClosing = this.paymentService.tableClosing;
    this.dateString = new Date().toLocaleDateString();
    this.filterForm = this.fb.group({
      date: [[new Date(), new Date()]],
      paymentMethods: [[1,2]],
      healthPlanId: [''],
      doctorId: [''],
    });
    this.subscription = this.filterForm.valueChanges.subscribe(values => {
      this.paymentService.setFilters(this.filterForm);
      if (this.filterForm.get('date')?.value.length) {
        if (this.filterForm.get('date')?.value[0].getTime() === this.filterForm.get('date')?.value[1].getTime()) {
          this.dateString = this.filterForm.get('date')?.value[0].toLocaleDateString();
        }
        else {
          this.dateString = `De ${this.filterForm.get('date')?.value[0].toLocaleDateString()} a ${this.filterForm.get('date')?.value[1].toLocaleDateString()}`
        }
      }
      else {
        this.dateString = new Date().toLocaleDateString();
      }
    })

  }


  clearFilters() {
    this.filterForm.reset();
    this.filterForm.get('date')?.setValue([new Date(), new Date()])
    this.filterForm.get('paymentMethods')?.setValue([1,2])
  }

  filterOption= (input: string, option: any): boolean => {
    return option.nzLabel.toLowerCase().startsWith(input.toLowerCase());
  };

  handleNewHealthPlan() {
    this.dialog.open(NewHealthPlanDialog, {
      width: '572px',
    });
  }

  handleNewDoctor() {
    this.dialog.open(NewDoctorDialog, {
      width: '572px',
    });
  }

  protected readonly presetColors = presetColors;
  protected readonly PAYMENT_METHOD_STRING: {[key: number]: string} = PAYMENT_METHOD_STRING;

  deleteTransaction(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '416px',
      data: {
        title: 'Você tem certeza que deseja excluir essa transação?',
        subtitle: '',
        confirmText: 'Deletar',
        cancelText: 'Cancelar'
      }
    }).afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.paymentService.deletePayment(id);
    });
  }

  updateTransaction(payment: IPayment) {
    const dialogRef = this.dialog.open(UpdateTransactionDialog, {
      width: '572px',
      disableClose: true,
      data: payment
    })
  }

  print() {
    window.print();
  }
}
