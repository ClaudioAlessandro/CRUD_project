const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/productController');

router.use(auth);
router.get('/', controller.list);
router.post('/', controller.create);
router.get('/:id', controller.get);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
