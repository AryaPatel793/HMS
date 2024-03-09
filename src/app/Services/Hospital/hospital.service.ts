import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constant } from '../constant/Constant';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  private static HOSPITAL_ENDPOINT = `${Constant.BASE_URL}hospitals/hospital`;

  constructor(private http:HttpClient) { }

  getHospital(): Observable<any> {
    return this.http.get(HospitalService.HOSPITAL_ENDPOINT);
  }

  addHospital(data: any): Observable<any> {
    return this.http.post(HospitalService.HOSPITAL_ENDPOINT, data);
  }

  getHospitalById(id :any) {
    return this.http.get(`${HospitalService.HOSPITAL_ENDPOINT}/${id}`);
  }
  
}






















// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { Constants } from '../constants/Constants';

// @Injectable({
//   providedIn: 'root'
// })
// export class HospitalService {

//   constructor(private http:HttpClient) {
//    }
//    public static HOSPITAL_ENDPOINT= "http://localhost:8080/hospitals/hospital";

//    getHospital(): Observable<any> {
//     return this.http.get(`${Constants.HOSPITAL_ENDPOINT}`);
//   }

//   addHospital(data: any): Observable<any> {
//     return this.http.post(`${Constants.HOSPITAL_ENDPOINT}`, data);
//   }

//   getHospitalById(id :any)
//   {
//     return this.http.get(`${Constants.HOSPITAL_ENDPOINT}/${id}`);
//   }
  
// }

