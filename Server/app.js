const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const botRoutes = require('./routes/botRoutes');
const usersRoutes = require('./routes/usersRoutes');
const authRoutes = require('./routes/authRoutes');
const brainRoutes = require('./routes/brainRoutes');
const discordRoutes = require('./routes/discordRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser, requireAdmin } = require('./middleware/authMiddleware');
require('./discordBot.js');
require('dotenv').config();
const http = require('http');

const Bot = require('./models/botModel');

// express app
const app = express();

const port = process.env.PORT;

// Connect to MongoDB and listen for requests
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

const res = Bot.find().sort({ createdAt: -1 })
    .then((result) => {
        result.forEach((bot) => {
            Bot.updateOne({ _id: bot._id }, { $set: { status: false } }, function (err, user) {
                if (err) return handleError(err);
            });
        });
    });
// register view engine
app.set('view engine', 'ejs');
app.set('views', './Server/views');

// middleware & static files

app.use(express.static('./Server/public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});
app.use(cookieParser());

// routes
app.get('*', checkUser);
app.get('/', (req, res) => {
    res.redirect('/auth');
});
app.use('/bots', requireAuth, requireAdmin, botRoutes);
app.use('/users', requireAuth, usersRoutes);
app.use('/auth', authRoutes);
app.use('/discord', discordRoutes);
app.use('/brains', requireAuth, requireAdmin, brainRoutes);

// 404 page
app.use((req, res) => {
    res.status(404).render('./404/404', { title: '404', subtitle: '' });
});
