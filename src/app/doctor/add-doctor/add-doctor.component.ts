import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
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

@Component({
  selector: 'app-add-doctor',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule],
  templateUrl: './add-doctor.component.html',
  styleUrl: './add-doctor.component.css'
})
export class AddDoctorComponent {

  doctorForm!: FormGroup;

  states: string[] = Constant.states;

  cities: string[] = [];

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private doctorService: DoctorService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {
    this.initializeForm();
    console.log('AddDoctorComponent constructor');
    this.route.params.subscribe((params) => {
      const doctorId = params['id'];
      if (doctorId) {
        this.getDoctorDetailsById(doctorId);
      }
    });
  }

  ngOnInit() {
    console.log('AddDoctorComponent ngOnInit');
  }

  private initializeForm() {
    this.doctorForm = new FormGroup({
      doctor_id: new FormControl(''),
      doctor_custom_id: new FormControl(''),
      doctor_name: new FormControl('', [Validators.required]),
      phone_number: new FormControl(null,[Validators.required, Validators.pattern(/^\d{10}$/)]),
      address: new FormControl('', [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      state: new FormControl(null, [Validators.required]),
      zipcode: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{6}$/),
      ]),
      is_active: new FormControl(null, [Validators.required]),
    });
  }

  saveDoctor() {
    if (this.doctorForm.valid) {
      let doctorData = new Doctor(this.doctorForm.value);
      this.doctorService
        .addDoctor(doctorData)
        .subscribe((result: any) => {
          if (result.valid) {
            this.notificationService.successNotification('Doctor added');
            this.router.navigate(['/adminDashboard/doctor']);
            this.initializeForm();
          }
        });
    } else {
      this.zone.run(() => {
        this.doctorForm.markAllAsTouched();
        this.notificationService.errorNotification('Please fill in all required fields correctly.');
      });
    }
  }


  getDoctorDetailsById(id: any) {
    this.doctorService.getDoctorById(id).subscribe((doctor: any) => {
      // Initialize the form with the retrieved hospital data
      this.initializeForm();
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
      (this.doctorForm.get(field)?.touched ||
        this.doctorForm.get(field)?.dirty)
    );
  }

  isFieldValid(field :string)
  {
    return (this.doctorForm.get(field)?.valid);
  }



}
