export class Appointment {
  appointment_id: string;
  appointment_custom_id: string;
  appointment_title: string;
  appointment_detail: string;
  appointment_date: Date;
  appointment_time: string;
  username: string | null;

  constructor(data: any) {
    this.appointment_id = data.appointment_id;
    this.appointment_custom_id = data.appointment_custom_id;
    this.appointment_title = data.appointment_title;
    this.appointment_detail = data.appointment_detail;
    this.appointment_date = data.appointment_date;
    this.appointment_time = data.appointment_time;
    this.username = '';
  }
}
