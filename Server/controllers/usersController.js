const Bot = require('../models/botModel');
const spawn = require('child_process').spawn;
const http = require('http');
const fs = require('fs');

// Display the user home page
const bot_index = (req, res) => {
    var liste = fs.readdirSync('./Server/brains');
    var brains = [];
    liste.forEach(elt => {
        brains.push(elt.split(".")[0]);
    })
    Bot.find().sort({ createdAt: -1 })
        .then(result => {
            res.render('./users/usersHome', { bots: result, title: 'All bots', subtitle: 'User home page', brains: brains });
        })
        .catch(err => {
            console.log(err);
        });
}

// Start a bot server if it is not already up
const users_start = (req, res) => { 
    Bot.findById(req.params.id)
        .then(result => {
            http.get(`http://localhost:${result.port}`, () => { // Check if the page is already up
                res.redirect(`http://localhost:${result.port}`);
            }).on('error', (e) => {
                let doc = Bot.findByIdAndUpdate(req.params.id, {status:true}).then(() => { // set the status of the bot to Online

                    const proc = spawn('node', ['./Bots/app.js', `${result.port}`], { detached: true });
                    
                    proc.stdout.on('data', (data) => {
                        console.log(`stdout: ${data}`);
                    });
                    
                    proc.stderr.on('data', (data) => {
                        console.error(`stderr: ${data}`);
                    });
                    
                    proc.on('close', (code) => {
                        console.log(`child process exited with code ${code}`);
                    });
                    setTimeout (function(){
                        res.redirect(`http://localhost:${result.port}`);
                    }, 1000); 
                })
            })
        });
};


module.exports = {
    bot_index,
    users_start
}
