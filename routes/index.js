const express = require('express')
const router = express.Router()

router.get('/home', (req, res) => {
    res.render('pages/index', {
        pageQuery: "Home"
    });
});

router.get('/', (req, res) => {
    res.redirect('/home');
});

module.exports = router;