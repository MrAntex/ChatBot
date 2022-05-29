const Bot = require('../models/botModel');
const spawn = require('child_process').spawn;
const http = require('http');


const discord_start = (req, res) => { // Start a bot server if it is not already up
    console.log("brain", req.params.brain);
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
