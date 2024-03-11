export class Doctor {
    doctor_id: string;
    doctor_name: string;
    phone_number: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
    is_active: boolean;
    doctor_custom_id: string;
    user_name: string;
    email : string;
    password: string;
    selected_hospital: any[];
  
    constructor(data: any) {
      this.doctor_id = data.doctor_id;
      this.doctor_custom_id = data.doctor_custom_id;
      this.doctor_name = data.doctor_name;
      this.phone_number= data.phone_number;
      this.address = data.address;
      this.city = data.city;
      this.state = data.state;
      this.zipcode = data.zipcode;
      this.is_active = data.is_active;
      this.user_name = data.user_name;
      this.email = data.email;
      this.password = data.password;
      this.selected_hospital = [];
    }
  }
  