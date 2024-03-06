import { Component, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ValueFormatterParams } from 'ag-grid-community';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
    { field: "id" ,headerName: "Hospital Id",
    cellRenderer:(item :any)=>{
      return "HO-"+ item.value
    }
  },
    { field: "name" },
    { field: "address" },
    { field: "city" },
    { field: "state" },
    { field: "zipCode" },
    { field: "hospitalType"  },
    {
      field: "active",
      headerName: "Status",
      cellRenderer: this.activeCellRenderer
    }
  ];

  defaultColDef = {
    flex: 1,
    minWidth: 100
  };

  hospitalList: any[] = [];

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any,
    private hospitalService: HospitalService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getAllHospital();
    }
  }

  getAllHospital() {
    this.hospitalService.getHospital().subscribe((response: any) => {
      this.hospitalList = response;
    });
  }

  activeCellRenderer(params: ValueFormatterParams): string {
    return params.value ? 'Active' : 'Not Active';
  }

  onAddHospitalClick() {
    console.log('Add Hospital button clicked');
  }
}


