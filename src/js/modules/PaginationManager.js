export class PaginationManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.totalItems = 0;
        this.totalPages = 0;
        this.data = [];
        this.onPageChange = null;
    }

    init(data, itemsPerPage = 20) {
        this.data = data;
        this.itemsPerPage = itemsPerPage;
        this.totalItems = data.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.currentPage = 1;
        
        this.setupPaginationControls();
        this.updatePaginationUI();
        this.emitPageChange();
    }

    setupPaginationControls() {
        // Cards pagination
        const cardsPrevBtn = document.getElementById('cards-prev-btn');
        const cardsNextBtn = document.getElementById('cards-next-btn');
        
        if (cardsPrevBtn) {
            cardsPrevBtn.addEventListener('click', () => this.previousPage());
        }
        if (cardsNextBtn) {
            cardsNextBtn.addEventListener('click', () => this.nextPage());
        }

        // Table pagination
        const tablePrevBtn = document.getElementById('table-prev-btn');
        const tableNextBtn = document.getElementById('table-next-btn');
        
        if (tablePrevBtn) {
            tablePrevBtn.addEventListener('click', () => this.previousPage());
        }
        if (tableNextBtn) {
            tableNextBtn.addEventListener('click', () => this.nextPage());
        }
    }

    updateData(newData) {
        this.data = newData;
        this.totalItems = newData.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.currentPage = 1;
        
        this.updatePaginationUI();
        this.emitPageChange();
    }

    getCurrentPageData() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.data.slice(startIndex, endIndex);
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updatePaginationUI();
            this.emitPageChange();
        }
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePaginationUI();
            this.emitPageChange();
        }
    }

    goToPage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.updatePaginationUI();
            this.emitPageChange();
        }
    }

    updatePaginationUI() {
        // Update pagination info
        const cardsInfo = document.getElementById('cards-pagination-info');
        const tableInfo = document.getElementById('table-pagination-info');
        
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
        const infoText = `Showing ${startItem}-${endItem} of ${this.totalItems}`;
        
        if (cardsInfo) cardsInfo.textContent = infoText;
        if (tableInfo) tableInfo.textContent = infoText;

        // Update button states
        this.updateButtonStates('cards');
        this.updateButtonStates('table');
    }

    updateButtonStates(prefix) {
        const prevBtn = document.getElementById(`${prefix}-prev-btn`);
        const nextBtn = document.getElementById(`${prefix}-next-btn`);
        
        if (prevBtn) {
            prevBtn.disabled = this.currentPage <= 1;
            prevBtn.classList.toggle('opacity-50', this.currentPage <= 1);
            prevBtn.classList.toggle('cursor-not-allowed', this.currentPage <= 1);
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentPage >= this.totalPages;
            nextBtn.classList.toggle('opacity-50', this.currentPage >= this.totalPages);
            nextBtn.classList.toggle('cursor-not-allowed', this.currentPage >= this.totalPages);
        }
    }

    emitPageChange() {
        if (this.onPageChange) {
            const pageData = this.getCurrentPageData();
            this.onPageChange(pageData, this.currentPage, this.totalPages);
        }
    }

    setItemsPerPage(items) {
        this.itemsPerPage = items;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.currentPage = 1;
        this.updatePaginationUI();
        this.emitPageChange();
    }

    getTotalPages() {
        return this.totalPages;
    }

    getCurrentPage() {
        return this.currentPage;
    }

    getTotalItems() {
        return this.totalItems;
    }

    getItemsPerPage() {
        return this.itemsPerPage;
    }
}