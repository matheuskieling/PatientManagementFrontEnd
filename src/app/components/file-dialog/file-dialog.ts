import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { IPatient } from '../../interfaces/IPatient.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-file-dialog',
  imports: [MatDialogModule, DatePipe],
  templateUrl: './file-dialog.html',
  styleUrl: './file-dialog.scss'
})
export class FileDialog {
  constructor(private dialogRef: MatDialogRef<FileDialog>, @Inject(MAT_DIALOG_DATA) public data: IPatient) {}
  ngOnInit() {
    setTimeout(() => {
      this.downloadPdf();
    }, 2000)
  }
  downloadPdf() {
    console.log('printing pdf');
    console.log(window.document.body);
    window.print();
  }
}
