const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports = function(passport) {

    passport.use(new LocalStrategy(
        function(username, password, done) {
            User.findOne({ userName: username }, async function(err, user) {
                if (err) return done(err);
                if (!user) return done(null, false, { message: 'Credentials Incorrect.' });
                await bcrypt.compare(password, user.userPassword, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user)
                    } else {
                        return done(null, false, { message: 'Credentials Incorrect.' });
                    }
                });
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
}