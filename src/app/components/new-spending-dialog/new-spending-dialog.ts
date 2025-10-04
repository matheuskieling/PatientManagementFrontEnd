import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentMethod } from '../../../enums/enums';
import { MatDialogRef } from '@angular/material/dialog';
import { PaymentService } from '../../services/payment-service';
import { IPayment } from '../../interfaces/IPayment.model';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { NgxMaskDirective } from 'ngx-mask';
import { ButtonWithIcon } from '../button-with-icon/button-with-icon';

@Component({
  selector: 'app-new-spending-dialog',
  imports: [
    NzIconDirective,
    ReactiveFormsModule,
    NzInputDirective,
    NzSelectComponent,
    NzOptionComponent,
    NgxMaskDirective,
    ButtonWithIcon
  ],
  templateUrl: './new-spending-dialog.html',
  styleUrl: './new-spending-dialog.scss'
})
export class NewSpendingDialog {
  addSpendingForm: FormGroup;
  paymentMethods;
  constructor(
    private dialogRef: MatDialogRef<NewSpendingDialog>,
    private fb: FormBuilder,
    private paymentService: PaymentService,
  ) {
    this.addSpendingForm = this.fb.group({
      description: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      value: ['', Validators.required],
    });
    this.paymentMethods = this.paymentService.paymentMethods;
  }

  closeModal() {
    this.dialogRef.close();
  }
  onSubmit() {
    if (this.addSpendingForm.valid) {
      this.paymentService.createPayment(this.addSpendingForm, false).subscribe({
        next: (data: IPayment) => {
          this.dialogRef.close(data);
        }
      })
    } else {
      this.addSpendingForm.markAllAsTouched();
    }
  }

  protected readonly PaymentMethod = PaymentMethod;
}
