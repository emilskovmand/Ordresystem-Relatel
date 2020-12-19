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
                res.json("Succesfully Authenticated");
            })
        }
    })(req, res, next);

})


// ROUTE: /api/user/logout
router.get('/logout', (req, res) => {
    req.logOut();
    res.send("Successfully logged out.")
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
        if (doc) res.status(200).send("User already exists");
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
            res.json(`User ${req.body.username} created!`);
            res.status(200);
        }
    })
})

// ROUTE: /api/user/userlist
router.get('/userlist', async (req, res) => {

    if (!req.user.permissions.admin) {
        res.status(401);
        res.send("Missing permissions to view list of users.");
        return;
    }

    if (req.user) {
        try {
            const users = await userModel.find();
            res.json(users);
            res.status(200);
        } catch (error) {
            res.json("Something went wrong.")
            res.status(500);
        }
    }
    else {
        res.send("Permission missing");
        res.status(401);
    }
})

// ROUTE: /api/user/update
router.put('/updateRoles/:_id', async (req, res) => {

    if (!req.user.permissions.admin) {
        res.status(401);
        res.json("Missing permissions to change user roles");
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
        res.send("Updated user: " + req.params._id);
        res.status(200);
    } catch (error) {
        res.status(500);
        res.send("Updating user " + req.params._id + " failed...")
    }
})

module.exports = router;