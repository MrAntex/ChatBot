const bodyParser = require('body-parser');
const express = require('express');
const { result, reduce } = require('lodash');
const mongoose = require('mongoose');
const botRoutes = require('./routes/botRoutes');
const usersRoutes = require('./routes/usersRoutes');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser, requireAdmin } = require('./middleware/authMiddleware');


// express app
const app = express();

const port = 3001;

// Connect to MongoDB and listen for requests
const dbURI = 'mongodb+srv://ProjetChatBot:WD0QRypXsiO0wnnN@cluster0.vpreh.mongodb.net/ProjetChatBot?retryWrites=true&w=majority';
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

// 404 page
app.use((req, res) => {
    res.status(404).render('./404/404', { title: '404', subtitle: '' });
});

