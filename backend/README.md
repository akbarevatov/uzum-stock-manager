# Backend API

Node.js/Express server that proxies requests to Uzum Market OpenAPI.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with:
```env
UZUM_API_TOKEN=Write uzum api token
UZUM_API_BASE_URL=https://api-seller.uzum.uz/api/seller-openapi
PORT=3000
```

3. Run development server:
```bash
npm run dev
```

4. Run production server:
```bash
npm start
```

## API Routes

### GET /api/stocks
Fetch all SKU stocks from Uzum API.

**Response:**
```json
{
  "result": [
    {
      "skuId": 123,
      "title": "Product Name",
      "barcode": "1234567890",
      "amount": 50
    }
  ]
}
```

### POST /api/stocks/update
Update stock amounts for one or more SKUs.

**Request Body:**
```json
{
  "stocks": [
    {
      "skuId": 123,
      "amount": 100
    }
  ]
}
```

**Validation:**
- `stocks` must be a non-empty array
- `skuId` must be a number
- `amount` must be a non-negative integer

### GET /api/order/:orderId
Fetch FBS order details by order ID.

**Example:**
```
GET /api/order/ORD123456
```

**Response:**
```json
{
  "orderId": "ORD123456",
  "status": "pending",
  "items": [...],
  "createdAt": "2024-01-01T10:00:00Z"
}
```

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `400` - Bad Request (validation errors)
- `500` - Server Error (Uzum API errors)

Error responses include details:
```json
{
  "error": "Error message",
  "message": "Detailed description"
}
```

## Project Structure

```
backend/
├── src/
│   ├── routes/
│   │   ├── stocks.js     # Stock routes
│   │   └── orders.js     # Order routes
│   ├── services/
│   │   └── uzumApi.js    # Uzum API client
│   └── app.js            # Express app
├── .env                  # Environment variables
├── .gitignore
└── package.json
```

## Dependencies

- **express** - Web framework
- **axios** - HTTP client
- **dotenv** - Environment variables
- **cors** - CORS middleware
- **express-validator** - Request validation
- **nodemon** (dev) - Auto-restart on changes
