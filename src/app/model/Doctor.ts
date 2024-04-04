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
  email: string;
  selected_hospital: any[];

  constructor(data: any) {
    const [doctorInfo, addressInfo, userInfo] = data.formArray;
    this.doctor_id = doctorInfo.doctor_id;
    this.doctor_custom_id = doctorInfo.doctor_custom_id;
    this.doctor_name = doctorInfo.doctor_name;
    this.phone_number = doctorInfo.phone_number;
    this.is_active = doctorInfo.is_active;
    this.address = addressInfo.address;
    this.city = addressInfo.city;
    this.state = addressInfo.state;
    this.zipcode = addressInfo.zipcode;
    this.user_name = userInfo.user_name;
    this.email = userInfo.email;
    this.selected_hospital = [];
  }
}
