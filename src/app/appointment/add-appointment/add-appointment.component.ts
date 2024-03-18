import { Component } from '@angular/core';
import {
  FormBuilder,
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
import { CommonModule } from '@angular/common';
import { Constant } from '../../Services/constant/Constant';
import { NgZone } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { Appointment } from '../../model/Appointment';
import { AppointmentService } from '../../Services/Appointment/appointment.service';
import { UserService } from '../../Services/User/user.service';
@Component({
  selector: 'app-add-appointment',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule, FormsModule],
  templateUrl: './add-appointment.component.html',
  styleUrl: './add-appointment.component.css',
})
export class AddAppointmentComponent {
  //Attributes required
  appointmentForm!: FormGroup;

  timeSlot: string[] = Constant.timeSlot;

  // Constructor of initializing services
  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private appointmentService: AppointmentService,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    console.log('AddAppointmentComponent constructor');
    this.route.params.subscribe((params) => {
      const appointmentId = params['id'];
      if (appointmentId) {
        this.getAppointmentDetailsById(appointmentId);
      }
    });
  }

  // On intialization of form
  ngOnInit(): void {
    this.initializeForm();
    console.log('add appointment OnInit');
  }

  // Detroying the component
  ngOnDestroy(): void {
    console.log('AddAppointmentComponent Destroyed');
  }

  // Initialize form using FormBuilder
  private initializeForm() {
    this.appointmentForm = this.formBuilder.group({
      appointment_id: [''],
      appointment_custom_id: [''],
      appointment_title: ['', Validators.required],
      appointment_detail: ['', Validators.required],
      appointment_date: [null, [Validators.required, this.validateSundayDate]],
      appointment_time: [null, Validators.required],
    });
  }

  // Save appointment
  saveAppointment() {
    if (this.appointmentForm.invalid) {
      this.zone.run(() => {
        this.appointmentForm.markAllAsTouched();
        this.notificationService.errorNotification(
          'Please fill in all required fields correctly.'
        );
      });
      return;
    }
    let appointmentData = new Appointment(this.appointmentForm.value);
    appointmentData.username = this.userService.getUsername();
    this.appointmentService
      .addAppointment(appointmentData)
      .subscribe((result: any) => {
        if (result.valid) {
          this.notificationService.successNotification('Appointment created');
          this.router.navigate(['/userDashboard/appointment']);
          this.initializeForm();
        } else {
          this.notificationService.errorNotification(result.message);
        }
      });
  }

  //Get appointment by ID
  getAppointmentDetailsById(id: any) {
    this.appointmentService
      .getAppointmentById(id)
      .subscribe((appointment: any) => {
        this.appointmentForm.patchValue({
          appointment_id: appointment.appointment_id,
          appointment_custom_id: appointment.appointment_custom_id,
          appointment_title: appointment.appointment_title,
          appointment_detail: appointment.appointment_detail,
          appointment_date: appointment.appointment_date,
          appointment_time: appointment.appointment_time,
        });
      });
  }

  // Validating the date for sunday
  validateSundayDate(control: FormControl): { [key: string]: any } | null {
    const selectedDate = new Date(control.value);
    if (selectedDate.getDay() === 0) {
      return { sundayDate: true };
    }
    return null;
  }

  // Invalid field validation
  isFieldInvalid(field: string) {
    return (
      this.appointmentForm.get(field)?.invalid &&
      (this.appointmentForm.get(field)?.touched ||
        this.appointmentForm.get(field)?.dirty)
    );
  }

  // valid field validation
  isFieldValid(field: string) {
    return this.appointmentForm.get(field)?.valid;
  }
}
