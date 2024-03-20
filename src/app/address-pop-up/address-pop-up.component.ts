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
  selector: 'app-address-pop-up',
  standalone: true,
  imports: [MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './address-pop-up.component.html',
  styleUrl: './address-pop-up.component.css'
})
export class AddressPopUpComponent {

   // Initialize services
   constructor(
    public dialogRef: MatDialogRef<AddressPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  // Initializing component
  ngOnInit(): void {
    console.log('Address popup Component Onint');
  }

  // Destroying component
  ngOnDestroy(): void {
    console.log('Address Popup component destroyed');
  }

  // Closing the dialog box
  onClose(): void {
    this.dialogRef.close(false); 
  }

}
