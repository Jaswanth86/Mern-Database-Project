const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://jaswanth:Jashu@cluster0.n4usz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB Connected');
}).catch(err => {
  console.log('MongoDB Connection Error: ', err);
});

// Product Schema
const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  sold: Boolean,
  dateOfSale: Date
});

const Product = mongoose.model('Product', productSchema);

// Routes
app.get('/api/initialize-database', async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const products = response.data;
    
    await Product.deleteMany({});

    const formattedProducts = products.map(product => ({
      ...product,
      dateOfSale: new Date(product.dateOfSale)
    }));
    
    await Product.insertMany(formattedProducts);
    
    res.status(200).json({ message: 'Database initialized successfully', count: formattedProducts.length });
  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).json({ error: 'Failed to initialize database' });
  }
});

const getMonthFilter = (month) => {
  const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
  const monthIndex = monthNames.indexOf(month.toLowerCase());
  
  if (monthIndex === -1) {
    throw new Error('Invalid month name');
  }
  
  return {
    $expr: {
      $eq: [{ $month: "$dateOfSale" }, monthIndex + 1]
    }
  };
};

// API to list all transactions with search and pagination
app.get('/api/transactions', async (req, res) => {
  try {
    const { month, search = "", page = 1, perPage = 10 } = req.query;
    const skip = (page - 1) * perPage;
    
    let filter = getMonthFilter(month);
    
    if (search) {
      filter = {
        ...filter,
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { price: isNaN(parseFloat(search)) ? undefined : parseFloat(search) }
        ].filter(Boolean)
      };
    }
    
    // Get transactions with pagination
    const transactions = await Product.find(filter)
      .skip(skip)
      .limit(parseInt(perPage))
      .sort({ dateOfSale: -1 });
    
    // Get total count for pagination
    const totalCount = await Product.countDocuments(filter);
    
    res.status(200).json({
      transactions,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        perPage: parseInt(perPage),
        totalPages: Math.ceil(totalCount / perPage)
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// API for statistics
app.get('/api/statistics', async (req, res) => {
  try {
    const { month } = req.query;
    const filter = getMonthFilter(month);
    
    // Total sale amount
    const saleResult = await Product.aggregate([
      { $match: filter },
      { $group: {
        _id: null,
        totalSaleAmount: { $sum: "$price" },
        totalSoldItems: { $sum: { $cond: [{ $eq: ["$sold", true] }, 1, 0] } },
        totalNotSoldItems: { $sum: { $cond: [{ $eq: ["$sold", false] }, 1, 0] } }
      }}
    ]);
    
    const stats = saleResult.length > 0 ? {
      totalSaleAmount: parseFloat(saleResult[0].totalSaleAmount.toFixed(2)),
      totalSoldItems: saleResult[0].totalSoldItems,
      totalNotSoldItems: saleResult[0].totalNotSoldItems
    } : {
      totalSaleAmount: 0,
      totalSoldItems: 0,
      totalNotSoldItems: 0
    };
    
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// API for bar chart
app.get('/api/bar-chart', async (req, res) => {
  try {
    const { month } = req.query;
    const filter = getMonthFilter(month);
    
    const priceRanges = [
      { range: "0-100", min: 0, max: 100 },
      { range: "101-200", min: 101, max: 200 },
      { range: "201-300", min: 201, max: 300 },
      { range: "301-400", min: 301, max: 400 },
      { range: "401-500", min: 401, max: 500 },
      { range: "501-600", min: 501, max: 600 },
      { range: "601-700", min: 601, max: 700 },
      { range: "701-800", min: 701, max: 800 },
      { range: "801-900", min: 801, max: 900 },
      { range: "901-above", min: 901, max: Infinity }
    ];
    
    const barChartData = await Promise.all(
      priceRanges.map(async ({ range, min, max }) => {
        const count = await Product.countDocuments({
          ...filter,
          price: { $gte: min, $lt: max === Infinity ? Number.MAX_SAFE_INTEGER : max }
        });
        
        return { range, count };
      })
    );
    
    res.status(200).json(barChartData);
  } catch (error) {
    console.error('Error fetching bar chart data:', error);
    res.status(500).json({ error: 'Failed to fetch bar chart data' });
  }
});

// API for pie chart
app.get('/api/pie-chart', async (req, res) => {
  try {
    const { month } = req.query;
    const filter = getMonthFilter(month);
    
    // Get unique categories and count of items
    const categoryData = await Product.aggregate([
      { $match: filter },
      { $group: {
        _id: "$category",
        count: { $sum: 1 }
      }},
      { $project: {
        _id: 0,
        category: "$_id",
        count: 1
      }}
    ]);
    
    res.status(200).json(categoryData);
  } catch (error) {
    console.error('Error fetching pie chart data:', error);
    res.status(500).json({ error: 'Failed to fetch pie chart data' });
  }
});

// Combined API
app.get('/api/combined-data', async (req, res) => {
  try {
    const { month } = req.query;
    
    // Fetch data from all three APIs
    const [statistics, barChart, pieChart] = await Promise.all([
      axios.get(`http://localhost:${PORT}/api/statistics?month=${month}`),
      axios.get(`http://localhost:${PORT}/api/bar-chart?month=${month}`),
      axios.get(`http://localhost:${PORT}/api/pie-chart?month=${month}`)
    ]);
    
    // Combine responses
    const combinedData = {
      statistics: statistics.data,
      barChart: barChart.data,
      pieChart: pieChart.data
    };
    
    res.status(200).json(combinedData);
  } catch (error) {
    console.error('Error fetching combined data:', error);
    res.status(500).json({ error: 'Failed to fetch combined data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});