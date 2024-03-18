import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
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
import {
  IDropdownSettings,
  NgMultiSelectDropDownModule,
} from 'ng-multiselect-dropdown';
import { Patient } from '../../model/Patient';
import { PatientService } from '../../Services/Patient/patient.service';
import { UserService } from '../../Services/User/user.service';

@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    CommonModule,
    NgMultiSelectDropDownModule,
    FormsModule,
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
      .getHospital(this.userService.getUsername())
      .subscribe((response: any) => {
        this.hospitals = response;
        console.log(this.hospitals);
      });
  }

  // Initialize patient form
  private initializeForm() {
    this.patientForm = new FormGroup({
      patient_id: new FormControl(''),
      patient_custom_id: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      age: new FormControl('', [Validators.required]),
      blood_group: new FormControl('', [Validators.required]),
      phone_number: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^\d{10}$/),
      ]),
      address: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      zipcode: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{6}$/),
      ]),
      is_active: new FormControl(true, [Validators.required]),
      user_name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        ),
      ]),
      hospitalList: new FormControl([], [Validators.required]),
    });
  }

  // Save or update patient
  savePatient() {
    if (this.patientForm.valid) {
      let patientData = new Patient(this.patientForm.value);
      const selectedHospitalIds = this.patientForm.value.hospitalList.map(
        (hospital: any) => hospital.hospital_custom_id
      );
      patientData.doctor_user_name = this.userService.getUsername();
      patientData.selected_hospital = selectedHospitalIds;

      this.patientService.addPatient(patientData).subscribe((result: any) => {
        if (result.valid) {
          this.notificationService.successNotification('Patient added');
          this.router.navigate(['/userDashboard/patient']);
        }
      });
    } else {
      this.zone.run(() => {
        this.patientForm.markAllAsTouched();
        this.notificationService.errorNotification(
          'Please fill in all required fields correctly.'
        );
      });
    }
  }

  // Get patient by ID
  getPatientDetailsById(id: any) {
    this.patientService.getPatientById(id).subscribe((patient: any) => {
      this.patientForm.patchValue({
        patient_id: patient.patient_id,
        patient_custom_id: patient.patient_custom_id,
        name: patient.name,
        age: patient.age,
        blood_group: patient.blood_group,
        phone_number: patient.phone_number,
        address: patient.address,
        city: patient.city,
        state: patient.state,
        zipcode: patient.zipcode,
        is_active: patient.is_active,
        user_name: patient.user_name,
        email: patient.email,
        password: patient.password,
        hospitalList: patient.selected_hospital || [],
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

  // Invalid field validation
  isFieldInvalid(field: string) {
    return (
      this.patientForm.get(field)?.invalid &&
      (this.patientForm.get(field)?.touched ||
        this.patientForm.get(field)?.dirty)
    );
  }

  // Valid field validation
  isFieldValid(field: string) {
    return this.patientForm.get(field)?.valid && this.patientForm.get(field)?.touched;
  }
}
