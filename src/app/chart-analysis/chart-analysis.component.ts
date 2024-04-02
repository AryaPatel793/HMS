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

  doctorCount: any[] = [];
  patientCount: any[] = [];
  patientHospitalName: any[] = [];
  doctorHospitalName: any[] = [];

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
    labels: this.patientHospitalName,
    datasets: [{ data: this.patientCount, label: 'Patient' }],
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
    labels: this.doctorHospitalName,
    datasets: [{ data: this.doctorCount, label: 'Doctor' }],
  };

  // Pie chart options
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };

  // Get hospital patients
  getHospitalPatient() {
    this.chartAnalysisService
      .getHospitalPatient()
      .subscribe((response: any) => {
        this.patientHospitalName = response.data.hospital_name;
        this.patientCount = response.data.total_patient_count;
        this.barChartData = {
          labels: this.patientHospitalName,
          datasets: [{ data: this.patientCount, label: 'Patient' }],
        };
      });
  }

  // Get hospital doctors
  getHospitalDoctor() {
    this.chartAnalysisService.getHospitalDoctor().subscribe((response: any) => {
      this.doctorHospitalName = response.data.hospital_name;
      this.doctorCount = response.data.total_doctor_count;
      this.pieChartData = {
        labels: this.doctorHospitalName,
        datasets: [
          {
            data: this.doctorCount,
            label: 'Doctor',
          },
        ],
      };
    });
  }
}
