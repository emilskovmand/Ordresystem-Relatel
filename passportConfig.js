const userModel = require('./models/userModel');
const bcrypt = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
    passport.use(
        new localStrategy((username, password, done) => {
            userModel.findOne({ username: username }, (err, user) => {
                if (err) return done(err, false);
                if (!user) return done(null, false);
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) return done(err, false);
                    if (result === true) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                });
            });
        })
    );

    passport.serializeUser((user, cb) => {
        cb(null, user.id);
    });
    passport.deserializeUser((id, cb) => {
        userModel.findOne({ _id: id }, (err, user) => {
            if (user) {
                const userInformation = {
                    _id: user._id,
                    username: (user.username) ? user.username : null,
                    permissions: user.permissions
                };
                cb(err, userInformation);
            }
            else {
                cb(err, null);
            }
        });
    });
};