import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
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
    private formBuilder: FormBuilder,
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

  // Initializing hospital form using FormBuilder
  private initializeForm() {
    this.hospitalForm = this.formBuilder.group({
      hospital_id: [''],
      hospital_custom_id: [''],
      name: [null, Validators.required],
      address: [null, Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipcode: [null, [
        Validators.required,
        Validators.pattern(/^\d{6}$/),
      ]],
      hospital_type: ['', Validators.required],
      is_active: [true, Validators.required],
    });
  }

  // Save or update hospital
  saveHospital() {
    if (this.hospitalForm.invalid){
      this.hospitalForm.markAllAsTouched();
      this.notificationService.errorNotification(
        'Please fill in all required fields correctly.'
      );
      return
    }
      let hospitalData = new Hospital(this.hospitalForm.value);
      this.hospitalService
        .addHospital(hospitalData)
        .subscribe((response: any) => {
          if (response.code === 201) {
            this.notificationService.successNotification('Hospital added');
            this.router.navigate(['/userDashboard/hospital']);
          }else if(response.code === 404){
            this.notificationService.errorNotification(
              response.message
            );
          }
        });
    } 
  

  // Get hospital by ID
  getHospitalDetailsById(id: any) {
    this.hospitalService.getHospitalById(id).subscribe((response: any) => {
      const hospital = response.data;
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
    return (
      this.hospitalForm.get(field)?.valid &&
      this.hospitalForm.get(field)?.touched
    );
  }
}
