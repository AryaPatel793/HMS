import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild, ViewChildren } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DoctorService } from '../../Services/Doctor/doctor.service';
import { NotificationService } from '../../Services/notification/notification.service';
import { Router } from '@angular/router';
import { Doctor } from '../../model/Doctor';
import { NgIf } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Constant } from '../../Services/constant/Constant';
import { NgZone } from '@angular/core';
// import {
//   IDropdownSettings,
//   NgMultiSelectDropDownModule,
// } from 'ng-multiselect-dropdown';
import { HospitalService } from '../../Services/Hospital/hospital.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

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
export class AddDoctorComponent implements OnInit, OnDestroy{

  // @ViewChild('multiSelect') multiSelect : any;

  doctorForm!: FormGroup;

  hospitals: any[] = []; // Populate this array with your hospital data

  selectedHospitals: any[] = [];

  states: string[] = Constant.states;

  cities: string[] = [];

  public dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'hospitalId', // Replace with your hospital ID field
    textField: 'name', // Replace with your hospital name field
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    defaultOpen: false,
  };


  ngOnInit(): void {
    this.getAllHospital();
    this.initializeForm();
    console.log('add doctor OnInit');
  }

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private doctorService: DoctorService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: any,
    private hospitalService: HospitalService
  ) {
    console.log('AddDoctorComponent constructor');
    this.route.params.subscribe((params) => {
      const doctorId = params['id'];
      if (doctorId) {
        this.getDoctorDetailsById(doctorId);
      }
    });
  }
  ngOnDestroy(): void {
    console.log("AddDoctorComponent Destroyed");
  }

  getUsername(): string | null {
    return sessionStorage.getItem('username');
  }

  getAllHospital() {
    this.hospitalService
      .getHospital(this.getUsername())
      .subscribe((response: any) => {
        this.hospitals = response;
        console.log(this.hospitals);
      });
  }

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
      city: new FormControl(null, [Validators.required]),
      state: new FormControl(null, [Validators.required]),
      zipcode: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{6}$/),
      ]),
      is_active: new FormControl(null, [Validators.required]),
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

  saveDoctor() {
    if (this.doctorForm.valid) {
      let doctorData = new Doctor(this.doctorForm.value);

      // Extract only hospital IDs from the selected hospitals
      const selectedHospitalIds = this.doctorForm.value.hospitalList.map(
        (hospital: any) => hospital.hospitalId
      );

      // Assign the selected hospital IDs to the doctorData
      doctorData.selected_hospital = selectedHospitalIds;
      console.log(doctorData.selected_hospital);
      console.log(doctorData);
      debugger;

      this.doctorService.addDoctor(doctorData).subscribe((result: any) => {
        if (result.valid) {
          this.notificationService.successNotification('Doctor added');
          this.router.navigate(['/adminDashboard/doctor']);
          this.initializeForm();
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

  getDoctorDetailsById(id: any) {
    this.doctorService.getDoctorById(id).subscribe((doctor: any) => {
      // Initialize the form with the retrieved hospital data
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
        hospitalList: doctor.selected_hospital || []
      });

      // Update cities based on the state from the database
      this.onStateChange({ target: { value: doctor.state } });
    });
  }

  onStateChange(event: any) {
    const state = event.target.value;
    this.cities = Constant.cityData[state] || [];
    this.cdr.detectChanges();
  }

  
  isFieldInvalid(field: string) {
    return (
      this.doctorForm.get(field)?.invalid &&
      (this.doctorForm.get(field)?.touched || this.doctorForm.get(field)?.dirty)
    );
  }

  isFieldValid(field: string) {
    return this.doctorForm.get(field)?.valid;
  }
}
