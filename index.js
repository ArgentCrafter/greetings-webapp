const express = require('express');
const exphba = require('express-handlebars');
const bodyParser = require('body-parser');
const factory = require('./greetingsFactory');
const session = require('express-session');
const flash = require('express-flash');
const { Pool } = require('pg');
let app = express();

const connectionString = process.env.DATABASE_URL || 'postgres://rntohclcqqooug:6e4d677f68a42e8f11d37d49692c964ce319903d08edd57a1e6fbbb394139f1b@ec2-18-215-44-132.compute-1.amazonaws.com:5432/dbfr12j9n97iqk';

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    }
});

pool.connect();

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
    let language = factory().checkLang(req.query.langInput);
    console.log(language);

    if (language) {
        if (inputName) {
            let arrNames = await (await pool.query('SELECT * FROM names')).rows;

            if (arrNames.length > 0) {
                for (var i = 0; i < arrNames.length; i++) {
                    if (arrNames[i].name === inputName) {
                        let currGreetCounter = arrNames[i].counter;
                        currGreetCounter += 1;
                        let currLangCounter;

                        switch (language) {
                            case 'English':
                                currLangCounter = arrNames[i].english;
                                currLangCounter += 1;
                                await pool.query('UPDATE names SET counter = $1, english = $2 WHERE name = $3', [currGreetCounter, currLangCounter, inputName]);
                                break;

                            case 'Afrikaans':
                                currLangCounter = arrNames[i].afrikaans;
                                currLangCounter += 1;
                                await pool.query('UPDATE names SET counter = $1, afrikaans = $2 WHERE name = $3', [currGreetCounter, currLangCounter, inputName]); 4
                                break;

                            case 'Xhosa':
                                currLangCounter = arrNames[i].xhosa;
                                currLangCounter += 1;
                                await pool.query('UPDATE names SET counter = $1, xhosa = $2 WHERE name = $3', [currGreetCounter, currLangCounter, inputName]);
                                break;

                            default:
                                break;
                        }
                        flag = true;
                    }
                }
            } else {
                switch (language) {
                    case 'English':
                        await pool.query('INSERT INTO names (name, counter, english, afrikaans, xhosa) VALUES ( $1, 1, 1, 0, 0)', [inputName])
                        break;

                    case 'Afrikaans':
                        await pool.query('INSERT INTO names (name, counter, english, afrikaans, xhosa) VALUES ( $1, 1, 0, 1, 0)', [inputName])
                        break;

                    case 'Xhosa':
                        await pool.query('INSERT INTO names (name, counter, english, afrikaans, xhosa) VALUES ( $1, 1, 0, 0, 1)', [inputName])
                        break;

                    default:
                        break;
                }
                flag = true;
            }

            if (!flag) {
                switch (language) {
                    case 'English':
                        await pool.query('INSERT INTO names (name, counter, english, afrikaans, xhosa) VALUES ( $1, 1, 1, 0, 0)', [inputName])
                        break;

                    case 'Afrikaans':
                        await pool.query('INSERT INTO names (name, counter, english, afrikaans, xhosa) VALUES ( $1, 1, 0, 1, 0)', [inputName])
                        break;

                    case 'Xhosa':
                        await pool.query('INSERT INTO names (name, counter, english, afrikaans, xhosa) VALUES ( $1, 1, 0, 0, 1)', [inputName])
                        break;

                    default:
                        break;
                }
            }
            let nameCount = await pool.query('SELECT COUNT (DISTINCT name) FROM names')
            res.render('index', { displayMessage: factory().displayString(req.query.nameInput, req.query.langInput), count: nameCount.rows[0].count, displayClass: "black" });
        } else {
            let nameCount = await pool.query('SELECT COUNT (DISTINCT name) FROM names')
            res.render('index', { count: nameCount.rows[0].count });
        }
    } else {
        console.log(inputName);
        if (inputName) {
            let nameCount = await pool.query('SELECT COUNT (DISTINCT name) FROM names')
            res.render('index', { count: nameCount.rows[0].count, displayMessage: "Please select a language", displayClass: "red" });
        } else {
            let nameCount = await pool.query('SELECT COUNT (DISTINCT name) FROM names')
            res.render('index', { count: nameCount.rows[0].count, displayMessage: "Please enter a name and select a language"});
        }
    }
})

app.get('/greeted', async function (req, res) {
    let names = await (await pool.query('SELECT * FROM names')).rows;
    let namesStyled = [];
    for (var i = 0; i < names.length; i++) {
        let nameTemp = names[i].name[0].toUpperCase() + names[i].name.slice(1).toLowerCase();
        namesStyled.push(nameTemp);
    }
    res.render('greeted', { names: namesStyled });
})

app.get('/greetedname/:name', async function (req, res) {
    let names = await (await pool.query('SELECT * FROM names WHERE name = $1', [req.params.name])).rows[0];
    res.render('greetedname', { name: names.name, counter: names.counter, english: names.english, afrikaans: names.afrikaans, xhosa: names.xhosa });
})

app.get("/reset/:route", async function (req, res) {
    await pool.query('DROP TABLE names');
    await pool.query('CREATE TABLE names (id serial primary key, name text not null, counter int not null, english int not null, afrikaans int not null, xhosa int not null)')

    res.redirect('/' + req.params.route);
});

let PORT = process.env.PORT || 3012;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});