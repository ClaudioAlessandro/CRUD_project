require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 4000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
