const express = require('express');
const usersController = require('../controllers/botController');

const router = express.Router();

/*
router.get('/', usersController.bot_index);
router.get('/start/:id',usersController.users_start);
router.post('/add-users', usersController.users_add);
router.get('/:id', usersController.users_details);
router.delete('/:id', usersController.users_delete);
*/
module.exports = router;