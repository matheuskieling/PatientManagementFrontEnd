import { Component, signal, WritableSignal } from '@angular/core';
import { IPatientFilters, PatientService } from '../../services/patient-service';
import { IPatient } from '../../interfaces/IPatient.model';
import { AuthService } from '../../services/auth-service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FileDialog } from '../../components/file-dialog/file-dialog';
import { Header } from '../../components/header/header';
import { Filter } from '../../components/filter/filter';
import { PatientTable } from '../../components/patient-table/patient-table';
import { IPageable } from '../../interfaces/IPageable.model';


@Component({
  selector: 'app-home',
  imports: [MatDialogModule, Header, Filter, PatientTable],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  patients: WritableSignal<IPageable<IPatient>>;
  constructor(private patientService: PatientService, private authService: AuthService, private dialog: MatDialog) {
    this.patients = patientService.patients
    patientService.getPatients();
  }

  logout() {
    this.authService.logout();
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
}
