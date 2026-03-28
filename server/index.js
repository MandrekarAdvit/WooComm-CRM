const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 1. Middleware
app.use(cors());
app.use(express.json());

// 2. Database Connection
const mongoURI = 'mongodb://127.0.0.1:27017/wooCRM'; 
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Connected! System is live.'))
  .catch((err) => console.error('Connection Error:', err));

// 3. Schema & Model Definition 
const customerSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    totalSpent: Number,
    orderCount: Number,
    status: { type: String, default: 'Regular' },
    orderStatus: { type: String, default: 'Pending' }, // New Field
    notes: [String]
});

const Customer = mongoose.model('Customer', customerSchema);

// 4. Routes
app.get('/api/customers', async (req, res) => {
    const customers = await Customer.find().sort({ updatedAt: -1 });
    res.json(customers);
});

app.post('/api/webhooks/order', async (req, res) => {
    const data = req.body;
    const { billing, total, customer_id } = data;

    try {
        const customer = await Customer.findOneAndUpdate(
            { email: billing.email }, 
            { 
                $set: { 
                    firstName: billing.first_name,
                    lastName: billing.last_name,
                    wooId: customer_id
                },
                $inc: { 
                    totalSpent: parseFloat(total),
                    orderCount: 1 
                },
                lastOrderDate: new Date()
            },
            { upsert: true, new: true }
        );

        if (customer.totalSpent > 500) {
            customer.status = 'VIP';
            await customer.save();
        }

        console.log(`CRM Updated: ${customer.email} | Total: $${customer.totalSpent}`);
        res.status(200).send('Webhook processed');
    } catch (err) {
        console.error('Webhook Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

// 5. Start Server
const PORT = 5000;

app.get('/api/test-add', async (req, res) => {
    try {
        const randomId = Math.floor(Math.random() * 1000);
        const newCustomer = await Customer.create({
            firstName: "Advit",
            lastName: `User-${randomId}`,
            email: `test-${randomId}@gmail.com`,
            totalSpent: Math.floor(Math.random() * 1000), // Random spend
            status: 'Customer'
        });

        // Trigger VIP logic if they spend over 500
        if (newCustomer.totalSpent > 500) {
            newCustomer.status = 'VIP';
            await newCustomer.save();
        }

        res.send(`Success! Added ${newCustomer.firstName} to MongoDB. Status: ${newCustomer.status}`);
    } catch (err) {
        res.status(500).send("Error adding customer: " + err.message);
    }
});

// AI Sentiment Agent Route
app.post('/api/customers/:id/notes', async (req, res) => {
    try {
        const { note } = req.body;
        const customer = await Customer.findById(req.params.id);

        if (!customer) return res.status(404).send('Customer not found');

        // NLP Keyword Heuristics (Simulating an Agentic AI workflow)
        const lowerNote = note.toLowerCase();
        const negativeWords = ['angry', 'delayed', 'cancel', 'terrible', 'refund', 'broken', 'late', 'worst'];
        const positiveWords = ['amazing', 'love', 'great', 'awesome', 'recommend', 'perfect'];

        let aiActionTaken = "Analyzed: Neutral sentiment. Added to file.";

        // Agent Logic: Auto-demote At-Risk users
        if (negativeWords.some(word => lowerNote.includes(word))) {
            customer.status = 'At-Risk';
            aiActionTaken = "Negative sentiment detected.";
        }
        // Agent Logic: Auto-promote happy users
        else if (positiveWords.some(word => lowerNote.includes(word))) {
            customer.status = 'VIP';
            aiActionTaken = "Positive sentiment detected.";
        }

        // Save the note and the AI's action
        customer.notes.push(`[System: ${aiActionTaken}] Note: "${note}"`);
        await customer.save();

        res.json({ customer, aiActionTaken });
    } catch (err) {
        res.status(500).send("Error processing AI note: " + err.message);
    }
});

app.get('/api/reports/ai-insights', async (req, res) => {
    try {
        const customers = await Customer.find();
        const totalRev = customers.reduce((sum, c) => sum + c.totalSpent, 0);
        const vipCount = customers.filter(c => c.status === 'VIP').length;
        const atRiskCount = customers.filter(c => c.status === 'At-Risk').length;

        // Simulating an LLM data-analysis pipeline
        let insights = [];
        insights.push(`Data Processed: Analyzed ₹${totalRev} in lifetime value across ${customers.length} customer profiles.`);

        if (vipCount > 0) {
            insights.push(`Revenue Strategy: You have ${vipCount} VIP customers. AI recommends triggering an automated loyalty discount email to this segment to maximize Lifetime Value (LTV).`);
        } else {
            insights.push(`Growth Alert: No VIP customers detected. AI recommends lowering the VIP threshold or running a high-ticket promotion.`);
        }

        if (atRiskCount > 0) {
            insights.push(`Churn Warning: ${atRiskCount} customers are marked 'At-Risk'. AI Agent suggests initiating a 'win-back' email workflow with a 20% apology coupon.`);
        } else {
            insights.push(`Health Score: Customer sentiment is highly positive. 0 'At-Risk' profiles detected in the latest WooCommerce webhook syncs.`);
        }

        res.json({ insights });
    } catch (err) {
        res.status(500).send("Error generating report: " + err.message);
    }
});

app.patch('/api/customers/:id/order-status', async (req, res) => {
    try {
        const { orderStatus } = req.body;
        const customer = await Customer.findByIdAndUpdate(
            req.params.id, 
            { orderStatus }, 
            { new: true }
        );
        res.json(customer);
    } catch (err) {
        res.status(500).send("Error updating status: " + err.message);
    }
})

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));