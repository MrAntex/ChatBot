const express = require('express');
const botController = require('../controllers/botController');

const router = express.Router();
router.post('/message', botController.send_message);

module.exports = router;


// botReply('Hello');
