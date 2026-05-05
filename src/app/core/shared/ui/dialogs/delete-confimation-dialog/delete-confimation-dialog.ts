
import { Component } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';



export type DeleteConfirmationDialogData = {
  title: string;
  message: string;
  notes: string[];
  cancelLabel: string;
  confirmLabel: string;
}

export type DeleteConfirmationDialogResult = {
  confirmed: boolean;
}

@Component({
  selector: 'app-delete-confirmation-dialog',
  imports: [],
  templateUrl: './delete-confirmation-dialog.html',
  styleUrl: './delete-confirmation-dialog.css',
})
export class DeleteConfirmationDialog {


  constructor(
    private readonly dialogRef: MatDialogRef<DeleteConfirmationDialog, DeleteConfirmationDialogResult>,
    @Inject(MAT_DIALOG_DATA) protected data: DeleteConfirmationDialogData,
  ) {}



  confirm() {
    this.dialogRef.close({ confirmed: true });
  }
  close() {
    this.dialogRef.close({ confirmed: false });
  }

}
