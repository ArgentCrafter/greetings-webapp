const express = require('express');
const exphba = require('express-handlebars');
const bodyParser = require('body-parser');
const factory = require('./greetingsFactory');
const session = require('express-session');
const pg = require('pg');
const Pool = pg.Pool;
let app = express();

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://jaden:codex123@localhost:3011/names_greeted';

const pool = new Pool({
    connectionString,
    ssl: useSSL
});

app.use(session({
    secret: 'keyboard cat5 run all 0v3r',
    resave: false,
    saveUninitialized: true
}))

app.engine('handlebars', exphba({ defaultLayout: 'main', layoutsDir: __dirname + '/views/layouts' }));
app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
    if (req.query.nameInput) {
        if (req.query.langInput) {
            res.render('index', { displayMessage: factory().displayString( req.query.nameInput, req.query.langInput) });
        } else {
            res.render('index')
        }
    }
});

app.post('/action', function (req, res) {
    res.render('index', { displayMessage: factory().displayString(req.query.language, req.query.nameInput) });
})


app.post('/action/:language', function (req, res) {
    res.render('index', { displayMessage: factory().displayString(req.params.language, req.body.nameInput) });

    res.redirect('/')
})

app.post("/reset", function (req, res) {

});

let PORT = process.env.PORT || 3011;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});