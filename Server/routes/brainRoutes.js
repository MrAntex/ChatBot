const express = require('express');
const brainController = require('../controllers/brainController');

const router = express.Router();

router.post('/add-brain', brainController.brain_add);

module.exports = router;
