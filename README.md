# Smart Inventory Management System

A comprehensive solution for businesses to manage inventory, track sales, and analyze data. This system provides an intuitive interface for product management, customer tracking, and sales reporting.

## Features

- 📦 Product inventory management with stock tracking
- 🛒 Cart functionality for creating orders
- 🧾 Invoice generation and printing
- 👥 Customer management system
- 📊 Analytics and reporting dashboard
- 👤 User authentication and management
- 📱 Responsive UI for all device sizes

## Tech Stack

### Frontend
- React.js
- Redux for state management
- Ant Design for UI components
- Recharts for data visualization
- React Router for navigation

### Backend
- Node.js
- Express.js
- MongoDB for database
- Mongoose for ODM

## Screenshots

*Screenshots will go here*

## Installation

Follow these steps to set up the project on your local machine:

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas connection)

### Setup

1. Clone the repository
```bash
git clone https://github.com/25hency/Inventory-Management-System.git
cd smart-inventory-management-system
```

2. Install dependencies for server
```bash
npm install
```

3. Install dependencies for client
```bash
cd client
npm install
cd ..
```

4. Create a `.env` file in the root directory with the following variables:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

5. Run the application
```bash
# Run both frontend and backend
npm run dev

# Run backend only
npm run server

# Run frontend only
npm run client
```

## Project Structure

```
smart-inventory-management-system/
├── client/                 # React frontend
│   ├── public/             # Static files
│   └── src/                # Source files
│       ├── components/     # React components
│       ├── pages/          # Page components
│       ├── redux/          # Redux store
│       └── assets/         # Images and other assets
├── controllers/            # API controllers
├── models/                 # Mongoose models
├── routes/                 # API routes
├── middleware/             # Custom middleware
├── utils/                  # Utility functions
└── tests/                  # Test files
```

## API Endpoints

### Products API
- `GET /api/products/getproducts` - Get all products
- `POST /api/products/addproducts` - Add new product
- `PUT /api/products/updateproducts` - Update product
- `POST /api/products/deleteproducts` - Delete product
- `POST /api/products/seeds` - Seed initial products

### Users API
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration

### Bills API
- `GET /api/bills/getbills` - Get all bills
- `POST /api/bills/addbills` - Create new bill

### Customers API
- `GET /api/customers/get-customers` - Get all customers
- `GET /api/customers/get-customers-by-number` - Find customer by phone number
- `POST /api/customers/add-customers` - Add new customer
- `PUT /api/customers/update-customers` - Update customer
- `POST /api/customers/delete-customers` - Delete customer

### Analytics API
- `GET /api/analytics/inventory-analytics` - Get inventory analytics

## Testing

The application includes E2E tests using Jest and Selenium WebDriver.

To run tests:
```bash
npm test
```

To run E2E tests:
```bash
npm run test:e2e
```

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
