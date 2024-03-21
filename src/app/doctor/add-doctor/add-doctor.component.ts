import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../Services/Doctor/doctor.service';
import { NotificationService } from '../../Services/notification/notification.service';
import { Router } from '@angular/router';
import { Doctor } from '../../model/Doctor';
import { NgIf } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Constant } from '../../Services/constant/Constant';
import { UserService } from '../../Services/User/user.service';
import { NgZone } from '@angular/core';
import { HospitalService } from '../../Services/Hospital/hospital.service';
import {
  IDropdownSettings,
  NgMultiSelectDropDownModule,
} from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-add-doctor',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    CommonModule,
    NgMultiSelectDropDownModule,
    FormsModule,
  ],
  templateUrl: './add-doctor.component.html',
  styleUrl: './add-doctor.component.css',
})
export class AddDoctorComponent implements OnInit, OnDestroy {
  //Required attributes
  doctorForm!: FormGroup;

  hospitals: any[] = [];

  states: string[] = Constant.states;

  cities: string[] = [];

  adminRole : any = Constant.ADMIN;

  // Dropdown settings
  public dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'hospital_custom_id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    defaultOpen: false,
  };

  // Intializing required services
  constructor(
    private formBuilder: FormBuilder,
    private doctorService: DoctorService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private hospitalService: HospitalService,
    public userService: UserService
  ) {
    console.log('AddDoctorComponent constructor');
    this.route.params.subscribe((params) => {
      const doctorId = params['id'];
      if (doctorId) {
        this.getDoctorDetailsById(doctorId);
      }
    });
  }

  // Initializing component
  ngOnInit(): void {
    this.getAllHospital();
    this.initializeForm();
    console.log('add doctor OnInit');
  }

  // Destroying component
  ngOnDestroy(): void {
    console.log('AddDoctorComponent Destroyed');
  }

  // Get all hospitals
  getAllHospital() {
    this.hospitalService
      .getHospital(this.userService.getUserEmail())
      .subscribe((response: any) => {
        this.hospitals = response.data;
      });
  }

  // Intializing doctor form using FormBuilder
  private initializeForm() {
    this.doctorForm = this.formBuilder.group({
      doctor_id: [''],
      doctor_custom_id: [''],
      doctor_name: ['', Validators.required],
      phone_number: [
        null,
        [Validators.required, Validators.pattern(/^\d{10}$/)],
      ],
      address: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(150)]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipcode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      is_active: [true, Validators.required],
      user_name: [null, Validators.required],
      email: [
        null,
        [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
          ),
          Validators.maxLength(20)
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
      hospitalList: [[], Validators.required],
    });
  }

  // Save or update doctor details
  saveDoctor() {
    if (this.doctorForm.invalid) {
      this.zone.run(() => {
        this.doctorForm.markAllAsTouched();
        this.notificationService.errorNotification(
          'Please fill in all required fields correctly.'
        );
      });
      return;
    }
    let doctorData = new Doctor(this.doctorForm.value);
    const selectedHospitalIds = this.doctorForm.value.hospitalList.map(
      (hospital: any) => hospital.hospital_custom_id
    );

    doctorData.selected_hospital = selectedHospitalIds;
    this.doctorService.addDoctor(doctorData).subscribe((response: any) => {
      if (response.code === 201) {
        this.notificationService.successNotification('Doctor added');
        this.router.navigate(['/userDashboard/doctor']);
      } else if(response.code === 404 || response.code === 704 || response.code === 804) {
        this.notificationService.errorNotification(response.message);
      }
      
    });
  }

  // Get doctor by ID
  getDoctorDetailsById(id: any) {
    this.doctorService.getDoctorById(id).subscribe((response: any) => {
      const doctor = response.data
      this.doctorForm.patchValue({
        doctor_id: doctor.doctor_id,
        doctor_custom_id: doctor.doctor_custom_id,
        doctor_name: doctor.doctor_name,
        phone_number: doctor.phone_number,
        address: doctor.address,
        city: doctor.city,
        state: doctor.state,
        zipcode: doctor.zipcode,
        is_active: doctor.is_active,
        user_name: doctor.user_name,
        email: doctor.email,
        password: doctor.password,
        hospitalList: doctor.selected_hospital || [],
      });

      this.onStateChange({ target: { value: doctor.state } });
    });
  }

  // On state chage update its cities
  onStateChange(event: any) {
    const state = event.target.value;
    this.cities = Constant.cityData[state] || [];
    this.cdr.detectChanges();
  }

  // Invalid field validation
  isFieldInvalid(field: string) {
    return (
      this.doctorForm.get(field)?.invalid &&
      (this.doctorForm.get(field)?.touched || this.doctorForm.get(field)?.dirty)
    );
  }

  // Valid field validation
  isFieldValid(field: string) {
    return (
      this.doctorForm.get(field)?.valid && this.doctorForm.get(field)?.touched
    );
  }
}
