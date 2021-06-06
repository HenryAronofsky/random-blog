const express = require('express')
const router = express.Router();
const User = require('../../models/User');
const Post = require('../../models/Post');
const Category = require('../../models/Category')

router.get('/:userName/posts', async (req, res) => {
    try {
        const user = await User.findOne({userName: req.params.userName})
        if (user == null) {
            res.redirect('/account')
            return
        }
        const posts = await Post.find({author: req.params.userName})
        if (posts == null) {
            res.redirect('/account')
            return
        }
        let currentUser =  req.user == undefined ? false : req.user.userName
        res.render('pages/posts/posts', {
            userPosts: posts,
            pageQuery: req.params.userName,
            currentUser: currentUser
        })
    } catch {
        res.redirect('/account')
    }
})

router.get('/:userName/posts/new', isAuthenticated, async (req, res) => {
    try {
        const categories = await Category.find({})
        res.render('pages/posts/new', {
            pageQuery: req.params.userName,
            currentUser: req.user.userName,
            categories: categories
        })
    } catch {

    }
})

router.post('/:userName/posts/new', isAuthenticated, async (req, res) => {
    let parsedImage = req.body.file != null && req.body.file != '' ? JSON.parse(req.body.file).data : ''
    const dateReference = new Date()
    const categories = await Category.find({})

    const newPost = new Post({
        title: req.body.title,
        content: req.body.content,
        imageJson: parsedImage,
        category: req.body.category,
        author: req.params.userName,
        date: `${String(dateReference.getMonth() + 1).padStart(2, '0')}/${String(dateReference.getDate()).padStart(2, '0')}/${dateReference.getFullYear()}`
    })

    if (newPost.title.trim().length == 0 || newPost.content.trim().length == 0) {
        res.render('pages/posts/new', {
            pageQuery: req.params.userName,
            errorMessage: ["Please fill out all text fields"],
            categories: categories
        })
        return
    }

    try {
        console.log(newPost)
        await newPost.save()
        res.redirect(`/account/${req.params.userName}/posts/${newPost._id}`)
    } catch (e) {
        res.render('pages/posts/new', {
            pageQuery: req.params.userName,
            errorMessage: ["Welp... The server's down. Come back later"]
        })
    }
})

router.get('/:userName/posts/:id', async (req, res) => {
    try {
        const post = await Post.findOne({_id: req.params.id, author: req.params.userName})
        if (post == null) {
            res.redirect(`/account/${req.params.userName}/posts`)
            return
        }

        let currentUser =  req.user == undefined ? false : req.user.userName
        res.render('pages/posts/view', {
            pageQuery: req.params.userName,
            thisPost: post,
            currentUser: currentUser
        })
    } catch {
        res.redirect(`/account/${req.params.userName}`)
    }
})

router.get('/:userName/posts/:id/edit', isAuthenticated, async (req, res) => {
    try {
        const categories = await Category.find({})
        const post = await Post.find({_id: req.params.id, author: req.params.userName})
        res.render('pages/posts/edit', {
            pageQuery: req.params.userName,
            post: post[0],
            currentUser: req.user.userName,
            categories: categories
        })
    } catch {
        res.redirect('/account')
    }
})

router.put('/:userName/posts/:id/edit', isAuthenticated, async (req, res) => {
    let parsedImage = req.body.file != null && req.body.file != '' ? JSON.parse(req.body.file).data : ''
    let post
	try {
        post = await Post.find({_id: req.params.id, author: req.params.userName})
        post[0].title = req.body.title
        post[0].content = req.body.content
        if (parsedImage != '') {
            post[0].imageJson = parsedImage
        }
		await post[0].save()
		res.redirect(`/account/${req.params.userName}/posts/${req.params.id}`)
	} catch {
        res.redirect(`/account/${req.params.userName}/posts/${req.params.id}/edit`)
    }
})

router.delete('/:userName/posts/:id', isAuthenticated, async (req, res) => {
    let post
    try {
        post = await Post.findById(req.params.id)
        await post.remove()
		res.redirect(`/account/${req.params.userName}/posts`)
    } catch (e) {
		if (post != null) {
			res.render('pages/posts/view', {
				thisPost: post,
				errorMessage: ["Could not remove post"]
			})
		} else {
			res.redirect(`/account/${req.params.userName}/posts`)
		}
    }
})

function isAuthenticated(req, res, next) {
    if (req.user == undefined) res.redirect('/account')
    if (req.user.userName == req.params.userName) {
        next()
    } else {
        res.redirect('/account')
    }
}

module.exports = router