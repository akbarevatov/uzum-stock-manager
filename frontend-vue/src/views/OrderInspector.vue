<template>
  <div class="order-inspector">
    <ToastNotification :toasts="toasts" />
    
    <div class="header">
      <h1>🔍 Order Inspector</h1>
      <p class="subtitle">View FBS order details</p>
    </div>

    <div class="search-container">
      <div class="input-group">
        <input 
          type="text" 
          v-model="orderId" 
          placeholder="Enter Order ID"
          @keyup.enter="fetchOrder"
          class="order-input"
        />
        <button 
          @click="fetchOrder" 
          :disabled="!orderId || loading"
          class="btn-fetch"
        >
          {{ loading ? 'Fetching...' : 'Fetch Order' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading order...</p>
    </div>

    <div v-else-if="error" class="error-message">
      <p>❌ {{ error }}</p>
    </div>

    <div v-else-if="order" class="order-content">
      <!-- Order Header Card -->
      <div class="detail-card header-card">
        <div class="order-main-info">
          <div>
            <span class="label">Order ID</span>
            <h2 class="value">#{{ order.id }}</h2>
          </div>
          <div class="status-wrapper">
            <span class="label">Status</span>
            <span :class="['status-badge', getStatusClass(order.status)]">
              {{ order.status }}
            </span>
          </div>
          <div>
            <span class="label">Total Price</span>
            <h2 class="value price">{{ formatPrice(order.price) }}</h2>
          </div>
        </div>
      </div>

      <div class="grid-layout">
        <!-- Dates & Logistics Card -->
        <div class="detail-card">
          <h3 class="card-title">📅 Timeline & Logistics</h3>
          <div class="info-list">
            <div class="info-row">
              <span class="info-label">Created At:</span>
              <span class="info-value">{{ formatDate(order.dateCreated) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Accept Until:</span>
              <span class="info-value">{{ formatDate(order.acceptUntil) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Deliver Until:</span>
              <span class="info-value">{{ formatDate(order.deliverUntil) }}</span>
            </div>
            <div class="divider"></div>
            <div class="info-row">
              <span class="info-label">Scheme:</span>
              <span class="info-value badge">{{ order.scheme }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Place:</span>
              <span class="info-value">{{ order.place }}</span>
            </div>
          </div>
        </div>

        <!-- Stock/Warehouse Info Card -->
        <div class="detail-card" v-if="order.stock">
          <h3 class="card-title">🏭 Warehouse Info</h3>
          <div class="info-list">
            <div class="info-row">
              <span class="info-label">Title:</span>
              <span class="info-value">{{ order.stock.title }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Address:</span>
              <span class="info-value address">{{ order.stock.address }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Working Hours:</span>
              <span class="info-value">{{ order.stock.timeFrom }} - {{ order.stock.timeTo }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Pool Source:</span>
              <span class="info-value">{{ order.stock.poolSource }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Items Card -->
      <div class="detail-card full-width">
        <h3 class="card-title">📦 Order Items ({{ order.orderItems ? order.orderItems.length : 0 }})</h3>
        <div class="items-list">
          <div v-for="item in order.orderItems" :key="item.id" class="item-row">
            <div class="item-image">
              <img 
                :src="getItemImage(item)" 
                alt="Product Image" 
                @error="handleImageError"
              />
            </div>
            <div class="item-details">
              <h4 class="item-title">{{ item.title }}</h4>
              <p class="item-sku">{{ item.skuTitle }}</p>
              <div class="item-meta">
                <span class="meta-badge">Barcode: {{ item.barcode }}</span>
                <span class="meta-badge">ID: {{ item.id }}</span>
              </div>
            </div>
            <div class="item-pricing">
              <div class="qty-box">
                <span class="qty-label">Qty</span>
                <span class="qty-value">{{ item.amount }}</span>
              </div>
              <div class="price-box">
                <span class="item-total">{{ formatPrice(item.price) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">📦</div>
      <p>Enter an Order ID to view details</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { ordersApi } from '../services/api';
import ToastNotification from '../components/ToastNotification.vue';

export default {
  name: 'OrderInspector',
  components: {
    ToastNotification
  },
  setup() {
    const orderId = ref('');
    const order = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const toasts = ref([]);

    const fetchOrder = async () => {
      if (!orderId.value) {
        showToast('error', 'Please enter an Order ID');
        return;
      }

      loading.value = true;
      error.value = null;
      order.value = null;

      try {
        const data = await ordersApi.getOrder(orderId.value);
        // Handle potential nested payload structure if backend wraps it
        order.value = data.payload || data; 
        showToast('success', 'Order loaded successfully!');
      } catch (err) {
        const apiError = err.response?.data?.error || err.response?.data?.message;
        error.value = apiError || err.message || 'Failed to fetch order details';
        showToast('error', error.value);
      } finally {
        loading.value = false;
      }
    };

    const getStatusClass = (status) => {
      if (!status) return 'status-default';
      const s = status.toUpperCase();
      if (s === 'DELIVERED' || s === 'COMPLETED') return 'status-success';
      if (s === 'CREATED' || s === 'AWAITING_PACKAGING') return 'status-info';
      if (s === 'CANCELLED' || s === 'RETURNED') return 'status-error';
      return 'status-warning';
    };

    const formatDate = (timestamp) => {
      if (!timestamp) return 'N/A';
      return new Date(timestamp).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const formatPrice = (price) => {
      if (price === null || price === undefined) return 'N/A';
      return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS' }).format(price);
    };

    const getItemImage = (item) => {
      try {
        // Try to get 120px high quality image, fallback to others
        return item.photo?.photo?.['120']?.high || 
               item.photo?.photo?.['120']?.low || 
               'https://via.placeholder.com/120?text=No+Image';
      } catch (e) {
        return 'https://via.placeholder.com/120?text=No+Image';
      }
    };

    const handleImageError = (e) => {
      e.target.src = 'https://via.placeholder.com/120?text=No+Image';
    };

    const showToast = (type, message) => {
      const id = Date.now();
      toasts.value.push({ id, type, message });
      setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== id);
      }, 3000);
    };

    return {
      orderId,
      order,
      loading,
      error,
      toasts,
      fetchOrder,
      getStatusClass,
      formatDate,
      formatPrice,
      getItemImage,
      handleImageError
    };
  }
};
</script>

<style scoped>
.order-inspector {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Inter', sans-serif;
}

.header {
  margin-bottom: 30px;
  text-align: center;
}

.header h1 {
  font-size: 2.5rem;
  color: #1f2937;
  margin-bottom: 8px;
  font-weight: 800;
}

.subtitle {
  color: #6b7280;
  font-size: 1.125rem;
}

.search-container {
  margin-bottom: 40px;
}

.input-group {
  display: flex;
  gap: 12px;
  max-width: 600px;
  margin: 0 auto;
}

.order-input {
  flex: 1;
  padding: 14px 18px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s;
}

.order-input:focus {
  outline: none;
  border-color: #7F4EFF;
  box-shadow: 0 0 0 4px rgba(127, 78, 255, 0.1);
}

.btn-fetch {
  padding: 14px 30px;
  background: #7F4EFF;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-fetch:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(127, 78, 255, 0.25);
}

.btn-fetch:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e5e7eb;
  border-top-color: #7F4EFF;
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  text-align: center;
  padding: 40px;
  background: #fee2e2;
  border-radius: 12px;
  color: #991b1b;
  margin-bottom: 20px;
}

.order-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #f3f4f6;
}

.header-card {
  background: linear-gradient(to right, #ffffff, #f9fafb);
  border-left: 6px solid #7F4EFF;
}

.order-main-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.label {
  display: block;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 4px;
  font-weight: 500;
}

.value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.value.price {
  color: #7F4EFF;
}

.status-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-success { background: #d1fae5; color: #065f46; }
.status-info { background: #dbeafe; color: #1e40af; }
.status-warning { background: #fef3c7; color: #92400e; }
.status-error { background: #fee2e2; color: #991b1b; }
.status-default { background: #f3f4f6; color: #374151; }

.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.card-title {
  font-size: 1.125rem;
  color: #1f2937;
  margin-bottom: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 0.95rem;
}

.info-label {
  color: #6b7280;
  font-weight: 500;
  min-width: 100px;
}

.info-value {
  color: #1f2937;
  font-weight: 500;
  text-align: right;
}

.info-value.address {
  font-size: 0.875rem;
  max-width: 200px;
  line-height: 1.4;
}

.info-value.badge {
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}

.divider {
  height: 1px;
  background: #e5e7eb;
  margin: 8px 0;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.item-row {
  display: flex;
  gap: 20px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  align-items: center;
  transition: all 0.2s;
}

.item-row:hover {
  border-color: #7F4EFF;
  background: #f9fafb;
}

.item-image img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.item-details {
  flex: 1;
}

.item-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.item-sku {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 8px;
}

.item-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.meta-badge {
  font-size: 0.75rem;
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 4px;
  color: #4b5563;
}

.item-pricing {
  text-align: right;
  min-width: 100px;
}

.qty-box {
  margin-bottom: 8px;
}

.qty-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-right: 4px;
}

.qty-value {
  font-weight: 700;
  color: #111827;
}

.item-total {
  font-size: 1.125rem;
  font-weight: 700;
  color: #7F4EFF;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #9ca3af;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

@media (max-width: 640px) {
  .order-main-info {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .item-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .item-pricing {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #e5e7eb;
  }
}
</style>
