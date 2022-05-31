const Bot = require('../models/botModel');

const bot_create = (req, res) => {
    // const port 
    res.render('./admin/create', { title: 'Create a new bot', subtitle: '' });
}

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
const bot_index = (req, res) => {
    Bot.find().sort({ createdAt: -1 })
        .then(result => {
            res.render('./admin/adminHome', { bots: result, title: 'All bots', subtitle: 'Admin home page' });
        })
        .catch(err => {
            console.log(err);
        });
}

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

const bot_edit_window = (req, res) => {
    Bot.findById(req.params.id)
        .then(result => {
            res.render('./admin/edit', { bot: result, title: 'Bot Editing', subtitle: '' });
        })
}

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
