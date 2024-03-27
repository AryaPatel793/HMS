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
  doctor_email: string | null;
  selected_hospital: any[];
  documents : any[];




  constructor(data: any) {
    const [patientInfo, addressInfo, userInfo] = data.formArray;
  
    this.patient_id = patientInfo.patient_id;
    this.patient_custom_id = patientInfo.patient_custom_id;
    this.name = patientInfo.name;
    this.age = patientInfo.age;
    this.blood_group = patientInfo.blood_group;
    this.phone_number = patientInfo.phone_number;
    this.is_active = patientInfo.is_active;
  
    this.address = addressInfo.address;
    this.city = addressInfo.city;
    this.state = addressInfo.state;
    this.zipcode = addressInfo.zipcode;
  
    this.user_name = userInfo.user_name;
    this.email = userInfo.email;
    this.password = userInfo.password;
  
    this.doctor_email = '';
    this.selected_hospital = [];
    this.documents = patientInfo.documents
  }
  
}
