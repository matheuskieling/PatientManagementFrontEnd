import { Component, WritableSignal } from '@angular/core';
import { IPatient } from '../../interfaces/IPatient.model';
import { IPageable } from '../../interfaces/IPageable.model';
import { PatientService } from '../../services/patient-service';
import { MatDialog } from '@angular/material/dialog';
import { FileDialog } from '../file-dialog/file-dialog';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { DatePipe } from '@angular/common';
import { NzTagComponent } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-patient-table',
  imports: [
    NzTableComponent,
    DatePipe,
    NzTagComponent
  ],
  templateUrl: './patient-table.html',
  styleUrl: './patient-table.scss'
})
export class PatientTable {
  patients: WritableSignal<IPageable<IPatient>>;
  pageIndex: number = 1;
  widthConfig: string[] = ['237px', '135px', '180px', '80px', '180px'];

  constructor(private patientService: PatientService, private dialog: MatDialog) {
    this.patients = patientService.patients
    patientService.getPatients();
  }


  openFileDialog() {
    if (this.patients && this.patients().items.length > 2) {
      this.dialog.open(FileDialog, {
        width: '1000px',
        height: '400px',
        data: this.patients().items[2]
      })
    }
  }
  accessFile() {
    return;
  }

  changePage(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.patientService.setPage(this.pageIndex)
  }
}
