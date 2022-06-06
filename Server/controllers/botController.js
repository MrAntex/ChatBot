const Bot = require('../models/botModel');
require('dotenv').config()

const port = process.env.PORT;

// Display the view to create a bot
const bot_create = (req, res) => {
    res.render('./admin/create', { title: 'Create a new bot', subtitle: '' });
}

// Add a new bot to the database then redirect to the admin home page
const bot_add = (req, res) => {
    const bot = new Bot(req.body);
    bot.save()
        .then((result) => {
            res.redirect('/bots');
        })
        .catch((err) => {
            console.log(`Error ${err} thrown... stack is : ${err.stack}`);
            res.status(400).send('BAD REQUEST');
        })
}

// Display the view to the admin home page
const bot_index = (req, res) => {
    Bot.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('./admin/adminHome', { bots: result, title: 'All bots', subtitle: 'Admin home page', port: port });
        })
        .catch(err => {
            console.log(err);
        });
}

// Display the view to the bot details of the selected bot
const bot_details = (req, res) => {
    Bot.findById(req.params.id)
        .then(result => {
            res.render('./admin/details', { bot: result, title: 'Bot Details', subtitle: '' });
        })
        .catch(err => {
            console.log(err);
            res.render('./404/404', { title: 'Bot not found', subtitle: '' });
        });
}

// Delete the selected bot from the database then redirect to the admin home page
const bot_delete = (req, res) => {
    const id = req.params.id;
    Bot.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/bots' });
        })
        .catch(err => {
            console.log(err);
        });
}

// Display the view to edit the selected bot
const bot_edit_window = (req, res) => {
    Bot.findById(req.params.id)
        .then(result => {
            res.render('./admin/edit', { bot: result, title: 'Bot Editing', subtitle: '' });
        })
}

// Update the selected bot in the database then redirect to the admin home page
const bot_edit = (req, res) => {
    const update = req.body;
    let doc = Bot.findByIdAndUpdate(req.params.id, update)
        .then((result) => {
            res.redirect('/bots');
        })
        .catch((err) => {
            console.log(`Error ${err} thrown... stack is : ${err.stack}`);
            res.status(400).send('BAD REQUEST');
        })
}

module.exports = {
    bot_create,
    bot_index,
    bot_details,
    bot_add,
    bot_delete,
    bot_edit_window,
    bot_edit
}
