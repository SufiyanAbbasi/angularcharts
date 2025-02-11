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
export class ChartComponent {


  openChartAndTablesAsPDF(): void {
    const pdf = new jsPDF('portrait', 'mm', 'a4');
    // Header
    const headerX = 10;
    const headerY = 10;
    const headerHeight = 20;
    const infoX = 130;
    let infoY = 3;
    const topPadding = 5;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text("TRUSAIC | PayParity ", headerX, headerY);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("Pay Grade: E01", headerX, headerY + 29);
    const infoGap = 7;
    const infoWidth = 75;
    const infoHeight = 38;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setFillColor(240, 240, 240);
    pdf.rect(infoX, infoY, infoWidth, infoHeight, "F");
    const infoText = [
      { label: "Company", value: "ABC Corp" },
      { label: "Project", value: "Q4 EU Analysis" },
      { label: "Dimension", value: "Q4 EU Anaylysis" },
      { label: "Compensation Type", value: "Q4 EU Anaylysis" },
      { label: "Created on", value: "November 8, 2024" }
    ];
    infoText.forEach((item, index) => {
      const currentYPosition = infoY + index * infoGap + topPadding;
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      pdf.text(item.label, infoX + 2, currentYPosition);
      pdf.setFont("helvetica", "bold");
      pdf.text(item.value, infoX + 50, currentYPosition);
    });
    const lineY = headerY + headerHeight + 11;
    pdf.setDrawColor(169, 169, 169);
    pdf.setLineWidth(0.2);
    pdf.line(headerX, lineY, 125, lineY);

    // Create chart canvases and generate charts
    const chartCanvas1 = document.createElement('canvas');
    chartCanvas1.width = 400;
    chartCanvas1.height = 180;
    const ctx1 = chartCanvas1.getContext('2d');
    if (!ctx1) return;

    const chartCanvas2 = document.createElement('canvas');
    chartCanvas2.width = 400;
    chartCanvas2.height = 180;
    const ctx2 = chartCanvas2.getContext('2d');
    if (!ctx2) return;

    // Create first chart
    new Chart(ctx1, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',],
        datasets: [{
          label: 'Salary Data (Chart 1)',
          data: [65, 59, 80, 81, 56, 88],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: { responsive: false, maintainAspectRatio: false }
    });

    // Create second chart
    new Chart(ctx2, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June'],
        datasets: [{
          label: 'Expense Data (Chart 2)',
          data: [40, 30, 50, 60, 45, 55],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: { responsive: false, maintainAspectRatio: false }
    });

    // Wait until charts are fully rendered to capture images
    setTimeout(() => {
      const imgWidth = 195;
      const imgHeight1 = 70;
      const imgHeight2 = 70;

      const chartImage1 = chartCanvas1.toDataURL('image/png');
      const chartImage2 = chartCanvas2.toDataURL('image/png');

      const marginTop = 10;
      let yPos = headerY + headerHeight + 20;
      const divWidth = 195;
      const divHeight = 20;
      pdf.setFillColor(240, 240, 240);
      pdf.rect(10, yPos + 3, divWidth, divHeight, "F");

      // Text for first chart abov ethta in div
      const text1 = 'Recommended Base Compensation';
      const text1Width = pdf.getTextWidth(text1);
      const text1XPosition = 2 + (divWidth - text1Width) / 2;
      const paddingTop = 8;
      const text1YPosition = yPos + paddingTop;
      const amount1 = "$4000";
      const smallText1 = "/year";
      const amount2 = "$2000";
      const smallText2 = "/year";
      const minusSign = " - ";
      const text2Width = pdf.getTextWidth(`${amount1} ${smallText1} ${minusSign} ${amount2} ${smallText2}`);
      const text2XPosition = -14 + (divWidth - text2Width) / 2;
      const marginTopText2 = 2;
      const text2YPosition = yPos + (divHeight * 2 / 3) + marginTopText2;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text(text1, text1XPosition, text1YPosition);
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text(amount1, text2XPosition, text2YPosition);
      const smallTextX1 = text2XPosition + pdf.getTextWidth(amount1) + 1;
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(smallText1, smallTextX1, text2YPosition);
      const minusX = smallTextX1 + pdf.getTextWidth(smallText1) + 5;
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text(minusSign, minusX, text2YPosition);
      const amount2X = minusX + pdf.getTextWidth(minusSign) + 5;
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text(amount2, amount2X, text2YPosition);
      const smallTextX2 = amount2X + pdf.getTextWidth(amount2) + 1;
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(smallText2, smallTextX2, text2YPosition);
      const salaryResultYPosition = yPos - 1;
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("Salary Result", 10, salaryResultYPosition);

      yPos += divHeight + marginTop + 5;
      pdf.addImage(chartImage1, 'PNG', 15, yPos, imgWidth, imgHeight1);
      pdf.setDrawColor(240, 240, 240);
      pdf.setLineWidth(0.5);
      pdf.rect(10, yPos - 1, imgWidth + 2, imgHeight1 + 2);
      yPos += imgHeight1 + 15;

      // Add second chart text above taht in div
      pdf.setFillColor(240, 240, 240);
      pdf.rect(10, yPos + 3, divWidth, divHeight, "F");
      const text3 = 'Recommended Base Compensation';
      const text3Width = pdf.getTextWidth(text3);
      const text3XPosition = 2 + (divWidth - text3Width) / 2;
      const text3YPosition = yPos + paddingTop;
      const amount3 = "$45";
      const smallText3 = "/hour";
      const amount4 = "$25";
      const smallText4 = "/hour";
      const minusSign2 = " - ";
      const text4Width = pdf.getTextWidth(`${amount3} ${smallText3} ${minusSign2} ${amount4} ${smallText4}`);
      const text4XPosition = -14 + (divWidth - text4Width) / 2;
      const marginTopText4 = 2;
      const text4YPosition = yPos + (divHeight * 2 / 3) + marginTopText4;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text(text3, text3XPosition, text3YPosition);
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text(amount3, text4XPosition, text4YPosition);
      const smallTextX3 = text4XPosition + pdf.getTextWidth(amount3) + 1;
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(smallText3, smallTextX3, text4YPosition);
      const minusX2 = smallTextX3 + pdf.getTextWidth(smallText3) + 5;
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text(minusSign2, minusX2, text4YPosition);
      const amount4X = minusX2 + pdf.getTextWidth(minusSign2) + 5;
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text(amount4, amount4X, text4YPosition);
      const smallTextX4 = amount4X + pdf.getTextWidth(amount4) + 1;
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(smallText4, smallTextX4, text4YPosition);
      const hourlyResultYPosition = yPos - 1;
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("Hourly Result", 10, hourlyResultYPosition);
      yPos += divHeight + marginTop + 5;
      pdf.addImage(chartImage2, 'PNG', 15, yPos, imgWidth, imgHeight2);
      pdf.setDrawColor(240, 240, 240);
      pdf.setLineWidth(0.5);
      pdf.rect(10, yPos - 1, imgWidth + 2, imgHeight2 + 2);
      yPos += imgHeight2 + marginTop;


      // Add the table after the charts
      const filtersData = [
        ['Filter', 'Values'],
        ['Location', 'Badge text'],
        ['Department', 'Badge text, Badge text'],
        ['Text', 'Badge text'],
        ['Text', 'Badge text'],
        ['Text', 'Badge text']
      ];

      const recommendedRangeData = [
        ['Range', 'Salary', 'Hourly'],
        ['A', '$60,000', '$30'],
        ['B', '$70,000', '$35']
      ];

      const payEquityRangeData = [
        ['Range', 'Salary', 'Hourly'],
        ['A', '$55,000', '$28'],
        ['B', '$65,000', '$33']
      ];

      const internalRangeData = [
        ['Range', 'Salary', 'Hourly'],
        ['A', '$80,000', '$40'],
        ['B', '$90,000', '$45']
      ];

      const externalRangeData = [
        ['Range', 'Salary', 'Hourly'],
        ['A', '$75,000', '$37'],
        ['B', '$85,000', '$42']
      ];

      const employeesInEachSegmentData = [
        ['Salary Range', 'Hourly Range', 'Employee Count'],
        ['$50,000-$60,000', '$25-$30', '150'],
        ['$60,000-$70,000', '$30-$35', '120']
      ];
      const pageHeight = pdf.internal.pageSize.height;
      const tableGap = 10;

      // Add the table
      yPos = this.checkAndAddTable(pdf, 'Filters', filtersData, yPos, imgWidth, pageHeight, tableGap);
      yPos = this.checkAndAddTable(pdf, 'Recommended Range Data', recommendedRangeData, yPos, imgWidth, pageHeight, tableGap);
      yPos = this.checkAndAddTable(pdf, 'Pay Equity Range Data', payEquityRangeData, yPos, imgWidth, pageHeight, tableGap);
      yPos = this.checkAndAddTable(pdf, 'Internal Range Data', internalRangeData, yPos, imgWidth, pageHeight, tableGap);
      yPos = this.checkAndAddTable(pdf, 'External Range Data', externalRangeData, yPos, imgWidth, pageHeight, tableGap);
      yPos = this.checkAndAddTable(pdf, 'Employees in Each Segment', employeesInEachSegmentData, yPos, imgWidth, pageHeight, tableGap);

      // Generate the PDF Blob
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
    const rowHeight = 9;
    const titleHeight = 6;
    let yPos = startY;

    if (yPos + titleHeight + data.length * rowHeight + gap > pageHeight) {
      pdf.addPage();
      yPos = 10;
    }

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(title, x, yPos);
    yPos += titleHeight - 1;

    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.setFillColor(240, 240, 240);
    pdf.rect(x, yPos, tableWidth, rowHeight, "F");
    pdf.setTextColor(0);

    // Render table headers
    data[0].forEach((header, index) => {
      const colX = x + (tableWidth / data[0].length) * index;
      let textX = colX + 2;
      if (
        (title === 'Recommended Range Data' || title === 'Pay Equity Range Data' ||
          title === 'Internal Range Data' || title === 'External Range Data') &&
        (index === 1 || index === 2)
      ) {
        const textWidth = pdf.getStringUnitWidth(header) * pdf.getFontSize() / pdf.internal.scaleFactor;
        textX = colX + (tableWidth / data[0].length) - textWidth - 2;
      }
      if (title === 'Employees in Each Segment') {
        if (index === 1) {
          textX = colX + 18; // Left alignment
        } else {
          const textWidth = pdf.getStringUnitWidth(header) * pdf.getFontSize() / pdf.internal.scaleFactor;
          textX = colX + (tableWidth / data[0].length) - textWidth - 2; // Right alignment
        }
      }

      pdf.text(header, textX, yPos + 5);
    });

    yPos += rowHeight;
    pdf.setDrawColor(211, 211, 211);
    pdf.setLineWidth(0.1);
    data.slice(1).forEach((row, rowIndex) => {
      const rowY = yPos + rowIndex * rowHeight;
      row.forEach((cell, cellIndex) => {
        const colX = x + (tableWidth / row.length) * cellIndex;
        let textX = colX + 2;
        if (
          (title === 'Recommended Range Data' || title === 'Pay Equity Range Data' ||
            title === 'Internal Range Data' || title === 'External Range Data') &&
          (cellIndex === 1 || cellIndex === 2)
        ) {
          const textWidth = pdf.getStringUnitWidth(cell) * pdf.getFontSize() / pdf.internal.scaleFactor;
          textX = colX + (tableWidth / row.length) - textWidth - 2;
        }
        if (title === 'Employees in Each Segment') {
          if (cellIndex === 1) {
            textX = colX + 18;
          } else {
            const textWidth = pdf.getStringUnitWidth(cell) * pdf.getFontSize() / pdf.internal.scaleFactor;
            textX = colX + (tableWidth / row.length) - textWidth - 2; // Right alignment
          }
        }
        pdf.text(cell, textX, rowY + 5);
      });
      pdf.line(x, rowY + rowHeight, x + tableWidth, rowY + rowHeight);
    });

    return yPos + data.length * rowHeight + gap;
  }

}
