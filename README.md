# BM Agency – Uzum Market Integration

Full-stack application integrating with Uzum Market OpenAPI for managing product stock information and inspecting FBS order details.

## 🏗️ Project Structure

```
BM agency/
├── backend/              # Node.js/Express API server
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   ├── services/    # Uzum API integration
│   │   └── app.js       # Express configuration
│   ├── .env             # Environment variables
│   └── package.json
│
└── frontend-vue/        # Vue 3 + Vite frontend
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── views/       # Page components
    │   ├── services/    # API client
    │   ├── router/      # Vue Router config
    │   └── App.vue
    └── package.json
```

## ✨ Features

### Stocks Dashboard
- View all SKU stock information
- Search/filter by SKU ID, title, or barcode
- Update stock amounts with validation
- Real-time success/error notifications

### Order Inspector
- Fetch order details by Order ID
- Display order status, items, and dates
- Formatted pricing and quantities
- Error handling for invalid orders

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

The API will run on `http://localhost:3000`

**API Endpoints:**
- `GET /api/stocks` - Fetch all stocks
- `POST /api/stocks/update` - Update stock amounts
- `GET /api/order/:orderId` - Get order details

### 2. Vue Frontend Setup

```bash
cd frontend-vue
npm install
npm run dev
```

The app will run on `http://localhost:5173`

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
UZUM_API_TOKEN=Write uzum api token
UZUM_API_BASE_URL=https://api-seller.uzum.uz/api/seller-openapi
PORT=3000
```

### Frontend Configuration

The frontend is configured to connect to `http://localhost:3000` by default. If you change the backend port, update `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:YOUR_PORT/api';
```

## 📋 Requirements

- Node.js 16+ and npm
- Modern web browser

## 🧪 Testing

### Test Backend API

1. Start the backend server
2. Test endpoints using curl or Postman:

```bash
# Get stocks
curl http://localhost:3000/api/stocks

# Update stock
curl -X POST http://localhost:3000/api/stocks/update \
  -H "Content-Type: application/json" \
  -d '{"stocks":[{"skuId":12345,"amount":100}]}'

# Get order
curl http://localhost:3000/api/order/YOUR_ORDER_ID
```

### Test Frontend

1. Start both backend and frontend servers
2. Navigate to `http://localhost:5173`
3. Test stocks dashboard:
   - Search for stocks
   - Click "Update" on any stock
   - Change amount and submit
4. Test order inspector:
   - Enter an order ID
   - Click "Fetch Order"
   - View order details

## 📦 Tech Stack

**Backend:**
- Node.js & Express
- Axios for HTTP requests
- express-validator for validation
- dotenv for environment config

**Frontend:**
- Vue 3 (Composition API)
- Vue Router
- Axios
- Vite for build tooling

## 🎨 UI Features

- Modern gradient design
- Responsive layout
- Loading states and spinners
- Toast notifications
- Modal dialogs
- Smooth animations
- Color-coded stock levels
- Formatted dates and prices

## 📝 API Integration

The application integrates with Uzum Market OpenAPI:
- **Base URL:** `https://api-seller.uzum.uz/api/seller-openapi`
- **Authentication:** Token-based (configured in `.env`)
- **Documentation:** [Uzum OpenAPI Docs](https://api-seller.uzum.uz/api/seller-openapi/swagger/swagger-ui/webjars/swagger-ui/index.html#/DBS)

## 🛡️ Error Handling

- Input validation on both frontend and backend
- User-friendly error messages
- Toast notifications for success/failure
- Graceful handling of API errors
- Loading states during requests

## 📄 License

ISC

---

**Developed for BM Agency Full-Stack Developer Test**
