const express = require('express');
const botController = require('../controllers/botController');

const router = express.Router();

router.get('/create',botController.bot_create);
router.get('/', botController.bot_index);
router.post('/add-bot', botController.bot_add);
router.get('/edit/:id',botController.bot_edit_window);
router.post('/edit/:id',botController.bot_edit);
router.get('/:id', botController.bot_details);
router.delete('/:id', botController.bot_delete);

module.exports = router;