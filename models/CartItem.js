// models/CartItem.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Cart = require('./Cart');
const Product = require('./Product');

class CartItem extends Model {}

CartItem.init({
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  cart_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: Cart, key: 'id' }
  },
  product_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: Product, key: 'id' }
  },
  quantity: { 
    type: DataTypes.INTEGER, 
    defaultValue: 1 
  }
}, {
  sequelize,
  modelName: 'CartItem',
  tableName: 'CartItems',
  timestamps: true,
});

module.exports = CartItem;
