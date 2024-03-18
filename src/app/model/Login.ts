export class Login {
  email: string;
  password: string;

  constructor(form: any) {
    this.email = form.get('email').value;
    this.password = form.get('password').value;
  }
}
