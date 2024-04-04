import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { NotificationService } from '../Services/notification/notification.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { ResetPasswordService } from '../Services/reset-password/reset-password.service';

@Component({
  selector: 'app-verfiy-otp',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, NgIf],
  templateUrl: './verfiy-otp.component.html',
  styleUrl: './verfiy-otp.component.css',
})
export class VerfiyOtpComponent implements OnInit, OnDestroy {
  //Required attributes
  verifyOtpForm!: FormGroup;

  // Initialize required services
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: any,
    private notificationService: NotificationService,
    private resetPasswordService: ResetPasswordService,
    private zone: NgZone
  ) {}

  // Initializing component
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      console.log('verify otp OnInit called');
    }
    this.initializeForm();
  }

  //Destroying the component
  ngOnDestroy() {
    console.log('Verify otp OnDestroy called');
  }

  // Initializing login form using FormBuilder
  initializeForm() {
    this.verifyOtpForm = this.formBuilder.group({
      otp: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d+$/),
          Validators.minLength(6),
          Validators.maxLength(6),
        ],
      ],
    });
  }

  // Checking valid OTP
  onSubmitOtp() {
    if (this.verifyOtpForm.invalid) {
      this.verifyOtpForm.markAllAsTouched();
      this.notificationService.errorNotification(
        'Please fill in all required fields correctly.'
      );
      return;
    }

    const otp = this.verifyOtpForm.value;
    this.resetPasswordService.verifyOTP(otp).subscribe((response: any) => {
      if (response.code === 202) {
        this.notificationService.successNotification('Valid OTP');
        this.zone.run(() => {
          this.router.navigate(['/setPassword']);
        });
      } else if (
        response.code === 104 ||
        response.code === 904 ||
        response.code === 404
      ) {
        this.notificationService.errorNotification(response.message);
      }
    });
  }

  //Resending the OTP
  onResendOtpClick() {
    this.resetPasswordService.resendOtp().subscribe((response: any) => {
      if (response.code === 200) {
        this.notificationService.successNotification('New OTP sent');
      } else if (response.code === 404) {
        this.notificationService.errorNotification(response.message);
      }
    });
  }

  // Valid field validation
  isFieldValid(field: string) {
    return (
      this.verifyOtpForm.get(field)?.invalid &&
      (this.verifyOtpForm.get(field)?.touched ||
        this.verifyOtpForm.get(field)?.dirty)
    );
  }

  // Check if field has pattern error
  isPatternInvalid(field: string) {
    return this.verifyOtpForm.get(field)?.errors?.['pattern'];
  }

  // Check if field has required error
  isRequiredInvalid(field: string) {
    return (
      this.verifyOtpForm.get(field)?.errors?.['required'] &&
      this.verifyOtpForm.get(field)?.touched
    );
  }

  // Check if field has length error
  isLengthInvalid(field: string) {
    const fieldControl = this.verifyOtpForm.get(field);
    return (
      (fieldControl?.hasError('minlength') ||
        fieldControl?.hasError('maxlength') ||
        fieldControl?.hasError('max')) &&
      !fieldControl?.errors?.['pattern']
    );
  }
}
