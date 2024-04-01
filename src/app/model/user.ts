export class User {
    user_id: string;
    user_name: string;
    email : string;
  
    constructor(data: any) {
      this.user_id = data.user_id;
      this.user_name = data.user_name;
      this.email = data.email;
    }
  }
  