export class Hospital {
  hospital_id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  hospital_type: string;
  is_active: boolean;

  constructor(data: any) {
    this.hospital_id = data.hospital_id;
    this.name = data.name;
    this.address = data.address;
    this.city = data.city;
    this.state = data.state;
    this.zipcode = data.zipcode;
    this.hospital_type = data.hospital_type;
    this.is_active = data.is_active;
  }
}
