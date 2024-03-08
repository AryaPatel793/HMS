import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../Services/Login/login.service';
import { NgIf } from '@angular/common';
import { NotificationService } from '../Services/notification/notification.service';
import { Login } from '../model/Login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [HttpClientModule, ReactiveFormsModule, NgIf],
  standalone: true,
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  
  loginForm!: FormGroup;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private loginService: LoginService,
    private notificationService: NotificationService
  ) {
    this.initForm();
  }

  ngOnInit() {
    console.log('ngOnInit called');
  }

  ngOnDestroy() {
    console.log('ngOnDestroy called');
  }

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

  onLogin() {
    let loginData = new Login(this.loginForm);
    this.loginService.login(loginData).subscribe((response: any) => {
      if (response.valid) {
        this.notificationService.successNotification('Login Successfully');
        if (response.role == 'Admin') {
          this.router.navigate(['/adminDashboard']);
        }
        if (response.role == 'Doctor') {
          // this.router.navigate(['/adminDashboard']);
        }
        if (response.role == 'Patient') {
          // this.router.navigate(['/adminDashboard']);
        }
      } else {
        this.notificationService.errorNotification('Invalid Credentials');
      }
    });
  }

  isFieldValid(field: string) {
    return (
      this.loginForm.get(field)?.invalid &&
      (this.loginForm.get(field)?.touched || this.loginForm.get(field)?.dirty)
    );
  }
}
