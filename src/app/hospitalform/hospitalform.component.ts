import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HospitalService } from '../Services/Hospital/hospital.service';
import { NotificationService } from '../Services/notification/notification.service';
import { Router } from '@angular/router';
import { Hospital } from '../model/Hospital';
import { NgIf } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Constants } from '../Services/constants/Constants';


@Component({
  selector: 'app-hospitalform',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule],
  templateUrl: './hospitalform.component.html',
  styleUrl: './hospitalform.component.css'
})
export class HospitalformComponent implements OnInit {
  
  


  hospitalForm: FormGroup = new FormGroup({
    hospital_id: new FormControl(''),
    name: new FormControl('',[Validators.required]),
    address: new FormControl('',[Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    zipcode: new FormControl('', [Validators.required, Validators.pattern(/^\d{6}$/)]),
    hospital_type: new FormControl("GENERAL",[Validators.required]),
    is_active: new FormControl(true,[Validators.required])
  })

  constructor(private http:HttpClient, private toastr: ToastrService, private hospitalService : HospitalService, private notificationService : NotificationService, private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef){
    console.log('HospitalformComponent constructor');
  }

  ngOnInit() {
    console.log('HospitalformComponent ngOnInit');
    
}
  saveHospital() {
    let hospitalData = new Hospital(this.hospitalForm);
    this.hospitalService.addHospital(hospitalData).subscribe((result : any)=>{
    if(result.valid)
    {
       this.notificationService.successNotification("Hospital added");
       this.router.navigate(['../hospital'], { relativeTo: this.route }); 
    }
    })
    }

    get f(){
      return this.hospitalForm.controls;
    }

    states:string[] = Constants.states;
    cities: string[] = [];

    onStateChange(event: Event) {
    const state = (event.target as HTMLSelectElement).value;
    this.cities = Constants.cityData[state] || [];
    this.cdr.detectChanges();
    }

}

