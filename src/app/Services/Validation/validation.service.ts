import { Injectable } from '@angular/core';
import { Validators, ValidatorFn, AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor() {}

  // User Name Validation
  public getUserNameValidators(): ValidatorFn[] {
    return [
      Validators.required,
      Validators.pattern('^[a-zA-Z]+( [a-zA-Z]+)*$'),
      Validators.maxLength(20),
      Validators.minLength(2),
    ];
  }

  // Email Validation
  public getEmailValidators(): ValidatorFn[] {
    return [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9.]+@[a-zA-Z]+.[a-zA-Z]*$'),
      Validators.maxLength(50),
    ];
  }

  // Zipcode Validation
  public getZipCodeValidators(): ValidatorFn[] {
    return [
      Validators.required,
      Validators.pattern(/^\d+$/),
      Validators.minLength(6),
      Validators.maxLength(6),
    ];
  }

  // Age Validation
  public getAgeValidators(): ValidatorFn[] {
    return [Validators.required, Validators.max(150), Validators.min(1)];
  }

  // Phone Validation
  public getPhoneValidators(): ValidatorFn[] {
    return [
      Validators.required,
      Validators.pattern(/^\d+$/),
      Validators.minLength(10),
      Validators.maxLength(10),
    ];
  }

  // Address Validation
  public getAddressValidators(): ValidatorFn[] {
    return [
      Validators.required,
      Validators.maxLength(150),
      Validators.minLength(10),
      Validators.pattern(/^[^@!#%^&;*\s]+(?:\s[^@!#%;^&*\s]+)*\s?[\w\d]$/),
    ];
  }

  // Email Validation
  public getPasswordValidators(): ValidatorFn[] {
    return [
      Validators.required,
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%#*?&]+$/
      ),
      Validators.minLength(8),
      Validators.maxLength(8),
    ];
  }

  // Appointment title validation
  public getAppointmentTitleValidators(): ValidatorFn[] {
    return [
      Validators.required,
      Validators.maxLength(30),
      Validators.minLength(5),
      Validators.pattern(/^[^@!#%^&;*\s]+(?:\s[^@!#%;^&*\s]+)*\s?[\w\d]$/),
    ];
  }

  // Appointment title validation
  public getAppointmentDetailValidators(): ValidatorFn[] {
    return [
      Validators.required,
      Validators.maxLength(150),
      Validators.minLength(10),
      Validators.pattern(/^[^@!#%^&;*\s]+(?:\s[^@!#%;^&*\s]+)*\s?[\w\d]$/),
    ];
  }
}
