const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Category extends Model {}

Category.init({
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  }
}, {
  sequelize,
  modelName: 'Category',
  tableName: 'Categories',
  timestamps: true,
});

module.exports = Category;
