import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
@Component({
  selector: 'app-confirmation-pop-up',
  standalone: true,
  imports: [MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './confirmation-pop-up.component.html',
  styleUrl: './confirmation-pop-up.component.css',
})
export class ConfirmationPopUpComponent implements OnInit, OnDestroy {
  // Initialize services
  constructor(
    public dialogRef: MatDialogRef<ConfirmationPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  // Initializing component
  ngOnInit(): void {
    console.log('Popup Component Onint');
    console.log(this.data); 
  }

  // Destroying component
  ngOnDestroy(): void {
    console.log('Popup component destroyed');
  }

  // Cancel popup choice
  onCancel(): void {
    this.dialogRef.close(false); // User canceled the operation
  }

  // Confirm popup choice
  onConfirm(): void {
    this.dialogRef.close(true); // User confirmed the operation
  }
}
