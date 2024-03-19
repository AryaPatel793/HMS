import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  getUsername(): string | null {
    return sessionStorage.getItem('username');
  }

  getUserRole(): string | null {
    return sessionStorage.getItem('role');
  }

  getUserEmail(): string | null {
    return sessionStorage.getItem('userEmail')
  }
}
