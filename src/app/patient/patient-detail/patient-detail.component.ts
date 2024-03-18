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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UserService } from '../../Services/User/user.service';
import { Constant } from '../../Services/constant/Constant';

@Component({
  selector: 'app-patiet-detail',
  standalone: true,
  imports: [
    AgGridAngular,
    RouterModule,
    RouterOutlet,
    AgGridModule,
    NgIf,
    MatSlideToggleModule,
  ],
  templateUrl: './patient-detail.component.html',
  styleUrl: './patient-detail.component.css',
})
export class PatientDetailComponent implements OnInit, OnDestroy {
  // Required attributes
  patientList: any[] = [];

  gridOptions: GridOptions = {};

  defaultColDef = {
    flex: 1,
    minWidth: 100,
  };

  patientIdCellRenderer = (params: any) => {
    const anchor = document.createElement('a');
    anchor.innerText = params.value;
    if (
      this.userService.getUserRole() === Constant.ADMIN ||
      this.userService.getUserRole() === Constant.DOCTOR ||
      this.userService.getUserRole() === Constant.PATIENT
    ) {
      anchor.href = 'javascript:void(0);';
      anchor.addEventListener('click', () => {
        this.onIdClick(params.data);
      });
    }
    return anchor;
  };

  // Defining table columns
  colDefs: ColDef[] = [
    {
      field: 'patient_custom_id',
      headerName: 'Patient Id',
      filter: true,
      cellRenderer: this.patientIdCellRenderer,
    },
    { field: 'name', filter: true },
    { field: 'age', filter: true },
    { field: 'blood_group', headerName: 'Blood Gorup', filter: true },
    { field: 'phone_number', headerName: 'Phone Number', filter: true },
    { field: 'address', filter: true },
    { field: 'city', filter: true },
    { field: 'state', filter: true },
    { field: 'zipcode', filter: true },
    {
      field: 'is_active',
      headerName: 'Status',
      filter: true,
      cellRenderer: this.activeCellRenderer,
    },
    { field: 'doctor_custom_id', headerName: 'Doctor Id', filter: true },
    { field: 'doctor_name', headerName: 'Doctor Name', filter: true },
    { field: 'hospital_custom_id', headerName: 'Hospital Id', filter: true },
    { field: 'hospital_name', headerName: 'Hospital Name', filter: true },

    // { Required for deletion
    //   headerName: 'Actions',
    //   cellRenderer: 'editButtonRenderer',
    //   width: 100,
    //   cellRendererParams: {
    //     onClick: this.onEditButtonClick.bind(this),
    //   },
    // },
  ];

  // Initialize required services
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    private patientService: PatientService,
    public userService: UserService
  ) {}

  // Initialzation of component
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getAllPatient();
    }
    console.log(' Patient Detail Component Onint');
  }

  // Destroy component
  ngOnDestroy(): void {
    console.log('Patient detail Component destroyed');
  }

  // Select hospital by ID
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

  // Get all patient
  getAllPatient() {
    this.patientService
      .getPatient(this.userService.getUsername())
      .subscribe((response: any) => {
        this.patientList = response;
      });
  }

  // Grid ready event
  onGridReady(params: any) {
    this.gridOptions = params.api;
  }

  // Display status of patient -> active or not active
  activeCellRenderer(params: ValueFormatterParams): string {
    return params.value ? 'Active' : 'Not Active';
  }
}
