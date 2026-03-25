const express = require('express');
const { param, validationResult } = require('express-validator');
const { getOrderById } = require('../services/uzumApi');

const router = express.Router();

/**
 * GET /api/order/:orderId
 * Fetch FBS order details by order ID
 */
router.get('/:orderId', [
    param('orderId').notEmpty().withMessage('Order ID is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { orderId } = req.params;
    const result = await getOrderById(orderId);

    if (result.success) {
        res.json(result.data);
    } else {
        res.status(500).json(result.error);
    }
});

module.exports = router;
