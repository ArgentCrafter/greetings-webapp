const express = require('express');
const exphba = require('express-handlebars');
const bodyParser = require('body-parser');
const Factory = require('./greetingsFactory');
const GreetRoutes = require('./greetingsRoutes');
const session = require('express-session');
const flash = require('express-flash');
const { Pool } = require('pg');
let app = express();

const connectionString = process.env.DATABASE_URL || 'postgres://rntohclcqqooug:6e4d677f68a42e8f11d37d49692c964ce319903d08edd57a1e6fbbb394139f1b@ec2-18-215-44-132.compute-1.amazonaws.com:5432/dbfr12j9n97iqk';
//'postgresql://jaden:codex123@localhost:5432/names_greeted'
//'postgres://rntohclcqqooug:6e4d677f68a42e8f11d37d49692c964ce319903d08edd57a1e6fbbb394139f1b@ec2-18-215-44-132.compute-1.amazonaws.com:5432/dbfr12j9n97iqk'

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    }
});

pool.connect();

let factory = Factory(pool);
let greetRoutes = GreetRoutes(pool, factory);

app.use(session({
    secret: 'keyboard cat5 run all 0v3r',
    resave: false,
    saveUninitialized: true
}))

app.use(flash());

app.engine('handlebars', exphba({ defaultLayout: 'main', layoutsDir: __dirname + '/views/layouts' }));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", greetRoutes.root);

app.get('/greetings', greetRoutes.greetings);

app.get('/greeted', greetRoutes.greeted);

app.get('/greetedname/:name', greetRoutes.greetedname);

app.get("/reset/:route", greetRoutes.reset);

let PORT = process.env.PORT || 3012;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});