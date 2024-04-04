import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { NotificationService } from '../Services/notification/notification.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { Password } from '../model/password';
import { ResetPasswordService } from '../Services/reset-password/reset-password.service';
import { ValidationService } from '../Services/validation/validation.service';
@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, NgIf],
  templateUrl: './set-password.component.html',
  styleUrl: './set-password.component.css',
})
export class SetPasswordComponent implements OnInit, OnDestroy {
  //Required attributes
  setPasswordForm!: FormGroup;

  // Initialize required services
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: any,
    private notificationService: NotificationService,
    private resetPasswordService: ResetPasswordService,
    private zone: NgZone,
    private validationService: ValidationService
  ) {}

  // Initializing component
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Set password OnInit called');
    }
    this.initializeForm();
  }

  //Destroying the component
  ngOnDestroy() {
    console.log('Set password OnDestroy called');
  }

  // Initializing Password form using FormBuilder
  initializeForm() {
    this.setPasswordForm = this.formBuilder.group(
      {
        password: ['', this.validationService.getPasswordValidators()],
        confirm_password: ['', this.validationService.getPasswordValidators()],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  // Checking valid credentials
  onSubmitPassword() {
    let password = new Password(this.setPasswordForm.value);

    this.resetPasswordService
      .setPassword(password)
      .subscribe((response: any) => {
        if (response.code === 201) {
          this.notificationService.successNotification(
            'Password set successfully'
          );
          this.zone.run(() => {
            this.router.navigate(['/login']);
          });
        } else if (response.code === 104 || response.code === 404) {
          this.notificationService.errorNotification(response.message);
        }
      });
  }

  // Valid field validation
  isFieldValid(field: string) {
    return (
      this.setPasswordForm.get(field)?.invalid &&
      (this.setPasswordForm.get(field)?.touched ||
        this.setPasswordForm.get(field)?.dirty)
    );
  }

  // Check if field has pattern error
  isPatternInvalid(field: string) {
    return this.setPasswordForm.get(field)?.errors?.['pattern'];
  }

  // Check if field has required error
  isRequiredInvalid(field: string) {
    return (
      this.setPasswordForm.get(field)?.errors?.['required'] &&
      this.setPasswordForm.get(field)?.touched
    );
  }

  // Check if field has length error
  isLengthInvalid(field: string) {
    const fieldControl = this.setPasswordForm.get(field);
    return (
      (fieldControl?.hasError('minlength') ||
        fieldControl?.hasError('maxlength') ||
        fieldControl?.hasError('max')) &&
      !fieldControl?.errors?.['pattern']
    );
  }

  // password match validator
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirm_password')?.value;
    if (password !== confirmPassword) {
      formGroup.get('confirm_password')?.setErrors({ mismatch: true });
    }
  }

  // password mismatch validation
  isMismatchInvalid(field: string) {
    return (
      this.setPasswordForm.get(field)?.errors?.['mismatch'] &&
      this.setPasswordForm.get(field)?.touched
    );
  }
}
