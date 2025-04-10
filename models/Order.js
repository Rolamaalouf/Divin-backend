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
    allowNull: false 
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
