export class Password {
    current_password: string;
    new_password: string;
  
    constructor(userData: any) {
      this.current_password = userData.current_password
      this.new_password =  userData.password
    }
  }