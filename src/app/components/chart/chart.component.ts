import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartType } from 'chart.js/auto';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class ChartComponent implements AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  activeChart = 'chart1'; 
  chartInstance!: Chart;
  availableFilters = [
    { name: 'Location', value: 'Badge Text', selected: false },
    { name: 'Text', value: 'Badge Text', selected: false },
    { name: 'Department', value: 'Badge Text', selected: false },
    { name: 'Computer', value: 'Badge Text', selected: false }
  ];
  filterData: string[][] = [['Filter', 'Values']];
  updateFilterData() {
    this.filterData = [['Filter', 'Values']]; 
    this.availableFilters.forEach(filter => {
      if (filter.selected) {
        this.filterData.push([filter.name, filter.value]); 
      }
    });
    console.log(this.filterData); 
  }
  ngAfterViewInit() {
    this.renderChart(); 
  }
  toggleChart() {
    this.activeChart = this.activeChart === 'chart1' ? 'chart2' : 'chart1';
    this.renderChart();
  }

  renderChart() {
    if (this.chartInstance) {
      this.chartInstance.destroy(); 
    }
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    const chartType: ChartType = this.activeChart === 'chart1' ? 'bar' : 'line'; 
    const chartData: ChartConfiguration<'bar' | 'line'> = {
      type: chartType,
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'], 
        datasets: [{
          label: this.activeChart === 'chart1' ? 'Salary Data (Chart 1)' : 'Expense Data (Chart 2)',
          data: this.activeChart === 'chart1' ? [65, 59, 80, 81, 56] : [40, 30, 50, 60, 45],
          backgroundColor: this.activeChart === 'chart1' ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)',
          borderColor: this.activeChart === 'chart1' ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      }
    };
    this.chartInstance = new Chart(ctx, chartData);
  }

  openChartAndTablesAsPDF(): void {
    const pdf = new jsPDF('portrait', 'mm', 'a4'); 
    const chartCanvas1 = document.createElement('canvas');
    chartCanvas1.width = 500;
    chartCanvas1.height = 200;
    const ctx1 = chartCanvas1.getContext('2d');
    if (!ctx1) return;
    const chartCanvas2 = document.createElement('canvas');
    chartCanvas2.width = 500;
    chartCanvas2.height = 200; 
    const ctx2 = chartCanvas2.getContext('2d');
    if (!ctx2) return;
    new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
          label: 'Salary Data (Chart 1)',
          data: [65, 59, 80, 81, 56],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: { responsive: false, maintainAspectRatio: false }
    });
    new Chart(ctx2, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
          label: 'Expense Data (Chart 2)',
          data: [40, 30, 50, 60, 45],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: { responsive: false, maintainAspectRatio: false }
    });
    setTimeout(() => {
      const imgWidth = 180; 
      const imgHeight1 = (chartCanvas1.height * imgWidth) / chartCanvas1.width; 
      const imgHeight2 = (chartCanvas2.height * imgWidth) / chartCanvas2.width; 
      const chartImage1 = chartCanvas1.toDataURL('image/png');
      pdf.addImage(chartImage1, 'PNG', 15, 10, imgWidth, imgHeight1);
      const chartImage2 = chartCanvas2.toDataURL('image/png');
      pdf.addImage(chartImage2, 'PNG', 15, imgHeight1 + 20, imgWidth, imgHeight2);

      const filterData = this.filterData;
      const recommendedRangeData = [['Range', 'Salary', 'Hourly'], ['A', '$60,000', '$30'], ['B', '$70,000', '$35']];
      const payEquityRangeData = [['Range', 'Salary', 'Hourly'], ['A', '$55,000', '$28'], ['B', '$65,000', '$33']];
      const internalRangeData = [['Range', 'Salary', 'Hourly'], ['A', '$80,000', '$40'], ['B', '$90,000', '$45']];
      const externalRangeData = [['Range', 'Salary', 'Hourly'], ['A', '$75,000', '$37'], ['B', '$85,000', '$42']];
      const employeesInEachSegmentData = [['Salary Range', 'Hourly Range', 'Employee Count'], ['$50,000-$60,000', '$25-$30', '150'], ['$60,000-$70,000', '$30-$35', '120']];

      let yPos = imgHeight1 + imgHeight2 + 30; 
      const pageHeight = pdf.internal.pageSize.height; 
      const tableGap = 20;

      yPos = this.checkAndAddTable(pdf, 'Filter Data', filterData, yPos, imgWidth, pageHeight, tableGap);
      yPos = this.checkAndAddTable(pdf, 'Recommended Range Data', recommendedRangeData, yPos, imgWidth, pageHeight, tableGap);
      yPos = this.checkAndAddTable(pdf, 'Pay Equity Range Data', payEquityRangeData, yPos, imgWidth, pageHeight, tableGap);
      yPos = this.checkAndAddTable(pdf, 'Internal Range Data', internalRangeData, yPos, imgWidth, pageHeight, tableGap);
      yPos = this.checkAndAddTable(pdf, 'External Range Data', externalRangeData, yPos, imgWidth, pageHeight, tableGap);
      yPos = this.checkAndAddTable(pdf, 'Employees in Each Segment', employeesInEachSegmentData, yPos, imgWidth, pageHeight, tableGap);

      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank'); 
    }, 500); 
  }

  private checkAndAddTable(
    pdf: jsPDF, 
    title: string, 
    data: string[][], 
    startY: number, 
    tableWidth: number, 
    pageHeight: number, 
    gap: number
  ) {
    const x = 10;
    const rowHeight = 8;
    const titleHeight = 6;
    let yPos = startY;
  
    if (yPos + titleHeight + data.length * rowHeight + gap > pageHeight) {
      pdf.addPage(); 
      yPos = 10; 
    }  
    pdf.setFontSize(10); 
    pdf.setFont("helvetica", "bold");
    pdf.text(title, x, yPos);
    yPos += titleHeight + 2; 
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");  
    pdf.setFillColor(240, 240, 240); 
    pdf.rect(x, yPos, tableWidth, rowHeight, "F"); 
    pdf.setTextColor(0);
      data[0].forEach((header, index) => {
      const colX = x + (tableWidth / data[0].length) * index;
      pdf.text(header, colX + 2, yPos + 5);
    });
      yPos += rowHeight;  
    pdf.setDrawColor(211, 211, 211);
    pdf.setLineWidth(0.1); 
      data.slice(1).forEach((row, rowIndex) => {
      const rowY = yPos + rowIndex * rowHeight;    
      row.forEach((cell, cellIndex) => {
        const colX = x + (tableWidth / row.length) * cellIndex;
        pdf.text(cell, colX + 2, rowY + 5);
      });  
      pdf.line(x, rowY + rowHeight, x + tableWidth, rowY + rowHeight);
    });
    return yPos + (data.length - 1) * rowHeight + gap;
  }  
}
