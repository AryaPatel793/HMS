export class Password {
    email: string;
    password: string;
  
    constructor(userData: any) {
      this.email = ''
      this.password =  userData.password
    }
  }