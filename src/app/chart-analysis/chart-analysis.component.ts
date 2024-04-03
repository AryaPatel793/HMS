import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { ChartAnalysisService } from '../Services/chart-analysis/chart-analysis.service';
import { ChartOptions } from 'chart.js';

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

  constructor(
    private chartAnalysisService: ChartAnalysisService,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.zone.run(() => {
      this.getHospitalPatient();
      this.getHospitalDoctor();
    });
    console.log('Chart Analysis Onint');
  }
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
  this.chartAnalysisService.getHospitalPatient().subscribe((response: any) => {
    if(response.code === 200){
    let responseData = response.data;
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
    if(response.code === 200){
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
