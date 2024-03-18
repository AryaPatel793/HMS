import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constant } from '../constant/Constant';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private userName: string | undefined;

  private static LOGIN_ENDPOINT = `${Constant.BASE_URL}loginUser/login`;

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(LoginService.LOGIN_ENDPOINT, credentials);
  }

  getUserName(): string | undefined {
    return this.userName;
  }

  setUserName(user: string): void {
    this.userName = user;
  }
}
