import { Component, OnDestroy, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ValueFormatterParams } from 'ag-grid-community';
import { NgIf, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GridOptions } from 'ag-grid-community';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { NgZone } from '@angular/core';
import { PatientService } from '../../Services/Patient/patient.service';

@Component({
  selector: 'app-patiet-detail',
  standalone: true,
  imports: [AgGridAngular, RouterModule, RouterOutlet, AgGridModule, NgIf],
  templateUrl: './patiet-detail.component.html',
  styleUrl: './patiet-detail.component.css'
})
export class PatietDetailComponent implements OnInit, OnDestroy {

   // Add a new property to the class for the cell renderer function
   patientIdCellRenderer = (params: any) => {
    const anchor = document.createElement('a');
    anchor.innerText = params.value;
    anchor.href = 'javascript:void(0);'; // Set a non-navigating href
    anchor.addEventListener('click', () => {
      this.onIdClick(params.data);
    });
    return anchor;
  };

  userRole: string = 'Admin';

  patientList: any[] = [];

  gridOptions: GridOptions = {};

  colDefs: ColDef[] = [
    {
      field: 'patient_custom_id',
      headerName: 'Patient Id',
      cellRenderer: this.patientIdCellRenderer, // Use the new cell renderer here
    },
    { field: 'name' },
    { field:'age'},
    { field:'blood_group', headerName: 'Blood Gorup'},
    { field: 'phone_number', headerName: 'Phone Number'},
    { field: 'address' },
    { field: 'city' },
    { field: 'state' },
    { field: 'zipcode' },
    {
      field: 'is_active',
      headerName: 'Status',
      cellRenderer: this.activeCellRenderer,
    },
    { field: 'doctor_custom_id' , headerName: 'Doctor Id'},
    { field: 'doctor_name', headerName: 'Doctor Name' },
    { field: 'hospital_custom_id' , headerName: 'Hospital Id'},
    { field: 'hospital_name', headerName: 'Hospital Name' },
    // {
    //   headerName: 'Actions',
    //   cellRenderer: 'editButtonRenderer',
    //   width: 100,
    //   cellRendererParams: {
    //     onClick: this.onEditButtonClick.bind(this),
    //   },
    // },
  ];


  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getAllPatient();
    }
    console.log(" Patient Detail Component Onint")
  }

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    private patientService : PatientService,
  ){

  }
  ngOnDestroy(): void {
    console.log("Patient detail Component destroyed")
  }


  onIdClick(rowData: any) {
    const patientId = rowData.patient_custom_id;
    console.log(patientId);
    console.log(rowData);
    this.zone.run(() => {
          this.router.navigate(['./addPatient', patientId], {
      relativeTo: this.route,
    });
  });
  }

  defaultColDef = {
    flex: 1,
    minWidth: 100,
  };

  getUsername(): string | null{
    return sessionStorage.getItem('username')
  }

  getUserRole(): string | null{
    return sessionStorage.getItem('role')
  }

  getAllPatient() {
    this.patientService.getPatient(this.getUsername()).subscribe((response: any) => {
      this.patientList = response;
    });
  }

  onGridReady(params: any) {
    this.gridOptions = params.api;
  }

  activeCellRenderer(params: ValueFormatterParams): string {
    return params.value ? 'Active' : 'Not Active';
  }

  onAddPatientClick() {
    console.log('Add patient button clicked');
  }

}
