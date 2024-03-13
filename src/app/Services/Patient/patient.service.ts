import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constant } from '../constant/Constant';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private static PATIENT_ENDPOINT = `${Constant.BASE_URL}patients/patient`;
  private static ALL_PATIENT =  `${Constant.BASE_URL}patients/all`;

  constructor(private http:HttpClient) { }

  getPatient(userName :any): Observable<any> {
    return this.http.get(`${PatientService.ALL_PATIENT}/${userName}`);
  }

  addPatient(data: any): Observable<any> {
    return this.http.post(PatientService.PATIENT_ENDPOINT, data);
  }

  getPatientById(id :any) {
    return this.http.get(`${PatientService.PATIENT_ENDPOINT}/${id}`);
  }

}
