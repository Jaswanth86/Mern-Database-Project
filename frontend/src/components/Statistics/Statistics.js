import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Statistics.css';

const Statistics = ({ apiBaseUrl, selectedMonth }) => {
  const [statistics, setStatistics] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatistics();
    // eslint-disable-next-line
  }, [selectedMonth]);
// eslint-disable-next-line
  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiBaseUrl}/statistics`, {
        params: { month: selectedMonth }
      });
      setStatistics(response.data);
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatMonth = (month) => {
    return month.charAt(0).toUpperCase() + month.slice(1);
  };

  return (
    <div className="statistics-container">
      <h2>Statistics - {formatMonth(selectedMonth)}</h2>
      
      {loading ? (
        <div className="loading">Loading statistics...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="stats-grid">
          <div className="stat-box">
            <h3>Total Sales</h3>
            <p>${statistics.totalSaleAmount.toLocaleString()}</p>
          </div>
          
          <div className="stat-box">
            <h3>Total Sold Items</h3>
            <p>{statistics.totalSoldItems}</p>
          </div>
          
          <div className="stat-box">
            <h3>Total Not Sold Items</h3>
            <p>{statistics.totalNotSoldItems}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;