import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from '../constants/Constants';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private static LOGIN_ENDPOINT = `${Constants.BASE_URL}loginUser/login`;

  constructor(private http:HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post(LoginService.LOGIN_ENDPOINT, credentials);
  }
}




















// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { Constants } from '../constants/Constants';

// @Injectable({
//   providedIn: 'root'
// })
// export class LoginService {

//   constructor(private http:HttpClient) { }

//   login(credentials: any): Observable<any> {
//     return this.http.post(`${Constants.LOGIN_ENDPOINT}`, credentials);
//   }
// }
