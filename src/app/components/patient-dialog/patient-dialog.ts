import { Component, Inject, WritableSignal } from '@angular/core';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { NgxMaskDirective } from 'ngx-mask';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PatientService } from '../../services/patient-service';
import { ButtonWithIcon } from '../button-with-icon/button-with-icon';
import { ICategory, IHealthPlan, IPatient } from '../../interfaces/IPatient.model';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { FileDialog } from '../file-dialog/file-dialog';
import { CategoryService } from '../../services/category-service';
import { HealthPlanService } from '../../services/health-plan-service';
import { Dialog } from '../dialog/dialog';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { NewCategoryDialog } from '../new-category-dialog/new-category-dialog';
import { NewHealthPlanDialog } from '../new-health-plan-dialog/new-health-plan-dialog';

export interface IPatientDialogData {
  patient: IPatient;
}

@Component({
  selector: 'app-patient-dialog',
  imports: [
    NzSelectComponent,
    NzOptionComponent,
    NgxMaskDirective,
    ReactiveFormsModule,
    NzIconDirective,
    ButtonWithIcon,
    NzInputDirective
  ],
  templateUrl: './patient-dialog.html',
  styleUrl: './patient-dialog.scss'
})
export class PatientDialog {
  addForm: FormGroup;
  categories: WritableSignal<ICategory[]>;
  healthPlans: WritableSignal<IHealthPlan[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IPatientDialogData,
    private fb: FormBuilder,
    private patientService: PatientService,
    private dialog: MatDialog,
    private categoryService: CategoryService,
    private healthPlanService: HealthPlanService,
    private dialogRef: MatDialogRef<PatientDialog>
  ) {
    console.log(data);
    this.addForm = this.fb.group({
      name: [data.patient.name],
      category: [data.patient.category?.name],
      record: [data.patient.fileNumber],
      recordEco: [data.patient.fileNumberEco],
      address: [data.patient.address],
      birthDate: [this.formatDate(data.patient.birthDate), Validators.pattern(/^\d{2}\/\d{1,2}\/\d{4}$/)],
      healthPlan: [data.patient.healthPlan?.name],
      healthPlanNumber: [data.patient.healthPlanNumber],
      gender: [data.patient.gender],
      phone: [data.patient.phone],
      cpf: [data.patient.cpf, Validators.pattern(/^\d{11}$/)],
      rg: [data.patient.rg, Validators.pattern(/^\d{10}$/)],
      contactName: [this.getPatientContactName(data.patient)],
      contactPhone: [this.getPatientContactPhone(data.patient)],
    })
    this.categories = this.categoryService.getCategories();
    this.healthPlans = this.healthPlanService.getHealthPlans();
  }
  getPatientContactName(patient: IPatient): string {
    return patient.contacts && patient.contacts.length > 0 ? patient.contacts[0].name : '';
  }
  getPatientContactPhone(patient: IPatient): string {
    return patient.contacts && patient.contacts.length > 0 ? (patient.contacts[0].phone ? patient.contacts[0].phone : '') : '';
  }

  formatDate(date: string | null | undefined): string {
    if (!date || !date.length) return '';
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return '';
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const year = parsedDate.getFullYear();
    return `${day}/${month}/${year}`;
  }

  onSubmit() {
    if (this.addForm.valid) {
      this.patientService.validatePatient(this.addForm, this.data.patient).subscribe(res => {
        if (!res.cpf.isValid) {
          //show cpf already in use dialog
          return;
        }
        else if (!res.name.isValid) {
          //show name already in use dialog
          // if ok create patient
          // if not ok return
          return;
        }
        else if (!res.fileNumber.isValid) {
          //show fileNumber already in use dialog
          // if ok create patient
          // if not ok return
          return;
        }
        this.patientService.updatePatient(this.addForm, this.data.patient).subscribe(res => {
          // show success dialog
          // close this dialog
          this.patientService.getPatients();
          console.log('Patient updated successfully', res);
        })
      });
    }
  }
  handleNewCategory() {
    this.dialog.open(NewCategoryDialog, {
      width: '572px',
    });
  }
  handleNewHealthPlan() {
    this.dialog.open(NewHealthPlanDialog, {
      width: '572px',
    });
  }

  printPatientFile() {
    if (this.data.patient) {
      this.dialog.open(FileDialog, {
        minWidth: '1000px',
        height: 'fit-content',
        data: this.data.patient,
      })
    }
  }

  deletePatient() {
    if (this.data.patient) {
      this.dialog.open(ConfirmDialog, {
        width: '416px',
        data: {
          title: 'Excluir paciente',
          subtitle: `Você tem certeza que deseja excluir o paciente ${this.data.patient.name}?`,
          confirmText: 'Excluir',
          cancelText: 'Cancelar'
        }
      }).afterClosed().subscribe(result => {
        if (result) {
          this.patientService.deletePatient(this.data.patient.id).subscribe(result => {
            if (result) {
              this.dialog.open(Dialog, {
                width: '416px',
                data: {
                  title: 'Paciente excluído',
                  subtitle: 'O paciente foi excluído com sucesso.',
                  confirmText: 'OK'
                }
              })
              this.dialogRef.close();
            }
            else {
              this.dialog.open(Dialog, {
                width: '416px',
                data: {
                  title: 'Erro ao excluir paciente',
                  subtitle: 'Um erro inesperado ocorreu ao excluir o paciente. Por favor, tente novamente mais tarde.',
                  confirmText: 'OK'
                }
              })
            }
          })
        }
      })
    }
  }
}
