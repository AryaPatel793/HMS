import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { NotificationService } from '../Services/notification/notification.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { ValidationService } from '../Services/Validation/validation.service';
import { ResetPasswordService } from '../Services/ResetPassword/reset-password.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, NgIf],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css',
})
export class VerifyEmailComponent {
  //Required attributes
  verifyEmailForm!: FormGroup;

  // Initialize required services
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: any,
    private notificationService: NotificationService,
    private validateService: ValidationService,
    private route: ActivatedRoute,
    private resetPasswordService: ResetPasswordService
  ) {}

  // Initializing component
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      console.log('verify email OnInit called');
    }
    this.initializeForm();
  }

  //Destroying the component
  ngOnDestroy() {
    console.log('Verify email OnDestroy called');
  }

  // Initializing login form using FormBuilder
  initializeForm() {
    this.verifyEmailForm = this.formBuilder.group({
      email: ['', this.validateService.getEmailValidators()],
    });
  }

  // Checking valid credentials
  onSubmitEmail() {
    if (this.verifyEmailForm.invalid) {
      this.verifyEmailForm.markAllAsTouched();
      this.notificationService.errorNotification(
        'Please fill in all required fields correctly.'
      );
      return;
    }
    const email = this.verifyEmailForm.value;
    this.resetPasswordService.verifyEmail(email).subscribe((response: any) => {
      if (response.code === 301) {
        this.notificationService.successNotification('OTP sent to your email for verification');
        sessionStorage.setItem('userEmail', this.verifyEmailForm.value.email);
        this.router.navigate(['/verifyOtp']);
      } else if (response.code === 404) {
        this.notificationService.errorNotification(response.message);
      }
    });
  }

  // Valid field validation
  isFieldValid(field: string) {
    return (
      this.verifyEmailForm.get(field)?.invalid &&
      (this.verifyEmailForm.get(field)?.touched ||
        this.verifyEmailForm.get(field)?.dirty)
    );
  }

  // Check if field has pattern error
  isPatternInvalid(field: string) {
    return this.verifyEmailForm.get(field)?.errors?.['pattern'];
  }

  // Check if field has required error
  isRequiredInvalid(field: string) {
    return (
      this.verifyEmailForm.get(field)?.errors?.['required'] &&
      this.verifyEmailForm.get(field)?.touched
    );
  }

  // Check if field has length error
  isLengthInvalid(field: string) {
    const fieldControl = this.verifyEmailForm.get(field);
    return (
      (fieldControl?.hasError('minlength') ||
        fieldControl?.hasError('maxlength') ||
        fieldControl?.hasError('max')) &&
      !fieldControl?.errors?.['pattern']
    );
  }
}
