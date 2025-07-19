export class AIManager {
    constructor() {
        this.apiKey = null;
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    }

    setApiKey(key) {
        this.apiKey = key;
    }

    async generateInsights(data, analysis) {
        if (!this.apiKey) {
            throw new Error("API Key is not set");
        }

        const prompt = this.createInsightsPrompt(data, analysis);
        const result = await this.callGemini(prompt);
        return this.formatInsightsResponse(result);
    }

    async processQuery(query, data, analysis) {
        if (!this.apiKey) {
            throw new Error("API Key is not set");
        }

        const prompt = this.createQueryPrompt(query, data, analysis);
        return await this.callGemini(prompt);
    }

    createInsightsPrompt(data, analysis) {
        const sampleData = data.slice(0, 100);
        const summary = {
            totalRecords: analysis.totalRecords,
            numerical: analysis.numerical.map(n => ({
                name: n.name,
                min: n.min,
                max: n.max,
                avg: n.avg
            })),
            categorical: analysis.categorical.map(c => ({
                name: c.name,
                uniqueCount: c.uniqueCount,
                topValues: c.distribution.slice(0, 5)
            })),
            datetime: analysis.datetime
        };

        return `Analyze this dataset and provide comprehensive insights in clean HTML format:

Dataset Summary:
- Total Records: ${summary.totalRecords}
- Numerical columns: ${summary.numerical.map(n => `${n.name} (min: ${n.min}, max: ${n.max}, avg: ${n.avg.toFixed(2)})`).join(', ')}
- Categorical columns: ${summary.categorical.map(c => `${c.name} (${c.uniqueCount} unique values)`).join(', ')}
- Date/Time columns: ${summary.datetime.join(', ')}

Sample Data (first 10 rows):
${JSON.stringify(sampleData.slice(0, 10), null, 2)}

Please provide:
1. Key trends and patterns
2. Notable correlations or relationships
3. Data quality observations
4. Actionable insights and recommendations

Format your response as clean HTML with proper headings (h3), paragraphs (p), and lists (ul/li). Use <strong> for emphasis.`;
    }

    createQueryPrompt(query, data, analysis) {
        const context = {
            totalRecords: analysis.totalRecords,
            columns: analysis.headers,
            numerical: analysis.numerical.map(n => n.name),
            categorical: analysis.categorical.map(c => c.name),
            sampleData: data.slice(0, 50)
        };

        return `You are a data analyst assistant. Answer the following question about the dataset:

Question: "${query}"

Dataset Context:
- Total Records: ${context.totalRecords}
- Columns: ${context.columns.join(', ')}
- Numerical columns: ${context.numerical.join(', ')}
- Categorical columns: ${context.categorical.join(', ')}

Sample Data:
${JSON.stringify(context.sampleData, null, 2)}

Provide a clear, concise answer. If calculations are needed, show your work. If the question cannot be answered with the available data, explain what additional information would be needed.`;
    }

    async callGemini(prompt) {
        if (!this.apiKey) {
            throw new Error("API Key is not set");
        }

        const apiUrl = `${this.baseUrl}?key=${this.apiKey}`;
        const payload = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (result.candidates && result.candidates.length > 0 && result.candidates[0].content.parts[0].text) {
                return result.candidates[0].content.parts[0].text;
            } else {
                throw new Error("Received an empty or invalid response from the AI service");
            }
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error("Network error: Unable to connect to AI service. Please check your internet connection.");
            }
            throw error;
        }
    }

    formatInsightsResponse(response) {
        // Clean up the response and ensure proper HTML formatting
        let formatted = response.trim();
        
        // Ensure proper paragraph tags
        if (!formatted.includes('<p>') && !formatted.includes('<h')) {
            formatted = formatted.split('\n\n').map(paragraph => 
                paragraph.trim() ? `<p>${paragraph.trim()}</p>` : ''
            ).filter(p => p).join('\n');
        }
        
        return formatted;
    }

    generateQuerySuggestions(analysis) {
        const suggestions = [];
        
        if (analysis.numerical.length > 0) {
            suggestions.push(`What is the average ${analysis.numerical[0].name}?`);
            suggestions.push(`Show me the distribution of ${analysis.numerical[0].name}`);
        }
        
        if (analysis.categorical.length > 0) {
            suggestions.push(`What are the most common ${analysis.categorical[0].name} values?`);
            suggestions.push(`How many unique ${analysis.categorical[0].name} are there?`);
        }
        
        if (analysis.datetime.length > 0) {
            suggestions.push(`What is the date range of this data?`);
            suggestions.push(`Show me trends over time`);
        }
        
        suggestions.push('Summarize the key insights from this data');
        suggestions.push('What patterns do you see in this dataset?');
        
        return suggestions;
    }

    isAvailable() {
        return this.apiKey !== null;
    }
}