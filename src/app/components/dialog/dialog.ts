import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NzButtonComponent } from 'ng-zorro-antd/button';

interface DialogData {
  title: string;
  subtitle: string;
  confirmText: string;
  action?: () => void;
  actionText?: string;
}
@Component({
  selector: 'app-dialog',
  imports: [
    NzButtonComponent
  ],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss'
})
export class Dialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private dialogRef: MatDialogRef<DialogData>) {
  }

  onConfirm(): void {
    this.dialogRef.close();
  }
  onAction(): void {
    if (this.data.action) {
      this.data.action();
    }
    this.dialogRef.close();
  }
}
