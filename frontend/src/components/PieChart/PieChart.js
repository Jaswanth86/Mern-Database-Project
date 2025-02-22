import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './PieChart.css';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const PieChart = ({ apiBaseUrl, selectedMonth }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPieChartData();
    // eslint-disable-next-line
  }, [selectedMonth]);

  const fetchPieChartData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiBaseUrl}/pie-chart`, {
        params: { month: selectedMonth }
      });
      setChartData(response.data);
    } catch (err) {
      console.error('Error fetching pie chart data:', err);
      setError('Failed to fetch pie chart data');
    } finally {
      setLoading(false);
    }
  };

  const formatMonth = (month) => {
    return month.charAt(0).toUpperCase() + month.slice(1);
  };

  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 137) % 360;
      colors.push(`hsla(${hue}, 70%, 60%, 0.8)`);
    }
    return colors;
  };

  const pieData = {
    labels: chartData.map(item => item.category),
    datasets: [
      {
        data: chartData.map(item => item.count),
        backgroundColor: generateColors(chartData.length),
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 15,
          padding: 15
        }
      },
      title: {
        display: true,
        text: `Category Distribution - ${formatMonth(selectedMonth)}`,
      },
    }
  };

  return (
    <div className="pie-chart-container">
      <h2>Category Distribution - {formatMonth(selectedMonth)}</h2>
      
      {loading ? (
        <div className="loading">Loading chart data...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="chart-wrapper">
          <Pie options={pieOptions} data={pieData} height={300} />
        </div>
      )}
    </div>
  );
};

export default PieChart;