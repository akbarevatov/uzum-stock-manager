# Vue Frontend

Modern Vue 3 application built with Vite for managing Uzum Market stocks and orders.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Features

### Stocks Dashboard (`/stocks`)
- **View Stocks:** Display all SKU inventory in a table
- **Search:** Filter by SKU ID, title, or barcode
- **Update Stock:** Click "Update" to modify stock amounts
- **Notifications:** Success/error toasts for user feedback
- **Color-Coded Amounts:**
  - 🟢 Green: Stock > 10
  - 🟡 Yellow: Stock < 10
  - 🔴 Red: Stock = 0

### Order Inspector (`/order`)
- **Fetch Orders:** Enter order ID to retrieve details
- **Order Information:** Status, dates, ID
- **Item Details:** SKU, product name, quantity, price
- **Total Amount:** Highlighted total price
- **Formatted Data:** Human-readable dates and currency

## Project Structure

```
frontend-vue/
├── src/
│   ├── components/
│   │   ├── UpdateStockModal.vue    # Stock update dialog
│   │   └── ToastNotification.vue   # Toast messages
│   ├── views/
│   │   ├── StocksDashboard.vue     # Stocks page
│   │   └── OrderInspector.vue      # Orders page
│   ├── services/
│   │   └── api.js                  # API client
│   ├── router/
│   │   └── index.js                # Vue Router config
│   ├── App.vue                     # Root component
│   └── main.js                     # App entry point
└── package.json
```

## Configuration

The API base URL is set in `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

Change this if your backend runs on a different port.

## Technologies

- **Vue 3** - Progressive JavaScript framework
- **Vue Router** - Official routing library
- **Vite** - Next-generation build tool
- **Axios** - Promise-based HTTP client
- **Composition API** - Modern Vue syntax

## UI/UX Features

- ✨ Modern gradient design
- 📱 Fully responsive
- 🎨 Smooth animations
- 🔔 Toast notifications
- 🎭 Modal dialogs
- ⚡ Fast loading states
- 🎯 Intuitive navigation

## Component Details

### UpdateStockModal
Modal component for updating stock amounts:
- Displays current stock info
- Input validation (min: 0)
- Loading state during update
- Close on backdrop click

### ToastNotification
Auto-dismissing notifications:
- Success (green)
- Error (red)
- Info (blue)
- 3-second auto-hide
- Slide-in animation

### StocksDashboard
Main stocks page:
- Fetches stocks on mount
- Real-time search filtering
- Table with hover effects
- Update button per row

### OrderInspector
Order details page:
- Order ID input
- Enter key support
- Detailed order display
- Conditional rendering

## Styling

All styles are scoped component styles using modern CSS:
- CSS Grid for layouts
- Flexbox for alignment
- CSS animations
- Gradient backgrounds
- Custom color palette

## Development Tips

- Hot module replacement enabled
- Vue DevTools compatible
- Console errors for debugging
- Network tab for API calls
