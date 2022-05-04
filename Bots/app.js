const bodyParser = require('body-parser');
const { render } = require('ejs');
const express = require('express');
const { result, reduce } = require('lodash');
const botRoutes = require('./routes/botRoutes');

// express app
const app = express();

const port = Number(process.argv.slice(2));
app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(`Server listening to port ${port}`);
})
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

// routes
app.get('/', (req, res) => {
    res.render('index');
});
// bot routes


// 404 page
app.use((req, res) => {
    res.status(404).render('./404/404', { title: '404', subtitle: '' });
});
