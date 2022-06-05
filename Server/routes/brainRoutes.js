const express = require('express');
const brainController = require('../controllers/brainController');

const router = express.Router();

router.post('/refresh', brainController.brain_refresh);
module.exports = router;
