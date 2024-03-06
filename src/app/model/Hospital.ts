export class Hospital {
    hospital_id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
    hospital_type: string;
    is_active: boolean;
  
    constructor(form: any) {
      this.hospital_id = form.get('hospital_id').value;
      this.name = form.get('name').value;
      this.address = form.get('address').value;
      this.city = form.get('city').value;
      this.state = form.get('state').value;
      this.zipcode = form.get('zipcode').value;
      this.hospital_type = form.get('hospital_type').value;
      this.is_active = form.get('is_active').value;
    }
  }