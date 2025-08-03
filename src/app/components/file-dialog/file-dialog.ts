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
      const printWindow = window.open('', '',);
      if (!printWindow) {
        console.error('Failed to open print window');
        return;
      }
      printWindow.document.write('<html><head><title>Print</title>');
      printWindow.document.write('<style>' +
        '@page { size: 225mm 163mm; }' +
        '@media print { body, html { font-family: arial, sans-serif; font-size: 12px !important; display: flex; justify-content: center; align-items: center; margin: auto !important; padding: 0 !important; width: 100%; height: 100%;}' +
        '.print-container { padding-top: 10px !important;font-size: 12px !important; padding-left: 10px !important; position: absolute !important; width: auto !important; height: auto !important; box-sizing: border-box !important; } }' +
        '.border {border: 2px solid black; font-size: 12px !important; display: grid; padding: 20px; width: 650px;}' +
        '.file-number {align-self: start;font-size: 12px; justify-self: end; padding: 12px 20px; border: 1px solid #aaa; min-width: 150px;}' +
        '.dados-table-header {display: flex; font-weight: normal;font-size: 12px; justify-content: left; align-items: flex-start}' +
        '.dados-table-row {padding-left: 20px;font-size: 12px;}' +
        '.dados-table-row-phone {text-align: right;font-size: 12px;}' +
        '.dados-table-row-name {text-align: left;font-size: 12px;}' +
      '</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write(document.getElementById('print-container')!.innerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      this.dialogRef.close();
      printWindow.print();
    }, 0)
  }
}
