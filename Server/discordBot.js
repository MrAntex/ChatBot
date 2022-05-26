const Bot = require('./models/botModel');
const fs = require('fs');
const fetch = require("node-fetch");
const { Client, Intents, MessageEmbed } = require('discord.js');
require('dotenv').config();

const port = process.env.PORT;

const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS);
const client = new Client({ intents: myIntents });

const prefix = '!';

const numberToWords = {
    0: '\:zero:',
    1: '\:one:',
    2: '\:two:',
    3: '\:three:',
    4: '\:four:',
    5: '\:five:',
    6: '\:six:',
    7: '\:seven:',
    8: '\:eight:',
    9: '\:nine:',
};

const bot_selected = {
    name: '',
    port: '',
    brain: ''
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

    if (command === 'test') {
        const setupBot = new MessageEmbed()
            .setColor('#777')
            .setTitle('Bot setting panel')
            .setURL(`http://localhost:${port}`)
            .setAuthor({ name: `${message.author.tag} wants to chat !`})
            .setDescription('Please select the bot you want to chat with')
            .setThumbnail(message.author.avatarURL())
             // .setImage('https://i.imgur.com/AfFp7pu.png')
            .setTimestamp()
            // .setFooter({ text: '', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
        var listeBot = [];
        var index = 0;
        Bot.find().sort({ createdAt: -1 })
            .then(result => {
                result.forEach(bot => {
                    listeBot.push(bot.name);
                    setupBot.addFields({ name: bot.name, value:numberToWords[index]});
                    index +=1;
                })
                message.channel.send({ embeds: [setupBot] })
                .then(embedMessage => {
                    for (let i = 0; i < listeBot.length; i++) {
                        message.channel.send(numberToWords[i]);
                        console.log(numberToWords[i]);
                        embedMessage.react(numberToWords[i]);
                    }
                });
            })
    }

    if (command === 'reset') {
        message.channel.messages.fetch({ limit: 100 })
            .then((result) => {
                message.channel.bulkDelete(result);
            })

    }

    if (command === 'start') {
        message.reply("Select a bot");
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
})

async function sendMessage(message) {
    // let myURL = `http://localhost:${botPort}/message`;
    let myURL = `http://localhost:3010/message`;
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
            message.reply(result);
        })
        .catch((err) => {
            console.log(`ERROR : ${err}`);
        })
}


client.login(process.env.discordToken);

