import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../Services/notification/notification.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Constant } from '../../Services/constant/Constant';
import { NgZone } from '@angular/core';
import { HospitalService } from '../../Services/hospital/hospital.service';
import { PLATFORM_ID, Inject } from '@angular/core';
import { Patient } from '../../model/Patient';
import { PatientService } from '../../Services/patient/patient.service';
import { ValidationService } from '../../Services/validation/validation.service';
import { UserService } from '../../Services/user/user.service';
import { MatStepperModule } from '@angular/material/stepper';
import {
  IDropdownSettings,
  NgMultiSelectDropDownModule,
} from 'ng-multiselect-dropdown';
import { DocumentPopUpComponent } from '../../document-pop-up/document-pop-up.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    CommonModule,
    NgMultiSelectDropDownModule,
    FormsModule,
    MatStepperModule,
  ],
  templateUrl: './add-patient.component.html',
  styleUrl: './add-patient.component.css',
})
export class AddPatientComponent implements OnInit, OnDestroy {
  openDocumentUploadDialog() {
    console.log('Document add dialog box');
  }
  //Required attributes
  patientForm!: FormGroup;

  hospitals: any[] = [];

  states: string[] = Constant.states;

  cities: string[] = [];

  isDocumentPresent!: boolean;

  patientDocuments: any[] = [];

  bloodGroups: string[] = Constant.bloodGroup;

  allowedRoles: string[] = [Constant.DOCTOR];

  patientRole: string = Constant.PATIENT;

  // Dropdown settings
  public dropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'hospital_custom_id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    defaultOpen: false,
  };

  // Initialize required service
  constructor(
    private formBuilder: FormBuilder,
    private patientService: PatientService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: any,
    private hospitalService: HospitalService,
    public userService: UserService,
    private validateService: ValidationService,
    private dialog: MatDialog
  ) {
    console.log('AddpatientComponent constructor');
    this.route.params.subscribe((params) => {
      const patientId = params['id'];
      if (patientId) {
        this.getPatientDetailsById(patientId);
      }
    });
  }

  //Initializing component
  ngOnInit(): void {
    this.getAllHospital();
    this.initializeForm();
    console.log('add patient OnInit');
  }

  // Destroying component
  ngOnDestroy(): void {
    console.log('AddPatientComponent Destroyed');
  }

  // Get all hospital
  getAllHospital() {
    this.hospitalService.getHospital().subscribe((response: any) => {
      if(response.code === 200){
      this.hospitals = response.data;
      }
    });
  }

  // Initialize patient form
  private initializeForm() {
    this.patientForm = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          patient_id: [''],
          patient_custom_id: [''],
          name: ['', this.validateService.getUserNameValidators()],
          age: ['', this.validateService.getAgeValidators()],
          blood_group: ['', Validators.required],
          phone_number: [null, this.validateService.getPhoneValidators()],
          is_active: [true, Validators.required],
          hospitalList: [[], Validators.required],
          ...(!this.isAllowedRole()
            ? { documents: [[], Validators.required] }
            : {}),
        }),
        this.formBuilder.group({
          address: ['', this.validateService.getAddressValidators()],
          city: ['', Validators.required],
          state: ['', Validators.required],
          zipcode: ['', this.validateService.getZipCodeValidators()],
        }),
        this.formBuilder.group({
          user_name: [null, this.validateService.getUserNameValidators()],
          email: [null, this.validateService.getEmailValidators()],
        }),
      ]),
    });
  }

  get formArray(): AbstractControl | null | FormArray {
    return this.patientForm.get('formArray') as FormArray;
  }

  // Save or update patient
  savePatient() {
    if (this.patientForm.invalid) {
      this.zone.run(() => {
        this.patientForm.markAllAsTouched();
        this.notificationService.errorNotification(
          'Please fill in all required fields correctly.'
        );
      });
      return;
    }
    let patientData = new Patient(this.patientForm.value);
    const [patientInfo, addressInfo, userInfo] =
      this.patientForm.value.formArray;
    const selectedHospitalIds = patientInfo.hospitalList.map(
      (hospital: any) => hospital.hospital_custom_id
    );
    patientData.doctor_email = this.userService.getUserEmail();
    patientData.selected_hospital = selectedHospitalIds;
    this.patientService.addPatient(patientData).subscribe((response: any) => {
      if (response.code === 201) {
        this.notificationService.successNotification('Patient added');
        this.router.navigate(['/userDashboard/patient']);
      } else if (
        response.code === 104 ||
        response.code === 105 ||
        response.code === 107 ||
        response.code === 404 ||
        response.code === 704 ||
        response.code === 804 
      ) {
        this.notificationService.errorNotification(response.message);
      } else if (response.code === 202) {
        this.notificationService.successNotification('Patient updated');
        this.router.navigate(['/userDashboard/patient']);
      }
    });
  }

  // Get patient by ID
  getPatientDetailsById(id: any) {
    this.patientService.getPatientById(id).subscribe((response: any) => {
      if(response.code === 200){
      const patient = response.data;
      this.patientForm.patchValue({
        formArray: [
          {
            patient_id: patient.patient_id,
            patient_custom_id: patient.patient_custom_id,
            name: patient.name,
            age: patient.age,
            blood_group: patient.blood_group,
            phone_number: patient.phone_number,
            is_active: patient.is_active,
            hospitalList: patient.selected_hospital || [],
            documents: patient.documents,
          },
          {
            address: patient.address,
            city: patient.city,
            state: patient.state,
            zipcode: patient.zipcode,
          },
          {
            user_name: patient.user_name,
            email: patient.email,
          },
        ],
      });
      this.patientDocuments = patient.documents;
      if (this.patientDocuments) {
        this.isDocumentPresent = true;
      }
      this.onStateChange({ target: { value: patient.state } });
    }
    });
  }

  // Update cities when state changes
  onStateChange(event: any) {
    const state = event.target.value;
    this.cities = Constant.cityData[state] || [];
    this.cdr.detectChanges();
  }

  // Checking if the user's role is allowed
  isAllowedRole(): boolean {
    const userRole = this.userService.getUserRole();
    return (
      userRole !== null &&
      userRole !== undefined &&
      this.allowedRoles.includes(userRole)
    );
  }

  // upload document click
  onDocumentClick() {
    const dialogRef = this.dialog.open(DocumentPopUpComponent, {
      width: '1200px',
      data: {
        message: 'Patient document here',
        presentDocument: this.patientDocuments,
      },
    });
    this.zone.run(() => {
      dialogRef.afterClosed().subscribe((documents: any[]) => {
        if (documents && documents.length > 0) {
          // Set documents array in patient form
          const documentFormArray = this.patientForm
            .get('formArray')
            ?.get([0, 'documents']);
          documentFormArray?.setValue(documents);
        }
      });
    });
  }

  // Invalid field validation
  isFieldInvalid(arrayIndex: number, field: string) {
    return (
      this.patientForm.get('formArray')?.get(arrayIndex.toString())?.get(field)
        ?.invalid &&
      (this.patientForm.get('formArray')?.get(arrayIndex.toString())?.get(field)
        ?.touched ||
        this.patientForm
          .get('formArray')
          ?.get(arrayIndex.toString())
          ?.get(field)?.dirty)
    );
  }

  // Valid field validation
  isFieldValid(arrayIndex: number, field: string) {
    return (
      this.patientForm.get('formArray')?.get(arrayIndex.toString())?.get(field)
        ?.valid &&
      this.patientForm.get('formArray')?.get(arrayIndex.toString())?.get(field)
        ?.touched
    );
  }

  // Check if field has pattern error
  isPatternInvalid(arrayIndex: number, field: string) {
    return this.patientForm
      .get('formArray')
      ?.get(arrayIndex.toString())
      ?.get(field)?.errors?.['pattern'];
  }

  // Check if field has required error
  isRequiredInvalid(arrayIndex: number, field: string) {
    return (
      this.patientForm.get('formArray')?.get(arrayIndex.toString())?.get(field)
        ?.errors?.['required'] &&
      this.patientForm.get('formArray')?.get(arrayIndex.toString())?.get(field)
        ?.touched
    );
  }

  // Check if field has length error
  isLengthInvalid(arrayIndex: number, field: string) {
    const fieldControl = this.patientForm
      .get('formArray')
      ?.get(arrayIndex.toString())
      ?.get(field);
    return (
      (fieldControl?.hasError('minlength') ||
        fieldControl?.hasError('maxlength') ||
        fieldControl?.hasError('max') ||
        fieldControl?.hasError('min')) &&
      !fieldControl?.hasError?.('pattern')
    );
  }

  // Validating all fields of formarray
  onNextStep(arrayIndex: number) {
    this.zone.run(() => {
      let formArray = this.patientForm.get('formArray') as FormArray;
      let formGroup = formArray.at(arrayIndex) as FormGroup;
      Object.keys(formGroup.controls).forEach((key) => {
        formGroup.controls[key].markAsTouched();
      });
    });
  }
}
