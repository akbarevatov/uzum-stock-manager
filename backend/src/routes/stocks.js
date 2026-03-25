const express = require('express');
const { body, validationResult } = require('express-validator');
const { getStocks, updateStocks } = require('../services/uzumApi');

const router = express.Router();

/**
 * GET /api/stocks
 * Fetch all SKU stocks
 */
router.get('/', async (req, res) => {
    const result = await getStocks();

    if (result.success) {
        res.json(result.data);
    } else {
        res.status(500).json(result.error);
    }
});

/**
 * POST /api/stocks/update
 * Update SKU stock amounts
 * Body: { skuAmountList: [complete stock objects with updated amounts] }
 */
router.post('/update', [
    body('skuAmountList').isArray({ min: 1 }).withMessage('skuAmountList must be a non-empty array'),
    body('skuAmountList.*.skuId').isNumeric().withMessage('SKU ID must be a number'),
    body('skuAmountList.*.amount').isInt({ min: 0 }).withMessage('Amount must be a non-negative integer')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { skuAmountList } = req.body;
    const result = await updateStocks(skuAmountList);

    if (result.success) {
        res.json(result.data);
    } else {
        res.status(500).json(result.error);
    }
});

module.exports = router;
