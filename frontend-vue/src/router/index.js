import { createRouter, createWebHistory } from 'vue-router';
import StocksDashboard from '../views/StocksDashboard.vue';
import OrderInspector from '../views/OrderInspector.vue';

const routes = [
    {
        path: '/',
        redirect: '/stocks'
    },
    {
        path: '/stocks',
        name: 'Stocks',
        component: StocksDashboard
    },
    {
        path: '/order',
        name: 'Order',
        component: OrderInspector
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
