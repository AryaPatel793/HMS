import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormArray,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
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
import { ValidationService } from '../../Services/Validation/validation.service';
import { MatStepperModule } from '@angular/material/stepper';
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
    MatStepperModule,
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

  adminRole: any = Constant.ADMIN;

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
    public userService: UserService,
    public validateService: ValidationService
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
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          doctor_id: [''],
          doctor_custom_id: [''],
          doctor_name: [
            '',
            this.validateService.getUserNameValidators(),
          ],
          phone_number: [
            null,
            this.validateService.getPhoneValidators(),
          ],
          is_active: [true, Validators.required],
          hospitalList: [[], Validators.required],
        }),
        this.formBuilder.group({
          address: [
            '',
            this.validateService.getAddressValidators(),
          ],
          city: ['', Validators.required],
          state: ['', Validators.required],
          zipcode: [
            '',
            this.validateService.getZipCodeValidators(),
          ],
        }),
        this.formBuilder.group({
          user_name: [
            null,
            this.validateService.getUserNameValidators(),
          ],
          email: [
            null,
            this.validateService.getEmailValidators(),
          ],
          password: [
            null,
            this.validateService.getPasswordValidators(),
          ],
        }),
      ]),
    });
  }

  get formArray(): AbstractControl | null | FormArray {
    return this.doctorForm.get('formArray') as FormArray;
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
    const [doctorInfo, addressInfo, userInfo] = this.doctorForm.value.formArray;
    const selectedHospitalIds = doctorInfo.hospitalList.map(
      (hospital: any) => hospital.hospital_custom_id
    );
    doctorData.selected_hospital = selectedHospitalIds;
    this.doctorService.addDoctor(doctorData).subscribe((response: any) => {
      if (response.code === 201) {
        this.notificationService.successNotification('Doctor added');
        this.router.navigate(['/userDashboard/doctor']);
      } else if (
        response.code === 404 ||
        response.code === 704 ||
        response.code === 804
      ) {
        this.notificationService.errorNotification(response.message);
      }
    });
  }

  // Get doctor by ID
  getDoctorDetailsById(id: any) {
    this.doctorService.getDoctorById(id).subscribe((response: any) => {
      const doctor = response.data;
      this.doctorForm.patchValue({
        formArray: [
          {
            doctor_id: doctor.doctor_id,
            doctor_custom_id: doctor.doctor_custom_id,
            doctor_name: doctor.doctor_name,
            phone_number: doctor.phone_number,
            is_active: doctor.is_active,
            hospitalList: doctor.selected_hospital || [],
          },
          {
            address: doctor.address,
            city: doctor.city,
            state: doctor.state,
            zipcode: doctor.zipcode,
          },
          {
            user_name: doctor.user_name,
            email: doctor.email,
            password: doctor.password,
          },
        ],
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
  isFieldInvalid(arrayIndex: number, field: string) {
    return (
      this.doctorForm.get('formArray')?.get(arrayIndex.toString())?.get(field)
        ?.invalid &&
      (this.doctorForm.get('formArray')?.get(arrayIndex.toString())?.get(field)
        ?.touched ||
        this.doctorForm.get('formArray')?.get(arrayIndex.toString())?.get(field)
          ?.dirty)
    );
  }

  // Valid field validation
  isFieldValid(arrayIndex: number, field: string) {
    return (
      this.doctorForm.get('formArray')?.get(arrayIndex.toString())?.get(field)
        ?.valid &&
      this.doctorForm.get('formArray')?.get(arrayIndex.toString())?.get(field)
        ?.touched
    );
  }

  // Check if field has pattern error
  isPatternInvalid(arrayIndex: number, field: string) {
    return this.doctorForm
      .get('formArray')
      ?.get(arrayIndex.toString())
      ?.get(field)?.errors?.['pattern'];
  }

  // Check if field has required error
  isRequiredInvalid(arrayIndex: number, field: string) {
    return (
      this.doctorForm.get('formArray')?.get(arrayIndex.toString())?.get(field)
        ?.errors?.['required'] &&
      this.doctorForm.get('formArray')?.get(arrayIndex.toString())?.get(field)
        ?.touched
    );
  }

  // Check if field has length error
  isLengthInvalid(arrayIndex: number, field: string) {
    const fieldControl = this.doctorForm
      .get('formArray')
      ?.get(arrayIndex.toString())
      ?.get(field);
    return ((
      fieldControl?.hasError('minlength') ||
      fieldControl?.hasError('maxlength') ||
      fieldControl?.hasError('max') ||
      fieldControl?.hasError('min')) &&
      !fieldControl?.hasError?.('pattern')

    );
  }

  // Validating all fields of previous step
  onNextStep(arrayIndex: number) {
    this.zone.run(() => {
      let formArray = this.doctorForm.get('formArray') as FormArray;
      let formGroup = formArray.at(arrayIndex) as FormGroup;
      Object.keys(formGroup.controls).forEach(key => {
        formGroup.controls[key].markAsTouched();
      });
    });
  }
}
