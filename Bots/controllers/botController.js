const RiveScript = require('rivescript');

let bot = new RiveScript();
const brains = [
    // 'https://gist.githubusercontent.com/awesammcoder/91e0f6c527bfdc03b8815289ca4af150/raw/6410ce00b7e1ea0dbd28be03b6eaab64252a841d/brain.rive'
    './Server/brains/Jim.rive'
];
function botReady() {
    bot.sortReplies();
}
function botNotReady(err) {
    console.log('An error has occurred.', err);
}

bot.loadFile(brains).then(botReady).catch(botNotReady);

const send_message = async (req, res) => {
    const message = req.body.message;
    console.log('message', message);
    console.log('message length', message.length);
    console.log('message type', typeof message);
    const answer = await bot.reply("",message);
    console.log('answer', answer);
    res.send(answer);
}

module.exports = {
    send_message
}