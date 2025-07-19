export class FilterManager {
    constructor() {
        this.originalData = [];
        this.filteredData = [];
        this.filters = {
            search: '',
            column: '',
            value: ''
        };
        this.onFilterChange = null;
    }

    init(data, analysis) {
        this.originalData = data;
        this.filteredData = [...data];
        this.setupFilterControls(analysis);
        this.bindEvents();
    }

    setupFilterControls(analysis) {
        const filterColumn = document.getElementById('filter-column');
        
        if (filterColumn) {
            filterColumn.innerHTML = '<option value="">All columns</option>';
            
            // Add all column options
            if (analysis.headers) {
                analysis.headers.forEach(header => {
                    const option = document.createElement('option');
                    option.value = header;
                    option.textContent = header;
                    filterColumn.appendChild(option);
                });
            }
        }
    }

    bindEvents() {
        const searchInput = document.getElementById('search-input');
        const filterColumn = document.getElementById('filter-column');
        const resetBtn = document.getElementById('reset-filters-btn');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }

        if (filterColumn) {
            filterColumn.addEventListener('change', (e) => {
                this.filters.column = e.target.value;
                this.applyFilters();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }
    }

    applyFilters() {
        let filtered = [...this.originalData];

        // Apply search filter
        if (this.filters.search) {
            filtered = filtered.filter(row => {
                if (this.filters.column) {
                    // Search in specific column
                    const value = row[this.filters.column];
                    return value && value.toString().toLowerCase().includes(this.filters.search);
                } else {
                    // Search in all columns
                    return Object.values(row).some(value => 
                        value && value.toString().toLowerCase().includes(this.filters.search)
                    );
                }
            });
        }

        this.filteredData = filtered;
        
        // Update UI to show filter status
        this.updateFilterStatus();
        
        // Notify listeners
        if (this.onFilterChange) {
            this.onFilterChange(this.filteredData);
        }
    }

    resetFilters() {
        this.filters = {
            search: '',
            column: '',
            value: ''
        };

        // Reset UI controls
        const searchInput = document.getElementById('search-input');
        const filterColumn = document.getElementById('filter-column');

        if (searchInput) searchInput.value = '';
        if (filterColumn) filterColumn.value = '';

        this.filteredData = [...this.originalData];
        this.updateFilterStatus();
        
        if (this.onFilterChange) {
            this.onFilterChange(this.filteredData);
        }
    }

    updateFilterStatus() {
        const totalRecords = this.originalData.length;
        const filteredRecords = this.filteredData.length;
        
        // Update metrics if they exist
        const metricsCards = document.querySelectorAll('.metric-card');
        if (metricsCards.length > 0) {
            const recordsCard = metricsCards[0]?.querySelector('p:last-child');
            if (recordsCard) {
                recordsCard.textContent = filteredRecords !== totalRecords 
                    ? `${filteredRecords.toLocaleString()} (filtered)`
                    : filteredRecords.toLocaleString();
            }
        }
    }

    getFilteredData() {
        return this.filteredData;
    }

    hasActiveFilters() {
        return this.filters.search !== '' || this.filters.column !== '';
    }

    addCustomFilter(filterFn) {
        this.filteredData = this.filteredData.filter(filterFn);
        this.updateFilterStatus();
        
        if (this.onFilterChange) {
            this.onFilterChange(this.filteredData);
        }
    }

    sortData(column, direction = 'asc') {
        this.filteredData.sort((a, b) => {
            const aVal = a[column];
            const bVal = b[column];
            
            // Handle different data types
            const aNum = parseFloat(aVal);
            const bNum = parseFloat(bVal);
            
            if (!isNaN(aNum) && !isNaN(bNum)) {
                // Numeric comparison
                return direction === 'asc' ? aNum - bNum : bNum - aNum;
            } else {
                // String comparison
                const aStr = aVal ? aVal.toString().toLowerCase() : '';
                const bStr = bVal ? bVal.toString().toLowerCase() : '';
                
                if (direction === 'asc') {
                    return aStr.localeCompare(bStr);
                } else {
                    return bStr.localeCompare(aStr);
                }
            }
        });
        
        if (this.onFilterChange) {
            this.onFilterChange(this.filteredData);
        }
    }
}