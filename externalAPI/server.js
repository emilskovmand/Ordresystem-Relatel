const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv/config');
const ConvertToOrderStructure = require('./mailConverter');

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


// Forbind til MongoDB
mongoose.connect(process.env.DB_CONNECTION_STRING,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false },
    (err) => {
        if (err) {
            throw err;
        } else {
            console.log('Connected to MongoDB!');
        }
    }
);


app.get('/test', (req, res) => {
    res.status(200);
    res.json("External API for Relatel.Ordresystem");
})

const createOrder = require('./createOrder');

app.post('/externalOrder', cors(), async (req, res) => {
    const orderStructure = ConvertToOrderStructure(req.body[0].data);
    await createOrder(orderStructure, res);
});

app.listen(port, () => console.log(`External API listening on port ${port}`));

exports.app = app;