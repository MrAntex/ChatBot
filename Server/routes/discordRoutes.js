const express = require('express');
const discordController = require('../controllers/discordController');

const router = express.Router();

router.post('/start/:id',discordController.discord_start);

module.exports = router;
