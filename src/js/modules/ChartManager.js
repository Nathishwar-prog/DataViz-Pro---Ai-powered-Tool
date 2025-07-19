export class ChartManager {
    constructor() {
        this.chartInstances = [];
        this.chartsGrid = document.getElementById('charts-grid');
    }

    generateAdvancedCharts(data, analysis) {
        this.destroyAllCharts();
        this.chartsGrid.innerHTML = '';

        let chartCount = 0;
        const maxCharts = 4;

        // Time series chart
        if (analysis.datetime.length > 0 && analysis.numerical.length > 0 && chartCount < maxCharts) {
            this.createTimeSeriesChart(data, analysis.datetime[0], analysis.numerical[0].name, analysis);
            chartCount++;
        }

        // Correlation chart
        if (analysis.numerical.length >= 2 && chartCount < maxCharts) {
            this.createCorrelationChart(data, analysis.numerical[0].name, analysis.numerical[1].name, analysis);
            chartCount++;
        }
        
        // Categorical bar chart
        if (analysis.categorical.length > 0 && chartCount < maxCharts) {
            this.createBarChart(analysis.categorical[0], analysis);
            chartCount++;
        }

        // Numerical distribution
        if (analysis.numerical.length > 0 && chartCount < maxCharts) {
            this.createHistogramChart(analysis.numerical[0], analysis);
            chartCount++;
        }
    }

    createChartContainer(id, title, subtitle, hasSelectors = false) {
        const container = document.createElement('div');
        container.className = "bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg";
        
        let selectorsHtml = '';
        if (hasSelectors) {
            selectorsHtml = `
                <div class="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
                    <select id="${id}-x" class="flex-1 p-2 text-sm rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"></select>
                    <select id="${id}-y" class="flex-1 p-2 text-sm rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"></select>
                </div>
            `;
        }
        
        container.innerHTML = `
            <div class="mb-4">
                <h4 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">${title}</h4>
                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">${subtitle}</p>
            </div>
            ${selectorsHtml}
            <div class="chart-container"><canvas id="${id}"></canvas></div>
        `;
        
        this.chartsGrid.appendChild(container);
        return container;
    }

    createTimeSeriesChart(data, dateCol, valCol, analysis) {
        this.createChartContainer('timeseries-chart', 'Time Series Analysis', 'Values over time', true);
        
        this.populateSelectors('timeseries-chart', analysis.datetime, analysis.numerical.map(n => n.name), dateCol, valCol);
        
        const chartData = data
            .map(row => ({ 
                x: new Date(row[dateCol]), 
                y: parseFloat(row[valCol].toString().replace(/[^0-9.-]+/g, "")) 
            }))
            .filter(d => !isNaN(d.x.getTime()) && !isNaN(d.y))
            .sort((a, b) => a.x - b.x);
        
        this.renderChart('timeseries-chart', 'line', {
            datasets: [{
                label: valCol,
                data: chartData,
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                fill: true,
                tension: 0.3
            }]
        }, { 
            x: { 
                type: 'time', 
                time: { unit: 'day' },
                title: { display: true, text: dateCol }
            },
            y: {
                title: { display: true, text: valCol }
            }
        });

        this.setupChartUpdater('timeseries-chart', data, analysis, 'timeseries');
    }

    createCorrelationChart(data, xCol, yCol, analysis) {
        this.createChartContainer('correlation-chart', 'Correlation Analysis', 'Relationship between numerical fields', true);
        
        this.populateSelectors('correlation-chart', analysis.numerical.map(n => n.name), analysis.numerical.map(n => n.name), xCol, yCol);
        
        const chartData = data
            .map(row => ({ 
                x: parseFloat(row[xCol].toString().replace(/[^0-9.-]+/g, "")), 
                y: parseFloat(row[yCol].toString().replace(/[^0-9.-]+/g, "")) 
            }))
            .filter(d => !isNaN(d.x) && !isNaN(d.y));

        this.renderChart('correlation-chart', 'scatter', {
            datasets: [{
                label: `${xCol} vs ${yCol}`,
                data: chartData,
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderColor: '#3b82f6'
            }]
        }, { 
            x: { title: { display: true, text: xCol } }, 
            y: { title: { display: true, text: yCol } } 
        });

        this.setupChartUpdater('correlation-chart', data, analysis, 'correlation');
    }

    createBarChart(catData, analysis) {
        this.createChartContainer('bar-chart', 'Category Distribution', 'Top categories by frequency', true);
        
        this.populateSelectors('bar-chart', analysis.categorical.map(c => c.name), ['Count'], catData.name, 'Count');
        
        const topCategories = catData.distribution.slice(0, 10);
        this.renderChart('bar-chart', 'bar', {
            labels: topCategories.map(d => d.value),
            datasets: [{
                label: 'Count',
                data: topCategories.map(d => d.count),
                backgroundColor: '#10b981',
                borderColor: '#059669',
                borderWidth: 1
            }]
        });

        this.setupChartUpdater('bar-chart', {}, analysis, 'bar');
    }

    createHistogramChart(numData, analysis) {
        this.createChartContainer('histogram-chart', 'Numerical Distribution', 'Frequency distribution of values', true);
        
        this.populateSelectors('histogram-chart', analysis.numerical.map(n => n.name), ['Frequency'], numData.name, 'Frequency');
        
        const bins = this.createHistogramBins(numData.values, 10);
        this.renderChart('histogram-chart', 'bar', {
            labels: bins.map(bin => `${bin.min.toFixed(1)}-${bin.max.toFixed(1)}`),
            datasets: [{
                label: 'Frequency',
                data: bins.map(bin => bin.count),
                backgroundColor: '#ef4444',
                borderColor: '#dc2626',
                borderWidth: 1
            }]
        });

        this.setupChartUpdater('histogram-chart', {}, analysis, 'histogram');
    }

    setupChartUpdater(chartId, data, analysis, type) {
        const xSelect = document.getElementById(`${chartId}-x`);
        const ySelect = document.getElementById(`${chartId}-y`);
        
        if (xSelect) {
            xSelect.addEventListener('change', () => this.updateChart(chartId, data, analysis, type));
        }
        if (ySelect) {
            ySelect.addEventListener('change', () => this.updateChart(chartId, data, analysis, type));
        }
    }

    updateChart(chartId, data, analysis, type) {
        const xCol = document.getElementById(`${chartId}-x`)?.value;
        const yCol = document.getElementById(`${chartId}-y`)?.value;
        
        if (!xCol) return;

        const chartIndex = this.chartInstances.findIndex(c => c.canvas.id === chartId);
        if (chartIndex > -1) {
            this.chartInstances[chartIndex].destroy();
            this.chartInstances.splice(chartIndex, 1);
        }

        switch (type) {
            case 'timeseries':
                if (yCol) this.createTimeSeriesChart(data, xCol, yCol, analysis);
                break;
            case 'correlation':
                if (yCol) this.createCorrelationChart(data, xCol, yCol, analysis);
                break;
            case 'bar':
                const catData = analysis.categorical.find(c => c.name === xCol);
                if (catData) this.createBarChart(catData, analysis);
                break;
            case 'histogram':
                const numData = analysis.numerical.find(n => n.name === xCol);
                if (numData) this.createHistogramChart(numData, analysis);
                break;
        }
    }

    populateSelectors(chartId, xOptions, yOptions, defaultX, defaultY) {
        const xSelect = document.getElementById(`${chartId}-x`);
        const ySelect = document.getElementById(`${chartId}-y`);
        
        if (xSelect && xOptions) {
            xSelect.innerHTML = xOptions.map(opt => 
                `<option value="${opt}" ${opt === defaultX ? 'selected' : ''}>${opt}</option>`
            ).join('');
        }
        
        if (ySelect && yOptions) {
            ySelect.innerHTML = yOptions.map(opt => 
                `<option value="${opt}" ${opt === defaultY ? 'selected' : ''}>${opt}</option>`
            ).join('');
        }
    }

    renderChart(canvasId, type, data, scaleOptions = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const isDark = document.documentElement.classList.contains('dark');
        const textColor = isDark ? '#e5e7eb' : '#374151';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

        const chart = new Chart(canvas, {
            type: type,
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { 
                        labels: { color: textColor }
                    }
                },
                scales: {
                    x: { 
                        ticks: { color: textColor }, 
                        grid: { color: gridColor }, 
                        ...scaleOptions.x 
                    },
                    y: { 
                        ticks: { color: textColor }, 
                        grid: { color: gridColor }, 
                        ...scaleOptions.y 
                    }
                }
            }
        });
        
        this.chartInstances.push(chart);
        
        // Register with theme manager
        window.dispatchEvent(new CustomEvent('chartCreated', { detail: { chart } }));
        
        return chart;
    }

    createHistogramBins(values, binCount) {
        if (values.length === 0) return [];
        
        const min = Math.min(...values);
        const max = Math.max(...values);
        
        if (min === max) return [{ min, max, count: values.length }];

        const binWidth = (max - min) / binCount;
        const bins = Array.from({ length: binCount }, (_, i) => ({
            min: min + i * binWidth,
            max: min + (i + 1) * binWidth,
            count: 0
        }));

        for (const value of values) {
            const binIndex = Math.min(Math.floor((value - min) / binWidth), binCount - 1);
            if (bins[binIndex]) bins[binIndex].count++;
        }
        
        return bins;
    }

    destroyAllCharts() {
        this.chartInstances.forEach(chart => {
            try {
                chart.destroy();
            } catch (e) {
                console.warn('Error destroying chart:', e);
            }
        });
        this.chartInstances = [];
    }

    getChartInstance(canvasId) {
        return this.chartInstances.find(chart => chart.canvas.id === canvasId);
    }
}