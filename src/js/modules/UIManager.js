export class UIManager {
    constructor() {
        this.notifications = [];
        this.toastContainer = null;
    }

    init() {
        this.createToastContainer();
        this.setupGlobalEventListeners();
    }

    createToastContainer() {
        this.toastContainer = document.createElement('div');
        this.toastContainer.id = 'toast-container';
        this.toastContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(this.toastContainer);
    }

    setupGlobalEventListeners() {
        // Listen for theme changes to update charts
        window.addEventListener('themeChanged', (e) => {
            this.handleThemeChange(e.detail.isDark);
        });

        // Listen for chart creation to register with theme manager
        window.addEventListener('chartCreated', (e) => {
            this.handleChartCreated(e.detail.chart);
        });

        // Listen for view changes
        window.addEventListener('viewChanged', (e) => {
            this.handleViewChange(e.detail.view);
        });

        // Global error handler
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            this.showToast('An unexpected error occurred', 'error');
        });
    }

    showLoading(message = 'Loading...') {
        const status = document.getElementById('status');
        if (status) {
            status.innerHTML = `
                <div class="flex items-center justify-center space-x-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
                    <div class="loader"></div>
                    <span class="text-blue-700 dark:text-blue-300 font-medium">${message}</span>
                </div>
            `;
        }
    }

    showError(message) {
        const status = document.getElementById('status');
        if (status) {
            status.innerHTML = `
                <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
                    <div class="flex items-center justify-center space-x-3">
                        <svg class="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span class="text-red-700 dark:text-red-300 font-medium">${message}</span>
                    </div>
                </div>
            `;
        }
        
        // Also show as toast for better visibility
        this.showToast(message, 'error');
    }

    showSuccess(message) {
        const status = document.getElementById('status');
        if (status) {
            status.innerHTML = `
                <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 text-center">
                    <div class="flex items-center justify-center space-x-3">
                        <svg class="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        <span class="text-green-700 dark:text-green-300 font-medium">${message}</span>
                    </div>
                </div>
            `;
        }
        
        this.showToast(message, 'success');
    }

    clearStatus() {
        const status = document.getElementById('status');
        if (status) {
            status.innerHTML = '';
        }
    }

    showToast(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        const id = `toast-${Date.now()}`;
        toast.id = id;
        
        let bgColor, textColor, icon;
        switch (type) {
            case 'error':
                bgColor = 'bg-red-500';
                textColor = 'text-white';
                icon = '⚠️';
                break;
            case 'success':
                bgColor = 'bg-green-500';
                textColor = 'text-white';
                icon = '✅';
                break;
            case 'warning':
                bgColor = 'bg-yellow-500';
                textColor = 'text-white';
                icon = '⚠️';
                break;
            default:
                bgColor = 'bg-blue-500';
                textColor = 'text-white';
                icon = 'ℹ️';
        }
        
        toast.className = `${bgColor} ${textColor} px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 transform transition-all duration-300 translate-x-full`;
        toast.innerHTML = `
            <span class="text-lg">${icon}</span>
            <span class="flex-1">${message}</span>
            <button onclick="this.parentElement.remove()" class="text-white hover:text-gray-200 ml-4">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        `;
        
        this.toastContainer.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            if (toast.parentElement) {
                toast.classList.add('translate-x-full');
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }
        }, duration);
    }

    showConfirmDialog(message, onConfirm, onCancel) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4';
        
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-w-md w-full">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Confirm Action</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-6">${message}</p>
                <div class="flex justify-end gap-4">
                    <button id="cancel-btn" class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-xl transition-colors">
                        Cancel
                    </button>
                    <button id="confirm-btn" class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition-colors">
                        Confirm
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('#confirm-btn').addEventListener('click', () => {
            modal.remove();
            if (onConfirm) onConfirm();
        });
        
        modal.querySelector('#cancel-btn').addEventListener('click', () => {
            modal.remove();
            if (onCancel) onCancel();
        });
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                if (onCancel) onCancel();
            }
        });
    }

    showProgressBar(message, progress = 0) {
        const status = document.getElementById('status');
        if (status) {
            status.innerHTML = `
                <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
                    <div class="flex items-center justify-center space-x-3 mb-4">
                        <span class="text-blue-700 dark:text-blue-300 font-medium">${message}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
            `;
        }
    }

    updateProgressBar(progress) {
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
    }

    handleThemeChange(isDark) {
        // Update any theme-dependent UI elements
        const modals = document.querySelectorAll('.fixed.inset-0');
        modals.forEach(modal => {
            // Update modal backgrounds if needed
        });
    }

    handleChartCreated(chart) {
        // Register chart with theme manager or other systems
        console.log('Chart created:', chart);
    }

    handleViewChange(view) {
        // Handle any view-specific UI updates
        console.log('View changed to:', view);
    }

    createLoadingSkeleton(container, type = 'cards') {
        if (!container) return;
        
        let skeletonHTML = '';
        
        switch (type) {
            case 'cards':
                skeletonHTML = Array(6).fill().map(() => `
                    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-pulse">
                        <div class="skeleton h-6 w-32 mb-4"></div>
                        <div class="space-y-3">
                            <div class="skeleton-text w-full"></div>
                            <div class="skeleton-text w-3/4"></div>
                            <div class="skeleton-text w-1/2"></div>
                        </div>
                    </div>
                `).join('');
                break;
            case 'table':
                skeletonHTML = `
                    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-pulse">
                        <div class="skeleton h-8 w-48 mb-4"></div>
                        ${Array(5).fill().map(() => `
                            <div class="flex space-x-4 mb-3">
                                <div class="skeleton-text flex-1"></div>
                                <div class="skeleton-text flex-1"></div>
                                <div class="skeleton-text flex-1"></div>
                            </div>
                        `).join('')}
                    </div>
                `;
                break;
        }
        
        container.innerHTML = skeletonHTML;
    }

    removeLoadingSkeleton(container) {
        if (container) {
            const skeletons = container.querySelectorAll('.animate-pulse');
            skeletons.forEach(skeleton => skeleton.remove());
        }
    }
}