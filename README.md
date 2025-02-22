# Transaction Dashboard - MERN Stack Application

## Overview
A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application that displays and analyzes transaction data. The application features a transaction listing with search capabilities, statistical analysis, and data visualization through charts.

## Features
- 📊 Transaction listing with search and pagination
- 📈 Monthly statistics dashboard
- 📊 Price range distribution bar chart
- 🥧 Category distribution pie chart
- 📅 Month-wise data filtering
- 🔍 Real-time search functionality
- 📱 Responsive design

## Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn package manager

## Project Structure
```
mern-transaction-dashboard/
├── backend/
│   ├── server.js
│   └── package.json
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── components/
    │       ├── TransactionsTable.js
    │       ├── TransactionsTable.css
    │       ├── Statistics.js
    │       ├── Statistics.css
    │       ├── BarChart.js
    │       ├── BarChart.css
    │       ├── PieChart.js
    │       └── PieChart.css
    └── package.json
```

## Installation

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory and add your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://jaswanth:<password>@cluster0.n4usz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

## API Endpoints

### Database Initialization
- `GET /api/initialize-database`
  - Fetches data from third-party API and initializes the database

### Transactions
- `GET /api/transactions`
  - Query Parameters:
    - `month`: Month name (January to December)
    - `search`: Search text for filtering transactions
    - `page`: Page number (default: 1)
    - `perPage`: Items per page (default: 10)

### Statistics
- `GET /api/statistics`
  - Query Parameters:
    - `month`: Month name (January to December)
  - Returns total sale amount, sold items, and not sold items

### Charts
- `GET /api/bar-chart`
  - Returns price range distribution data
- `GET /api/pie-chart`
  - Returns category distribution data

### Combined Data
- `GET /api/combined-data`
  - Returns combined statistics, bar chart, and pie chart data

## Environment Variables

### Backend
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

### Frontend
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Key Features Implementation

### Transaction Search
- Real-time search across title, description, and price
- Automatically updates results as you type
- Maintains current month filter while searching

### Month-based Filtering
- Filters all data based on selected month
- Works across transactions, statistics, and charts
- Default month set to March

### Pagination
- Server-side pagination for optimal performance
- Configurable items per page
- Previous/Next navigation

### Data Visualization
- Bar chart showing price range distribution
- Pie chart displaying category distribution
- Real-time updates when month changes

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Technical Choices

### Backend
- **Express.js**: For robust API development
- **Mongoose**: For MongoDB object modeling
- **Cors**: For handling Cross-Origin Resource Sharing
- **Axios**: For making HTTP requests

### Frontend
- **React**: For building the user interface
- **Chart.js & react-chartjs-2**: For data visualization
- **Axios**: For API calls
- **CSS Modules**: For component-scoped styling

## Error Handling
- Backend validation for all API endpoints
- Frontend loading states and error messages
- Graceful fallbacks for missing data
- Network error handling

## Performance Considerations
- Server-side pagination
- Optimized MongoDB queries
- Efficient state management
- Responsive image handling
- Debounced search implementation

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Known Issues
- None reported yet

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Author
Jaswanth

## Acknowledgments
- Chart.js for visualization libraries
- MongoDB Atlas for database hosting
- React community for component libraries
