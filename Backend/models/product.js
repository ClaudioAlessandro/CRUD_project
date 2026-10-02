module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    qrcode: { type: DataTypes.STRING },
    userId: { type: DataTypes.INTEGER, allowNull: false }
  });
  return Product;
};
