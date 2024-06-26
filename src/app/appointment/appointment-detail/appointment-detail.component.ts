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
import { AppointmentService } from '../../Services/appointment/appointment.service';
import { NotificationService } from '../../Services/notification/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationPopUpComponent } from '../../confirmation-pop-up/confirmation-pop-up.component';
import { Constant } from '../../Services/constant/constant';
import { UserService } from '../../Services/user/user.service';

@Component({
  selector: 'app-appointment-detail',
  standalone: true,
  imports: [AgGridAngular, RouterModule, RouterOutlet, AgGridModule, NgIf],
  templateUrl: './appointment-detail.component.html',
  styleUrl: './appointment-detail.component.css',
})
export class AppointmentDetailComponent implements OnInit, OnDestroy {
  //Required attributes
  appointmentList: any[] = [];

  gridOptions: GridOptions = {};

  defaultColDef = {
    flex: 1,
    minWidth: 100,
  };

  allowedRoles: string[] = [Constant.PATIENT];

  // Cell renderer for updating particular appointment
  appointmentIdCellRenderer = (params: any) => {
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

  // cell renderer to display status
  statusCellRenderer = (params: any) => {
    const status = params.value;
    if (this.userService.getUserRole() === Constant.DOCTOR) {
      if (status === 'PENDING') {
        const approveButton = document.createElement('button');
        approveButton.className = 'btn btn-success';
        approveButton.innerText = 'Approve';
        approveButton.style.marginRight = '5px';
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

  // Defining table columns
  colDefs: ColDef[] = [
    {
      field: 'appointment_custom_id',
      headerName: 'Appointment Id',
      filter: true,
      cellRenderer: this.appointmentIdCellRenderer,
    },
    { field: 'appointment_title', headerName: 'Title', filter: true },
    { field: 'appointment_detail', headerName: 'Detail', filter: true },
    { field: 'appointment_date', headerName: 'Date', filter: true },
    { field: 'appointment_time', headerName: 'Time', filter: true },
    { field: 'patient_custom_id', headerName: 'Patient ID', filter: true },
    { field: 'patient_name', headerName: 'Patient Name', filter: true },
    { field: 'doctor_id', headerName: 'Doctor ID', filter: true },
    { field: 'doctor_name', headerName: 'Doctor Name', filter: true },
    { field: 'hospital_id', headerName: 'Hospital ID', filter: true },
    { field: 'hospital_name', headerName: 'Hospital Name', filter: true },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 200,
      cellRenderer: this.statusCellRenderer,
    },
  ];

  //Constructor to initialize services
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    private appointmentService: AppointmentService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    public userService: UserService
  ) {}

  // Initialize appointment detail component
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getAllAppointment();
    }
    console.log(' Appointment Detail Component Onint');
  }

  // Destroy the component
  ngOnDestroy(): void {
    console.log('Appointment Detail Component destroyed');
  }

  //Updating appointment by ID
  onIdClick(rowData: any) {
    const appointmentId = rowData.appointment_custom_id;
    this.zone.run(() => {
      this.router.navigate(['./addAppointment', appointmentId], {
        relativeTo: this.route,
      });
    });
  }

  // Get all apointment
  getAllAppointment() {
    this.appointmentService.getAllAppointment().subscribe((response: any) => {
      if (response.code === 200) {
        this.appointmentList = response.data;
      }
    });
  }

  // AG grid ready event
  onGridReady(params: any) {
    this.gridOptions = params.api;
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

  // Approving the appointment
  onApproveClick() {
    console.log('Approve button clicked');
  }
  // Approving the appointment
  approveAppointment(id: any) {
    this.appointmentService
      .approveAppointment(id)
      .subscribe((response: any) => {
        this.zone.run(() => {
          if (response.code === 200) {
            this.getAllAppointment();
          } else if (
            response.code === 504 ||
            response.code === 104 ||
            response.code === 404
          ) {
            this.notificationService.errorNotification(response.message);
          }
        });
      });
  }

  // Rejecting the appointment
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
                if (response.code === 200) {
                  this.getAllAppointment();
                }
              });
          });
        }
      });
    });
  }
}
