const axios = require('axios');
require('dotenv').config();

const uzumApiClient = axios.create({
  baseURL: process.env.UZUM_API_BASE_URL,
  headers: {
    'Authorization': process.env.UZUM_API_TOKEN,
    'Content-Type': 'application/json'
  }
});

/**
 * Fetch SKU stocks from Uzum API
 */
async function getStocks() {
  try {
    const response = await uzumApiClient.get('/v2/fbs/sku/stocks');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching stocks:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || { message: 'Failed to fetch stocks' }
    };
  }
}

/**
 * Update SKU stock amounts
 * @param {Array} skuAmountList - Array of complete stock objects from Uzum API
 */
async function updateStocks(skuAmountList) {
  try {
    // Uzum API expects the complete stock objects in skuAmountList format
    const response = await uzumApiClient.post('/v2/fbs/sku/stocks', { skuAmountList });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error updating stocks:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || { message: 'Failed to update stocks' }
    };
  }
}

/**
 * Fetch FBS order details by order ID
 * @param {string} orderId - The order ID to fetch
 */
async function getOrderById(orderId) {
  try {
    const response = await uzumApiClient.get(`/v1/fbs/order/${orderId}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching order:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data || { message: 'Failed to fetch order details' }
    };
  }
}

module.exports = {
  getStocks,
  updateStocks,
  getOrderById
};
