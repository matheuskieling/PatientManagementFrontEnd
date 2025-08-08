import { Component, WritableSignal } from '@angular/core';
import { ICategory, IHealthPlan, IPatient } from '../../interfaces/IPatient.model';
import { IPageable } from '../../interfaces/IPageable.model';
import { PatientService } from '../../services/patient-service';
import { MatDialog } from '@angular/material/dialog';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { DatePipe } from '@angular/common';
import { NzTagComponent } from 'ng-zorro-antd/tag';
import { PatientDialog } from '../patient-dialog/patient-dialog';
import { CategoryService } from '../../services/category-service';
import { HealthPlanService } from '../../services/health-plan-service';

@Component({
  selector: 'app-patient-table',
  imports: [
    NzTableComponent,
    DatePipe,
  ],
  templateUrl: './patient-table.html',
  styleUrl: './patient-table.scss'
})
export class PatientTable {
  patients: WritableSignal<IPageable<IPatient>>;
  page: WritableSignal<number>;
  widthConfig: string[] = ['200px', '135px', '145px', '150px', '85px', '100px'];

  constructor(private patientService: PatientService, private dialog: MatDialog, private categoryService: CategoryService, private healthPlanService: HealthPlanService) {
    this.patients = patientService.patients
    this.page = patientService.page;
    patientService.getPatients();
  }


  accessFile(patient: IPatient) {
    this.dialog.open(PatientDialog, {
      width: '572px',
      data: {
        patient
      },
    });
  }

  changePage(pageIndex: number) {
    this.page.set(pageIndex)
    this.patientService.getPatients();
  }
}
