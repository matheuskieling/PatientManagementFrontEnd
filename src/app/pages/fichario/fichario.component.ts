import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { MatDialogModule } from '@angular/material/dialog';
import { Header } from '../../components/header/header';
import { Filter } from '../../components/filter/filter';
import { PatientTable } from '../../components/patient-table/patient-table';


@Component({
  selector: 'app-fichario',
  imports: [MatDialogModule, Header, Filter, PatientTable],
  templateUrl: './fichario.component.html',
  styleUrl: './fichario.component.scss'
})
export class Fichario {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
