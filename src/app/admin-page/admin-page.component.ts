  import { Component, OnInit } from '@angular/core';
  import {RouterModule, RouterOutlet } from '@angular/router';
  import { LoginService } from '../Services/Login/login.service';
  import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

  @Component({
    selector: 'app-admin-page',
    standalone: true,
    imports: [RouterOutlet, RouterModule],
    templateUrl: './admin-page.component.html',
    styleUrl: './admin-page.component.css',
  })
  export class AdminPageComponent implements OnInit {

    username: string | null = null;

    constructor(@Inject(PLATFORM_ID) private platformId: any) {}
  
    ngOnInit(): void {
      if (isPlatformBrowser(this.platformId)) {
        this.username = sessionStorage.getItem('username');
      }
    }

  
  }
