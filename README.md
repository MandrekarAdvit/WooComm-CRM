# WooComm CRM 
### A Strategic Relationship Manager for WooCommerce Stores

## Overview
WooComm CRM is a full-stack platform built to bridge the gap between e-commerce transactions and proactive customer management. Instead of just viewing a list of orders, this tool uses autonomous AI agents to interpret customer behavior and sentiment, allowing business owners to focus on high-priority relationships.

The project is styled with a professional **Peach and Green** theme, utilizing the **Roboto Slab** typeface to ensure long-term readability for dashboard-heavy workflows.

---

## Core Features

### Agentic AI Support Analyst
The heart of the application is a sentiment-aware AI agent. When a support note or customer message is entered, the agent does not just store the text; it analyzes the tone:

* **Automated Risk Detection**: If frustration is detected, the agent autonomously flags the customer as **At-Risk** to ensure they receive priority support.
* **Loyalty Recognition**: If a customer expresses high satisfaction, the agent upgrades them to **VIP** status to recognize their loyalty.
* **Humanized Logs**: The logs are written in natural language, explaining the AI's reasoning rather than just providing system codes.

### Strategic AI Insights
On the Reports page, a secondary AI agent acts as a business consultant. It scans the entire database—including total revenue, VIP counts, and at-risk accounts—to generate a human-like strategy report. This helps owners identify churn risks and growth opportunities without manually calculating metrics.

### Order Management Pipeline
The CRM includes a dedicated fulfillment tracker. Administrators can manage the lifecycle of an order by transitioning it through three stages: 
1. **Pending**
2. **Processing** 3. **Completed**

Each stage is visually color-coded for instant recognition on the dashboard.

---

## Technical Setup

### Prerequisites
* Node.js
* MongoDB (Local or Atlas)

### Installation
1. **Server**: Navigate to `/server`, run `npm install`, then `node index.js`.
2. **Client**: Navigate to `/client`, run `npm install`, then `npm run dev`.

### Structure
* `/client`: React frontend and dashboard logic.
* `/server`: Express backend and AI sentiment agents.