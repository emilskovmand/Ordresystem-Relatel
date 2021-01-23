const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');

const userModel = require('../models/userModel');
const orderModel = require('../models/orderModel');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('This is the user API');
});

// ROUTE: /api/user/login
router.post('/login', (req, res, next) => {

    passport.authenticate("local", { session: true, successRedirect: '/', failureRedirect: '/login' }, (err, user, info) => {
        if (err) {
            res.status(500);
            console.log(err);
        }
        if (!user) res.json("No user Exists");
        else {
            req.logIn(user, err => {
                if (err) {
                    res.status(500);
                    console.log(err);
                }
                res.json("Loggede ind med succes.");
            })
        }
    })(req, res, next);

})


// ROUTE: /api/user/logout
router.get('/logout', (req, res) => {
    req.logOut();
    res.send("Loggede ud.")
    res.status(200);
})

// ROUTE: /api/user/getUser
router.get('/getUser', async (req, res) => {
    try {
        res.json({ user: req.user }); // The req.user stores the entire user information that has been authenticated inside of it.
        res.status(200);
    } catch (error) {
        res.json(req.user);
        res.status(401);
    }
})

// ROUTE: /api/user/register
router.post('/register', (req, res) => {
    userModel.findOne({ username: req.body.username }, async (err, doc) => {
        if (err) {
            res.status(500);
            throw err;
        };
        if (doc) res.status(200).send("Bruger eksisterer allerede");
        if (!doc) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const newUser = new userModel({
                username: req.body.username,
                password: hashedPassword,
                email: req.body.email,
                permissions: {
                    admin: req.body.admin,
                    createOrder: req.body.createOrder,
                    produce: req.body.produceOrder,
                    approve: req.body.approve,
                    complete: req.body.completedOrders
                }
            })
            await newUser.save();
            res.json(`Bruger med brugernavn: "${req.body.username}" blev skabt!`);
            res.status(200);
        }
    })
})


// ROUTE: /api/user/editmyuser
router.put('/editmyuser/:_id', async (req, res) => {
    if (req.body.password.length <= 7) {
        res.status(401);
        res.json("Kodeords kriterier ikke mødt.");
    };


    if (req.user._id == req.params._id) {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const updatedUser = await userModel.findByIdAndUpdate(req.params._id, {
                password: hashedPassword,
                email: req.body.email
            });
            res.json("Opdaterede dine egne bruger informationer");
            res.status(200);
        } catch (error) {
            res.status(500);
            res.json("Serverfejl: editmyuser")
        }
    } else {
        res.send("Manglende tilladelse");
        res.status(401);
    }
})

// ROUTE: /api/user/userlist
router.get('/userlist', async (req, res) => {

    if (!req.user.permissions.admin) {
        res.status(401);
        res.send("Manglende tilladelse til at se liste af brugere.");
        return;
    }

    if (req.user) {
        try {
            const users = await userModel.find();
            res.json(users);
            res.status(200);
        } catch (error) {
            res.json("Serverfejl: userlist")
            res.status(500);
        }
    }
    else {
        res.send("Manglende tilladelse");
        res.status(401);
    }
})

// ROUTE: /api/user/update
router.put('/updateRoles/:_id', async (req, res) => {

    if (!req.user.permissions.admin) {
        res.status(401);
        res.json("Manglende tilladelser til at ændre brugerroller.");
        return;
    }

    try {
        const updatedUser = await userModel.findByIdAndUpdate(req.params._id, {
            permissions: {
                admin: req.body.admin,
                createOrder: req.body.createOrder,
                produce: req.body.produceOrder,
                approve: req.body.approve,
                complete: req.body.completedOrders
            }
        })
        res.json("Opdaterede bruger: " + updatedUser.username);
        res.status(200);
    } catch (error) {
        res.status(500);
        res.json("Serverfejl: userUpdate")
    }
})

module.exports = router;