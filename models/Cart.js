// models/Cart.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Cart extends Model {}

Cart.init({
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  user_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  }
}, {
  sequelize,
  modelName: 'Cart',
  tableName: 'Carts',
  timestamps: true,
});

module.exports = Cart;
