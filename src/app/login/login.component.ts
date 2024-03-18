import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../Services/Login/login.service';
import { NgIf } from '@angular/common';
import { NotificationService } from '../Services/notification/notification.service';
import { Login } from '../model/Login';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

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
    @Inject(PLATFORM_ID) private platformId: any,
    private notificationService: NotificationService
  ) {
    this.initForm();
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

  // Initializing login form
  initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        ),
      ]),
    });
  }

  // Checking valid credentials
  onLogin() {
    let loginData = new Login(this.loginForm);
    this.loginService.login(loginData).subscribe((response: any) => {
      if (response.valid) {
        sessionStorage.setItem('username', response.user_name);
        sessionStorage.setItem('role', response.role);
        this.notificationService.successNotification('Login Successfull');
        this.router.navigate(['/userDashboard']);
      } else {
        this.notificationService.errorNotification('Invalid Credentials');
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
}
