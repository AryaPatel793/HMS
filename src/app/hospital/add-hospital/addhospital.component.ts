import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HospitalService } from '../../Services/Hospital/hospital.service';
import { NotificationService } from '../../Services/notification/notification.service';
import { Router } from '@angular/router';
import { Hospital } from '../../model/Hospital';
import { NgIf } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Constant } from '../../Services/constant/Constant';

@Component({
  selector: 'app-hospitalform',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule],
  templateUrl: './addhospital.component.html',
  styleUrl: './addhospital.component.css',
})
export class AddHospitalComponent implements OnInit, OnDestroy {
  // Required Attributes
  hospitalForm!: FormGroup;

  states: string[] = Constant.states;

  cities: string[] = [];

  // Initialize required services
  constructor(
    private hospitalService: HospitalService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    console.log('HospitalformComponent constructor');
    this.route.params.subscribe((params) => {
      const hospitalId = params['id'];
      if (hospitalId) {
        this.getHospitalDetailsById(hospitalId);
      }
    });
  }

  // Initializing component
  ngOnInit() {
    this.initializeForm();
    console.log('HospitalformComponent ngOnInit');
  }

  // Destroying the component
  ngOnDestroy(): void {
    console.log('AddHospital Component destroyed');
  }

  // Initializing hospital form
  private initializeForm() {
    this.hospitalForm = new FormGroup({
      hospital_id: new FormControl(''),
      hospital_custom_id: new FormControl(''),
      name: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      state: new FormControl(null, [Validators.required]),
      zipcode: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^\d{6}$/),
      ]),
      hospital_type: new FormControl(null, [Validators.required]),
      is_active: new FormControl(null, [Validators.required]),
    });
  }

  // Save or update hospital
  saveHospital() {
    if (this.hospitalForm.valid) {
      let hospitalData = new Hospital(this.hospitalForm.value);
      this.hospitalService
        .addHospital(hospitalData)
        .subscribe((result: any) => {
          if (result.valid) {
            this.notificationService.successNotification('Hospital added');
            this.router.navigate(['/userDashboard/hospital']);
          }
        });
    } else {
      this.hospitalForm.markAllAsTouched();
      this.notificationService.errorNotification(
        'Please fill in all required fields correctly.'
      );
    }
  }

  // Get hospital by ID
  getHospitalDetailsById(id: any) {
    this.hospitalService.getHospitalById(id).subscribe((hospital: any) => {
      this.hospitalForm.patchValue({
        hospital_id: hospital.hospital_id,
        hospital_custom_id: hospital.hospital_custom_id,
        name: hospital.name,
        address: hospital.address,
        city: hospital.city,
        state: hospital.state,
        zipcode: hospital.zipcode,
        hospital_type: hospital.hospital_type,
        is_active: hospital.is_active,
      });

      this.onStateChange({ target: { value: hospital.state } });
    });
  }

  // Update cities when state change
  onStateChange(event: any) {
    const state = event.target.value;
    this.cities = Constant.cityData[state] || [];
    this.cdr.detectChanges();
  }

  // Invalid field validation
  isFieldInvalid(field: string) {
    return (
      this.hospitalForm.get(field)?.invalid &&
      (this.hospitalForm.get(field)?.touched ||
        this.hospitalForm.get(field)?.dirty)
    );
  }

  // Valid field validation
  isFieldValid(field: string) {
    return this.hospitalForm.get(field)?.valid;
  }
}
