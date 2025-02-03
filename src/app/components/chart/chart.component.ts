import { Component } from '@angular/core'
import { Chart } from 'chart.js/auto'
import jsPDF from 'jspdf'

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent {
  downloadChartAndTablesAsPDF(): void {
    const pdf = new jsPDF('portrait', 'mm', 'a4')
  
    const chartCanvas = document.createElement('canvas')
    chartCanvas.width = 500
    chartCanvas.height = 300
    const chartCtx = chartCanvas.getContext('2d')
  
    if (!chartCtx) return
  
    new Chart(chartCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
          label: 'Salary Data',
          data: [65, 59, 80, 81, 56, 55, 40],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: { responsive: false, maintainAspectRatio: false }
    })
  
    setTimeout(() => {
      const chartImage = chartCanvas.toDataURL('image/png')
  
      // Add the chart image with the same width as the table cells
      const imgWidth = 120  // Set the width of the chart image (50% of A4 page width)
      const imgHeight = (chartCanvas.height * imgWidth) / chartCanvas.width
      pdf.addImage(chartImage, 'PNG', 10, 10, imgWidth, imgHeight)
  
      // Generate Salary Table
      let yPos = imgHeight + 20  // Position the table just below the chart
      this.addTableToPDF(pdf, [
        ['Position', 'Min Salary', 'Max Salary'],
        ['Junior Developer', '$40,000', '$60,000'],
        ['Senior Developer', '$70,000', '$100,000']
      ], yPos, imgWidth)
  
      // Generate Department Table
      yPos += 40  // Move the second table down
      this.addTableToPDF(pdf, [
        ['Department', 'Employees'],
        ['Engineering', '50'],
        ['Marketing', '20'],
        ['HR', '15']
      ], yPos, imgWidth)
  
      // Open PDF in new tab and print
      const pdfBlob = pdf.output('blob')
      const pdfUrl = URL.createObjectURL(pdfBlob)
      setTimeout(() => {
        const printWindow = window.open(pdfUrl, '_blank')
        printWindow?.print()
      }, 1000)
    }, 500)
  }
  
  // Helper function to add tables with consistent width
  private addTableToPDF(pdf: jsPDF, data: string[][], startY: number, tableWidth: number) {
    const x = 10
    const cellWidth = tableWidth / 3  // Divide the table width evenly into 3 columns
    const cellHeight = 12           // Set cell height to avoid overlap
    const fontSize = 10             // Adjust font size for readability
  
    pdf.setFontSize(fontSize)  // Set a consistent font size for all text
  
    data.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        // Draw a border for each cell
        pdf.rect(x + cellIndex * cellWidth, startY + rowIndex * cellHeight, cellWidth, cellHeight)
  
        // Adjust text position to avoid overlapping with borders
        pdf.text(cell, x + 5 + cellIndex * cellWidth, startY + 7 + rowIndex * cellHeight) 
      })
    })
  }
    
}

