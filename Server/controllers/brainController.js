const Brain = require('../models/brainModel');


const brain_add = (req, res) => {
    const brain = new Brain(req.body);
    brain.save()
        .then((result) => {
            // res.redirect('/bots');
        })
        .catch((err) => {
            console.log(`Error ${err} thrown... stack is : ${err.stack}`);
            res.status(400).send('BAD REQUEST');
        })
}

module.exports = {
    brain_add
}