import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { UserService } from '../Services/User/user.service';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './layout-page.component.html',
  styleUrl: './layout-page.component.css',
})
export class LayoutPageComponent implements OnInit, OnDestroy {
  // Required attributes
  username: string | null = null;

  // Initializing required services
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private userService: UserService
  ) {}

  // Initializing the component
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.username = this.userService.getUsername();
    }
  }

  //Destroying the component
  ngOnDestroy(): void {
    console.log('Layout Component Destroyed');
  }
}
