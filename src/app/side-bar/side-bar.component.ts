import {
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  ElementRef,
} from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnInit, OnDestroy {
  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit(): void {
    console.log('Sidebar OnInit called');
  }
  ngOnDestroy(): void {
    console.log('Side Bar OnDestroy called');
  }
  isSidebarVisible = true;

  toggleSidebar() {
    console.log('Toggle side bar clicked');

    this.isSidebarVisible = !this.isSidebarVisible;

    const content =
      this.el.nativeElement.ownerDocument.getElementById('content');

    if (this.isSidebarVisible) {
      // If sidebar is now open, adjust content margin
      this.renderer.setStyle(content, 'margin-left', '240px');
    } else {
      // If sidebar is now closed, make content take full width
      this.renderer.setStyle(content, 'margin-left', '0');
    }
  }
}
