import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../Services/notification/notification.service';
import { ValidationService } from '../Services/Validation/validation.service';
import { User } from '../model/user';
import { UpdateUserService } from '../Services/update-user/update-user.service';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent implements OnInit, OnDestroy {

  // Required Attributes
  userForm!: FormGroup;

  // Initialize required services
  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private router: Router,
    private validateService : ValidationService,
    private updateUserService : UpdateUserService
  ) {
    console.log('Update User Component constructor');
    this.getUserDetails();
  }

   // Initializing component
   ngOnInit() {
    this.initializeForm();
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
        user_name: [
          null,
          this.validateService.getUserNameValidators(),
        ],
        email: [
          null,
          this.validateService.getEmailValidators(),
        ],
      });
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
    this.updateUserService.updateUser(userData)
      .subscribe((response: any) => {
        if (response.code === 202) {
          this.notificationService.successNotification('Profile updated');
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
        user_name : user.user_name,
        email : user.email
      });
    });
  }

    // Invalid field validation
    isFieldInvalid(field: string) {
      return (
        this.userForm.get(field)?.invalid &&
        (this.userForm.get(field)?.touched ||
          this.userForm.get(field)?.dirty)
      );
    }
  
    // Valid field validation
    isFieldValid(field: string) {
      return (
        this.userForm.get(field)?.valid &&
        this.userForm.get(field)?.touched
      );
    }
  
    // Check if field has pattern error
    isPatternInvalid(field: string) {
      return this.userForm.get(field)?.errors?.['pattern'];
    }
  
    // Check if field has required error
    isRequiredInvalid(field: string) {
      return (
        this.userForm.get(field)?.errors?.['required'] &&
        this.userForm.get(field)?.touched
      );
    }
  
     // Check if field has length error
     isLengthInvalid(field: string) {
      const fieldControl = this.userForm.get(field);
      return ((
        fieldControl?.hasError('minlength') ||
        fieldControl?.hasError('maxlength') ||
        fieldControl?.hasError('max')) &&
        !fieldControl?.errors?.['pattern']
      );
    }

}
