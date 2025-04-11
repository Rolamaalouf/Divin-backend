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
  guest_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  user_id: { 
    type: DataTypes.INTEGER, 
    allowNull: true 
  }
}, {
  sequelize,
  modelName: 'Cart',
  tableName: 'Carts',
  timestamps: true,
});

module.exports = Cart;
