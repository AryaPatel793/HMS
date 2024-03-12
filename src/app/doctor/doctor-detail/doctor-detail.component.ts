import { Component, OnDestroy, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ValueFormatterParams } from 'ag-grid-community';
import { NgIf, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DoctorService } from '../../Services/Doctor/doctor.service';
import { GridOptions } from 'ag-grid-community';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { NgZone } from '@angular/core';


@Component({
  selector: 'app-doctor-detail',
  standalone: true,
  imports: [AgGridAngular, RouterModule, RouterOutlet, AgGridModule, NgIf],
  templateUrl: './doctor-detail.component.html',
  styleUrl: './doctor-detail.component.css'
})
export class DoctorDetailComponent implements OnInit, OnDestroy{

   // Add a new property to the class for the cell renderer function
   doctorIdCellRenderer = (params: any) => {
    const anchor = document.createElement('a');
    anchor.innerText = params.value;
    anchor.href = 'javascript:void(0);'; // Set a non-navigating href
    anchor.addEventListener('click', () => {
      this.onIdClick(params.data);
    });
    return anchor;
  };

  userRole: string = 'Admin';

  gridOptions: GridOptions = {};

  colDefs: ColDef[] = [
    {
      field: 'doctorId',
      headerName: 'Doctor Id',
      cellRenderer: this.doctorIdCellRenderer, // Use the new cell renderer here
    },
    { field: 'name' },
    { field: 'phoneNumber'},
    { field: 'address' },
    { field: 'city' },
    { field: 'state' },
    { field: 'zipCode' },
    {
      field: 'active',
      headerName: 'Status',
      cellRenderer: this.activeCellRenderer,
    },
    // {
    //   headerName: 'Actions',
    //   cellRenderer: 'editButtonRenderer',
    //   width: 100,
    //   cellRendererParams: {
    //     onClick: this.onEditButtonClick.bind(this),
    //   },
    // },
  ];


  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any,
    private doctorService: DoctorService,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
  ) {}
  
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getAllDoctor();
    }
    console.log('Doctor Detail Component Oninit')
  }

  ngOnDestroy(): void {
    console.log('Doctor Detail Component destroyed')
  }

  onIdClick(rowData: any) {
    const doctorId = rowData.doctorId;
    console.log(doctorId);
    console.log(rowData);
    this.zone.run(() => {
          this.router.navigate(['./addDoctor', doctorId], {
      relativeTo: this.route,
    });
  });

  }

  defaultColDef = {
    flex: 1,
    minWidth: 100,
  };

  doctorList: any[] = [];

  getAllDoctor() {
    this.doctorService.getDoctor().subscribe((response: any) => {
      this.doctorList = response;
    });
  }

  onGridReady(params: any) {
    this.gridOptions = params.api;
  }

  activeCellRenderer(params: ValueFormatterParams): string {
    return params.value ? 'Active' : 'Not Active';
  }

  onAddDoctorClick() {
    console.log('Add doctor button clicked');
  }

}
