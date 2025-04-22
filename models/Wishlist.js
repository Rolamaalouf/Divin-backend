// models/Wishlist.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Product = require('./Product');

class Wishlist extends Model {}

Wishlist.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Product, key: 'id' }
  }
}, {
  sequelize,
  modelName: 'Wishlist',
  tableName: 'Wishlists',
  timestamps: true,
});

module.exports = Wishlist;
