// This file is specialy made for the discord bot. Since every request made to 
// the website needs the authentification, discord needs its own route.

const Bot = require('../models/botModel');
const spawn = require('child_process').spawn;
const http = require('http');

// Start a bot server if it is not already up
const discord_start = (req, res) => { 
    Bot.findById(req.params.id)
        .then(result => {
            http.get(`http://localhost:${result.port}`, () => { // Check if the page is already up
            }).on('error', (e) => {
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

            })
        });
};

module.exports = {
    discord_start
}
