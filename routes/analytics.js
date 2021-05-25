const express = require('express');
const controller = require('../controllers/analytics');
const router = express.Router();
const passport = require('passport');

const auth = () => passport.authenticate('jwt', { session: false });

router.get('/overview', auth(), controller.overview);
router.get('/analytics', auth(), controller.analytics);

module.exports = router;
