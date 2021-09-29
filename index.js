const express = require('express');
const exphba = require('express-handlebars');
const bodyParser = require('body-parser');
const Factory = require('./greetingsFactory');
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

app.get("/", function (req, res) {
    res.redirect('/greetings');
});

app.get('/greetings', async function (req, res) {
    let flag = false;
    let inputName;
    if (req.query.nameInput) {
        inputName = req.query.nameInput.toLowerCase();
    }
    let language = factory.checkLang(req.query.langInput);

    if (language) {
        if (inputName) {
            if (/^[a-zA-Z]*$/g.test(inputName)) {
                let arrNames = await factory.selectAll();

                if (arrNames.length > 0) {
                    for (var i = 0; i < arrNames.length; i++) {
                        let currName = arrNames[i];
                        if (currName.name === inputName) {
                            let currGreetCounter = arrNames[i].counter + 1;
                            let currLangCounter;
                            currLangCounter = currName[language.toLowerCase()] + 1;
                            await factory.updateQuery(language, currGreetCounter, currLangCounter, inputName);

                            flag = true;
                        }
                    }
                } else {
                    await factory.insertQuery(language, inputName);
                    flag = true;
                }

                if (!flag) {
                    await factory.insertQuery(language, inputName);
                }

                let nameCount = await factory.getDistinctNames();
                res.render('index', { displayMessage: factory.displayString(req.query.nameInput, req.query.langInput), count: nameCount, displayClass: "black" });
            } else {
                let nameCount = await factory.getDistinctNames();
                res.render('index', { count: nameCount, displayMessage: "Please enter a valid name", displayClass: "red" });
            }
        } else {
            res.render('index', { count: await factory.getDistinctNames() });
        }

    } else {
        res.render('index', await factory.createRender(inputName));
    }
})

app.get('/greeted', async function (req, res) {
    let names = await factory.selectAll();
    console.log(names);
    res.render('greeted', { names: await factory.styleNames(names) });
})

app.get('/greetedname/:name', async function (req, res) {
    let names = await factory.selectName(req.params.name.toLowerCase());
    res.render('greetedname', { name: names.name, counter: names.counter, english: names.english, afrikaans: names.afrikaans, xhosa: names.xhosa });
})

app.get("/reset/:route", function (req, res) {
    factory.reset();

    res.redirect('/' + req.params.route);
});

let PORT = process.env.PORT || 3012;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});