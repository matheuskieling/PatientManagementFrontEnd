import { Component, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IDoctor, IDoctorRequest } from '../../interfaces/IPatient.model';
import { DoctorService } from '../../services/doctor-service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { ButtonWithIcon } from '../button-with-icon/button-with-icon';
import { NgClass } from '@angular/common';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-new-doctor-dialog',
  imports: [
    ReactiveFormsModule,
    NzInputDirective,
    ButtonWithIcon,
    NgClass,
    NzButtonComponent
  ],
  templateUrl: './new-doctor-dialog.html',
  styleUrl: './new-doctor-dialog.scss'
})
export class NewDoctorDialog {
  addDoctorForm: FormGroup;
  editDoctorForm: FormGroup;
  isEditing: boolean = false;
  editingDoctorId: string | null | undefined = null;
  doctors: WritableSignal<IDoctor[]>;
  constructor(private fb: FormBuilder, private doctorService: DoctorService, private dialog: MatDialog, private dialogRef: MatDialogRef<NewDoctorDialog>) {
    this.addDoctorForm = this.fb.group({
      name: ['', Validators.required],
    })
    this.editDoctorForm = this.fb.group({
      name: ['', Validators.required],
    })
    this.doctors = this.doctorService.doctors;
  }
  createDoctor() {
    if (this.addDoctorForm.invalid) {
      return;
    }
    const doctor: IDoctorRequest = {
      name: this.addDoctorForm.value.name,
    }
    this.doctorService.createDoctor(doctor)
    this.addDoctorForm.reset();
  }
  editDoctor(doctor: IDoctor) {
    this.isEditing = true;
    this.editingDoctorId = doctor.id;
    this.editDoctorForm.patchValue({
      name: doctor.name,
    });
  }
  saveEditedDoctor(doctor: IDoctor) {
    if (this.editDoctorForm.invalid) {
      return;
    }
    const updatedDoctor: IDoctor = {
      ...doctor,
      name: this.editDoctorForm.value.name
    };
    this.doctorService.updateDoctor(updatedDoctor)
    this.editDoctorForm.reset();
    this.editingDoctorId = null;
    this.isEditing = false;
  }
  deleteDoctor(doctor: IDoctor) {
    if (this.isEditing) {
      return;
    }
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '416px',
      data: {
        title: 'Você tem certeza que deseja excluir este médico?',
        subtitle: 'Todos os lançamentos que possuem este médico vão perder a informação. Deseja continuar?',
        confirmText: 'Deletar',
        cancelText: 'Cancelar'
      }
    }).afterClosed().subscribe(result => {
      this.doctorService.deleteDoctor(doctor);
    })
  }
  closeModal() {
    this.dialogRef.close();
  }
}
