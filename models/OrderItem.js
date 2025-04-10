// models/OrderItem.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Order = require('./Order');
const Product = require('./Product');

class OrderItem extends Model {}

OrderItem.init({
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  order_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: Order, key: 'id' }
  },
  product_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: Product, key: 'id' }
  },
  quantity: { 
    type: DataTypes.INTEGER, 
    defaultValue: 1 
  },
  price: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  }
}, {
  sequelize,
  modelName: 'OrderItem',
  tableName: 'OrderItems',
  timestamps: true,
});

module.exports = OrderItem;
