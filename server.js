const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv/config');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes
const userRouter = require('./routes/user');
app.use('/api/user', userRouter);
const orderRouter = require('./routes/order');
app.use('/api/order', orderRouter);

// Forbind til MongoDB
mongoose.connect(process.env.DB_CONNECTION_STRING,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    () => {
        console.log('Connected to MongoDB!');
    });


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