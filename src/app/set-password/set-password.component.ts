import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { NotificationService } from '../Services/notification/notification.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { Password } from '../model/Password';
import { ResetPasswordService } from '../Services/ResetPassword/reset-password.service';
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
    private route: ActivatedRoute,
    private resetPasswordService : ResetPasswordService,
    private zone: NgZone,
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
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
            ),
            Validators.maxLength(8),
            Validators.minLength(8),
          ],
        ],
        confirm_password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
            ),
            Validators.maxLength(8),
            Validators.minLength(8),
          ],
        ],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirm_password')?.value;
    if (password !== confirmPassword) {
      formGroup.get('confirm_password')?.setErrors({ mismatch: true });
    }
  }

  // Checking valid credentials
  onSubmitPassword() {
    let setPasswordFormValue = this.setPasswordForm.value;
    let password = new Password(setPasswordFormValue);
    
    this.resetPasswordService.setPassword(password).subscribe((response: any) => {
      if (response.code === 201) {
        this.notificationService.successNotification(
          "Password set successfully"
        );
        this.zone.run(() => {
        this.router.navigate(['/login']);
      });
      } else if (response.code === 404) {
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

  isMismatchInvalid(field: string) {
    return this.setPasswordForm.get(field)?.errors?.['mismatch'] && this.setPasswordForm.get(field)?.touched ;
  }
}
