import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import TransactionsTable from './components/TransactionsTable/TransactionsTable';
import Statistics from './components/Statistics/Statistics';
import BarChart from './components/BarChart/BarChart';
import PieChart from './components/PieChart/PieChart';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [selectedMonth, setSelectedMonth] = useState('march');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const initializeDatabase = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/initialize-database`);
      console.log('Database initialized:', response.data);
      alert('Database initialized successfully!');
    } catch (err) {
      console.error('Error initializing database:', err);
      setError('Failed to initialize database. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if database needs initialization
    const checkDatabase = async () => {
      try {
        // Try to fetch transactions to see if DB is initialized
        await axios.get(`${API_BASE_URL}/transactions?month=${selectedMonth}&page=1&perPage=1`);
      } catch (err) {
        if (err.response && err.response.status === 500) {
          // Database might need initialization
          if (window.confirm('Database appears to be empty. Would you like to initialize it?')) {
            initializeDatabase();
          }
        }
      }
    };
    
    checkDatabase();
    // eslint-disable-next-line
  }, []);

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Transaction Dashboard</h1>
        <button onClick={initializeDatabase} disabled={isLoading}>
          {isLoading ? 'Initializing...' : 'Initialize Database'}
        </button>
        {error && <div className="error-message">{error}</div>}
      </header>

      <main className="dashboard-container">
        <div className="month-selector">
          <label htmlFor="month-select">Select Month: </label>
          <select 
            id="month-select" 
            value={selectedMonth} 
            onChange={(e) => handleMonthChange(e.target.value)}
          >
            <option value="january">January</option>
            <option value="february">February</option>
            <option value="march">March</option>
            <option value="april">April</option>
            <option value="may">May</option>
            <option value="june">June</option>
            <option value="july">July</option>
            <option value="august">August</option>
            <option value="september">September</option>
            <option value="october">October</option>
            <option value="november">November</option>
            <option value="december">December</option>
          </select>
        </div>

        <TransactionsTable 
          apiBaseUrl={API_BASE_URL} 
          selectedMonth={selectedMonth} 
        />
        
        <Statistics 
          apiBaseUrl={API_BASE_URL} 
          selectedMonth={selectedMonth} 
        />
        
        <BarChart 
          apiBaseUrl={API_BASE_URL} 
          selectedMonth={selectedMonth} 
        />
        
        <PieChart 
          apiBaseUrl={API_BASE_URL} 
          selectedMonth={selectedMonth} 
        />
      </main>
    </div>
  );
}

export default App;