import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './BarChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ apiBaseUrl, selectedMonth }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBarChartData();
    // eslint-disable-next-line
  }, [selectedMonth]);

  const fetchBarChartData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiBaseUrl}/bar-chart`, {
        params: { month: selectedMonth }
      });
      setChartData(response.data);
    } catch (err) {
      console.error('Error fetching bar chart data:', err);
      setError('Failed to fetch bar chart data');
    } finally {
      setLoading(false);
    }
  };

  const formatMonth = (month) => {
    return month.charAt(0).toUpperCase() + month.slice(1);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Price Range Distribution - ${formatMonth(selectedMonth)}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Items'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Price Range'
        }
      }
    }
  };

  const barData = {
    labels: chartData.map(item => item.range),
    datasets: [
      {
        label: 'Number of Items',
        data: chartData.map(item => item.count),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bar-chart-container">
      <h2>Bar Chart - {formatMonth(selectedMonth)}</h2>
      
      {loading ? (
        <div className="loading">Loading chart data...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="chart-wrapper">
          <Bar options={chartOptions} data={barData} height={300} />
        </div>
      )}
    </div>
  );
};

export default BarChart;