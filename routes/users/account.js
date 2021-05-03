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
                let password = req.body.userPasswordSignUp
                let passwordConfirm = req.body.userPasswordSignUpConfirm
                
                const hashedPassword = await bcrypt.hash(password, 10);
            
                const newUser = new User({
                    userName: name,
                    userPassword: hashedPassword
                });

                let errorMessage = []
            
                if (newUser.userName.trim().length == 0 || password.trim().length == 0) {
                    errorMessage.push("Please fill out all the fields")
                }
                if (newUser.userName.length > 10) {
                    errorMessage.push("10 character cap for user name")
                }
                if (newUser.userName.includes("/")) {
                    errorMessage.push("Illegal character")
                }
                if (password !== passwordConfirm) {
                    errorMessage.push("Passwords do not match")
                }
                await User.findOne({ userName: newUser.userName.trim().length == 0 })
                    .then(user => {
                        if (user) {
                            errorMessage.push("Username Is Already In Use")
                        }
                    })

                if (errorMessage.length > 0) {
                    res.render('pages/users/account', {
                        pageQuery: "Account",
                        errorMessage: errorMessage
                    })
                    return
                }
                await newUser.save()
                res.render('pages/users/account', {
                    pageQuery: "Account",
                    location: "login",
                    successMessage: "You can now login"
                })
            } catch {
                res.render('pages/users/account', {
                    errorMessage: ["Welp... The server's down. Come back later"],
                    pageQuery: "Account"
                });
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