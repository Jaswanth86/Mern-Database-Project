import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TransactionsTable.css';

const TransactionsTable = ({ apiBaseUrl, selectedMonth }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line
  }, [selectedMonth, pagination.page, searchText]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiBaseUrl}/transactions`, {
        params: {
          month: selectedMonth,
          search: searchText,
          page: pagination.page,
          perPage: pagination.perPage
        }
      });
      
      setTransactions(response.data.transactions);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages
      }));
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on new search
  };

  const clearSearch = () => {
    setSearchText('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="transactions-table-container">
      <h2>Transactions Table</h2>
      
      <div className="table-controls">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search transaction" 
            value={searchText}
            onChange={handleSearchChange}
          />
          {searchText && (
            <button onClick={clearSearch} className="clear-search">×</button>
          )}
        </div>
      </div>
      
      {loading ? (
        <div className="loading">Loading transactions...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Sold</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map(transaction => (
                    <tr key={transaction.id}>
                      <td>{transaction.id}</td>
                      <td>{transaction.title}</td>
                      <td className="description-cell">{transaction.description.substring(0, 50)}...</td>
                      <td>${transaction.price.toFixed(2)}</td>
                      <td>{transaction.category}</td>
                      <td>{transaction.sold ? 'Yes' : 'No'}</td>
                      <td>{formatDate(transaction.dateOfSale)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">No transactions found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="pagination-controls">
            <span>Page No: {pagination.page} / {pagination.totalPages}</span>
            <div className="pagination-buttons">
              <button 
                onClick={handlePrevPage} 
                disabled={pagination.page <= 1}
              >
                Previous
              </button>
              <button 
                onClick={handleNextPage} 
                disabled={pagination.page >= pagination.totalPages}
              >
                Next
              </button>
            </div>
            <span>Per Page: {pagination.perPage}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionsTable;