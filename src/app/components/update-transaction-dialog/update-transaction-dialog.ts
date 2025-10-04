import { ChangeDetectorRef, Component, Inject, WritableSignal } from '@angular/core';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { IDoctor, IHealthPlan, IPatient } from '../../interfaces/IPatient.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PaymentService } from '../../services/payment-service';
import { PatientService } from '../../services/patient-service';
import { DoctorService } from '../../services/doctor-service';
import { HealthPlanService } from '../../services/health-plan-service';
import { NewHealthPlanDialog } from '../new-health-plan-dialog/new-health-plan-dialog';
import { NewDoctorDialog } from '../new-doctor-dialog/new-doctor-dialog';
import { IPayment } from '../../interfaces/IPayment.model';
import { PaymentMethod } from '../../../enums/enums';
import { ButtonWithIcon } from '../button-with-icon/button-with-icon';
import { PAYMENT_METHOD_STRING } from '../../../constants';

@Component({
  selector: 'app-update-transaction-dialog',
  imports: [
    NzIconDirective,
    ReactiveFormsModule,
    NzInputDirective,
    NzSelectComponent,
    NzOptionComponent,
    ButtonWithIcon
  ],
  templateUrl: './update-transaction-dialog.html',
  styleUrl: './update-transaction-dialog.scss'
})
export class UpdateTransactionDialog {
  updateTransactionForm: FormGroup;
  healthPlans: WritableSignal<IHealthPlan[]>;
  doctors: WritableSignal<IDoctor[]>;
  patients: IPatient[] = [];
  paymentMethods;


  constructor(
    private dialogRef: MatDialogRef<UpdateTransactionDialog>,
    private fb: FormBuilder,
    private healthPlanService: HealthPlanService,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private paymentService: PaymentService,
    @Inject(MAT_DIALOG_DATA) public data: IPayment,
  ) {
    this.paymentMethods = this.paymentService.paymentMethods;
    this.healthPlans = this.healthPlanService.getHealthPlans();
    this.doctors = this.doctorService.getDoctors();
    this.updateTransactionForm = this.fb.group({
      description: [data.description, Validators.required],
      patientId: [''],
      healthPlanId: [data.healthPlan?.id],
      doctorId: [data.doctor?.id],
      paymentMethod: [data.paymentMethod, Validators.required],
      value: [data.value, Validators.required],
    });

    if (this.data.patient) {
      this.patientService.searchPatients(this.data.patient!.name!)
        .subscribe((results: IPatient[]) => {
          this.patients = results;
          this.cdr.detectChanges();
          this.updateTransactionForm.get('patientId')?.setValue(this.data.patient!.id!)
        });
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
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
  onSubmit() {
    if (this.updateTransactionForm.valid) {
      this.paymentService.updatePayment(this.updateTransactionForm, this.data.id, this.data.isIncome).subscribe({
        next: (data: IPayment) => {
          this.dialogRef.close(data);
        }
      })
    } else {
      this.updateTransactionForm.markAllAsTouched();
    }
  }
  onPatientChange(value: any) {
    this.patientService.searchPatients(value)
    .subscribe((results: IPatient[]) => {
      this.patients = results;
      this.cdr.detectChanges();
    });
  }

  protected readonly PaymentMethod = PaymentMethod;
  protected readonly PAYMENT_METHOD_STRING: {[key: string]: string} = PAYMENT_METHOD_STRING;
}
