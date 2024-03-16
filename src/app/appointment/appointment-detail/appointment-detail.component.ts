import { Component, OnDestroy, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
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
import { NotificationService } from '../../Services/notification/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationPopUpComponent } from '../../confirmation-pop-up/confirmation-pop-up.component';

@Component({
  selector: 'app-appointment-detail',
  standalone: true,
  imports: [AgGridAngular, RouterModule, RouterOutlet, AgGridModule, NgIf],
  templateUrl: './appointment-detail.component.html',
  styleUrl: './appointment-detail.component.css',
})
export class AppointmentDetailComponent {
  appointmentIdCellRenderer = (params: any) => {
    const anchor = document.createElement('a');
    anchor.innerText = params.value;
    if (this.getUserRole() === 'Admin' || this.getUserRole() === 'Patient') {
      anchor.href = 'javascript:void(0);'; 
      anchor.addEventListener('click', () => {
        this.onIdClick(params.data);
      });
    }
    return anchor;
  };

  statusCellRenderer = (params: any) => {
    const status = params.value;
    if (this.getUserRole() === 'Doctor') {
      if (status === 'PENDING') {
        const approveButton = document.createElement('button');
        approveButton.className = 'btn btn-success';
        approveButton.innerText = 'Approve';
        approveButton.addEventListener('click', () => {
          console.log(params.data);
          this.approveAppointment(params.data.appointment_id);
        });

        const rejectButton = document.createElement('button');
        rejectButton.className = 'btn btn-danger';
        rejectButton.innerText = 'Reject';
        rejectButton.addEventListener('click', () => {
          console.log(params.data);
          this.rejectAppointment(params.data.appointment_id);
        });

        const container = document.createElement('div');
        container.appendChild(approveButton);
        container.appendChild(rejectButton);
        return container;
      } else {
        return status;
      }
    } else {
      return status;
    }
  };

  userRole: string = 'Admin';

  appointmentList: any[] = [];

  gridOptions: GridOptions = {};

  colDefs: ColDef[] = [
    {
      field: 'appointment_custom_id',
      headerName: 'Appointment Id',
      filter: true,
      cellRenderer: this.appointmentIdCellRenderer,
    },
    { field: 'appointment_title', filter: true },
    { field: 'appointment_detail', filter: true },
    { field: 'appointment_date', filter: true },
    { field: 'appointment_time', filter: true },
    { field: 'patient_custom_id', filter: true },
    { field: 'patient_name', filter: true },
    { field: 'doctor_id', filter: true },
    { field: 'doctor_name', filter: true },
    { field: 'hospital_id', filter: true },
    { field: 'hospital_name', filter: true },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 200,
      cellRenderer: this.statusCellRenderer,
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

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getAllAppointment();
    }
    console.log(' Appointment Detail Component Onint');
  }

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    private appointmentService: AppointmentService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) { }

  ngOnDestroy(): void {
    console.log('Appointment Detail Component destroyed');
  }

  onIdClick(rowData: any) {
    const appointmentId = rowData.appointment_custom_id;
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

  getUsername(): string | null {
    return sessionStorage.getItem('username');
  }

  getUserRole(): string | null {
    return sessionStorage.getItem('role');
  }

  getAllAppointment() {
    this.appointmentService
      .getAllAppointment(this.getUsername())
      .subscribe((response: any) => {
        this.appointmentList = response;
      });
  }

  onGridReady(params: any) {
    this.gridOptions = params.api;
  }

  onAddAppointmentClick() {
    console.log('Add appointment button clicked');
  }

  onApproveClick() {
    console.log('Approve button clicked');
  }

  approveAppointment(id: any) {
    console.log(id);
    debugger;

    this.appointmentService
      .approveAppointment(id)
      .subscribe((response: any) => {
        this.zone.run(() => {
          if (response.valid) {
            this.getAllAppointment();
          }
        });
      });
  }

  rejectAppointment(id: any) {
    const dialogRef = this.dialog.open(ConfirmationPopUpComponent, {
      width: '300px',
      data: {
        message: 'Reject Appointment?',
        confirm: 'Reject',
      },
    });
    this.zone.run(() => {
      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this.zone.run(() => {

            this.appointmentService
              .rejectAppointment(id)
              .subscribe((response: any) => {
                if (response.valid) {
                  this.getAllAppointment();
                }
              });
          });
        }
      });
    });
  }
}
