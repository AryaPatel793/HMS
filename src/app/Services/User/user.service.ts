import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  getUsername(): string {
    const userName = sessionStorage.getItem('username');
    return userName ? userName : '';
  }
  
  public getUserRole(): string {
    const userRole = sessionStorage.getItem('role');
    return userRole ? userRole : '';
  }
  public getUserEmail(): string {
    const userEmail = sessionStorage.getItem('userEmail');
    return userEmail ? userEmail : '';
  }

  public logoutUser(){
    sessionStorage.removeItem('username')
    sessionStorage.removeItem('role')
    sessionStorage.removeItem('userEmail')
  }
}
