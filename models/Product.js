// models/Product.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');
const Category = require('./category');

class Product extends Model {}

Product.init({
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  description: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
  price: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  },
  category_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: Category, key: 'id' } // explicit foreign key
  },
  stock: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    defaultValue: 0 
  },
  image: { 
    type: DataTypes.JSON, 
    allowNull: true 
  }
}, {
  sequelize,
  modelName: 'Product',
  tableName: 'Products',
  timestamps: true,
});

// Association: One Category has many Products.
Category.hasMany(Product, { foreignKey: 'category_id', onDelete: 'CASCADE' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = Product;
