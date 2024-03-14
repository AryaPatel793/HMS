import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constant } from '../constant/Constant';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private static APPOINTMENT_ENDPOINT = `${Constant.BASE_URL}appointments/appointment`;
  private static ALL_APPOINTMENT =  `${Constant.BASE_URL}appointments/all`;

  constructor(private http:HttpClient) { }

  getAllAppointment(userName :any): Observable<any> {
    return this.http.get(`${AppointmentService.ALL_APPOINTMENT}/${userName}`);
  }

  addAppointment(data: any): Observable<any> {
    return this.http.post(AppointmentService.APPOINTMENT_ENDPOINT, data);
  }

  getAppointmentById(id :any) {
    return this.http.get(`${AppointmentService.APPOINTMENT_ENDPOINT}/${id}`);
  }
}
