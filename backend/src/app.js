const express = require('express');
const cors = require('cors');
require('dotenv').config();

const stocksRouter = require('./routes/stocks');
const ordersRouter = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/stocks', stocksRouter);
app.use('/api/order', ordersRouter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'BM Agency Backend API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API endpoints:`);
    console.log(`   GET  http://localhost:${PORT}/api/stocks`);
    console.log(`   POST http://localhost:${PORT}/api/stocks/update`);
    console.log(`   GET  http://localhost:${PORT}/api/order/:orderId`);
});

module.exports = app;
