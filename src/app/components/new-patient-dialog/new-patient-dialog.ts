import { Component, Inject, WritableSignal } from '@angular/core';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ButtonWithIcon } from '../button-with-icon/button-with-icon';
import { NgxMaskDirective } from 'ngx-mask';
import { PatientService } from '../../services/patient-service';
import { HealthPlanService } from '../../services/health-plan-service';
import { ICategory, IHealthPlan } from '../../interfaces/IPatient.model';
import { CategoryService } from '../../services/category-service';
import { Dialog } from '../dialog/dialog';
import { PatientDialog } from '../patient-dialog/patient-dialog';
import { FileDialog } from '../file-dialog/file-dialog';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { firstValueFrom } from 'rxjs';
import { NewCategoryDialog } from '../new-category-dialog/new-category-dialog';
import { NewHealthPlanDialog } from '../new-health-plan-dialog/new-health-plan-dialog';

@Component({
  selector: 'app-new-patient-dialog',
  imports: [
    NzIconDirective,
    NzInputDirective,
    ReactiveFormsModule,
    NzSelectComponent,
    NzOptionComponent,
    ButtonWithIcon,
    NgxMaskDirective
  ],
  templateUrl: './new-patient-dialog.html',
  styleUrl: './new-patient-dialog.scss'
})
export class NewPatientDialog {
  addContact: boolean = false;
  addForm: FormGroup;
  loading: boolean = false;
  categories: WritableSignal<ICategory[]>;
  healthPlans: WritableSignal<IHealthPlan[]>;
  bypassName: boolean = false;
  bypassFileNumber: boolean = false;
  bypassFileNumberEco: boolean = false;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private categoryService: CategoryService,
    private healthPlanService: HealthPlanService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<NewPatientDialog>
  ) {
    this.patientService.getNextFileNumbers().subscribe(res => {
      this.addForm.patchValue({
        record: res.fileNumber,
        recordEco: res.fileNumberEco,
      });
    });
    this.addForm = this.createForm();
    this.categories = this.categoryService.getCategories();
    this.healthPlans = this.healthPlanService.getHealthPlans();
  }

  createForm() {
    return this.fb.group({
      name: [''],
      category: [null],
      record: [null],
      recordEco: [null],
      address: [''],
      birthDate: [null, Validators.pattern(/^\d{2}\/\d{1,2}\/\d{4}$/)],
      healthPlan: [null],
      healthPlanNumber: [''],
      gender: [''],
      phone: [''],
      cpf: ['', Validators.pattern(/^\d{11}$/)],
      rg: ['', Validators.pattern(/^\d{10}$/)],
      contactName: [''],
      contactPhone: [''],
    })
  }

  async onSubmit(): Promise<void> {
    if (!this.addForm.valid) return;

    // Use firstValueFrom to avoid deprecated toPromise
    const res = await firstValueFrom(this.patientService.validatePatient(this.addForm));

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
                  width: '572px',
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
                  width: '572px',
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
      const created = await firstValueFrom(this.patientService.createPatient(this.addForm));
      this.loading = false;
      this.patientService.getPatients();
      this.dialog.open(Dialog, {
        width: '416px',
        data: {
          title: 'Paciente criado com sucesso. \n Gostaria de impimir o envolope agora?',
          subtitle: 'Caso prefira, você pode imprimir depois acessando a ficha do paciente.',
          confirmText: 'Concluir',
          actionText: 'Imprimir',
          action: () => {
            if (!created) return;
            this.patientService.getPatientById(created.id).subscribe({
              next: patient => {
                this.dialog.open(FileDialog, {
                  minWidth: '1000px',
                  height: 'fit-content',
                  data: patient,
                })
              },
              error: err => this.dialog.open(Dialog, {
                width: '572px',
                data: {
                  title: 'Erro ao acessar ficha do paciente',
                  subtitle: 'Não foi possível acessar a ficha do paciente. Tente novamente mais tarde.',
                  confirmText: 'Ok'
                }
              })
            })
          }
        }
      });
      this.dialogRef.close(true);
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
  closeModal() {
    this.dialogRef.close();
  }
  handleNewHealthPlan() {
    this.dialog.open(NewHealthPlanDialog, {
      width: '572px',
    });
  }
}
