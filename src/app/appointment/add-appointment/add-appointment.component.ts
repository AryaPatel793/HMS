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
import { NotificationService } from '../../Services/notification/notification.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Constant } from '../../Services/constant/constant';
import { NgZone } from '@angular/core';
import { Appointment } from '../../model/appointment';
import { AppointmentService } from '../../Services/appointment/appointment.service';
import { UserService } from '../../Services/user/user.service';
import { ValidationService } from '../../Services/validation/validation.service';

@Component({
  selector: 'app-add-appointment',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule, FormsModule],
  templateUrl: './add-appointment.component.html',
  styleUrl: './add-appointment.component.css',
})
export class AddAppointmentComponent implements OnInit, OnDestroy {
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
    private validateService: ValidationService
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
      appointment_title: [
        '',
        this.validateService.getAppointmentTitleValidators(),
      ],
      appointment_detail: [
        '',
        this.validateService.getAppointmentTitleValidators(),
      ],
      appointment_date: [null, [Validators.required, this.validateDate]],
      appointment_time: ['', [Validators.required]],
    });
  }

  // Save appointment
  saveAppointment() {
    if (!this.checkValidTime()) {
      this.zone.run(() => {
        this.appointmentForm.markAllAsTouched();
        this.notificationService.errorNotification(
          'This time slot is not available'
        );
      });
      return;
    }
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
    appointmentData.user_email = this.userService.getUserEmail();
    this.appointmentService
      .addAppointment(appointmentData)
      .subscribe((response: any) => {
        if (response.code === 201) {
          this.notificationService.successNotification('Appointment created');
          this.router.navigate(['/userDashboard/appointment']);
          this.initializeForm();
        } else if (
          response.code === 404 ||
          response.code === 504 ||
          response.code === 104
        ) {
          this.notificationService.errorNotification(response.message);
        }
      });
  }

  //Get appointment by ID
  getAppointmentDetailsById(id: any) {
    this.appointmentService
      .getAppointmentById(id)
      .subscribe((response: any) => {
        if (response.code === 200) {
          const appointment = response.data;
          this.appointmentForm.patchValue({
            appointment_id: appointment.appointment_id,
            appointment_custom_id: appointment.appointment_custom_id,
            appointment_title: appointment.appointment_title,
            appointment_detail: appointment.appointment_detail,
            appointment_date: appointment.appointment_date,
            appointment_time: appointment.appointment_time,
          });
        } else if (
          response.code === 404 ||
          response.code === 504 ||
          response.code === 104
        ) {
          this.notificationService.errorNotification(response.message);
        }
      });
  }

  // Validation of date
  validateDate(control: FormControl): { [key: string]: any } | null {
    if (!control.value) {
      return null;
    }

    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Check if selected date is in the past
    if (selectedDate < today) {
      return { pastDate: true };
    }

    // Check if selected date is Sunday
    if (selectedDate.getDay() === 0) {
      return { sundayDate: true };
    }
    return null;
  }

  // Check valid time slot
  private checkValidTime() {
    const appointmentDateControl =
      this.appointmentForm?.get('appointment_date');
    const appointmentTimeControl =
      this.appointmentForm?.get('appointment_time');

    const selectedDate = new Date(appointmentDateControl?.value);
    const today = new Date();

    if (selectedDate.getDate() === today.getDate()) {
      const currentTime = new Date();
      const currentHour = currentTime.getHours() + 1;
      const selectedTimeSlot = appointmentTimeControl?.value;
      const timeSlotParts = selectedTimeSlot.split(' ');
      let selectedHour = parseInt(timeSlotParts[2], 10); // Get the hour part from 'X to Y pm/am'
      // Convert to 24-hour format if the time slot is in the afternoon
      if (timeSlotParts[3] === 'pm' && selectedHour !== 12) {
        selectedHour += 12;
      }
      // If the current hour has passed the selected hour, it's invalid
      if (currentHour >= selectedHour) {
        return false;
      }
    }
    return true;
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

  // Check if field has date error
  isDateInvalid(field: string) {
    const fieldErrors = this.appointmentForm.get(field)?.errors;
    return fieldErrors?.['pastDate'] || fieldErrors?.['sundayDate'];
  }

  // Check if field has required error
  isRequiredInvalid(field: string) {
    return (
      this.appointmentForm.get(field)?.errors?.['required'] &&
      this.appointmentForm.get(field)?.touched
    );
  }
  // Check if field has pattern error
  isPatternInvalid(field: string) {
    return this.appointmentForm.get(field)?.errors?.['pattern'];
  }

  // Check if field has length error
  isLengthInvalid(field: string) {
    const fieldControl = this.appointmentForm.get(field);
    return (
      fieldControl?.hasError('minlength') ||
      fieldControl?.hasError('maxlength') ||
      fieldControl?.hasError('max')
    );
  }
}
