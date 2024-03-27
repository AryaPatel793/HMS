import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgZone } from '@angular/core';
import { NgFor } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { NotificationService } from '../Services/notification/notification.service';
@Component({
  selector: 'app-document-pop-up',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    NgFor,
  ],
  templateUrl: './document-pop-up.component.html',
  styleUrl: './document-pop-up.component.css',
})
export class DocumentPopUpComponent implements OnInit, OnDestroy {
  documentForm!: FormGroup;

  uploadedDocuments: string[] = [];

  presentDocument: any[] = [];

  fileCategory: string[] = ['Aadhar card', 'Pan card', 'Receipt'];

  public accpetedDocuments = ['.pdf', '.jpeg', '.txt', '.xlsx', '.csv'];

  maxFileControls = 3;

  // Initialize services
  constructor(
    public dialogRef: MatDialogRef<DocumentPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private zone: NgZone,
    private notificationService : NotificationService
  ) {
    this.presentDocument = data.presentDocument;
  }

  // Initializing component
  ngOnInit(): void {
    this.zone.run(() => {
      this.initializeForm();
      this.getDocumentFromPatient(this.presentDocument);
      console.log('Document popup Component Onint');
    });
  }

  // Destroying component
  ngOnDestroy(): void {
    console.log('Document Popup component destroyed');
  }

  // initializing the form
  private initializeForm() {
    this.documentForm = this.formBuilder.group({
      documents: new FormArray([]),
    });
    this.addMoreDocument(); // Add at least one document row

  }

  // To get form array 'document'
  public documents(): FormArray {
    return this.documentForm.get('documents') as FormArray;
  }

  // FormControl of 'document' formarray
  public newDocument(): UntypedFormGroup {
    return this.formBuilder.group({
      document_file: [''],
      file_category: ['',[Validators.required]],
      file_name: ['',[Validators.required]],
      file_type: [''],
      file_size: [''],
      file_date: [''],
    });
  }

// Get document of patient
  public getDocumentFromPatient(existingDocuments: any[]) {
    existingDocuments.forEach((document: any, index: number) => {
      // Ensure FormGroup exists at the index
      // while (this.documents().length <= index) {
        this.documents().push(this.newDocument());
      // }
      // Now we can safely patch the value
      this.documents().at(index).patchValue({
        // document_file: document.document_file,
        file_category: document.file_category,
        file_name: document.file_name,
        file_type: document.file_type,
        file_size: document.file_size,
        file_date: document.file_date,
      });
    });
  }

  // On uploading file
  onDocumentSelection(event: any, index: number) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.slice(
        ((fileName.lastIndexOf('.') - 1) >>> 0) + 2
      ); // Extract file extension from file name
      if (!this.accpetedDocuments.includes('.' + fileExtension)) {
        this.notificationService.errorNotification(
          '.'+fileExtension+' this file is not supported'
        );
        return;
      }
      const fileSize = file.size; 
      const fileSizeMB = (fileSize / 1000000).toFixed(2); // Convert to string and keep only two digits after the decimal
      const fileDate = new Date(file.lastModified); // File last modified date
      // const fileDateOnly = fileDate.toLocaleDateString();
      this.documents().at(index).get('file_name')?.setValue(file);
      this.documents().at(index).get('file_name')?.setValue(fileName);
      this.documents().at(index).get('file_type')?.setValue(fileExtension);
      this.documents().at(index).get('file_size')?.setValue(fileSizeMB);
      this.documents().at(index).get('file_date')?.setValue(fileDate);
    }
  }

  // add more document
  public addMoreDocument(): void {
    if (this.documents().length < this.maxFileControls) {
      this.documents().push(this.newDocument());
    }  }

  // remove document
  public removeDocument(i: number): void {
    this.documents().removeAt(i);
  }

  // //On file change
  // onFileChange() {
  //   this.documentForm.valueChanges.subscribe((files: any) => {
  //     if (!Array.isArray(files)) {
  //       this.uploadedDocuments = [files];
  //     } else {
  //       this.uploadedDocuments = files;
  //     }
  //   });
  // }

  //Documents submit
  onDocumentSubmit() {
    if (this.documentForm.invalid) {
      this.zone.run(() => {
        this.documentForm.markAllAsTouched();
        this.notificationService.errorNotification(
          'File is required'
        );
      });
      return;
    }

    const categories: string[] = [];
    let duplicateFound = false;

    this.documents().controls.forEach(control => {
      const category = control.get('file_category')?.value;
      if (categories.includes(category)) {
        duplicateFound = true;
      } else {
        categories.push(category);
      }
    });

    if (duplicateFound) {
      this.notificationService.errorNotification('Duplicate file categories are not allowed');
      return;
    }


    const documents = this.documentForm.value.documents;
    console.log(documents);
    this.dialogRef.close(documents);
  }

  // Closing the dialog box
  onClose(): void {
    this.dialogRef.close(false);
  }

 // Check if field has required error
isRequiredInvalid(field: string, index: number) {
  return (this.documents().at(index).get(field)?.errors?.['required'] 
  && this.documents().at(index).get(field)?.touched);
}

}
