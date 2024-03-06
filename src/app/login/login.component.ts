
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators} from '@angular/forms';
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
  standalone:true,
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;

  constructor(private http: HttpClient, private router: Router,private toastr: ToastrService, private loginService : LoginService, private notificationService : NotificationService
    ) {
    this.loginForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]),
      'password': new FormControl('',[Validators.required, Validators.minLength(6)]),
    });
  }

  ngOnInit() {
    console.log('ngOnInit called');
  }

  ngOnDestroy() {
    console.log('ngOnDestroy called');
  }

  onLogin() {
    let loginData = new Login(this.loginForm);
    this.loginService.login(loginData).subscribe((response: any) => {
    if (response.valid) {
        this.notificationService.successNotification("Login Successfully");
        if(response.role=='Admin')
        {
        this.router.navigate(['/adminDashboard']);
        }
        if(response.role=='Doctor')
        {
        // this.router.navigate(['/adminDashboard']);
        }
        if(response.role=='Patient')
        {
        // this.router.navigate(['/adminDashboard']);
        }
      } else {
        this.notificationService.errorNotification("Invalid Credentials")
      }
    })
  }

  get email()
  {
    return this.loginForm.get('email')
  }
  get password()
  {
    return this.loginForm.get('password');
  }

  get f(){
    return this.loginForm.controls;
  }
}
