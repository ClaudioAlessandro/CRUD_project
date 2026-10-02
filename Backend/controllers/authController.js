const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Missing fields' });
  const existing = await User.findOne({ where: { username } });
  if (existing) return res.status(400).json({ message: 'User exists' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, passwordHash });
  res.json({ id: user.id, username: user.username });
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Missing fields' });
  const user = await User.findOne({ where: { username } });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
  res.json({ token });
};

module.exports = { register, login };
