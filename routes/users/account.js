const express = require('express')
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../../models/User');

router.get('/', async (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('account/' + req.user.userName)
        return
    }
    
    res.render('pages/users/account', {
        pageQuery: "Account"
    });
});

module.exports = function(passport) {
    router.post('/', async function(req, res, next) {
        if ('SignUp' === req.body.formType) {
            try {
                let name = req.body.userNameSignUp
                let password = req.body.password
                
                const hashedPassword = await bcrypt.hash(password, 10);
                
                const newUser = new User({
                    userName: name,
                    userPassword: hashedPassword
                });

                await User.findOne({ userName: newUser.userName.trim()})
                    .then(user => {
                        return
                    })

                await newUser.save()
            } catch (e) {
                console.log(e)
            }
        }  else if ('SignIn' === req.body.formType) {
            passport.authenticate('local', {failureFlash: true}, function(err, user, info) {
                if (err) { return next(err); }
                if (!user) {
                    return res.render('pages/users/account', {
                        errorMessage: [info.message],
                        pageQuery: "Account",
                        location: "login"
                    });
                }
                req.logIn(user, function(err) {
                    if (err) { return next(err); }
                    return res.redirect('account/' + user.userName);
                });
            })(req, res, next);
        }
    });
    return router
}