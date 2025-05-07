// models/index.js
const sequelize = require('../config/db');

const User = require('./User');
const Category = require('./category');
const Product = require('./Product');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Wishlist = require('./Wishlist');

// User associations
// (For example: a User can have one Cart and many Orders and Wishlists)
User.hasOne(Cart, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Order, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
;

User.hasMany(Wishlist, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Wishlist.belongsTo(User, { foreignKey: 'user_id' });

// Cart and CartItem associations
Cart.hasMany(CartItem, { foreignKey: 'cart_id', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });


Order.hasMany(OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE', as: 'orderItems' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });


Product.hasMany(CartItem, { foreignKey: 'product_id', onDelete: 'CASCADE' });
CartItem.belongsTo(Product, { foreignKey: 'product_id' });

Product.hasMany(OrderItem, { foreignKey: 'product_id', onDelete: 'CASCADE' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

Product.hasMany(Wishlist, { foreignKey: 'product_id', onDelete: 'CASCADE' });
Wishlist.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });


module.exports = {
  sequelize,
  User,
  Category,
  Product,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Wishlist
};
