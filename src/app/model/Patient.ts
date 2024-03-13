export class Patient {
  patient_id: string;
  patient_custom_id: string;
  name: string;
  age: string;
  blood_group: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  is_active: boolean;
  user_name: string;
  email: string;
  password: string;
  doctor_user_name: string | null;
  selected_hospital: any[];

  constructor(data: any) {
    this.patient_id = data.patient_id;
    this.patient_custom_id = data.patient_custom_id;
    this.name = data.name;
    this.age = data.age;
    this.blood_group = data.blood_group;
    this.phone_number = data.phone_number;
    this.address = data.address;
    this.city = data.city;
    this.state = data.state;
    this.zipcode = data.zipcode;
    this.is_active = data.is_active;
    this.user_name = data.user_name;
    this.email = data.email;
    this.password = data.password;
    this.doctor_user_name = '';
    this.selected_hospital = [];
  }
}
