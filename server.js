const express = require('express');
// const bodyParser = require('body-parser');
const bb = require('express-busboy');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const crypto = require("crypto");
var methodOverride = require('method-override');
require('dotenv/config');

//---------------------------------------- END OF IMPORT --------------------------------------

const app = express();
const port = process.env.PORT || 3001;
app.use(methodOverride('_method'));
bb.extend(app);


app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 24 * 1000 }
}))

app.use(cookieParser(process.env.SECRET));
app.use(passport.initialize());
app.use(passport.session());
require('./passportConfig')(passport);

//---------------------------------------- END OF MIDDLEWARE ------------------------------------

// API Routes
const userRouter = require('./routes/user');
app.use('/api/user', userRouter);
const orderRouter = require('./routes/order');
app.use('/api/order', orderRouter);
const audioRouter = require('./routes/audio');
app.use('/api/audio', audioRouter);

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

var db = mongoose.connection;

const userSchema = require('./models/userModel');
const orderSchema = require('./models/orderModel');
const { path } = require('dotenv/lib/env-options');


// Hvis dette er production miljø så skal vi statisk sørge for klientens brugerflade
if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));

    // Handle React routing, return all requests to React app
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

// Lyt til port 3001 ELLLER den dynamiske port fra hosten
app.listen(port, () => console.log(`Listening on port ${port}`));

exports.app = app;