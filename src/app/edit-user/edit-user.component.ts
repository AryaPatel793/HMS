import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../Services/notification/notification.service';
import { ValidationService } from '../Services/Validation/validation.service';
import { User } from '../model/user';
import { EditUserService } from '../Services/edit-user/edit-user.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
} from '@angular/material/core';
import { Password } from '../model/Password';
import { UserService } from '../Services/User/user.service';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    CommonModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css',
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
})
export class EditUserComponent implements OnInit, OnDestroy {
  // Required Attributes
  userForm!: FormGroup;

  passwordFrom!: FormGroup;
  hideCurrent = true;
  hideNew = true;
  hideConfirm = true;
  // Initialize required services
  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private router: Router,
    private validateService: ValidationService,
    private updateUserService: EditUserService,
    private zone: NgZone,
    private route: ActivatedRoute,
    private userService : UserService

  ) {
    console.log('Update User Component constructor');
    this.getUserDetails();
  }

  // Initializing component
  ngOnInit() {
    this.initializeForm();
    this.initializePasswordForm();
    console.log('Update UserComponent ngOnInit');
  }

  // Destroying the component
  ngOnDestroy(): void {
    console.log('Upadate user Component destroyed');
  }

  // Initializing user form using FormBuilder
  private initializeForm() {
    this.userForm = this.formBuilder.group({
      user_id: [''],
      user_name: [null, this.validateService.getUserNameValidators()],
      email: [null, this.validateService.getEmailValidators()],
    });
  }

  // Initializing user form using FormBuilder
  private initializePasswordForm() {
    this.passwordFrom = this.formBuilder.group(
      {
        current_password: [null, this.validateService.getPasswordValidators()],
        password: [null, this.validateService.getPasswordValidators()],
        confirm_password: [null, this.validateService.getPasswordValidators()],
      },
      { validator: this.combinedValidator.bind(this) },
    );
  }

  private combinedValidator(formGroup: FormGroup) {
    this.newPasswordMatchValidator(formGroup);
    this.currentPasswordMatchValidator(formGroup);
  }
  

  newPasswordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirm_password')?.value;
    if (password !== confirmPassword) {
      formGroup.get('confirm_password')?.setErrors({ mismatch: true });
    }
  }

  currentPasswordMatchValidator(formGroup: FormGroup) {
    const currentPassword = formGroup.get('current_password')?.value;
    const newPassword = formGroup.get('password')?.value;
    if (currentPassword === newPassword) {
      formGroup.get('password')?.setErrors({ match: true });
    }
  }

  // save user
  saveUser() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.notificationService.errorNotification(
        'Please fill in all required fields correctly.'
      );
      return;
    }
    let userData = new User(this.userForm.value);
    this.updateUserService.updateUser(userData).subscribe((response: any) => {
      if (response.code === 202) {
        this.notificationService.successNotification('Profile updated');
        sessionStorage.setItem('username', userData.user_name);
        sessionStorage.setItem('userEmail', userData.email);
        this.router.navigate(['/userDashboard/hospital']);
      } else if (response.code === 404) {
        this.notificationService.errorNotification(response.message);
      }
    });
  }

  // Get user
  getUserDetails() {
    this.updateUserService.getUser().subscribe((response: any) => {
      const user = response.data;
      this.userForm.patchValue({
        user_id: user.user_id,
        user_name: user.user_name,
        email: user.email,
      });
    });
  }

  //Update password
  updatePassword() {
    if (this.passwordFrom.invalid) {
      this.passwordFrom.markAllAsTouched();
      this.notificationService.errorNotification(
        'Please fill in all required fields correctly.'
      );
      return;
    }
    let passwordData = new Password(this.passwordFrom.value);
    this.updateUserService
      .setPassword(passwordData)
      .subscribe((response: any) => {
        if (response.code === 201) {
          this.notificationService.successNotification(
            'Password set successfully'
          );
          this.passwordFrom.reset();
          this.zone.run(() => {
          this.userService.logoutUser()
          this.router.navigate(['/login'], {
            relativeTo: this.route,
          });
        });
        } else if (response.code === 404) {
          this.notificationService.errorNotification(response.message);
        }
      });
  }

  // Invalid field validation
  isFieldInvalid(field: string, form: FormGroup) {
    return (
      form.get(field)?.invalid &&
      (form.get(field)?.touched || form.get(field)?.dirty)
    );
  }

  // Valid field validation
  isFieldValid(field: string, form: FormGroup) {
    // Modify this method
    return form.get(field)?.valid && form.get(field)?.touched;
  }

  // Check if field has pattern error
  isPatternInvalid(field: string, form: FormGroup) {
    // Modify this method
    return form.get(field)?.errors?.['pattern'];
  }

  // Check if field has required error
  isRequiredInvalid(field: string, form: FormGroup) {
    // Modify this method
    return form.get(field)?.errors?.['required'] && form.get(field)?.touched;
  }

  // Check if field has length error
  isLengthInvalid(field: string, form: FormGroup) {
    // Modify this method
    const fieldControl = form.get(field);
    return (
      (fieldControl?.hasError('minlength') ||
        fieldControl?.hasError('maxlength') ||
        fieldControl?.hasError('max')) &&
      !fieldControl?.errors?.['pattern']
    );
  }

  // Validate new password
  isMismatchInvalid(field: string) {
    return (
      this.passwordFrom.get(field)?.errors?.['mismatch'] &&
      this.passwordFrom.get(field)?.touched
    );
  }

  // Validate new password
  isNewPasswordInvalid(field: string) {
    return (
      this.passwordFrom.get(field)?.errors?.['match'] &&
      this.passwordFrom.get(field)?.touched
    );
  }
}
