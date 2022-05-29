const RiveScript = require('rivescript');

let bot = new RiveScript();

function botReady() {
    bot.sortReplies();
};
function botNotReady(err) {
    console.log('An error has occurred.', err);
};


const send_message = async (req, res) => {
    const message = req.body.message;
    console.log('message', message);
    console.log('message length', message.length);
    console.log('message type', typeof message);
    const answer = await bot.reply("", message);
    res.send(answer);
};

const set_Brain = (req,res) => {
    const brain = req.body.brain;
    const brainPath = './Server/brains/' + brain+ '.rive';
    bot.loadFile(brainPath)
    .then(botReady)
    .catch(botNotReady);
    res.send("It's ok");
};

module.exports = {
    send_message,
    set_Brain
}