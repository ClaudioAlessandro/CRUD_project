const { Product } = require('../models');

const list = async (req, res) => {
  const products = await Product.findAll({ where: { userId: req.user.id } });
  res.json(products);
};

const create = async (req, res) => {
  const { name, price, qrcode } = req.body;
  if (!name || price == null) return res.status(400).json({ message: 'Missing fields' });
  const p = await Product.create({ name, price, qrcode, userId: req.user.id });
  res.json(p);
};

const get = async (req, res) => {
  const p = await Product.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!p) return res.status(404).json({ message: 'Not found' });
  res.json(p);
};

const update = async (req, res) => {
  const p = await Product.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!p) return res.status(404).json({ message: 'Not found' });
  const { name, price, qrcode } = req.body;
  await p.update({ name, price, qrcode });
  res.json(p);
};

const remove = async (req, res) => {
  const p = await Product.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!p) return res.status(404).json({ message: 'Not found' });
  await p.destroy();
  res.json({ success: true });
};

module.exports = { list, create, get, update, remove };
