import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from '../constants/Constants';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(private http:HttpClient) {
   }

   getHospital(): Observable<any> {
    return this.http.get(`${Constants.HOSPITAL_ENDPOINT}`);
  }

  addHospital(data: any): Observable<any> {
    return this.http.post(`${Constants.HOSPITAL_ENDPOINT}`, data);
  }
}

