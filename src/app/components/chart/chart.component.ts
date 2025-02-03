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
  
    //  1️⃣ Create an in-memory canvas (NOT in the DOM)
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
  
      // Make sure the chart is not added to DOM
      if (chartCanvas.parentNode) {
        chartCanvas.parentNode.removeChild(chartCanvas)
      }
  
      pdf.addImage(chartImage, 'PNG', 10, 10, 150, 100) // 📌 Reduced Graph Size
  
      // 2️⃣ Generate Table (Salary)
      let yPos = 120
      this.addTableToPDF(pdf, [
        ['Position', 'Min Salary', 'Max Salary'],
        ['Junior Developer', '$40,000', '$60,000'],
        ['Senior Developer', '$70,000', '$100,000']
      ], yPos)
  
      // 3️⃣ Generate Second Table (Departments)
      yPos += 40
      this.addTableToPDF(pdf, [
        ['Department', 'Employees'],
        ['Engineering', '50'],
        ['Marketing', '20'],
        ['HR', '15']
      ], yPos)
  
      // 4️⃣ Open PDF in new tab
      const pdfBlob = pdf.output('blob')
      const pdfUrl = URL.createObjectURL(pdfBlob)
      setTimeout(() => {
        const printWindow = window.open(pdfUrl, '_blank')
        printWindow?.print()
      }, 1000)
  
    }, 500)
  }
  
  // 🔹 Helper function to add tables
  private addTableToPDF(pdf: jsPDF, data: string[][], startY: number) {
    let x = 10
    const cellWidth = 60, cellHeight = 10

    data.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        pdf.rect(x + cellIndex * cellWidth, startY + rowIndex * cellHeight, cellWidth, cellHeight) // Border
        pdf.text(cell, x + 5 + cellIndex * cellWidth, startY + 7 + rowIndex * cellHeight) // Text
      })
    })
  }
}

