import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // AG Grid Component
import { ColDef } from 'ag-grid-community'; // Column Definition Type Interface
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HospitalService } from '../Services/Hospital/hospital.service';

@Component({
  selector: 'app-hospital',
  standalone: true,
  imports: [AgGridAngular, RouterModule, RouterOutlet],
  templateUrl: './hospital.component.html',
  styleUrl: './hospital.component.css'
})
export class HospitalComponent implements OnInit {
  colDefs: ColDef[] = [
    { field:  "id"},
    { field: "name" },
    { field: "address" },
    { field: "city" },
    { field: "state" },
    { field: "zipCode"},
    { field: "hospitalType"},
    { field : "active"}
  ];

  defaultColDef ={
    flex:1,
    minWidth:100

  }
  hospitalList : any []=[];
  constructor(private http:HttpClient, @Inject(PLATFORM_ID) private platformId: any, private hospitalService :HospitalService){}
  
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getHospital();
    }
  }

  // getHospital(){
  //   this.http.get(' http://localhost:8080/hospitals/hospital').subscribe((response :any)=>{
  //     this.hospitalList = response; 
  //   })
  // }

  getHospital(){
   this.hospitalService.getHospital().subscribe((response :any)=>{
    this.hospitalList = response; 
   })
  }
  onAddHospitalClick() {
    console.log('Add Hospital button clicked');
}



}
