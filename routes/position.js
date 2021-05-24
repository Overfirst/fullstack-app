const express = require('express');
const controller = require('../controllers/position');
const router = express.Router();
const passport = require('passport');

const auth = () => passport.authenticate('jwt', { session: false });

router.get('/:categoryId', auth(), controller.getByCategoryId);
router.post('/', auth(), controller.create);
router.patch('/:id', auth(), controller.update);
router.delete('/:id', auth(), controller.remove);

module.exports = router;
