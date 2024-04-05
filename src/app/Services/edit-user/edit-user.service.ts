import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constant } from '../constant/constant';

@Injectable({
  providedIn: 'root',
})
export class EditUserService {
  private static GET_USER_ENDPOINT = `${Constant.BASE_URL}users/getUser`;
  private static UPDATE_USER_ENDPOINT = `${Constant.BASE_URL}users/user`;
  private static PASSWORD_ENDPOINT = `${Constant.BASE_URL}users/setPassword`;
  constructor(private http: HttpClient) {}

  getUser(): Observable<any> {
    return this.http.get(`${EditUserService.GET_USER_ENDPOINT}`);
  }

  updateUser(data: any): Observable<any> {
    return this.http.post(EditUserService.UPDATE_USER_ENDPOINT, data);
  }

  setPassword(password: any) {
    return this.http.post(EditUserService.PASSWORD_ENDPOINT, password);
  }
}
