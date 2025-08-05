import { Component, signal, WritableSignal } from '@angular/core';
import { IPatientFilters, PatientService } from '../../services/patient-service';
import { IPatient } from '../../interfaces/IPatient.model';
import { AuthService } from '../../services/auth-service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FileDialog } from '../../components/file-dialog/file-dialog';
import { Header } from '../../components/header/header';


@Component({
  selector: 'app-home',
  imports: [MatDialogModule, Header],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  patients: WritableSignal<IPatient[]> = signal<IPatient[]>([]);
  constructor(private patientService: PatientService, private authService: AuthService, private dialog: MatDialog) {}
  ngOnInit() {
    this.getPatients({} as IPatientFilters);
  }

  getPatients(filters: IPatientFilters) {
    this.patientService.getPatients(filters).subscribe(patients => {
      this.patients.set(patients.items);
    });
  }

  logout() {
    this.authService.logout();
  }

  openFileDialog() {
    this.dialog.open(FileDialog, {
      width: '1000px',
      height: '400px',
      data: this.patients()[2]
    })
  }
}
