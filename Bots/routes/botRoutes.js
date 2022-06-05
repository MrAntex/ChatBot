const express = require('express');
const botController = require('../controllers/botController');

const router = express.Router();
router.get('/',botController.home);
router.get('/test',botController.test);
router.post('/message', botController.send_message);
router.post('/brain',botController.set_Brain);

module.exports = router;


