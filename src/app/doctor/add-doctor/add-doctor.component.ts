import { Component, OnDestroy, OnInit } from '@angular/core';
import {
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
      .getHospital(this.userService.getUsername())
      .subscribe((response: any) => {
        this.hospitals = response;
        console.log(this.hospitals);
      });
  }

  // Intializing doctor form
  private initializeForm() {
    this.doctorForm = new FormGroup({
      doctor_id: new FormControl(''),
      doctor_custom_id: new FormControl(''),
      doctor_name: new FormControl('', [Validators.required]),
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

  // Save or update doctor details
  saveDoctor() {
    if (this.doctorForm.valid) {
      let doctorData = new Doctor(this.doctorForm.value);

      const selectedHospitalIds = this.doctorForm.value.hospitalList.map(
        (hospital: any) => hospital.hospital_custom_id
      );

      doctorData.selected_hospital = selectedHospitalIds;

      this.doctorService.addDoctor(doctorData).subscribe((result: any) => {
        if (result.valid) {
          this.notificationService.successNotification('Doctor added');
          this.router.navigate(['/userDashboard/doctor']);
        }
      });
    } else {
      this.zone.run(() => {
        this.doctorForm.markAllAsTouched();
        this.notificationService.errorNotification(
          'Please fill in all required fields correctly.'
        );
      });
    }
  }

  // Get doctor by ID
  getDoctorDetailsById(id: any) {
    this.doctorService.getDoctorById(id).subscribe((doctor: any) => {
      console.log(doctor);

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
    return this.doctorForm.get(field)?.valid && this.doctorForm.get(field)?.touched;
  }
}
