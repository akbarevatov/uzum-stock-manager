<template>
  <div class="stocks-dashboard">
    <ToastNotification :toasts="toasts" />
    
    <div class="header">
      <h1>📦 Stocks Dashboard</h1>
      <p class="subtitle">Manage your SKU inventory</p>
    </div>

    <div class="search-bar">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search by SKU ID, title, or barcode..."
        class="search-input"
      />
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading stocks...</p>
    </div>

    <div v-else-if="error" class="error-message">
      <p>❌ {{ error }}</p>
      <button @click="fetchStocks" class="btn-retry">Retry</button>
    </div>

    <div v-else class="table-container">
      <table class="stocks-table">
        <thead>
          <tr>
            <th>№</th>
            <th>SKU ID</th>
            <th>SKU Title</th>
            <th>Product Title</th>
            <th>Barcode</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="group in groupedStocks" :key="group.key">
            <!-- Group Header -->
            <tr class="group-header" @click="toggleGroup(group.key)">
              <td colspan="7">
                <div class="group-title">
                  <span class="chevron" :class="{ expanded: expandedGroups.has(group.key) }">▶</span>
                  <span class="group-name">{{ group.key }}</span>
                  <span class="group-count">({{ group.items.length }} items)</span>
                </div>
              </td>
            </tr>
            
            <!-- Group Items -->
            <template v-if="expandedGroups.has(group.key)">
              <tr v-for="(stock, index) in group.items" :key="stock.skuId" class="stock-row">
                <td>{{ index + 1 }}</td>
                <td>{{ stock.skuId }}</td>
                <td>{{ stock.skuTitle }}</td>
                <td>{{ stock.productTitle }}</td>
                <td>{{ stock.barcode }}</td>
                <td>
                  <span class="amount-badge" :class="getAmountClass(stock.amount)">
                    {{ stock.amount }}
                  </span>
                </td>
                <td>
                  <button @click="openUpdateModal(stock)" class="btn-update">
                    Update
                  </button>
                </td>
              </tr>
            </template>
          </template>

          <tr v-if="groupedStocks.length === 0">
            <td colspan="7" class="no-data">No stocks found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <UpdateStockModal 
      v-if="showModal"
      :stock="selectedStock"
      :loading="updating"
      @close="closeModal"
      @update="handleUpdate"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { stocksApi } from '../services/api';
import UpdateStockModal from '../components/UpdateStockModal.vue';
import ToastNotification from '../components/ToastNotification.vue';

export default {
  name: 'StocksDashboard',
  components: {
    UpdateStockModal,
    ToastNotification
  },
  setup() {
    const stocks = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const searchQuery = ref('');
    const showModal = ref(false);
    const selectedStock = ref(null);
    const updating = ref(false);
    const toasts = ref([]);
    const expandedGroups = ref(new Set());

    const filteredStocks = computed(() => {
      if (!searchQuery.value) return stocks.value;
      
      const query = searchQuery.value.toLowerCase();
      return stocks.value.filter(stock => 
        stock.skuId?.toString().includes(query) ||
        stock.skuTitle?.toLowerCase().includes(query) ||
        stock.productTitle?.toLowerCase().includes(query) ||
        stock.barcode?.toLowerCase().includes(query)
      );
    });

    const groupedStocks = computed(() => {
      const groups = {};
      
      filteredStocks.value.forEach(stock => {
        // Get first 2 words/segments of SKU title
        // e.g. "GLTEX-TRIKO-ТЕМНСЕР-50" -> "GLTEX-TRIKO"
        const parts = (stock.skuTitle || '').split('-');
        const groupKey = parts.length >= 2 
          ? `${parts[0]}-${parts[1]}`
          : (stock.skuTitle || 'Other');
          
        if (!groups[groupKey]) {
          groups[groupKey] = [];
        }
        groups[groupKey].push(stock);
      });

      return Object.keys(groups).sort().map(key => ({
        key,
        items: groups[key]
      }));
    });

    const toggleGroup = (key) => {
      if (expandedGroups.value.has(key)) {
        expandedGroups.value.delete(key);
      } else {
        expandedGroups.value.add(key);
      }
    };

    const fetchStocks = async () => {
      loading.value = true;
      error.value = null;
      try {
        const data = await stocksApi.getStocks();
        stocks.value = data.payload.skuAmountList || [];
        
        // Expand all groups by default after loading
        const keys = new Set();
        stocks.value.forEach(stock => {
          const parts = (stock.skuTitle || '').split('-');
          const key = parts.length >= 2 ? `${parts[0]}-${parts[1]}` : (stock.skuTitle || 'Other');
          keys.add(key);
        });
        expandedGroups.value = keys;
        
      } catch (err) {
        const apiError = err.response?.data?.error || err.response?.data?.message;
        error.value = apiError || err.message || 'Failed to fetch stocks';
        showToast('error', error.value);
      } finally {
        loading.value = false;
      }
    };

    const openUpdateModal = (stock) => {
      selectedStock.value = stock;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      selectedStock.value = null;
    };

    const handleUpdate = async (newAmount) => {
      updating.value = true;
      try {
        await stocksApi.updateStock(selectedStock.value, newAmount);
        
        const index = stocks.value.findIndex(s => s.skuId === selectedStock.value.skuId);
        if (index !== -1) {
          stocks.value[index].amount = newAmount;
        }
        
        showToast('success', 'Stock updated successfully!');
        closeModal();
      } catch (err) {
        const apiError = err.response?.data?.error || err.response?.data?.message;
        const errorMsg = apiError || err.message || 'Failed to update stock';
        showToast('error', errorMsg);
      } finally {
        updating.value = false;
      }
    };

    const getAmountClass = (amount) => {
      if (amount === 0) return 'amount-zero';
      if (amount < 10) return 'amount-low';
      return 'amount-ok';
    };

    const showToast = (type, message) => {
      const id = Date.now();
      toasts.value.push({ id, type, message });
      setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== id);
      }, 3000);
    };

    onMounted(() => {
      fetchStocks();
    });

    return {
      stocks,
      loading,
      error,
      searchQuery,
      groupedStocks,
      expandedGroups,
      toggleGroup,
      showModal,
      selectedStock,
      updating,
      toasts,
      fetchStocks,
      openUpdateModal,
      closeModal,
      handleUpdate,
      getAmountClass
    };
  }
};
</script>

<style scoped>
.stocks-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.header {
  margin-bottom: 30px;
  text-align: center;
}

.header h1 {
  font-size: 2.5rem;
  color: #1f2937;
  margin-bottom: 8px;
  font-weight: 700;
}

.subtitle {
  color: #6b7280;
  font-size: 1.125rem;
}

.search-bar {
  margin-bottom: 30px;
}

.search-input {
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #7F4EFF;
  box-shadow: 0 0 0 3px rgba(127, 78, 255, 0.1);
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
  border-radius: 10px;
  color: #991b1b;
}

.btn-retry {
  margin-top: 16px;
  padding: 10px 24px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.btn-retry:hover {
  background: #dc2626;
}

.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.stocks-table {
  width: 100%;
  border-collapse: collapse;
}

.stocks-table thead {
  background: #7F4EFF;
  color: white;
}

.stocks-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.group-header {
  background: #f3f4f6;
  cursor: pointer;
  transition: background-color 0.2s;
}

.group-header:hover {
  background: #e5e7eb;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #1f2937;
}

.chevron {
  font-size: 0.8rem;
  transition: transform 0.2s;
  color: #6b7280;
}

.chevron.expanded {
  transform: rotate(90deg);
}

.group-name {
  font-size: 1rem;
}

.group-count {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 400;
}

.stock-row {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s;
}

.stock-row:hover {
  background: #f9fafb;
}

.stocks-table td {
  padding: 16px;
  color: #374151;
}

.amount-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
}

.amount-ok {
  background: #d1fae5;
  color: #065f46;
}

.amount-low {
  background: #fef3c7;
  color: #92400e;
}

.amount-zero {
  background: #fee2e2;
  color: #991b1b;
}

.btn-update {
  padding: 8px 16px;
  background: #7F4EFF;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn-update:hover {
  background: #6b3fd4;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(127, 78, 255, 0.2);
}

.no-data {
  text-align: center;
  color: #9ca3af;
  padding: 40px;
  font-style: italic;
}
</style>
