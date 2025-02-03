

// import { Component } from '@angular/core'
// import { Chart } from 'chart.js/auto'
// import jsPDF from 'jspdf'

// @Component({
//   selector: 'app-chart',
//   templateUrl: './chart.component.html',
//   styleUrls: ['./chart.component.scss']
// })
// export class ChartComponent {

//   downloadChartAndTablesAsPDF(): void {
//     const pdf = new jsPDF('portrait')

//     // 1️⃣ Create the Chart in memory (not in DOM)
//     const chartCanvas = document.createElement('canvas')
//     chartCanvas.width = 600
//     chartCanvas.height = 400
//     const chartCtx = chartCanvas.getContext('2d')

//     if (!chartCtx) {
//       console.error('Failed to create chart canvas')
//       return
//     }

//     new Chart(chartCtx, {
//       type: 'bar',
//       data: {
//         labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
//         datasets: [{
//           label: 'Salary Data',
//           data: [65, 59, 80, 81, 56, 55, 40],
//           backgroundColor: 'rgba(75, 192, 192, 0.2)',
//           borderColor: 'rgba(75, 192, 192, 1)',
//           borderWidth: 1
//         }]
//       },
//       options: {
//         responsive: false,
//         maintainAspectRatio: false,
//         scales: {
//           y: { beginAtZero: true }
//         }
//       }
//     })

//     setTimeout(() => {
//       const chartImage = chartCanvas.toDataURL('image/png')
//       const imgWidth = 180
//       const imgHeight = (chartCanvas.height * imgWidth) / chartCanvas.width

//       pdf.addImage(chartImage, 'PNG', 10, 10, imgWidth, imgHeight)

//       // 2️⃣ Create Tables in memory (not in DOM)
//       const tableCanvas = document.createElement('canvas')
//       tableCanvas.width = 600
//       tableCanvas.height = 400
//       const tableCtx = tableCanvas.getContext('2d')

//       if (!tableCtx) {
//         console.error('Failed to create table canvas')
//         return
//       }

//       // Draw white background
//       tableCtx.fillStyle = '#ffffff'
//       tableCtx.fillRect(0, 0, tableCanvas.width, tableCanvas.height)

//       // Table Data
//       const tableData = [
//         ['Position', 'Min Salary', 'Max Salary'],
//         ['Junior Developer', '$40,000', '$60,000'],
//         ['Senior Developer', '$70,000', '$100,000']
//       ]

//       // Draw Table Borders & Text
//       const cellWidth = 150, cellHeight = 30
//       let x = 50, y = 50

//       tableCtx.fillStyle = '#000000'
//       tableCtx.font = '16px Arial'

//       tableData.forEach((row, rowIndex) => {
//         row.forEach((cell, cellIndex) => {
//           const cellX = x + cellIndex * cellWidth
//           const cellY = y + rowIndex * cellHeight

//           tableCtx.strokeRect(cellX, cellY, cellWidth, cellHeight) // Draw Border
//           tableCtx.fillText(cell, cellX + 10, cellY + 20) // Draw Text
//         })
//       })

//       // Convert Table to Image
//       const tableImage = tableCanvas.toDataURL('image/png')
//       pdf.addImage(tableImage, 'PNG', 10, imgHeight + 30, imgWidth, imgHeight)

//       // 3️⃣ Generate Another Table with Different Data
//       const secondTableCanvas = document.createElement('canvas')
//       secondTableCanvas.width = 600
//       secondTableCanvas.height = 400
//       const secondTableCtx = secondTableCanvas.getContext('2d')

//       if (!secondTableCtx) {
//         console.error('Failed to create second table canvas')
//         return
//       }

//       secondTableCtx.fillStyle = '#ffffff'
//       secondTableCtx.fillRect(0, 0, secondTableCanvas.width, secondTableCanvas.height)

//       const secondTableData = [
//         ['Department', 'Employees'],
//         ['Engineering', '50'],
//         ['Marketing', '20'],
//         ['HR', '15']
//       ]

//       let x2 = 50, y2 = 50

//       secondTableCtx.fillStyle = '#000000'
//       secondTableCtx.font = '16px Arial'

//       secondTableData.forEach((row, rowIndex) => {
//         row.forEach((cell, cellIndex) => {
//           const cellX = x2 + cellIndex * cellWidth
//           const cellY = y2 + rowIndex * cellHeight

//           secondTableCtx.strokeRect(cellX, cellY, cellWidth, cellHeight) // Draw Border
//           secondTableCtx.fillText(cell, cellX + 10, cellY + 20) // Draw Text
//         })
//       })

//       // Convert Second Table to Image
//       const secondTableImage = secondTableCanvas.toDataURL('image/png')
//       pdf.addImage(secondTableImage, 'PNG', 10, imgHeight * 2 + 50, imgWidth, imgHeight)

//       // 4️⃣ Open PDF in new tab and print
//       const pdfBlob = pdf.output('blob')
//       const pdfUrl = URL.createObjectURL(pdfBlob)

//       setTimeout(() => {
//         const printWindow = window.open(pdfUrl, '_blank')
//         printWindow?.print()
//       }, 1000)
//     }, 500)
//   }
// }




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

