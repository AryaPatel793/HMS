import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
@Component({
  selector: 'app-confirmation-pop-up',
  standalone: true,
  imports: [ 
   
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent],
  templateUrl: './confirmation-pop-up.component.html',
  styleUrl: './confirmation-pop-up.component.css'
})
export class ConfirmationPopUpComponent {

  

  constructor(
    public dialogRef: MatDialogRef<ConfirmationPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    
  }

  onCancel(): void {
    this.dialogRef.close(false); // User canceled the operation
  }

  onConfirm(): void {
    this.dialogRef.close(true); // User confirmed the operation
  }

}
