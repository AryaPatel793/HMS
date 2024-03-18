import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  successNotification(message: any): void {
    this.toastr.success(message, '', {
      progressBar: true,
      progressAnimation: 'decreasing',
    });
  }

  errorNotification(message: any): void {
    this.toastr.error(message, '', {
      progressBar: true,
      progressAnimation: 'decreasing',
    });
  }
}
