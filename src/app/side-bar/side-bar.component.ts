import {
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  ElementRef,
} from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { UserService } from '../Services/user/user.service';
import { Constant } from '../Services/constant/constant';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnInit, OnDestroy {
  isSidebarVisible = true;
  notAllowedRole = Constant.PATIENT;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    console.log('Sidebar OnInit called');
  }
  ngOnDestroy(): void {
    console.log('Side Bar OnDestroy called');
  }

  toggleSidebar() {
    console.log('Toggle side bar clicked');

    this.isSidebarVisible = !this.isSidebarVisible;

    const content =
      this.el.nativeElement.ownerDocument.getElementById('content');

    if (this.isSidebarVisible) {
      this.renderer.setStyle(content, 'margin-left', '240px');
    } else {
      this.renderer.setStyle(content, 'margin-left', '0');
    }
  }
}
