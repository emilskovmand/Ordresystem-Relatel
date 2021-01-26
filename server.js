const express = require('express');
// const bodyParser = require('body-parser');
const bb = require('express-busboy');
const fs = require('fs');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const multer = require('multer');
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const crypto = require("crypto");
const { path } = require('dotenv/lib/env-options');
const pather = require('path');
var methodOverride = require('method-override');
require('dotenv/config');

//---------------------------------------- END OF IMPORT --------------------------------------

const app = express();
app.use(multer({
    dest: './uploads',
    limits: {
        fileSize: 10240000, // limit file size to 10mb
        files: 1 // limit files to 1
    },
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads')
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + pather.extname(file.originalname).toLowerCase());
        }
    }),
    fileFilter: (req, file, next) => {
        var ext = pather.extname(file.originalname).toLowerCase();
        if (ext !== '.mp3' || ext !== '.m4a' || ext !== '.aac' || ext !== '.wav' || ext !== '.oga' || ext !== '.flac' || ext !== '.pcm' || ext !== '.aiff') {
            next(null, false);
        }

        next(null, true);
    }
}).single("file"));

const port = process.env.PORT || 3001;
app.use(methodOverride('_method'));
app.use(bodyParser.json()); // parses header requests (req.body)
app.use(bodyParser.urlencoded({ extended: true })); // allows objects and arrays to be URL-encoded
app.set("json spaces", 2); // sets JSON spaces for clarity


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

// Static routes
app.use("/uploads", express.static("uploads"));

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


// Hvis dette er production miljø så skal vi statisk sørge for klientens brugerflade
if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(pather.join(__dirname, 'client/build')));

    // Handle React routing, return all requests to React app
    app.get('*', function (req, res) {
        res.sendFile(pather.join(__dirname, 'client/build', 'index.html'));
    });
}

// Lyt til port 3001 ELLLER den dynamiske port fra hosten
app.listen(port, () => console.log(`Listening on port ${port}`));

if (!fs.existsSync("uploads")) {
    fs.mkdir("uploads", (err) => {
        if (err) throw err;

        console.log("Uploads directory created.");
    });
}

exports.app = app;