// config/db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.SUPABASE_DB_URL, {
  dialect: 'postgres',
  logging: false, // Change to console.log for debugging
});

module.exports = sequelize;
