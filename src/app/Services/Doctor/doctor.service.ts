import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constant } from '../constant/Constant';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private static DOCTOR_ENDPOINT = `${Constant.BASE_URL}doctors/doctor`;
  private static ALL_DOCTOR =  `${Constant.BASE_URL}doctors/all`;

  constructor(private http:HttpClient) { }

  getDoctor(userName :any): Observable<any> {
    return this.http.get(`${DoctorService.ALL_DOCTOR}/${userName}`);
  }

  addDoctor(data: any): Observable<any> {
    return this.http.post(DoctorService.DOCTOR_ENDPOINT, data);
  }

  getDoctorById(id :any) {
    return this.http.get(`${DoctorService.DOCTOR_ENDPOINT}/${id}`);
  }

}
