import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constant } from '../constant/Constant';

@Injectable({
  providedIn: 'root',
})
export class HospitalService {
  private static HOSPITAL_ENDPOINT = `${Constant.BASE_URL}hospitals/hospital`;
  private static ALL_HOSPITAL = `${Constant.BASE_URL}hospitals/all`;

  constructor(private http: HttpClient) {}

  getHospital(userName: any): Observable<any> {
    return this.http.get(`${HospitalService.ALL_HOSPITAL}/${userName}`);
  }

  addHospital(data: any): Observable<any> {
    return this.http.post(HospitalService.HOSPITAL_ENDPOINT, data);
  }

  getHospitalById(id: any) {
    return this.http.get(`${HospitalService.HOSPITAL_ENDPOINT}/${id}`);
  }
}

