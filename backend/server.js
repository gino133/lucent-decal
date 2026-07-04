require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { seedAdmin } = require('./controllers/authController');

const app = express();

// Kết nối DB
connectDB();

// Seed admin user
seedAdmin();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Lucent Glass API is running!',
    version: '1.0.0',
    endpoints: {
      pages: '/api/pages',
      products: '/api/products',
      projects: '/api/projects',
      menu: '/api/menu',
      settings: '/api/settings',
      auth: '/api/auth/login'
    }
  });
});

// Health check (tùy chọn)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// Routes
app.use('/api/pages', require('./routes/pages'));
app.use('/api/products', require('./routes/products'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/projects', require('./routes/projects'));
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
