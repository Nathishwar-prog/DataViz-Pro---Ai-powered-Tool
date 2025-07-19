export class FileManager {
    constructor() {
        this.onFileProcessed = null;
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
        this.allowedTypes = ['text/csv', 'application/vnd.ms-excel'];
    }

    init() {
        this.setupDropzone();
        this.setupFileInput();
    }

    setupDropzone() {
        const dropzone = document.getElementById('dropzone');
        const fileInput = document.getElementById('file-input');

        if (dropzone && fileInput) {
            dropzone.addEventListener('click', () => fileInput.click());
            
            dropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropzone.classList.add('dragover');
            });

            dropzone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                dropzone.classList.remove('dragover');
            });

            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropzone.classList.remove('dragover');
                
                const files = Array.from(e.dataTransfer.files);
                this.handleFiles(files);
            });
        }
    }

    setupFileInput() {
        const fileInput = document.getElementById('file-input');
        
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const files = Array.from(e.target.files);
                this.handleFiles(files);
            });
        }
    }

    async handleFiles(files) {
        const csvFiles = files.filter(file => this.isValidFile(file));
        
        if (csvFiles.length === 0) {
            this.showError('Please select valid CSV files.');
            return;
        }

        if (csvFiles.length > 1) {
            this.showError('Please select only one file at a time.');
            return;
        }

        try {
            const file = csvFiles[0];
            this.showLoading(`Processing ${file.name}...`);
            
            const data = await this.processFile(file);
            
            if (this.onFileProcessed) {
                this.onFileProcessed(data);
            }
            
            this.clearStatus();
        } catch (error) {
            this.showError(`Error processing file: ${error.message}`);
        }
    }

    isValidFile(file) {
        // Check file size
        if (file.size > this.maxFileSize) {
            this.showError(`File ${file.name} is too large. Maximum size is 10MB.`);
            return false;
        }

        // Check file type
        const fileName = file.name.toLowerCase();
        const isCSV = fileName.endsWith('.csv') || file.type === 'text/csv';
        
        if (!isCSV) {
            this.showError(`File ${file.name} is not a CSV file.`);
            return false;
        }

        return true;
    }

    async processFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const csvText = e.target.result;
                    const data = this.parseCsv(csvText);
                    
                    if (data.length === 0) {
                        reject(new Error('No data found in the file'));
                        return;
                    }
                    
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Error reading file'));
            };
            
            reader.readAsText(file);
        });
    }

    parseCsv(csvText) {
        const lines = csvText.trim().split('\n');
        if (lines.length < 2) return [];
        
        const headers = this.parseCSVLine(lines[0]);
        return lines.slice(1).map(line => {
            const values = this.parseCSVLine(line);
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = values[index] || '';
            });
            return obj;
        }).filter(row => Object.values(row).some(val => val && val.toString().trim()));
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result.map(val => val.replace(/^"|"$/g, ''));
    }

    showLoading(message) {
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
    }

    clearStatus() {
        const status = document.getElementById('status');
        if (status) {
            status.innerHTML = '';
        }
    }
}