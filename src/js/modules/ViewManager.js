export class ViewManager {
    constructor() {
        this.currentView = 'dashboard';
        this.views = document.querySelectorAll('.view-content');
        this.tabButtons = document.querySelectorAll('.tab-button');
    }

    init() {
        this.switchView('dashboard');
    }

    switchView(view) {
        this.currentView = view;
        
        // Hide all views
        this.views.forEach(v => v.classList.add('hidden'));
        
        // Show target view
        const targetView = document.getElementById(`${view}-view`);
        if (targetView) {
            targetView.classList.remove('hidden');
        }

        // Update tab buttons
        this.tabButtons.forEach(btn => {
            const isActive = btn.dataset.view === view;
            btn.classList.toggle('active', isActive);
            if (!isActive) {
                btn.classList.remove('text-white');
            }
        });

        // Trigger view change event
        window.dispatchEvent(new CustomEvent('viewChanged', { detail: { view } }));
    }

    getCurrentView() {
        return this.currentView;
    }

    isViewVisible(view) {
        const viewElement = document.getElementById(`${view}-view`);
        return viewElement && !viewElement.classList.contains('hidden');
    }

    showView(view) {
        const viewElement = document.getElementById(`${view}-view`);
        if (viewElement) {
            viewElement.classList.remove('hidden');
        }
    }

    hideView(view) {
        const viewElement = document.getElementById(`${view}-view`);
        if (viewElement) {
            viewElement.classList.add('hidden');
        }
    }
}