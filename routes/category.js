const express = require('express');
const controller = require('../controllers/category');
const router = express.Router();
const upload = require('../middleware/upload');
const passport = require('passport');

const auth = () => passport.authenticate('jwt', { session: false });

router.get('/', auth(), controller.getAll);
router.get('/:id', auth(), controller.getById);
router.delete('/:id', auth(), controller.remove);
router.post('/', auth(), upload.single('image'), controller.create);
router.patch('/:id', auth(), upload.single('image'), controller.update);

module.exports = router;
