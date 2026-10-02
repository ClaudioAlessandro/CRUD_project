const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite')
});

const User = require('./user')(sequelize, DataTypes);
const Product = require('./product')(sequelize, DataTypes);

User.hasMany(Product, { as: 'products', foreignKey: 'userId' });
Product.belongsTo(User, { as: 'user', foreignKey: 'userId' });

module.exports = { sequelize, User, Product };
