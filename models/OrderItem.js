const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class OrderItem extends Model {}

OrderItem.init({
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  order_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  product_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
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
