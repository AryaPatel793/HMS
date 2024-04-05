import { Component, OnDestroy, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ValueFormatterParams } from 'ag-grid-community';
import { NgIf, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HospitalService } from '../../Services/hospital/hospital.service';
import { GridOptions } from 'ag-grid-community';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { NgZone } from '@angular/core';
import { Constant } from '../../Services/constant/constant';
import { UserService } from '../../Services/user/user.service';
import { MatDialog } from '@angular/material/dialog';
import { AddressPopUpComponent } from '../../address-pop-up/address-pop-up.component';

@Component({
  selector: 'app-hospital',
  standalone: true,
  imports: [AgGridAngular, RouterModule, RouterOutlet, AgGridModule, NgIf],
  templateUrl: './hospital-detail.component.html',
  styleUrl: './hospital-detail.component.css',
})
export class HospitalDetailComponent implements OnInit, OnDestroy {
  // Required attributes
  hospitalList: any[] = [];

  gridOptions: GridOptions = {};

  defaultColDef = {
    flex: 1,
    minWidth: 100,
  };

  adminRole: string = Constant.ADMIN;

  // Add a new property to the class for the cell renderer function
  hospitalIdCellRenderer = (params: any) => {
    const anchor = document.createElement('a');
    anchor.innerText = params.value;
    if (this.userService.getUserRole() === Constant.ADMIN) {
      anchor.href = 'javascript:void(0);'; // Set a non-navigating href
      anchor.addEventListener('click', () => {
        this.onIdClick(params.data);
      });
    }
    return anchor;
  };

  // Cell renderer for displaying particular address
  addressIdCellRenderer = (params: any) => {
    const anchor = document.createElement('a');
    anchor.innerText = params.value;
    anchor.href = 'javascript:void(0);';
    anchor.addEventListener('click', () => {
      this.onAddressClick(params.data);
    });
    return anchor;
  };

  // Defining table columns
  colDefs: ColDef[] = [
    {
      field: 'hospital_custom_id',
      headerName: 'Hospital Id',
      cellRenderer: this.hospitalIdCellRenderer, // Use the new cell renderer here
    },
    { field: 'name', headerName: 'Name', filter: true },
    {
      field: 'address',
      headerName: 'Address',
      filter: true,
      cellRenderer: this.addressIdCellRenderer,
    },
    { field: 'city', headerName: 'City', filter: true },
    { field: 'state', headerName: 'State', filter: true },
    { field: 'zipcode', headerName: 'Zip Code', filter: true },
    { field: 'hospital_type', headerName: 'Hospital Type', filter: true },
    {
      field: 'is_active',
      filter: true,
      headerName: 'Status',
      cellRenderer: this.activeCellRenderer,
    },
  ];

  // Initialize required services
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any,
    private hospitalService: HospitalService,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    public userService: UserService,
    private dialog: MatDialog
  ) {}

  // Initialize component
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getAllHospital();
    }
    console.log('Hospital Detail Component Oninit');
  }

  // Destroy component
  ngOnDestroy(): void {
    console.log('Hospital Detail Component Destroyed');
  }

  // Selecting particular hospital
  onIdClick(rowData: any) {
    const hospitalId = rowData.hospital_custom_id;
    console.log(hospitalId);
    this.zone.run(() => {
      this.router.navigate(['./addHospital', hospitalId], {
        relativeTo: this.route,
      });
    });
  }

  // Get all hospital
  getAllHospital() {
    console.log(this.userService.getUserEmail());
    this.hospitalService.getHospital().subscribe((response: any) => {
      if (response.code === 200) {
        this.hospitalList = response.data;
      }
    });
  }

  // Gridd ready event
  onGridReady(params: any) {
    this.gridOptions = params.api;
  }

  // To display hospital -> Active or not active
  activeCellRenderer(params: ValueFormatterParams): string {
    return params.value ? 'Active' : 'Not Active';
  }

  //Address dialog box
  onAddressClick(rowData: any) {
    const address = rowData.address;
    console.log(address);
    this.zone.run(() => {
      const dialogRef = this.dialog.open(AddressPopUpComponent, {
        width: '500px',
        data: {
          message: address,
        },
      });
    });
  }
}
