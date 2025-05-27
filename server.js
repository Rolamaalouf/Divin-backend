require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./models');

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const cartItemRoutes = require('./routes/cartItemRoutes');
const orderRoutes = require('./routes/orderRoutes');
const orderItemRoutes = require('./routes/orderItemRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const cartTransferRoutes = require('./routes/cartTransferRoutes');

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://divin-frontend.vercel.app',
  'http://127.0.0.1:3000',
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log('Incoming request origin:', origin);
    // Allow requests with no origin (like Postman, curl, or mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

// Use CORS middleware
app.use(cors(corsOptions));

// Explicitly enable pre-flight OPTIONS requests for all routes
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Routes mounting
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/cart-items', cartItemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order-items', orderItemRoutes);
app.use('/api/wishlists', wishlistRoutes);
app.use('/api/cart-transfer', cartTransferRoutes);

// Sync database and start server
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database connected and synchronized.');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error('Database sync error:', error);
  });
