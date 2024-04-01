import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constant } from '../constant/Constant';

@Injectable({
  providedIn: 'root'
})
export class UpdateUserService {

  private static GET_USER_ENDPOINT = `${Constant.BASE_URL}users/getUser`;
  private static UPDATE_USER_ENDPOINT = `${Constant.BASE_URL}users/user`;
  constructor(private http: HttpClient) 
  { }

  getUser(): Observable<any> {
    return this.http.get(`${UpdateUserService.GET_USER_ENDPOINT}`);
  }

  updateUser(data: any): Observable<any> {
    return this.http.post(UpdateUserService.UPDATE_USER_ENDPOINT, data);
  }
  
}
