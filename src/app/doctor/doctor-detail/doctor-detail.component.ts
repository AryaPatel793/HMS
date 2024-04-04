import { Component, OnDestroy, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ValueFormatterParams } from 'ag-grid-community';
import { NgIf, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DoctorService } from '../../Services/doctor/doctor.service';
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
  selector: 'app-doctor-detail',
  standalone: true,
  imports: [AgGridAngular, RouterModule, RouterOutlet, AgGridModule, NgIf],
  templateUrl: './doctor-detail.component.html',
  styleUrl: './doctor-detail.component.css',
})
export class DoctorDetailComponent implements OnInit, OnDestroy {
  // Reuqired attributes
  doctorList: any[] = [];

  gridOptions: GridOptions = {};

  defaultColDef = {
    flex: 1,
    minWidth: 100,
  };

  allowedRoles: string[] = [Constant.ADMIN, Constant.DOCTOR];
  adminRole: any = Constant.ADMIN;

  // Add a new property to the class for the cell renderer function
  doctorIdCellRenderer = (params: any) => {
    const anchor = document.createElement('a');
    anchor.innerText = params.value;
    if (this.isAllowedRole()) {
      anchor.href = 'javascript:void(0);';
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
      field: 'doctor_custom_id',
      headerName: 'Doctor Id',
      cellRenderer: this.doctorIdCellRenderer,
      filter: true,
    },
    { field: 'doctor_name', filter: true },
    { field: 'phone_number', filter: true },
    {
      field: 'address',
      headerName: 'Address',
      filter: true,
      cellRenderer: this.addressIdCellRenderer,
    },
    { field: 'city', filter: true },
    { field: 'state', filter: true },
    { field: 'zipcode', filter: true },
    {
      field: 'is_active',
      headerName: 'Status',
      filter: true,
      cellRenderer: this.activeCellRenderer,
    },
  ];

  // To initialize required services
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any,
    private doctorService: DoctorService,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    public userService: UserService,
    private dialog: MatDialog
  ) {}

  // Initialzing component
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getAllDoctor();
    }
    console.log('Doctor Detail Component Oninit');
  }

  // Destroying the component
  ngOnDestroy(): void {
    console.log('Doctor Detail Component destroyed');
  }

  // Selecting doctor by ID
  onIdClick(rowData: any) {
    const doctorId = rowData.doctor_custom_id;
    this.zone.run(() => {
      this.router.navigate(['./addDoctor', doctorId], {
        relativeTo: this.route,
      });
    });
  }

  // Get all doctors
  getAllDoctor() {
    this.doctorService.getDoctor().subscribe((response: any) => {
      if(response.code === 200){
      this.doctorList = response.data;
    }
    });
  }

  // Grid ready event
  onGridReady(params: any) {
    this.gridOptions = params.api;
  }

  // To display doctor ->active or not active
  activeCellRenderer(params: ValueFormatterParams): string {
    return params.value ? 'Active' : 'Not Active';
  }

  // Checking if the user's role is allowed
  isAllowedRole(): boolean {
    const userRole = this.userService.getUserRole();
    return (
      userRole !== null &&
      userRole !== undefined &&
      this.allowedRoles.includes(userRole)
    );
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
