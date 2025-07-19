export class ExportManager {
    exportToCsv(data, filename = 'data_export.csv') {
        if (!data || data.length === 0) {
            throw new Error('No data to export');
        }

        const headers = Object.keys(data[0]);
        const csvRows = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => {
                    const value = row[header] || '';
                    // Escape quotes and wrap in quotes if necessary
                    const escaped = value.toString().replace(/"/g, '""');
                    return `"${escaped}"`;
                }).join(',')
            )
        ];
        
        this.downloadFile(csvRows.join('\n'), filename, 'text/csv;charset=utf-8;');
    }

    exportToJson(data, filename = 'data_export.json') {
        if (!data || data.length === 0) {
            throw new Error('No data to export');
        }

        const jsonString = JSON.stringify(data, null, 2);
        this.downloadFile(jsonString, filename, 'application/json;charset=utf-8;');
    }

    exportToExcel(data, filename = 'data_export.xlsx') {
        // Basic Excel export using CSV format with .xlsx extension
        // For full Excel support, would need a library like SheetJS
        this.exportToCsv(data, filename.replace('.xlsx', '.csv'));
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        URL.revokeObjectURL(url);
    }

    exportChartAsImage(chartInstance, filename = 'chart.png') {
        if (!chartInstance || !chartInstance.canvas) {
            throw new Error('Invalid chart instance');
        }

        const canvas = chartInstance.canvas;
        const link = document.createElement('a');
        
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    exportMultipleCharts(chartInstances, filename = 'charts.zip') {
        // For a production app, you would use a library like JSZip
        // For now, export each chart individually
        chartInstances.forEach((chart, index) => {
            this.exportChartAsImage(chart, `chart_${index + 1}.png`);
        });
    }

    generateReport(data, analysis, chartInstances) {
        const report = {
            metadata: {
                generated: new Date().toISOString(),
                totalRecords: data.length,
                columns: analysis.headers
            },
            summary: {
                numerical: analysis.numerical.map(n => ({
                    column: n.name,
                    min: n.min,
                    max: n.max,
                    average: n.avg,
                    sum: n.sum
                })),
                categorical: analysis.categorical.map(c => ({
                    column: c.name,
                    uniqueValues: c.uniqueCount,
                    topValues: c.distribution.slice(0, 5)
                })),
                datetime: analysis.datetime
            },
            data: data
        };

        this.exportToJson(report, 'analytics_report.json');
    }

    async exportToPdf(elementId, filename = 'report.pdf') {
        // For production, would use a library like jsPDF or Puppeteer
        // For now, use browser's print functionality
        const element = document.getElementById(elementId);
        if (!element) {
            throw new Error('Element not found');
        }

        // Open print dialog
        window.print();
    }
}