const express = require('express')
const router = express.Router();
const User = require('../../models/User');
const Post = require('../../models/Post');

router.get('/:userName', async (req, res) => {
    try {
        const user = await User.findOne({userName: req.params.userName})
        if (user == null) {
            res.redirect('/account')
        }

        let currentUser =  req.user == undefined ? 'unauthorized' : req.user.userName

        res.render('pages/users/user', {
            pageQuery: req.params.userName,
            currentUser: currentUser,
            user: user,
            accountHome: true
        })
        return
    } catch (e) {
        console.log(e)
		res.redirect('/account')
	}
})

router.delete('/:userName', isAuthenticated, async (req, res) => {
    let user
    try {
        user = await User.findOne({userName: req.params.userName})
        await user.remove()
        let userPosts = await Post.find({author: req.params.userName})
        for (let post of userPosts) {
            await post.remove()
        }
        req.logout();
		res.redirect(`/account`)
    } catch (e) {
		if (post != null) {
			res.render('pages/users/account', {
				thisPost: post,
				errorMessage: ["Could not remove post"]
			})
		} else {
			res.redirect(`/account`)
		}
    }
})

router.get('/:userName/edit', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findOne({userName: req.params.userName})
        res.render('pages/users/edit', {
            pageQuery: req.params.userName,
            currentUser: req.user.userName,
            user: user
        })
        return
    } catch {
        res.redirect('/account')
    }
})

router.put('/:userName/edit', isAuthenticated, async (req, res) => {
    let parsedImage = req.body.file != null && req.body.file != '' ? JSON.parse(req.body.file).data : ''
    let user
    try {
        user = await User.findOne({userName: req.params.userName})
        user.userName = req.body.name
        user.userDescription = req.body.description
        if (parsedImage != '') {
            user.userImageJson = parsedImage
        }

        let errorMessage = []

        if (user.userName.trim().length == 0) {
            errorMessage.push("Username Must Contain Letters or Numbers")
        }
        if (user.userName.length > 10) {
            errorMessage.push("10 character cap for user name")
        }
        if (user.userName.includes("/")) {
            errorMessage.push("Illegal character")
        }


        await User.findOne({userName: user.userName.trim()})
        .then(user => {
            if (user && req.params.userName != user.userName) {
                errorMessage.push("Username Is Already In Use")
            }
        })

        if (errorMessage.length > 0) {
            res.render('pages/users/edit', {
                pageQuery: req.params.userName,
                currentUser: req.user.userName,
                user: user,
                errorMessage: errorMessage
            })
            return
        }

        await user.save()

        let posts = await Post.find({author: req.params.userName});
        for (let post of posts) {
            post.author = user.userName
            await post.save()
        }
        
        req.logout();
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/account');
        });
    } catch (e) {
        console.log(e)
        res.render('pages/users/user', {
            pageQuery: user.userName,
            user: user,
            currentUser: req.user.userName,
            errorMessage: ["Error Editing User"]
        })
    }
})

router.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/account');
})

function isAuthenticated(req, res, next) {
    if (req.user.userName == req.params.userName) {
        next()
    } else {
        res.redirect('/account')
    }
}

module.exports = router;