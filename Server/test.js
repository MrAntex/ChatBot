const exec = require('child_process').exec
const Bot = require('./models/botModel');

console.log("Beginning");
Bot.findById('625c6079cfd30393cb535a97')
    .then(result => {
        console.log(result);
        const proc = exec(`node ./../Bots/app.js ${result.port}`, (error, stdout, stderr) => {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        })
    })