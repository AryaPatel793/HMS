import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewChildren,
} from '@angular/core';
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
import { NotificationService } from '../../Services/notification/notification.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Constant } from '../../Services/constant/Constant';
import { NgZone } from '@angular/core';
import { HospitalService } from '../../Services/Hospital/hospital.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import {
  IDropdownSettings,
  NgMultiSelectDropDownModule,
} from 'ng-multiselect-dropdown';
import { Patient } from '../../model/Patient';
import { PatientService } from '../../Services/Patient/patient.service';

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
  patientForm!: FormGroup;

  hospitals: any[] = []; // Populate this array with your hospital data

  selectedHospitals: any[] = [];

  states: string[] = Constant.states;

  cities: string[] = [];

  public dropdownSettings: IDropdownSettings = {
    singleSelection: true,
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
    console.log('add patient OnInit');
  }

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private patientService: PatientService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: any,
    private hospitalService: HospitalService
  ) {
    console.log('AddpatientComponent constructor');
    this.route.params.subscribe((params) => {
      const patientId = params['id'];
      if (patientId) {
        this.getPatientDetailsById(patientId);
      }
    });
  }

  ngOnDestroy(): void {
    console.log('AddPatientComponent Destroyed');
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
    this.patientForm = new FormGroup({
      patient_id: new FormControl(''),
      patient_custom_id: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      age: new FormControl('', [Validators.required]),
      blood_group: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(A|B|AB|O)[+-]$/),
      ]),
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

  savePatient() {
    if (this.patientForm.valid) {
      let patientData = new Patient(this.patientForm.value);

      // Extract only hospital IDs from the selected hospitals
      const selectedHospitalIds = this.patientForm.value.hospitalList.map(
        (hospital: any) => hospital.hospitalId
      );

      patientData.doctor_user_name = this.getUsername();

      // Assign the selected hospital IDs to the patientData
      patientData.selected_hospital = selectedHospitalIds;
      console.log(patientData.selected_hospital);
      console.log(patientData);
      debugger;

      this.patientService.addPatient(patientData).subscribe((result: any) => {
        if (result.valid) {
          this.notificationService.successNotification('Patient added');
          this.router.navigate(['/adminDashboard/patient']);
          this.initializeForm();
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

  getPatientDetailsById(id: any) {
    this.patientService.getPatientById(id).subscribe((patient: any) => {
      // Initialize the form with the retrieved hospital data
      console.log(patient);

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

      // Update cities based on the state from the database
      this.onStateChange({ target: { value: patient.state } });
    });
  }

  onStateChange(event: any) {
    const state = event.target.value;
    this.cities = Constant.cityData[state] || [];
    this.cdr.detectChanges();
  }

  isFieldInvalid(field: string) {
    return (
      this.patientForm.get(field)?.invalid &&
      (this.patientForm.get(field)?.touched ||
        this.patientForm.get(field)?.dirty)
    );
  }

  isFieldValid(field: string) {
    return this.patientForm.get(field)?.valid;
  }
}
