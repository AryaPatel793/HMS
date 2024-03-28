import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../Services/Login/login.service';
import { NgIf } from '@angular/common';
import { NotificationService } from '../Services/notification/notification.service';
import { Login } from '../model/Login';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { ValidationService } from '../Services/Validation/validation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [HttpClientModule, ReactiveFormsModule, NgIf],
  standalone: true,
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  //Required attributes
  loginForm!: FormGroup;

  // Initialize required services
  constructor(
    private router: Router,
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: any,
    private notificationService: NotificationService,
    private validateService: ValidationService
  ) {
    this.initializeForm();
  }

  // Initializing component
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      console.log('ngOnInit called');
    }
  }

  //Destroying the component
  ngOnDestroy() {
    console.log('ngOnDestroy called');
  }

  // Initializing login form using FormBuilder
  initializeForm() {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        this.validateService.getEmailValidators(),
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
          ),
          Validators.minLength(8),
        ],
      ],
    });
  }

  // Checking valid credentials
  onLogin() {
    let loginData = new Login(this.loginForm);
    this.loginService.login(loginData).subscribe((response: any) => {
      if (response.code === 200) {
        sessionStorage.setItem('username', response.data.user_name);
        sessionStorage.setItem('role', response.data.role);
        sessionStorage.setItem('userEmail', response.data.email);
        this.notificationService.successNotification('Login Successfull');
        this.router.navigate(['/userDashboard']);
      } else if (response.code === 404) {
        this.notificationService.errorNotification(response.message);
      }
    });
  }

  // Valid field validation
  isFieldValid(field: string) {
    return (
      this.loginForm.get(field)?.invalid &&
      (this.loginForm.get(field)?.touched || this.loginForm.get(field)?.dirty)
    );
  }

  // Check if field has pattern error
  isPatternInvalid(field: string) {
    return this.loginForm.get(field)?.errors?.['pattern'];
  }

  // Check if field has required error
  isRequiredInvalid(field: string) {
    return (
      this.loginForm.get(field)?.errors?.['required'] &&
      this.loginForm.get(field)?.touched
    );
  }

  // Check if field has length error
  isLengthInvalid(field: string) {
    const fieldControl = this.loginForm.get(field);
    return ((
      fieldControl?.hasError('minlength') ||
      fieldControl?.hasError('maxlength') ||
      fieldControl?.hasError('max')) &&
      !fieldControl?.errors?.['pattern']
    );
  }
}
