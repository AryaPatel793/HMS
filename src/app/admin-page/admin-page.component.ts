import { Component } from '@angular/core';
import {RouterModule, RouterOutlet } from '@angular/router';
import { LoginService } from '../Services/Login/login.service';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css',
})
export class AdminPageComponent {

  constructor( public loginService : LoginService){
    console.log("Layout page constructor");
    

  }



  getUserName(){
    return sessionStorage.getItem('username');
  }

  
}
