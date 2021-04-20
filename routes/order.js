const express = require('express');
const controller = require('../controllers/order');
const router = express.Router();
const passport = require('passport');

const auth = () => passport.authenticate('jwt', { session: false });

router.get('/', controller.getAll);
router.post('/', controller.create);

module.exports = router;
