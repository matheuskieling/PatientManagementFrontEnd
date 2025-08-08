import { Component, Inject } from '@angular/core';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NzButtonComponent } from 'ng-zorro-antd/button';

interface ConfirmDialogData {
  title: string;
  subtitle: string;
  confirmText: string;
  cancelText: string;
}
@Component({
  selector: 'app-confirm-dialog',
  imports: [
    NzIconDirective,
    NzButtonComponent
  ],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss'
})
export class ConfirmDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData, private dialogRef: MatDialogRef<ConfirmDialogData>) {
  }


  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
