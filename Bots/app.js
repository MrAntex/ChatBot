const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const botRoutes = require('./routes/botRoutes');
require('dotenv').config();


// express app
const app = express();

const port = Number(process.argv.slice(2));
const dbURI = process.env.dbURI;


mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log('Connected to db');
        app.listen(port, (err) => {
            if (err) {
                console.log(err);
            }
            console.log(`Server listening to port ${port}`);
        })
    })
    .catch((err) => { console.log(err) });



// register view engine
app.set('view engine', 'ejs');
app.set('views', './Bots/views');

// middleware & static files

//app.use(express.static('public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

app.use("/", botRoutes);

app.use(express.static('./Bots/public'));


// 404 page
app.use((req, res) => {
    res.status(404).render('./404/404', { title: '404', subtitle: '' });
});
