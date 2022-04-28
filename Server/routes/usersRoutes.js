const express = require('express');
const usersController = require('../controllers/usersController');

const router = express.Router();

router.get('/',usersController.bot_index);
router.get('/start/:id&:brain',usersController.users_start);

module.exports = router;