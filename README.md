# DataViz Pro 📊✨ (Pilot Program)
[![Go Live](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://datavizprotool.netlify.app/)

**Tagline:** *From Raw Data to Intelligent Insights, Instantly.*

[![Status](https://img.shields.io/badge/status-pilot%20program-orange)](https://github.com/Nathishwar-prog/DataViz-Pro-AI-Software)
[![Version](https://img.shields.io/badge/version-v0.5.0--beta-blue)](https://github.com/Nathishwar-prog/DataViz-Pro-AI-Software)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/Nathishwar-prog/DataViz-Pro-AI-Software/blob/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

DataViz Pro is a powerful, open-source analytics platform designed to transform your raw data into stunning interactive visualizations and actionable insights. This tool is currently in a **pilot program**, and we are actively seeking contributors to help test, improve, and shape its future.

Go beyond manual exploration—choose between standard analysis for quick insights or leverage our AI-powered engine to ask complex questions, identify errors in your data, and discover opportunities for improvement.

---

### 🖼️ How It Works

Here is a quick overview of the application workflow from start to finish.

**Step 1: Import Your Data**
Begin by uploading a CSV file or pasting a link to a public Google Sheet on the main interface.

![Main Interface](https://raw.githubusercontent.com/Nathishwar-prog/DataViz-Pro-AI-Software/main/Preview-software/Main-interface.png)

**Step 2: Choose Your Analysis Type**
Select between a quick "Standard Analysis" or the more powerful "AI-Powered Analysis" which requires a Google AI API key.

![Choose Analysis Type](https://raw.githubusercontent.com/Nathishwar-prog/DataViz-Pro-AI-Software/main/Preview-software/Analysis%20request.png)

**Step 3: Interact with the AI**
If you choose the AI mode, you can ask questions about your data in plain English to get specific insights.

![AI Chat Interface](https://raw.githubusercontent.com/Nathishwar-prog/DataViz-Pro-AI-Software/main/Preview-software/Ai-chat.png)

**Step 4: View Your Dashboard**
The application generates a comprehensive dashboard with key metrics, category distributions, and other visualizations based on your data.

![Dashboard View](https://raw.githubusercontent.com/Nathishwar-prog/DataViz-Pro-AI-Software/main/Preview-software/Dashboard.png)

---

### ✨ Key Features

DataViz Pro is packed with features to make data analysis intuitive and powerful.

#### 📥 Data Input Methods
* **File Upload:** Directly upload your data using common file formats like CSV, Excel, and JSON by dragging and dropping or browsing your files.
* **Link Format:** Connect directly to live data sources by providing a public Google Sheets link.

#### 🔬 Analysis Modes
* **Standard Analysis:** Generates essential visualizations and statistical summaries from your dataset.
* **AI-Powered Analysis:** Use natural language queries, check data quality, and perform deep searches. **Requires a Google AI API key.**

#### 📈 Core Visualization & Collaboration
* **Multiple Views:** Explore your data through a comprehensive dashboard, individual data cards, or a raw data table.
* **Rich Chart Library:** From essential bar and line graphs to advanced heatmaps and geo-plots.
* **Easy Export & Sharing:** Share your insights with a single click via secure links or export visualizations as high-resolution images.
* **Clear Instructions:** A simple "Getting Started" guide is available in the app to help you.
  ![Instructions](https://raw.githubusercontent.com/Nathishwar-prog/DataViz-Pro-AI-Software/main/Preview-software/Instruction.png)


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
