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
import { firstValueFrom } from 'rxjs';

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
  addContact: number = 0;
  categories: WritableSignal<ICategory[]>;
  healthPlans: WritableSignal<IHealthPlan[]>;
  bypassName: boolean = false;
  bypassFileNumber: boolean = false;
  bypassFileNumberEco: boolean = false;
  loading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IPatientDialogData,
    private fb: FormBuilder,
    private patientService: PatientService,
    private dialog: MatDialog,
    private categoryService: CategoryService,
    private healthPlanService: HealthPlanService,
    private dialogRef: MatDialogRef<PatientDialog>
  ) {
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
      contactName: [this.getPatientContactName(data.patient, 0)],
      contactPhone: [this.getPatientContactPhone(data.patient, 0)],
      contactName2: [this.getPatientContactName(data.patient, 1)],
      contactPhone2: [this.getPatientContactPhone(data.patient, 1)],
      contactName3: [this.getPatientContactName(data.patient, 2)],
      contactPhone3: [this.getPatientContactPhone(data.patient, 2)],
    })
    this.addContact = this.data.patient.contacts.length + 1;
    this.categories = this.categoryService.getCategories();
    this.healthPlans = this.healthPlanService.getHealthPlans();
  }

  addNewContact(): void {
    this.addContact += 1;
    console.log('addContact', this.addContact);
  }
  getPatientContactName(patient: IPatient, index: number): string {
    return patient.contacts && patient.contacts.length > index ? (patient.contacts[index].name ? patient.contacts[index].name : '') : '';
  }
  getPatientContactPhone(patient: IPatient, index: number): string {
    return patient.contacts && patient.contacts.length > index ? (patient.contacts[index].phone ? patient.contacts[index].phone : '') : '';
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

  async onSubmit(): Promise<void> {
    if (!this.addForm.valid) return;

    // Use firstValueFrom to avoid deprecated toPromise
    const res = await firstValueFrom(this.patientService.validatePatient(this.addForm, this.data.patient));

    // Defensive: If res is undefined, abort
    if (!res) return;

    // CPF validation
    if (res.cpf && !res.cpf.isValid) {
      this.dialog.open(Dialog, {
        width: '572px',
        data: {
          title: 'CPF já cadastrado no nome de outro paciente.',
          subtitle: 'Deseja navegar até a ficha do paciente?',
          confirmText: 'Cancelar',
          actionText: 'Acessar ficha',
          action: () => {
            this.patientService.getPatientByCpf(this.addForm.get('cpf')?.value).subscribe({
              next: patient => {
                this.dialogRef.close();
                this.dialog.open(PatientDialog, {
                  width: '600px',
                  data: { patient }
                });
              },
              error: _ => this.dialog.open(Dialog, {
                width: '416px',
                data: {
                  title: 'Erro ao acessar ficha do paciente',
                  subtitle: 'Não foi possível acessar a ficha do paciente. Tente novamente mais tarde.',
                  confirmText: 'Ok'
                }
              })
            });
          }
        }
      });
      return;
    }

    // RG validation
    if (res.rg && !res.rg.isValid) {
      this.dialog.open(Dialog, {
        width: '572px',
        data: {
          title: 'RG já cadastrado no nome de outro paciente.',
          subtitle: 'Deseja navegar até a ficha do paciente?',
          confirmText: 'Cancelar',
          actionText: 'Acessar ficha',
          action: () => {
            this.patientService.getPatientByRg(this.addForm.get('rg')?.value).subscribe({
              next: patient => {
                this.dialogRef.close();
                this.dialog.open(PatientDialog, {
                  width: '600px',
                  data: { patient }
                });
              },
              error: _ => this.dialog.open(Dialog, {
                width: '416px',
                data: {
                  title: 'Erro ao acessar ficha do paciente',
                  subtitle: 'Não foi possível acessar a ficha do paciente. Tente novamente mais tarde.',
                  confirmText: 'Ok'
                }
              })
            });
          }
        }
      });
      return;
    }

    // Name validation
    if (res.name && !res.name.isValid && !this.bypassName) {
      const result = await firstValueFrom(
        this.dialog.open(ConfirmDialog, {
          width: '572px',
          data: {
            title: 'Nome já cadastrado em outro paciente',
            subtitle: 'A ação ira criar um paciente <span class="font-weight-bold">com mesmo nome</span>. Deseja continuar mesmo assim?',
            confirmText: 'Continuar',
            cancelText: 'Cancelar',
          }
        }).afterClosed()
      );

      if (!result) {
        this.bypassFileNumber = false
        this.bypassName = false;
        this.bypassFileNumberEco = false;
        return;
      }
      this.bypassName = true;
      return this.onSubmit();
    }

    // File number validation
    if (res.fileNumber && !res.fileNumber.isValid && !this.bypassFileNumber) {
      const result = await firstValueFrom(
        this.dialog.open(ConfirmDialog, {
          width: '572px',
          data: {
            title: 'Ficha de consulta já cadastrada em outro paciente',
            subtitle: 'A ação irá <span class="font-weight-bold">remover o número da ficha</span> do outro paciente. Deseja continuar mesmo assim?',
            confirmText: 'Continuar',
            cancelText: 'Cancelar',
          }
        }).afterClosed()
      );

      if (!result) {
        this.bypassFileNumber = false
        this.bypassName = false;
        this.bypassFileNumberEco = false;
        return;
      }
      this.bypassFileNumber = true;
      return this.onSubmit();
    }

    // File number eco validation
    if (res.fileNumberEco && !res.fileNumberEco.isValid && !this.bypassFileNumberEco) {
      const result = await firstValueFrom(
        this.dialog.open(ConfirmDialog, {
          width: '572px',
          data: {
            title: 'Ficha de ecografia já cadastrada em outro paciente',
            subtitle: 'A ação irá <span class="font-weight-bold">remover o número da ficha</span> do outro paciente. Deseja continuar mesmo assim?',
            confirmText: 'Continuar',
            cancelText: 'Cancelar',
          }
        }).afterClosed()
      );

      if (!result) {
        this.bypassFileNumber = false
        this.bypassName = false;
        this.bypassFileNumberEco = false;
        return;
      }
      this.bypassFileNumberEco = true;
      return this.onSubmit();
    }

    this.loading = true;
    this.bypassFileNumberEco = false;
    this.bypassFileNumber = false;
    this.bypassName = false;
    try {
      const created = await firstValueFrom(this.patientService.updatePatient(this.addForm, this.data.patient));
      console.log("created", created);
      this.data.patient = created;
      this.loading = false;
      this.patientService.getPatients();
      this.dialog.open(Dialog, {
        width: '416px',
        data: {
          title: 'Salvo com sucesso!',
          subtitle: 'Paciente atualizado com sucesso.',
          confirmText: 'Continuar',
        }
      });
    } catch (err) {
      this.loading = false;
      console.log('Patient error', err);
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
  closeModal() {
    this.dialogRef.close();
  }
}
