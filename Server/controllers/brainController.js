const Brain = require('../models/brainModel');
const fs = require('fs');
require('dotenv').config();

const port = process.env.PORT;

// Empty the database of all brains then populate with the content of the brains folder
const brain_refresh = (req, res) => {
    var liste = fs.readdirSync('./Server/brains');
    var brains = '';
    Brain.deleteMany({}, (result) => {
        liste.forEach(elt => {
            brains = elt.split(".")[0];
            const brain = new Brain({name:brains});
            brain.save()
            .then((result) => {
            })
            .catch((err) => {
                console.log(`Error ${err} thrown... stack is : ${err.stack}`);
                res.status(400).send('BAD REQUEST');
            })
        });
        res.redirect('/bots');
    })
}


module.exports = {
    brain_refresh
}