const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('pages/trending', {
        pageQuery: "Trending"
    });
});

module.exports = router;