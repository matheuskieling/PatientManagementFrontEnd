import { Component, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IHealthPlan, IHealthPlanRequest } from '../../interfaces/IPatient.model';
import { HealthPlanService } from '../../services/health-plan-service';
import { ButtonWithIcon } from '../button-with-icon/button-with-icon';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-new-health-plan-dialog',
  imports: [
    ReactiveFormsModule,
    ButtonWithIcon,
    NzInputDirective,
    NzButtonComponent,
    NgClass
  ],
  templateUrl: './new-health-plan-dialog.html',
  styleUrl: './new-health-plan-dialog.scss'
})
export class NewHealthPlanDialog {
  addHealthPlanForm: FormGroup;
  editHealthPlanForm: FormGroup;
  isEditing: boolean = false;
  editingHealthPlanId: string | null | undefined = null;
  healthPlans: WritableSignal<IHealthPlan[]>;
  constructor(private fb: FormBuilder, private healthPlanService: HealthPlanService, private dialog: MatDialog) {
    this.addHealthPlanForm = this.fb.group({
      name: ['', Validators.required],
    })
    this.editHealthPlanForm = this.fb.group({
      name: ['', Validators.required],
    })
    this.healthPlans = this.healthPlanService.healthPlans;
  }
  createHealthPlan() {
    if (this.addHealthPlanForm.invalid) {
      return;
    }
    const healthPlan: IHealthPlanRequest = {
      name: this.addHealthPlanForm.value.name,
    }
    this.healthPlanService.createHealthPlan(healthPlan)
    this.addHealthPlanForm.reset();
  }
  editHealthPlan(healthPlan: IHealthPlan) {
    this.isEditing = true;
    this.editingHealthPlanId = healthPlan.id;
    this.editHealthPlanForm.patchValue({
      name: healthPlan.name,
    });
  }
  saveEditedHealthPlan(healthPlan: IHealthPlan) {
    if (this.editHealthPlanForm.invalid) {
      return;
    }
    const updatedHealthPlan: IHealthPlan = {
      ...healthPlan,
      name: this.editHealthPlanForm.value.name
    };
    this.healthPlanService.updateHealthPlan(updatedHealthPlan)
    this.editHealthPlanForm.reset();
    this.editingHealthPlanId = null;
    this.isEditing = false;
  }
  deleteHealthPlan(healthPlan: IHealthPlan) {
    if (this.isEditing) {
      return;
    }
    this.healthPlanService.checkHealthPlanDelete(healthPlan).subscribe(result => {
      const subtitle = result > 0 ? `Esse convênio é usado em ${result} paciente${result > 1 ? 's' : ''}. Se você excluir este convênio, ele será removido de todos os pacientes.` : 'A ação não pode ser desfeita.';
      const dialogRef = this.dialog.open(ConfirmDialog, {
        width: '416px',
        data: {
          title: 'Você tem certeza que deseja excluir esta convênio?',
          subtitle: subtitle,
          confirmText: 'Deletar',
          cancelText: 'Cancelar'
        }
      }).afterClosed().subscribe(result => {
        if (!result) {
          return;
        }
        this.healthPlanService.deleteHealthPlan(healthPlan);
      });
    })
  }
}
