const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv/config');

//---------------------------------------- END OF IMPORT --------------------------------------

const app = express();

const port = process.env.PORT || 8483;
app.use(methodOverride('_method'));
app.use(bodyParser.json()); // parses header requests (req.body)
app.use(bodyParser.urlencoded({ extended: true })); // allows objects and arrays to be URL-encoded
app.use(cors());

app.use((req, res, next) => {
    if (req.headers.authorization != process.env.AUTHPASS) {
        return res.status(403).json({ error: 'Credentials missing!' });
    } else {
        next();
    }
})

app.get('/test', (req, res) => {
    res.status(200);
    res.json("External API for Relatel.Ordresystem");
})

app.post('/externalOrder', cors(), (req, res) => {
    console.log(req.body);
    res.status(200);
    res.json("Succes!");
});


app.listen(port, () => console.log(`External API listening on port ${port}`));

exports.app = app;