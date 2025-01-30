import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements AfterViewInit {
  @ViewChild('chartCanvas1') chartCanvas1!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartCanvas2') chartCanvas2!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartCanvas2Wrapper') chartCanvas2Wrapper!: ElementRef;

  chart1: any;
  chart2: any;

  ngAfterViewInit(): void {
    this.createCharts();
  }

  createCharts(): void {
    const ctx1 = this.chartCanvas1.nativeElement.getContext('2d');
    if (ctx1) {
      this.chart1 = new Chart(ctx1, {
        type: 'bar', 
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [{
            label: 'Sales',
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
    const ctx2 = this.chartCanvas2.nativeElement.getContext('2d');
    if (ctx2) {
      this.chart2 = new Chart(ctx2, {
        type: 'line', 
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [{
            label: 'Revenue',
            data: [100, 200, 300, 250, 400, 350, 500],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
  downloadChartsAsPDF(): void {
    const chartElement1 = this.chartCanvas1?.nativeElement;
  
    if (!chartElement1) {
      console.error('Chart elements not found!');
      return;
    }
  
    html2canvas(chartElement1).then((canvas1) => {
      const imgData1 = canvas1.toDataURL('image/png');  
      const offScreenCanvas = document.createElement('canvas');
      offScreenCanvas.width = this.chartCanvas1.nativeElement.width;
      offScreenCanvas.height = this.chartCanvas1.nativeElement.height;
      const ctx2 = offScreenCanvas.getContext('2d');  
      if (!ctx2) {
        console.error('Failed to create off-screen canvas for Chart 2');
        return;
      }  
      new Chart(ctx2, {
        type: 'line', 
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [{
            label: 'Revenue',
            data: [100, 200, 300, 250, 400, 350, 500],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });  
      setTimeout(() => {
        const imgData2 = offScreenCanvas.toDataURL('image/png');  
        const pdf = new jsPDF('landscape');
        const imgWidth = 200;
        const imgHeight1 = (canvas1.height * imgWidth) / canvas1.width;
        const imgHeight2 = (offScreenCanvas.height * imgWidth) / offScreenCanvas.width;  
        pdf.addImage(imgData1, 'PNG', 10, 10, imgWidth, imgHeight1);
        pdf.addImage(imgData2, 'PNG', 10, imgHeight1 + 20, imgWidth, imgHeight2);  
        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);        
        window.open(pdfUrl, '_blank');
        setTimeout(() => {
          const printWindow = window.open(pdfUrl, '_blank');
          printWindow?.print();
        }, 1000);
        
      }, 500);
    }).catch(error => {
      console.error('Error capturing Chart 1:', error);
    });
  }   
}
