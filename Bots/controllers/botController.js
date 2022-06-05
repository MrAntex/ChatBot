const RiveScript = require('rivescript');
const Brain = require('../models/brainModel');

let bot = new RiveScript();
function botReady() {
    bot.sortReplies();
    console.log("rep sorted")
};
function botNotReady(err) {
    console.log('An error has occurred.', err);
};


const home = (req, res) => {
    Brain.find().then(result => {
        const port = Number(process.argv.slice(2));
        res.render('index', { port: port, brains: result });
    });
}

const send_message = async (req, res) => {
    const message = req.body.message;
    const answer = await bot.reply("", message);
    res.send(answer);
};

const set_Brain = (req, res) => {
    const brain = req.body.brain;
    const brainPath = './Server/brains/' + brain + '.rive';
    console.log(brain)
    bot.loadFile(brainPath)
        .then(botReady)
        .catch(botNotReady);
};

const test = (req, res) => {
    res.sendStatus(100);
    res.render('index');
}

module.exports = {
    send_message,
    set_Brain,
    home,
    test
}