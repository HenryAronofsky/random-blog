const express = require('express')
const router = express.Router()
const Category = require('../../models/Category')
const Post = require('../../models/Post')

router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({})

        let loggedIn = false
        if (req.isAuthenticated()) {
            loggedIn = true
        }
        res.render('pages/categories/categories', {
            pageQuery: "Categories",
            categories: categories,
            isLoggedIn: loggedIn
        });
    } catch {
        res.redirect('/')
    }
});

router.post('/', isAuthenticated, async (req, res) => {
    try {
        const categories = await Category.find({})
        const newCategory = new Category({
            category: req.body.category
        })
    
        let errorMessage = []
    
        if (newCategory.category.trim().length == 0) {
            errorMessage.push("Category must be filled out");
        }
        if (newCategory.category.includes("/")) {
            errorMessage.push("Illegal character")
        }
        await Category.findOne({ category: newCategory.category })
        .then(category => {
            if (category) {
                errorMessage.push("Category Already Exists")
            }
        })
    
        if (errorMessage.length > 0) {
            res.render('pages/categories/categories', {
                pageQuery: "Categories",
                errorMessage: errorMessage,
                categories: categories
            })
            return
        }
    
        await newCategory.save()
        res.render('pages/categories/categories', {
            pageQuery: "Categories",
            successMessage: "Category Added",
            categories: categories
        })
    } catch {
        res.render('pages/categories/categories', {
            pageQuery: "Categories",
            errorMessage: ["Error making the category"],
            categories: categories
        })
    }
});

router.get('/:category', async (req, res) => {
    try {
        const posts = await Post.find({category: req.params.category })
        console.log(posts)
        let currentUser = req.user == undefined ? false : req.user.userName
        
        res.render('pages/categories/category', {
            pageQuery: "Categories",
            posts: posts,
            currentUser: currentUser
        });
    } catch {
        res.render('/')
    }
});

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/account')
    }
}

module.exports = router;