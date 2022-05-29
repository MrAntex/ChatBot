const express = require('express');
const botController = require('../controllers/botController');

const router = express.Router();
router.post('/message', botController.send_message);
router.post('/brain',botController.set_Brain);

module.exports = router;


// botReply('Hello');
