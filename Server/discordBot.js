const Bot = require('./models/botModel');
const fs = require('fs');
const fetch = require("node-fetch");
const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
require('dotenv').config();

const port = process.env.PORT;

const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS);

const myPartials = ["MESSAGE", "CHANNEL", "REACTION"]

const client = new Client({ intents: myIntents, partials: myPartials });

const prefix = '!';

const numberToWords = {
    0: '0️⃣',
    1: '1️⃣',
    2: '2️⃣',
    3: '3️⃣',
    4: '4️⃣',
    5: '5️⃣',
    6: '6️⃣',
    7: '7️⃣',
    8: '8️⃣',
    9: '9️⃣',
};

const emojiToNumber = {
    '0️⃣': 0,
    '1️⃣': 1,
    '2️⃣': 2,
    '3️⃣': 3,
    '4️⃣': 4,
    '5️⃣': 5,
    '6️⃣': 6,
    '7️⃣': 7,
    '8️⃣': 8,
    '9️⃣': 9,
};

const bot_selected = {
    name: '',
    id: '',
    brain: '',
    port: ''
};

client.once('ready', () => {
    console.log("Discord Bot is online !");
})

client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) {
        sendMessage(message);
    };
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'start') {
        message.reply("Select a bot");
        start(message);
    }

    if (command === 'info') {
        message.channel.send("Name : " + bot_selected.name);
        message.channel.send("id : " + bot_selected.id);
        message.channel.send("port : " + bot_selected.port);
        message.channel.send("Brain : " + bot_selected.brain);
    }
    if (command === 'reset') {
        clear(message);
        help(message);
    }

    if (command === "brains") {
        var liste = fs.readdirSync('./Server/brains');
        var brains = [];
        liste.forEach(elt => {
            brains.push(elt.split(".")[0]);
        })
        const list = brains.map((item, i) => `${i + 1}. ${item}`).join("\r\n")
        message.channel.send(list);
    }

    if (command === 'bots') {
        var listeBot = [];
        Bot.find().sort({ createdAt: -1 })
            .then(result => {
                result.forEach(bot => {
                    listeBot.push(bot.name);
                })
                const list = listeBot.map((item, i) => `${i + 1}. ${item}`).join("\r\n");
                message.channel.send(list);
            })
    }
    if (command === 'test') {
        console.log(args);
    }

    if (command === 'select') {
        var liste = fs.readdirSync('./Server/brains');
        var brains = [];
        liste.forEach(elt => {
            brains.push(elt.split(".")[0]);
        })
        setBrain(brains[Number(args[0])-1]);
        message.channel.send(`My brain is now : ${brains[Number(args[0])-1]}`)
    }
})

async function sendMessage(message) {
    let myURL = `http://localhost:${bot_selected.port}/message`;
    console.log("message content : " + message.content);
    const myBody = JSON.stringify({
        message: message.content
    })

    await fetch(myURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: myBody,
        mode: 'cors',
        cache: 'default'
    })
        .then(response => response.text())
        .then((result) => {
            message.reply(`${bot_selected.name} : ` + result);
        })
        .catch((err) => {
            console.log(`ERROR : ${err}`);
        })
}


function start(message) {
    const setupBot = new MessageEmbed()
        .setColor('#777')
        .setTitle('Bot setting panel')
        .setURL(`http://localhost:${port}`)
        .setAuthor({ name: `${message.author.tag} wants to chat !` })
        .setDescription('Please select the bot you want to chat with')
        .setThumbnail(message.author.avatarURL())
        .setTimestamp()

    var listeBot = [];
    var index = 0;
    Bot.find().sort({ createdAt: -1 })
        .then(result => {
            result.forEach(bot => {
                listeBot.push(bot.name);
                setupBot.addFields({ name: bot.name, value: numberToWords[index] });
                index += 1;
            })
            const msg = message.channel.send({ embeds: [setupBot] })
                .then(embedMessage => {
                    for (let i = 0; i < listeBot.length; i++) {
                        embedMessage.react(numberToWords[i]);
                    }
                    const filter = (reaction, user) => user.id === message.author.id;
                    const collector1 = embedMessage.createReactionCollector({
                        filter,
                        time: 60 * 1000
                    });

                    collector1.on("collect", async (reaction, user) => {
                        const emoji = reaction._emoji.name;
                        bot_selected.name = listeBot[emojiToNumber[emoji]];
                        collector1.stop();
                        updateEmbed(message, embedMessage);
                    })
                });
        })
}
function updateEmbed(message, embedMessage) {
    const setupBrain = new MessageEmbed()
        .setColor('#777')
        .setTitle('Bot setting panel')
        .setURL(`http://localhost:${port}`)
        .setAuthor({ name: `${message.author.tag} wants to chat !` })
        .setDescription(`Please select the brain of ${bot_selected.name}`)
        .setThumbnail(message.author.avatarURL())
        .setTimestamp();
    embedMessage.reactions.removeAll();
    var liste = fs.readdirSync('./Server/brains');
    var brains = [];
    liste.forEach(elt => {
        brains.push(elt.split(".")[0]);
    });
    var index = 0;
    brains.forEach(brain => {
        setupBrain.addFields({ name: brain, value: numberToWords[index] });
        index += 1;
    })

    for (let i = 0; i < brains.length; i++) {
        embedMessage.react(numberToWords[i]);
    }
    embedMessage.edit({ embeds: [setupBrain] });

    const filter = (reaction, user) => user.id === message.author.id;
    const collector2 = embedMessage.createReactionCollector({
        filter,
        time: 1000 * 60
    });
    collector2.on("collect", async (reaction, user) => {
        const emoji = reaction._emoji.name;
        bot_selected.brain = brains[emojiToNumber[emoji]];
        collector2.stop();
        Bot.findOne({ 'name': bot_selected.name })
            .then(bot => {
                bot_selected.id = bot._id;
                bot_selected.port = bot.port;
            });
        startEmbed(message, embedMessage);
    })
}

function startEmbed(message, embedMessage) {
    const finalEmbed = new MessageEmbed()
        .setColor('#777')
        .setTitle('Bot setting panel')
        .setURL(`http://localhost:${port}`)
        .setAuthor({ name: `${message.author.tag} wants to chat !` })
        .setDescription(`You are about to chat with ${bot_selected.name} equipped with ${bot_selected.brain} brain`)
        .setThumbnail(message.author.avatarURL())
        .setTimestamp();
    embedMessage.reactions.removeAll();
    embedMessage.edit({ embeds: [finalEmbed] });

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('start_yes')
                .setLabel('Start')
                .setStyle('SUCCESS')
        )
        .addComponents(
            new MessageButton()
                .setCustomId('start_no')
                .setLabel('Reset')
                .setStyle('DANGER')
        );

    const filter = (btnInt) => btnInt.user.id === message.author.id;
    const collector3 = message.channel.createMessageComponentCollector({
        filter,
        max: 1,
        time: 1000 * 60
    })
    collector3.on('collect', async (btn) => {
        if (btn.customId === 'start_yes') {
            clear(message);
            help(message);
            await startBot();
        }
        if (btn.customId === 'start_no') {
            clear(message);
            help(message);
        }
    })
    message.reply({ content: 'Are you ready ?', components: [row] });
}

function clear(message) {
    message.channel.messages.fetch({ limit: 100 })
        .then((result) => {
            message.channel.bulkDelete(result);
        })
}


async function startBot() {
    let myURL = `http://localhost:${port}/discord/start/${bot_selected.id}`;
    await fetch(myURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        cache: 'default'
    });
}

async function setBrain(brain) {
    let myURL = `http://localhost:${bot_selected.port}/brain`;
    const myBody = JSON.stringify({
        brain: brain
    });
    await fetch(myURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: myBody,
        mode: 'cors',
        cache: 'default'
    })
}

function help(message) {
    message.channel.send("Welcome to our ChatBot service. Type !start to begin chatting and !reset to reset the service ! You can change the brain during the conversation. View the brains with !brains then select it with !select <number>")
}

client.login(process.env.discordToken);

