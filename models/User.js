// models/User.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class User extends Model {}

User.init({
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  name: { 
    type: DataTypes.STRING 
  },
  address: { 
    type: DataTypes.STRING 
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'Users',
  timestamps: true,
});

module.exports = User;
