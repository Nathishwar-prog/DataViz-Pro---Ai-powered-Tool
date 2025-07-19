export class ThemeManager {
    constructor() {
        this.darkIcon = document.getElementById('theme-toggle-dark-icon');
        this.lightIcon = document.getElementById('theme-toggle-light-icon');
        this.chartInstances = [];
    }

    init() {
        const isDark = localStorage.getItem('color-theme') === 'dark' || 
                       (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        this.updateTheme(isDark);
    }

    toggleTheme() {
        const isDark = !document.documentElement.classList.contains('dark');
        this.updateTheme(isDark);
        localStorage.setItem('color-theme', isDark ? 'dark' : 'light');
    }

    updateTheme(isDark) {
        document.documentElement.classList.toggle('dark', isDark);
        
        if (this.lightIcon && this.darkIcon) {
            this.lightIcon.classList.toggle('hidden', !isDark);
            this.darkIcon.classList.toggle('hidden', isDark);
        }
        
        // Update charts if any exist
        this.chartInstances.forEach(chart => this.updateChartTheme(chart, isDark));
        
        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDark } }));
    }

    updateChartTheme(chart, isDark) {
        if (!chart || !chart.options) return;
        
        const textColor = isDark ? '#e5e7eb' : '#374151';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        
        // Update legend
        if (chart.options.plugins?.legend?.labels) {
            chart.options.plugins.legend.labels.color = textColor;
        }
        
        // Update scales
        ['x', 'y'].forEach(axis => {
            if (chart.options.scales?.[axis]) {
                if (chart.options.scales[axis].ticks) {
                    chart.options.scales[axis].ticks.color = textColor;
                }
                if (chart.options.scales[axis].grid) {
                    chart.options.scales[axis].grid.color = gridColor;
                }
                if (chart.options.scales[axis].title) {
                    chart.options.scales[axis].title.color = textColor;
                }
            }
        });
        
        chart.update('none');
    }

    registerChart(chart) {
        this.chartInstances.push(chart);
    }

    unregisterChart(chart) {
        const index = this.chartInstances.indexOf(chart);
        if (index > -1) {
            this.chartInstances.splice(index, 1);
        }
    }

    getCurrentTheme() {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }

    isDarkMode() {
        return document.documentElement.classList.contains('dark');
    }
}