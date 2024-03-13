import { Component, OnDestroy, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ValueFormatterParams } from 'ag-grid-community';
import { NgIf, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HospitalService } from '../../Services/Hospital/hospital.service';
import { GridOptions } from 'ag-grid-community';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { NgZone } from '@angular/core';



@Component({
  selector: 'app-hospital',
  standalone: true,
  imports: [AgGridAngular, RouterModule, RouterOutlet, AgGridModule, NgIf],
  templateUrl: './hospital-detail.component.html',
  styleUrl: './hospital-detail.component.css',
})
export class HospitalDetailComponent implements OnInit, OnDestroy {

  hospitalList: any[] = [];

  // Add a new property to the class for the cell renderer function
  hospitalIdCellRenderer = (params: any) => {
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
      field: 'hospitalId',
      headerName: 'Hospital Id',
      cellRenderer: this.hospitalIdCellRenderer, // Use the new cell renderer here
    },
    { field: 'name' ,filter:true },
    { field: 'address' ,filter:true  },
    { field: 'city' ,filter:true },
    { field: 'state' ,filter:true  },
    { field: 'zipCode' ,filter:true },
    { field: 'hospitalType' ,filter:true },
    {
      field: 'active',
      filter:true ,
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
    private hospitalService: HospitalService,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,

  ) {}
  

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getAllHospital();
    }
    console.log('Hospital Detail Component Oninit')
  }

  ngOnDestroy(): void {
     console.log('Hospital Detail Component Destroyed')
  }

  onIdClick(rowData: any) {
    const hospitalId = rowData.hospitalId;
    console.log(hospitalId);
    this.zone.run(() => {
    this.router.navigate(['./addHospital', hospitalId], {
      relativeTo: this.route,
    });
  });

  }

  defaultColDef = {
    flex: 1,
    minWidth: 100,
  };


  getAllHospital() {

    this.hospitalService.getHospital(this.getUsername()).subscribe((response: any) => {
      this.hospitalList = response;
    });
  }

  getUsername(): string | null{
    return sessionStorage.getItem('username')
  }

  onGridReady(params: any) {
    this.gridOptions = params.api;
  }

  activeCellRenderer(params: ValueFormatterParams): string {
    return params.value ? 'Active' : 'Not Active';
  }

  onAddHospitalClick() {
    console.log('Add Hospital button clicked');
  }
}

// onEditButtonClick(rowData: any) {
//   // Get the selected hospital ID and navigate to the hospital form
//   const hospitalId = rowData.id;
//   this.router.navigate(['../addHospital', hospitalId], { relativeTo: this.route });
// }

// frameworkComponents: any = {
//   editButtonRenderer: this.editButtonRenderer,
// };

// editButtonRenderer(params: any) {
//   const button = document.createElement('button');
//   button.innerHTML = 'Edit';
//   button.className = 'btn btn-info';
//   button.addEventListener('click', () => {
//     params.onClick(params.data);
//   });
//   return button;
// }

// [components]="frameworkComponents" in html file

// changes
