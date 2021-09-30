module.exports = function greetRoutes(pool) {

    async function greetings(req, res, factory) {
        let inputName;
        if (req.query.nameInput) {
            inputName = req.query.nameInput.toLowerCase();
        }
        let language = factory.checkLang(req.query.langInput);

        if (language) {
            if (inputName) {
                if (/^[a-zA-Z]*$/g.test(inputName)) {
                    let currName = await factory.selectName(inputName);

                    if (currName) {
                        await factory.updateQuery(language, currName.counter, currName[language.toLowerCase()], inputName);
                    } else {
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

    }

    function root(res) {
        res.redirect('/greetings');
    }

    async function greeted(res, factory) {
        let names = await factory.selectAll();
        res.render('greeted', { names: await factory.styleNames(names) });    
    }

    async function greetedname(req, res, factory) {
        let names = await factory.selectName(req.params.name.toLowerCase());
        res.render('greetedname', { name: names.name, counter: names.counter, english: names.english, afrikaans: names.afrikaans, xhosa: names.xhosa });    
    }

    async function reset(req, res) {
        await pool.query('TRUNCATE TABLE names');

        res.redirect('/' + req.params.route);
      }

    return {
        greetings,
        root,
        greeted,
        greetedname,
        reset
    }
}