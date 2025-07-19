export class DataBackend {
    async fetchDataFromSheet(url) {
        const csvUrl = this.convertToCsvUrl(url);
        if (!csvUrl) {
            throw new Error("Invalid Google Sheets URL format. Please use the full URL from your browser.");
        }
        
        const response = await fetch(csvUrl);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to fetch. Ensure the sheet is public ('Anyone with the link can view').`);
        }
        
        const csvText = await response.text();
        return this.parseCsv(csvText);
    }

    convertToCsvUrl(url) {
        const match = url.match(/https:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)\/edit.*?(?:#gid=([0-9]+))?/);
        if (match) {
            const sheetId = match[1];
            const gid = match[2] || '0';
            return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;
        }
        return null;
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

    analyzeData(data) {
        const headers = Object.keys(data[0]);
        const analysis = {
            totalRecords: data.length,
            columns: headers.length,
            numerical: [],
            categorical: [],
            datetime: [],
            headers: headers
        };

        headers.forEach(header => {
            const values = data.map(row => row[header]).filter(val => val && val.toString().trim());
            if (values.length === 0) return;

            const sampleValues = values.slice(0, Math.min(100, values.length));
            
            if (this.isDateColumn(sampleValues)) {
                analysis.datetime.push(header);
            } else if (this.isNumericColumn(sampleValues)) {
                const numericValues = values
                    .map(v => parseFloat(v.toString().replace(/[^0-9.-]+/g, "")))
                    .filter(v => !isNaN(v));
                
                if (numericValues.length > 0) {
                    analysis.numerical.push({
                        name: header,
                        values: numericValues,
                        min: Math.min(...numericValues),
                        max: Math.max(...numericValues),
                        avg: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
                        sum: numericValues.reduce((a, b) => a + b, 0)
                    });
                }
            } else {
                const uniqueValues = [...new Set(values)];
                analysis.categorical.push({
                    name: header,
                    uniqueCount: uniqueValues.length,
                    values: values,
                    distribution: uniqueValues.map(val => ({
                        value: val,
                        count: values.filter(v => v === val).length
                    })).sort((a, b) => b.count - a.count)
                });
            }
        });

        return analysis;
    }

    isNumericColumn(values) {
        let numericCount = 0;
        for (const v of values) {
            const cleaned = v.toString().replace(/[^0-9.-]+/g, "");
            if (!isNaN(parseFloat(cleaned)) && cleaned !== '') {
                numericCount++;
            }
        }
        return numericCount / values.length >= 0.7;
    }

    isDateColumn(values) {
        let dateCount = 0;
        for (const v of values) {
            const str = v.toString();
            if (!isNaN(Date.parse(str)) && str.length > 4) {
                dateCount++;
            }
        }
        return dateCount / values.length >= 0.6;
    }

    validateData(data) {
        if (!Array.isArray(data)) {
            throw new Error('Data must be an array');
        }
        
        if (data.length === 0) {
            throw new Error('Data array is empty');
        }
        
        if (typeof data[0] !== 'object') {
            throw new Error('Data must be an array of objects');
        }
        
        return true;
    }

    cleanData(data) {
        return data.map(row => {
            const cleanRow = {};
            Object.keys(row).forEach(key => {
                const value = row[key];
                if (value === null || value === undefined) {
                    cleanRow[key] = '';
                } else {
                    cleanRow[key] = value.toString().trim();
                }
            });
            return cleanRow;
        }).filter(row => {
            // Remove rows where all values are empty
            return Object.values(row).some(val => val !== '');
        });
    }
}