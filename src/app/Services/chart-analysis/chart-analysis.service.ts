import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constant } from '../constant/Constant';

@Injectable({
  providedIn: 'root',
})
export class ChartAnalysisService {
  private static GET_HOSPITAL_PATIENT_ENDPOINT = `${Constant.BASE_URL}chartAnalysis/getHospitalPatient`;
  private static GET_HOSPITAL_DOCTOR_ENDPOINT = `${Constant.BASE_URL}chartAnalysis/getHospitalDoctor`;

  constructor(private http: HttpClient) {}

  getHospitalPatient(): Observable<any> {
    return this.http.get(
      `${ChartAnalysisService.GET_HOSPITAL_PATIENT_ENDPOINT}`
    );
  }

  getHospitalDoctor(): Observable<any> {
    return this.http.get(
      `${ChartAnalysisService.GET_HOSPITAL_DOCTOR_ENDPOINT}`
    );
  }
}
