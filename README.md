WooComm CRM
A Strategic Relationship Manager for WooCommerce Stores

Overview
WooComm CRM is a full-stack platform built to bridge the gap between e-commerce transactions and proactive customer management. Instead of just viewing a list of orders, this tool uses autonomous AI agents to interpret customer behavior and sentiment, allowing business owners to focus on high-priority relationships.

The project is styled with a professional Peach and Green theme, utilizing the Roboto Slab typeface to ensure long-term readability for dashboard-heavy workflows.

Core Features
Agentic AI Support Analyst
The heart of the application is a sentiment-aware AI agent. When a support note or customer message is entered, the agent does not just store the text; it analyzes the tone.

If frustration is detected, the agent autonomously flags the customer as At-Risk to ensure they receive priority support.

If a customer expresses high satisfaction, the agent upgrades them to VIP status to recognize their loyalty.

The logs are written in natural language, explaining the AI's reasoning rather than just providing system codes.

Strategic AI Insights
On the Reports page, a secondary AI agent acts as a business consultant. It scans the entire database—including total revenue, VIP counts, and at-risk accounts—to generate a human-like strategy report. This helps owners identify churn risks and growth opportunities without manually calculating metrics.

Order Management Pipeline
The CRM includes a dedicated fulfillment tracker. Administrators can manage the lifecycle of an order by transitioning it through three stages: Pending, Processing, and Completed. Each stage is visually color-coded for instant recognition on the dashboard.

Localized Financial Tracking
All financial data is formatted for the Indian market, displaying currency in Rupees (₹) and using the Indian numbering system for clear revenue tracking.

Technical Architecture
The project follows a modern MERN (MongoDB, Express, React, Node) architecture designed for scalability and real-time updates.

Frontend: React.js with Tailwind CSS v4.

Backend: Node.js and Express.js with a RESTful API structure.

Database: MongoDB via Mongoose for flexible customer and order schemas.

Data Visualization: Recharts for interactive Customer Lifetime Value (LTV) distribution.

Installation and Setup
Prerequisites
Node.js installed on your machine.

A local or cloud-based MongoDB instance.

Server Setup
Navigate to the server directory.

Run npm install to install dependencies.

Create a .env file and add your MONGO_URI.

Run node index.js to start the backend on Port 5000.

Client Setup
Navigate to the client directory.

Run npm install to install dependencies.

Run npm run dev to launch the frontend.

Project Structure
/client: Contains the React dashboard, routing logic, and themed UI components.

/server: Contains the API routes, AI logic, and MongoDB connection.

.gitignore: Configured to keep the repository clean by excluding dependency folders and environment variables.