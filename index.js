const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Raw body parser for webhooks (must be before express.json())
app.use('/api/webhook', express.raw({type: 'application/json'}));

// JSON body parser for other routes
app.use(express.json());

// Routes
const checkoutRoutes = require('./routes/create-checkout-session');
app.use('/api', checkoutRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Stripe webhook endpoint: http://localhost:${PORT}/api/webhook`);
});