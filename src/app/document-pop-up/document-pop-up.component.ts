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
  selector: 'app-document-pop-up',
  standalone: true,
  imports: [MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './document-pop-up.component.html',
  styleUrl: './document-pop-up.component.css'
})
export class DocumentPopUpComponent {

    // Initialize services
    constructor(
      public dialogRef: MatDialogRef<DocumentPopUpComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    // Initializing component
  ngOnInit(): void {
    console.log('Document popup Component Onint');
  }

  // Destroying component
  ngOnDestroy(): void {
    console.log('Document Popup component destroyed');
  }

  // Closing the dialog box
  onClose(): void {
    this.dialogRef.close(false); 
  }

}
