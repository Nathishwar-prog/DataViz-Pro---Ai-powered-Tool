# DataViz Pro 📊✨ (Pilot Program)

**Tagline:** *From Raw Data to Intelligent Insights, Instantly.*

[![Status](https://img.shields.io/badge/status-pilot%20program-orange)](https://github.com/Nathishwar-prog/DataViz-Pro-AI-Software)
[![Version](https://img.shields.io/badge/version-v0.5.0--beta-blue)](https://github.com/Nathishwar-prog/DataViz-Pro-AI-Software)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/Nathishwar-prog/DataViz-Pro-AI-Software/blob/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

DataViz Pro is a powerful, open-source analytics platform designed to transform your raw data into stunning interactive visualizations and actionable insights. This tool is currently in a **pilot program**, and we are actively seeking contributors to help test, improve, and shape its future.

Go beyond manual exploration—choose between standard analysis for quick insights or leverage our AI-powered engine to ask complex questions, identify errors in your data, and discover opportunities for improvement.

---

### 🖼️ Application Preview

![DataViz Pro Workflow](https://i.imgur.com/9vYmG9d.gif)
*An overview of the DataViz Pro workflow: Import Data → Choose Analysis → View Insights.*

---

### ✨ Key Features

DataViz Pro is packed with features to make data analysis intuitive and powerful.

#### 📥 Data Input Methods
* **File Upload:** Directly upload your data using common file formats like CSV, Excel, and JSON by dragging and dropping or browsing your files.
* **Link Format:** Connect directly to live data sources by providing a public Google Sheets link.

#### 🔬 Analysis Modes
Choose the analysis method that best fits your needs.

* **Standard Analysis:**
    * Generates essential visualizations and statistical summaries from your dataset.
    * Provides a quick, high-level overview of your data's key metrics, category distributions, and correlations.
    * Ideal for straightforward reporting and monitoring.

* **AI-Powered Analysis:**
    * **Natural Language Query:** Ask questions in plain English (e.g., *"What are the total sales?"*) and get instant answers visualized.
    * **Data Quality Check:** The AI automatically scans your data to find errors, inconsistencies, and missing values, suggesting ways to clean and improve it.
    * **Deep Search & Filtering:** Perform intelligent searches within your dataset and filter by columns to quickly locate specific records or patterns.
    * **Requires Google AI API Key:** To use the advanced features, you'll need to provide your own Google AI Studio API key.

#### 📈 Core Visualization & Collaboration
* **Multiple Views:** Explore your data through different lenses:
    * **All Insights:** A comprehensive dashboard with key metrics and charts.
    * **Dashboard:** A customizable space for your most important visuals.
    * **Data Cards:** View individual records in a clean, card-based format.
    * **Data Table:** Interact with your raw data in a traditional table layout.
* **Rich Chart Library:** From essential bar and line graphs to advanced heatmaps and geo-plots.
* **Easy Export & Sharing:** Share your insights with a single click via secure links or export visualizations as high-resolution images (PNG, SVG).

---

### 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

#### Prerequisites

* Node.js (v18.x or later)
* npm / yarn
* Python (v3.9 or later)
* Git

#### Installation

1.  **Fork & Clone the repository:**
    * First, fork the repository on GitHub.
    * Then, clone your fork locally:
        ```sh
        git clone [https://github.com/Nathishwar-prog/DataViz-Pro-AI-Software.git](https://github.com/Nathishwar-prog/DataViz-Pro-AI-Software.git)
        cd DataViz-Pro-AI-Software
        ```

2.  **Install Frontend Dependencies:**
    ```sh
    cd frontend
    npm install
    ```

3.  **Install Backend Dependencies:**
    ```sh
    cd ../backend
    pip install -r requirements.txt
    ```

4.  **Configure Environment Variables:**
    Create a `.env` file in the `backend` directory and add your necessary API keys and database credentials.
    ```
    # .env
    DATABASE_URL="your_database_connection_string"
    GOOGLE_AI_API_KEY="your_google_ai_api_key"
    ```

5.  **Run the Application:**
    * Start the Backend Server: (from the `backend` directory)
        ```sh
        python app.py
        ```
    * Start the Frontend Development Server: (from the `frontend` directory)
        ```sh
        npm start
        ```

The application should now be running at `http://localhost:3000`.

---

### 🤝 Contributing

This is an open-source tool in its pilot phase, and we welcome your help! Contributions are what make the open-source community such an amazing place to learn, inspire, and create.

Feel free to **fork** the project, try it with your own data, and submit **pull requests** with bug fixes or feature suggestions. Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

### 📜 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Nathishwar-prog/DataViz-Pro-AI-Software/blob/main/LICENSE) file for details.

---

### 📧 Contact

Nathishwar-prog - [@Nathishwar-prog](https://github.com/Nathishwar-prog)

Project Link: [https://github.com/Nathishwar-prog/DataViz-Pro-AI-Software](https://github.com/Nathishwar-prog/DataViz-Pro-AI-Software)
