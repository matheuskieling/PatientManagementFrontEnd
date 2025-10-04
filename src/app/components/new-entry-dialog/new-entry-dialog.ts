import { ChangeDetectorRef, Component, WritableSignal } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HealthPlanService } from '../../services/health-plan-service';
import { IDoctor, IHealthPlan, IPatient } from '../../interfaces/IPatient.model';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { NewHealthPlanDialog } from '../new-health-plan-dialog/new-health-plan-dialog';
import { NgxMaskDirective } from 'ngx-mask';
import { ButtonWithIcon } from '../button-with-icon/button-with-icon';
import { PatientService } from '../../services/patient-service';
import { PaymentMethod } from '../../../enums/enums';
import { DoctorService } from '../../services/doctor-service';
import { NewDoctorDialog } from '../new-doctor-dialog/new-doctor-dialog';
import { PaymentService } from '../../services/payment-service';
import { IPayment } from '../../interfaces/IPayment.model';

@Component({
  selector: 'app-new-entry-dialog',
  imports: [
    NzIconDirective,
    NzInputDirective,
    ReactiveFormsModule,
    NzSelectComponent,
    NzOptionComponent,
    NgxMaskDirective,
    ButtonWithIcon
  ],
  templateUrl: './new-entry-dialog.html',
  styleUrl: './new-entry-dialog.scss'
})
export class NewEntryDialog {
  addEntryForm: FormGroup;
  healthPlans: WritableSignal<IHealthPlan[]>;
  doctors: WritableSignal<IDoctor[]>;
  patients: IPatient[] = [];
  paymentMethods;

  constructor(
    private dialogRef: MatDialogRef<NewEntryDialog>,
    private fb: FormBuilder,
    private healthPlanService: HealthPlanService,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private paymentService: PaymentService,
  ) {
    this.healthPlans = this.healthPlanService.getHealthPlans();
    this.doctors = this.doctorService.getDoctors();
    this.addEntryForm = this.fb.group({
      description: ['', Validators.required],
      patientId: [''],
      healthPlanId: [''],
      doctorId: [''],
      paymentMethod: ['', Validators.required],
      value: ['', Validators.required],
    });
    this.paymentMethods = this.paymentService.paymentMethods;
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
    if (this.addEntryForm.valid) {
      this.paymentService.createPayment(this.addEntryForm, true).subscribe({
        next: (data: IPayment) => {
          this.dialogRef.close(data);
        }
      })
    } else {
      this.addEntryForm.markAllAsTouched();
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
}
