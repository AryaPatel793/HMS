import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constant } from '../constant/Constant';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private static DOCTOR_ENDPOINT = `${Constant.BASE_URL}doctors/doctor`;

  constructor(private http:HttpClient) { }

  getDoctor(): Observable<any> {
    return this.http.get(DoctorService.DOCTOR_ENDPOINT);
  }

  addDoctor(data: any): Observable<any> {
    return this.http.post(DoctorService.DOCTOR_ENDPOINT, data);
  }

  getDoctorById(id :any) {
    return this.http.get(`${DoctorService.DOCTOR_ENDPOINT}/${id}`);
  }

}
