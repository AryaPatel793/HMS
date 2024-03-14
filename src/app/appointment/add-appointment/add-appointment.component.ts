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
import { DoctorService } from '../../Services/Doctor/doctor.service';
import { NotificationService } from '../../Services/notification/notification.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Constant } from '../../Services/constant/Constant';
import { NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { Appointment } from '../../model/Appointment';
import { AppointmentService } from '../../Services/Appointment/appointment.service';
@Component({
  selector: 'app-add-appointment',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './add-appointment.component.html',
  styleUrl: './add-appointment.component.css'
})
export class AddAppointmentComponent {
  appointmentForm!: FormGroup;

  timeSlot: string[] = Constant.timeSlot;

  ngOnInit(): void {
    this.initializeForm();
    console.log('add appointment OnInit');
  }

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private doctorService: DoctorService,
    private notificationService: NotificationService,
    private appointmentService : AppointmentService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {
    console.log('AddAppointmentComponent constructor');
    this.route.params.subscribe((params) => {
      const appointmentId = params['id'];
      if (appointmentId) {
        this.getAppointmentDetailsById(appointmentId);
      }
    });
  }

  ngOnDestroy(): void {
    console.log('AddAppointmentComponent Destroyed');
  }

  getUsername(): string | null {
    return sessionStorage.getItem('username');
  }
  getUserRole(): string | null{
    return sessionStorage.getItem('role')
  }

  private initializeForm() {
    this.appointmentForm = new FormGroup({
      appointment_id : new FormControl(''),
      appointment_custom_id : new FormControl(''),
      appointment_title : new FormControl('', [Validators.required,]),
      appointment_detail : new FormControl('', [Validators.required]),
      appointment_date : new FormControl(null , [Validators.required,this.validateSundayDate]),
      appointment_time: new FormControl(null, [Validators.required]),
    })
  }

  saveAppointment() {
    if (this.appointmentForm.valid) {
      let appointmentData = new Appointment(this.appointmentForm.value);
      appointmentData.patient_username = this.getUsername();
      console.log(appointmentData);
      debugger;

      this.appointmentService.addAppointment(appointmentData).subscribe((result: any) => {
        if (result.valid) {
          this.notificationService.successNotification('Appointment created');
          this.router.navigate(['/adminDashboard/appointment']);
          this.initializeForm();
        }else{
          this.notificationService.errorNotification(
            result.message
          );
        }
      });
    } else {
      this.zone.run(() => {
        this.appointmentForm.markAllAsTouched();
        this.notificationService.errorNotification(
          'Please fill in all required fields correctly.'
        );
      });
    }
  }

  getAppointmentDetailsById(id: any) {
    this.appointmentService.getAppointmentById(id).subscribe((appointment: any) => {
      // Initialize the form with the retrieved hospital data
      console.log(appointment);

      this.appointmentForm.patchValue({
        appointment_id: appointment.appointment_id,
        appointment_custom_id : appointment.appointment_custom_id,
        appointment_title: appointment.appointment_title,
        appointment_detail : appointment.appointment_detail,
        appointment_date: appointment.appointment_date,
        appointment_time: appointment.appointment_time,
      });

    });
  }

  validateSundayDate(control: FormControl): { [key: string]: any } | null {
    const selectedDate = new Date(control.value);
    if (selectedDate.getDay() === 0) { // Sunday is represented by 0
      return { 'sundayDate': true };
    }
    return null;
  }

  isFieldInvalid(field: string) {
    return (
      this.appointmentForm.get(field)?.invalid &&
      (this.appointmentForm.get(field)?.touched || this.appointmentForm.get(field)?.dirty)
    );
  }

  isFieldValid(field: string) {
    return this.appointmentForm.get(field)?.valid;
  }

}
