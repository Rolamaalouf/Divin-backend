
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.SUPABASE_DB_URL, {
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;
