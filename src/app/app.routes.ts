import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { HospitalComponent } from './hospital/hospital.component';
import { DoctorComponent } from './doctor/doctor.component';
import { PatientComponent } from './patient/patient.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { HospitalformComponent } from './hospitalform/hospitalform.component';

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
          pathMatch: 'full',
        //   children: [
        //     {
        //       path: 'addHospital',
        //       component: HospitalformComponent,
        //     }
        //   ]
        },
        {
            path: 'addHospital',
            component: HospitalformComponent,
        },
        {
          path: 'doctor',
          component: DoctorComponent
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
  
  
