import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constant } from '../constant/Constant';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private static APPOINTMENT_ENDPOINT = `${Constant.BASE_URL}appointments/appointment`;
  private static ALL_APPOINTMENT = `${Constant.BASE_URL}appointments/all`;
  private static APPROVE_APPOINTMENT = `${Constant.BASE_URL}appointments/appointment/approve`;
  private static REJECT_APPOINTMENT = `${Constant.BASE_URL}appointments/appointment/reject`;

  constructor(private http: HttpClient) {}

  getAllAppointment(): Observable<any> {
    return this.http.get(`${AppointmentService.ALL_APPOINTMENT}`);
  }

  addAppointment(data: any): Observable<any> {
    return this.http.post(AppointmentService.APPOINTMENT_ENDPOINT, data);
  }

  getAppointmentById(id: any): Observable<any> {
    return this.http.get(`${AppointmentService.APPOINTMENT_ENDPOINT}/${id}`);
  }

  approveAppointment(id: any): Observable<any> {
    return this.http.post(AppointmentService.APPROVE_APPOINTMENT, id);
  }

  rejectAppointment(id: any): Observable<any> {
    return this.http.post(AppointmentService.REJECT_APPOINTMENT, id);
  }
}
