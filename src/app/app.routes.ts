import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { HospitalDetailComponent } from './hospital/hospital-detail/hospital-detail.component';
import { DoctorComponent } from './doctor/doctor.component';
import { PatientComponent } from './patient/patient.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { AddHospitalComponent } from './hospital/add-hospital/addhospital.component';
import { HospitalComponent } from './hospital/hospital.component';
import { DoctorDetailComponent } from './doctor/doctor-detail/doctor-detail.component';
import { AddDoctorComponent } from './doctor/add-doctor/add-doctor.component';

export const routes: Routes = [
    {
      path: '',
      redirectTo: 'login',
      pathMatch: 'full'
    },
    {
      path: 'login',
      component: LoginComponent
    },
    {
      path: 'adminDashboard',
      component: AdminPageComponent,
      children: [
        {
          path: 'hospital',
          component: HospitalComponent,
          children:[
            {
              path: '',
              component: HospitalDetailComponent,
          },
          {
              path: 'addHospital',
              component: AddHospitalComponent,
          },
          {
            path: 'addHospital/:id',
            component: AddHospitalComponent,
          },
          ]
        },
        {
          path: 'doctor',
          component: DoctorComponent,
          children:[
            {
              path:'',
              component:DoctorDetailComponent
            },
            {
              path: 'addDoctor',
              component: AddDoctorComponent,
          },
          {
            path: 'addDoctor/:id',
            component: AddDoctorComponent,
          },
          ]
        },
        {
          path: 'patient',
          component: PatientComponent
        },
        {
          path: 'appointment',
          component: AppointmentComponent
        },
      ]
    }
  ];
  
  
