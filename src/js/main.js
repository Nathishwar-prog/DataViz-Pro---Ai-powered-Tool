import { DataBackend } from './modules/DataBackend.js';
import { ThemeManager } from './modules/ThemeManager.js';
import { ViewManager } from './modules/ViewManager.js';
import { ChartManager } from './modules/ChartManager.js';
import { AIManager } from './modules/AIManager.js';
import { FilterManager } from './modules/FilterManager.js';
import { ExportManager } from './modules/ExportManager.js';
import { PaginationManager } from './modules/PaginationManager.js';
import { FileManager } from './modules/FileManager.js';
import { UIManager } from './modules/UIManager.js';

class AnalyticsDashboard {
    constructor() {
        this.currentData = [];
        this.filteredData = [];
        this.analysis = {};
        this.apiKey = null;
        this.aiEnabled = false;
        
        this.initializeManagers();
        this.bindEvents();
        this.init();
    }

    initializeManagers() {
        this.backend = new DataBackend();
        this.themeManager = new ThemeManager();
        this.viewManager = new ViewManager();
        this.chartManager = new ChartManager();
        this.aiManager = new AIManager();
        this.filterManager = new FilterManager();
        this.exportManager = new ExportManager();
        this.paginationManager = new PaginationManager();
        this.fileManager = new FileManager();
        this.uiManager = new UIManager();
    }

    bindEvents() {
        // File upload events
        document.getElementById('fetchBtn').addEventListener('click', () => this.showAiChoiceModal());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearData());
        document.getElementById('paste-btn').addEventListener('click', () => this.pasteFromClipboard());
        document.getElementById('sheetUrl').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.showAiChoiceModal();
        });

        // File manager events
        this.fileManager.onFileProcessed = (data) => this.handleFileData(data);
        this.fileManager.init();

        // Modal events
        document.getElementById('select-ai-btn').addEventListener('click', () => this.showApiKeyView());
        document.getElementById('select-standard-btn').addEventListener('click', () => this.startStandardAnalysis());
        document.getElementById('back-to-choice-btn').addEventListener('click', () => this.showInitialChoiceView());
        document.getElementById('start-ai-analysis-btn').addEventListener('click', () => this.startAiAnalysis());

        // View switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => this.viewManager.switchView(e.currentTarget.dataset.view));
        });

        // AI Query
        document.getElementById('queryBtn').addEventListener('click', () => this.handleNaturalLanguageQuery());
        document.getElementById('queryInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleNaturalLanguageQuery();
        });

        // Export events
        document.getElementById('exportCsvBtn').addEventListener('click', () => this.exportManager.exportToCsv(this.filteredData));
        document.getElementById('exportJsonBtn').addEventListener('click', () => this.exportManager.exportToJson(this.filteredData));

        // Help modal
        document.getElementById('help-btn').addEventListener('click', () => this.showHelpModal());
        document.getElementById('close-help-btn').addEventListener('click', () => this.hideHelpModal());

        // Data preview confirmation
        document.getElementById('confirm-data-btn').addEventListener('click', () => this.confirmAndAnalyzeData());

        // Filter events
        this.filterManager.onFilterChange = (data) => this.handleFilteredData(data);

        // Theme events
        document.getElementById('theme-toggle').addEventListener('click', () => this.themeManager.toggleTheme());

        // Pagination events
        this.paginationManager.onPageChange = (data, page, totalPages) => {
            this.updateCurrentView(data, page, totalPages);
        };
    }

    init() {
        this.themeManager.init();
        this.viewManager.init();
        this.uiManager.init();
    }

    async pasteFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            document.getElementById('sheetUrl').value = text;
        } catch (err) {
            this.uiManager.showError('Failed to read from clipboard. Please paste manually.');
        }
    }

    handleFileData(data) {
        this.currentData = data;
        this.showDataPreview(data);
    }

    showDataPreview(data) {
        const preview = document.getElementById('data-preview');
        const table = document.getElementById('preview-table');
        const stats = document.getElementById('preview-stats');
        
        if (data.length === 0) {
            this.uiManager.showError('No data found in the file.');
            return;
        }

        const headers = Object.keys(data[0]);
        const previewData = data.slice(0, 5);

        stats.textContent = `${data.length} rows, ${headers.length} columns`;

        table.innerHTML = `
            <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>${headers.map(h => `<th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">${h}</th>`).join('')}</tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                ${previewData.map(row => 
                    `<tr>${headers.map(h => `<td class="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">${row[h] || ''}</td>`).join('')}</tr>`
                ).join('')}
                ${data.length > 5 ? `<tr><td colspan="${headers.length}" class="px-4 py-2 text-center text-sm text-gray-500 dark:text-gray-400">... and ${data.length - 5} more rows</td></tr>` : ''}
            </tbody>
        `;

        preview.classList.remove('hidden');
        document.getElementById('initial-message').classList.add('hidden');
    }

    confirmAndAnalyzeData() {
        document.getElementById('data-preview').classList.add('hidden');
        this.showAiChoiceModal();
    }

    showAiChoiceModal() {
        const url = document.getElementById('sheetUrl').value.trim();
        if (!url && this.currentData.length === 0) {
            this.uiManager.showError("Please upload a file or enter a Google Sheets URL first.");
            return;
        }
        this.showInitialChoiceView();
        document.getElementById('ai-choice-modal').classList.remove('hidden');
    }

    hideAiChoiceModal() {
        document.getElementById('ai-choice-modal').classList.add('hidden');
    }

    showInitialChoiceView() {
        document.getElementById('initial-choice-view').classList.remove('hidden');
        document.getElementById('api-key-view').classList.add('hidden');
    }

    showApiKeyView() {
        document.getElementById('initial-choice-view').classList.add('hidden');
        document.getElementById('api-key-view').classList.remove('hidden');
        document.getElementById('apiKeyInput').focus();
    }

    showHelpModal() {
        document.getElementById('help-modal').classList.remove('hidden');
    }

    hideHelpModal() {
        document.getElementById('help-modal').classList.add('hidden');
    }

    startStandardAnalysis() {
        this.aiEnabled = false;
        this.apiKey = null;
        this.hideAiChoiceModal();
        this.processData();
    }

    startAiAnalysis() {
        const key = document.getElementById('apiKeyInput').value.trim();
        if (!key) {
            document.getElementById('api-key-error').classList.remove('hidden');
            return;
        }
        document.getElementById('api-key-error').classList.add('hidden');
        this.aiEnabled = true;
        this.apiKey = key;
        this.aiManager.setApiKey(key);
        this.hideAiChoiceModal();
        this.processData();
    }

    async processData() {
        try {
            // If we don't have data from file upload, fetch from URL
            if (this.currentData.length === 0) {
                const url = document.getElementById('sheetUrl').value.trim();
                if (!url) {
                    this.uiManager.showError("No data to process.");
                    return;
                }
                await this.handleFetch(url);
            } else {
                this.analyzeAndRender();
            }
        } catch (error) {
            this.uiManager.showError(error.message);
        }
    }

    async handleFetch(url) {
        this.uiManager.showLoading();
        
        try {
            const data = await this.backend.fetchDataFromSheet(url);
            if (data.length === 0) {
                this.uiManager.showError("No data found or sheet is empty.");
                return;
            }
            this.currentData = data;
            this.analyzeAndRender();
        } catch (error) {
            console.error('Fetch Error:', error);
            this.uiManager.showError(error.message);
        }
    }

    analyzeAndRender() {
        this.analysis = this.backend.analyzeData(this.currentData);
        this.filteredData = [...this.currentData];
        
        this.renderAll();
        
        if (this.aiEnabled) {
            this.getAiInsights();
        }

        this.uiManager.clearStatus();
    }

    renderAll() {
        document.getElementById('main-content').classList.remove('hidden');
        document.getElementById('initial-message').classList.add('hidden');
        document.getElementById('data-preview').classList.add('hidden');

        // Show/hide AI features
        const aiElements = [
            document.querySelector('[data-view="ai-insights"]'),
            document.getElementById('natural-language-query')
        ];
        aiElements.forEach(el => el && el.classList.toggle('hidden', !this.aiEnabled));

        // Initialize filter manager
        this.filterManager.init(this.currentData, this.analysis);

        // Generate visualizations
        this.generateMetricsOverview(this.analysis);
        this.generateCategoryAnalysis(this.analysis);
        this.chartManager.generateAdvancedCharts(this.currentData, this.analysis);
        
        // Initialize pagination
        this.paginationManager.init(this.filteredData);

        // Set initial view
        if (this.aiEnabled) {
            this.viewManager.switchView('ai-insights');
        } else {
            this.viewManager.switchView('dashboard');
        }
    }

    handleFilteredData(filteredData) {
        this.filteredData = filteredData;
        this.paginationManager.updateData(filteredData);
        this.updateCurrentView(filteredData);
    }

    updateCurrentView(data, page = 1, totalPages = 1) {
        const currentView = this.viewManager.getCurrentView();
        
        switch (currentView) {
            case 'cards':
                this.generateDataCards(data, page, totalPages);
                break;
            case 'table':
                this.generateDataTable(data, page, totalPages);
                break;
        }
    }

    async getAiInsights() {
        const container = document.getElementById('ai-insights-container');
        container.innerHTML = '<div class="loader mx-auto"></div><p class="text-center mt-4">Generating AI insights...</p>';
        
        try {
            const insights = await this.aiManager.generateInsights(this.currentData, this.analysis);
            container.innerHTML = insights;
        } catch (error) {
            container.innerHTML = `
                <div class="error-state">
                    <p class="font-bold">Failed to generate AI insights.</p>
                    <p class="text-sm mt-2">${error.message}</p>
                </div>
            `;
        }
    }

    async handleNaturalLanguageQuery() {
        if (!this.aiEnabled) {
            this.showQueryResult('AI features are disabled. Please start a new analysis and enable AI to use this feature.', 'warning');
            return;
        }

        const query = document.getElementById('queryInput').value.trim();
        if (!query) return;

        this.showQueryResult('<div class="loader mx-auto"></div>', 'loading');

        try {
            const result = await this.aiManager.processQuery(query, this.currentData, this.analysis);
            this.showQueryResult(result, 'success');
        } catch (error) {
            this.showQueryResult(`Error processing query: ${error.message}`, 'error');
        }
    }

    showQueryResult(content, type = 'info') {
        const resultDiv = document.getElementById('query-result');
        resultDiv.classList.remove('hidden');
        
        let className = 'p-4 rounded-lg';
        switch (type) {
            case 'error':
                className += ' error-state';
                break;
            case 'warning':
                className += ' warning-state';
                break;
            case 'success':
                className += ' success-state';
                break;
            default:
                className += ' bg-gray-100 dark:bg-gray-700';
        }
        
        resultDiv.className = className;
        resultDiv.innerHTML = content;
    }

    generateMetricsOverview(analysis) {
        const metrics = [
            { 
                title: 'Total Records', 
                value: analysis.totalRecords.toLocaleString(), 
                icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', 
                gradient: 'metric-card' 
            },
            { 
                title: 'Data Columns', 
                value: analysis.columns, 
                icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', 
                gradient: 'metric-card-2' 
            },
            { 
                title: 'Categorical', 
                value: analysis.categorical.length, 
                icon: 'M7 7h.01M7 3h5c.512 0 .853.05 1.147.146C13.442 3.24 13.674 3.375 13.87 3.58c.198.207.348.476.393.81.046.334-.07.666-.25.948a1.4 1.4 0 01-.677.61c.458.201.858.556 1.158 1.037.3.48.407 1.048.318 1.617-.089.57-.31 1.104-.63 1.539-.32.436-.737.773-1.2 1.009', 
                gradient: 'metric-card-3' 
            },
            { 
                title: 'Numerical', 
                value: analysis.numerical.length, 
                icon: 'M9 7h6l2 9H5l2-9z M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M7 21h10', 
                gradient: 'metric-card-4' 
            }
        ];

        document.getElementById('metrics-overview').innerHTML = metrics.map(m => `
            <div class="${m.gradient} rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover-scale">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-white/80 text-xs sm:text-sm font-medium">${m.title}</p>
                        <p class="text-xl sm:text-3xl font-bold mt-1">${m.value}</p>
                    </div>
                    <svg class="w-6 h-6 sm:w-10 sm:h-10 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${m.icon}"/>
                    </svg>
                </div>
            </div>
        `).join('');
    }

    generateCategoryAnalysis(analysis) {
        const container = document.getElementById('category-analysis');
        
        if (analysis.categorical.length === 0) {
            container.innerHTML = '';
            return;
        }

        const categoryCards = analysis.categorical.slice(0, 3).map(cat => `
            <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div class="flex items-center justify-between mb-4">
                    <h4 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white capitalize truncate" title="${cat.name}">${cat.name}</h4>
                    <span class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 sm:px-3 py-1 rounded-full">${cat.uniqueCount} unique</span>
                </div>
                <div class="space-y-2">
                    ${cat.distribution.slice(0, 5).map(item => {
                        const percentage = (item.count / cat.values.length * 100).toFixed(1);
                        return `
                        <div class="flex items-center justify-between text-sm">
                            <span class="text-gray-600 dark:text-gray-300 truncate max-w-24 sm:max-w-32" title="${item.value}">${item.value}</span>
                            <div class="flex items-center space-x-2">
                                <div class="w-16 sm:w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                    <div class="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full" style="width: ${percentage}%"></div>
                                </div>
                                <span class="text-xs text-gray-500 dark:text-gray-400 w-10 sm:w-12 text-right">${percentage}%</span>
                            </div>
                        </div>`;
                    }).join('')}
                </div>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="mb-4 sm:mb-6">
                <h3 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Top Category Distributions</h3>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">${categoryCards}</div>
        `;
    }

    generateDataCards(data, page = 1, totalPages = 1) {
        const container = document.getElementById('results-cards');
        
        if (!data || data.length === 0) {
            container.innerHTML = '<div class="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">No data to display</div>';
            return;
        }

        container.innerHTML = data.map((row, index) => `
            <div class="data-card bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 transition-all duration-300 hover-scale fade-in">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Record #${index + 1}</h3>
                </div>
                <div class="space-y-2 sm:space-y-3 text-sm">
                    ${Object.entries(row).slice(0, 6).map(([key, value]) => `
                        <div>
                            <span class="font-medium text-gray-500 dark:text-gray-400">${key}:</span>
                            <span class="text-gray-800 dark:text-white ml-2 break-words">${value || 'N/A'}</span>
                        </div>
                    `).join('')}
                    ${Object.keys(row).length > 6 ? `<div class="text-xs text-gray-500 dark:text-gray-400 mt-2">... and ${Object.keys(row).length - 6} more fields</div>` : ''}
                </div>
            </div>
        `).join('');
    }

    generateDataTable(data, page = 1, totalPages = 1) {
        const table = document.getElementById('data-table');
        
        if (!data || data.length === 0) {
            table.innerHTML = '<tbody><tr><td class="text-center py-8 text-gray-500 dark:text-gray-400">No data to display</td></tr></tbody>';
            return;
        }

        const headers = Object.keys(data[0]);
        
        table.innerHTML = `
            <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0">
                <tr>${headers.map(h => `<th class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">${h}</th>`).join('')}</tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                ${data.map(row => `
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        ${headers.map(h => `<td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${row[h] || ''}</td>`).join('')}
                    </tr>
                `).join('')}
            </tbody>
        `;
    }

    clearData() {
        document.getElementById('sheetUrl').value = '';
        this.currentData = [];
        this.filteredData = [];
        this.analysis = {};
        this.chartManager.destroyAllCharts();
        this.aiEnabled = false;
        this.apiKey = null;
        
        document.getElementById('main-content').classList.add('hidden');
        document.getElementById('data-preview').classList.add('hidden');
        document.getElementById('initial-message').classList.remove('hidden');
        
        this.uiManager.clearStatus();
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnalyticsDashboard();
});