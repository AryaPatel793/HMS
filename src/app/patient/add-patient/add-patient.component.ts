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
import { HospitalService } from '../../Services/Hospital/hospital.service';
import { PLATFORM_ID, Inject } from '@angular/core';
import { Patient } from '../../model/Patient';
import { PatientService } from '../../Services/Patient/patient.service';
import { UserService } from '../../Services/User/user.service';
import { MatStepperModule } from '@angular/material/stepper';
import {
  IDropdownSettings,
  NgMultiSelectDropDownModule,
} from 'ng-multiselect-dropdown';

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
  //Required attributes
  patientForm!: FormGroup;

  hospitals: any[] = [];

  states: string[] = Constant.states;

  cities: string[] = [];

  bloodGroups: string[] = Constant.bloodGroup;

  allowedRoles: string[] = [Constant.DOCTOR];

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
    public userService: UserService
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
    this.hospitalService
      .getHospital(this.userService.getUserEmail())
      .subscribe((response: any) => {
        this.hospitals = response.data;
      });
  }

  // Initialize patient form
  private initializeForm() {
    this.patientForm = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          patient_id: [''],
          patient_custom_id: [''],
          name: ['', Validators.required],
          age: ['', Validators.required],
          blood_group: ['', Validators.required],
          phone_number: [
            null,
            [Validators.required, Validators.pattern(/^\d{10}$/)],
          ],
          is_active: [true, Validators.required],
          hospitalList: [[], Validators.required],
        }),
        this.formBuilder.group({
          address: [
            '',
            [
              Validators.required,
              Validators.maxLength(150),
              Validators.minLength(20),
            ],
          ],
          city: ['', Validators.required],
          state: ['', Validators.required],
          zipcode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
        }),
        this.formBuilder.group({
          user_name: [null, Validators.required],
          email: [
            null,
            [
              Validators.required,
              Validators.pattern(
                '^[a-zA-Z0-9.]+@[a-zA-Z]+\.[a-zA-Z]*$'
              ),
              Validators.maxLength(50),
            ],
          ],
          password: [
            null,
            [
              Validators.required,
              Validators.pattern(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
              ),
            ],
          ],
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
    debugger;
    this.patientService.addPatient(patientData).subscribe((response: any) => {
      if (response.code === 201) {
        this.notificationService.successNotification('Patient added');
        this.router.navigate(['/userDashboard/patient']);
      } else if ( response.code === 404 ||
        response.code === 704 ||
        response.code === 804) {
        this.notificationService.errorNotification(response.message);
      } 
    });
  }

  // Get patient by ID
  getPatientDetailsById(id: any) {
    this.patientService.getPatientById(id).subscribe((response: any) => {
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
            password: patient.password,
          },
        ],
      });

      this.onStateChange({ target: { value: patient.state } });
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
isPatternError(arrayIndex: number, field: string) {
  return this.patientForm.get('formArray')?.get(arrayIndex.toString())?.get(field)?.errors?.['pattern'];
}
}
