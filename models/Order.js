const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Order extends Model {}

Order.init({
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },

  user_id: { 
    type: DataTypes.INTEGER, 
    allowNull: true // NULL for guest orders
  },

  guest_id: {
    type: DataTypes.UUID,
    allowNull: true, // NULL for logged-in users
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true, // Optional for logged-in users
  },

  email: {
    type: DataTypes.STRING,
    allowNull: true, // Optional for logged-in users
    validate: {
      isEmail: true
    }
  },
  promocode: {
    type: DataTypes.STRING,
    allowNull: true
  },

  shipping_fees: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0
  },

  address: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null
  },

  status: { 
    type: DataTypes.STRING,
    defaultValue: 'pending' 
  }

}, {
  sequelize,
  modelName: 'Order',
  tableName: 'Orders',
  timestamps: true,
});

module.exports = Order;
