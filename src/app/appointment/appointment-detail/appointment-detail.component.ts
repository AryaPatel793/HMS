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
import { AppointmentService } from '../../Services/Appointment/appointment.service';
@Component({
  selector: 'app-appointment-detail',
  standalone: true,
  imports: [AgGridAngular, RouterModule, RouterOutlet, AgGridModule, NgIf],
  templateUrl: './appointment-detail.component.html',
  styleUrl: './appointment-detail.component.css'
})
export class AppointmentDetailComponent {

   // Add a new property to the class for the cell renderer function
   appointmentIdCellRenderer = (params: any) => {
    const anchor = document.createElement('a');
    anchor.innerText = params.value;
    if (this.getUserRole() === 'Admin' || this.getUserRole() === "Patient") {
    anchor.href = 'javascript:void(0);'; // Set a non-navigating href
    anchor.addEventListener('click', () => {
      this.onIdClick(params.data);
    });
  }
    return anchor;
  };

  userRole: string = 'Admin';

  appointmentList: any[] = [];

  gridOptions: GridOptions = {};

  colDefs: ColDef[] = [
    {
      field: 'appointment_custom_id',
      headerName: 'Appointment Id',
      cellRenderer: this.appointmentIdCellRenderer, // Use the new cell renderer here
    },
    { field: 'appointment_title' },
    { field:'appointment_detail'},
    { field: 'appointment_date'},
    { field: 'appointment_time' },
    { field: 'patient_custom_id' },
    { field: 'patient_name' },
    { field: 'doctor_id' },
    { field: 'doctor_name' },
    { field: 'hospital_id' },
    { field: 'hospital_name' },
    { field: 'status'}
    
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
      this.getAllAppointment();
    }
    console.log(" Appointment Detail Component Onint")
  }

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    private appointmentService : AppointmentService
  ){
  }

  ngOnDestroy(): void {
    console.log("Appointment Detail Component destroyed")
  }

  onIdClick(rowData: any) {
    const appointmentId = rowData.appointment_custom_id;
    console.log(appointmentId);
    console.log(rowData);
    this.zone.run(() => {
          this.router.navigate(['./addAppointment', appointmentId], {
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

  getAllAppointment() {
    this.appointmentService.getAllAppointment(this.getUsername()).subscribe((response: any) => {
      this.appointmentList = response;
    });
  }

  onGridReady(params: any) {
    this.gridOptions = params.api;
  }

 
  onAddAppointmentClick() {
    console.log('Add appointment button clicked');
  }

}
