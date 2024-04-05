import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { ChartAnalysisService } from '../Services/chart-analysis/chart-analysis.service';
import { ChartOptions } from 'chart.js';
import { Constant } from '../Services/constant/constant';
import { UserService } from '../Services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chart-analysis',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './chart-analysis.component.html',
  styleUrl: './chart-analysis.component.css',
})
export class ChartAnalysisComponent implements OnInit, OnDestroy {
  //Required attributes and settings
  public barChartLegend = true;
  public barChartPlugins = [];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  allowedRoles: string[] = [Constant.ADMIN, Constant.DOCTOR];
  userRole = this.userService.getUserRole();

  // To initialize service
  constructor(
    private chartAnalysisService: ChartAnalysisService,
    private zone: NgZone,
    private userService: UserService,
    private router: Router
  ) {
    if (this.userService.getUserRole() === Constant.PATIENT) {
      this.zone.run(() => {
        this.router.navigate(['userDashboard/hospital']);
      });
    }
  }

  // Intializing component
  ngOnInit(): void {
    if (this.allowedRoles.includes(this.userRole)) {
      this.zone.run(() => {
        this.getHospitalPatient();
        this.getHospitalDoctor();
      });
    }
    console.log('Chart Analysis Onint');
  }
  // Destroying the component
  ngOnDestroy(): void {
    console.log('Chart Analysis OnDestroy');
  }

  // Bar chart configuration
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [],
  };

  // Bar chart x and y label
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Hospitals',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Total Patients',
        },
      },
    },
  };

  // Pie chart configuration
  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [],
  };

  // Pie chart options
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  // Get hospital-patient data
  getHospitalPatient() {
    this.chartAnalysisService
      .getHospitalPatient()
      .subscribe((response: any) => {
        if (response.code === 200) {
          let responseData = response.data;
          // const hospitalNames = Object.keys(responseData).map(hospitalName => hospitalName.split(''));
          this.barChartData = {
            labels: Object.keys(responseData),
            datasets: [{ data: Object.values(responseData), label: 'Patient' }],
          };
        }
      });
  }

  // Get hospital-doctor data
  getHospitalDoctor() {
    this.chartAnalysisService.getHospitalDoctor().subscribe((response: any) => {
      if (response.code === 200) {
        let responseData = response.data;
        this.pieChartData = {
          labels: Object.keys(responseData),
          datasets: [
            {
              data: Object.values(responseData),
              label: 'Doctor',
            },
          ],
        };
      }
    });
  }
}
