import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constant } from '../constant/constant';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService {
  private static VERIFY_EMAIL_ENDPOINT = `${Constant.BASE_URL}resetPassword/verifyEmail`;
  private static PASSWORD_ENDPOINT = `${Constant.BASE_URL}resetPassword/setPassword`;
  private static VERIFY_OTP_ENDPOINT = `${Constant.BASE_URL}resetPassword/verifyOtp`;
  private static RESEND_OTP_ENDPOINT = `${Constant.BASE_URL}resetPassword/resendOtp`;

  constructor(private http: HttpClient) {}

  verifyEmail(email: any) {
    return this.http.post(ResetPasswordService.VERIFY_EMAIL_ENDPOINT, email);
  }

  verifyOTP(otp: any) {
    return this.http.post(ResetPasswordService.VERIFY_OTP_ENDPOINT, otp);
  }

  setPassword(password: any) {
    return this.http.post(ResetPasswordService.PASSWORD_ENDPOINT, password);
  }

  resendOtp() {
    return this.http.get(`${ResetPasswordService.RESEND_OTP_ENDPOINT}`);
  }
}
