import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const stocksApi = {
    getStocks: async () => {
        const response = await apiClient.get('/stocks');
        return response.data;
    },

    updateStock: async (stockObject, newAmount) => {
        // Send the complete stock object with updated amount
        const updatedStock = { ...stockObject, amount: newAmount };
        const response = await apiClient.post('/stocks/update', {
            skuAmountList: [updatedStock]
        });
        return response.data;
    }
};

export const ordersApi = {
    getOrder: async (orderId) => {
        const response = await apiClient.get(`/order/${orderId}`);
        return response.data;
    }
};
