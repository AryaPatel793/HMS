import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { UserService } from '../Services/User/user.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterOutlet, RouterModule,],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
    // Required attributes
    username: string | null = null;

    // Initializing required services
    constructor(
      @Inject(PLATFORM_ID) private platformId: any,
      public userService: UserService
    ) {}
  
    // Initializing the component
    ngOnInit(): void {
      if (isPlatformBrowser(this.platformId)) {
        this.username = this.userService.getUsername();
        console.log("header Oninit component called")
      }
    }
  
    //Destroying the component
    ngOnDestroy(): void {
      console.log('Header Component Destroyed');
    }

}
