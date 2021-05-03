// Flash; File Upload;

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config({ path: '.env' });
}

// Dependencies
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const methodOverride = require('method-override')

// Setup
app.set('view engine', 'ejs');
app.set('layout', 'layout');
app.use(express.json({limit: '12mb'}));
app.use(express.urlencoded({limit: '12mb', extended: true, parameterLimit:50000}));
app.use(express.static(__dirname + '/public'));
app.use(session({ secret: 'yeet', resave: false, saveUninitialized: false }));
app.use(expressLayouts);
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
// app.use(cookieParser());

// Passport Setup
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, 'useCreateIndex': true });
mongoose.connection.on('error', error => console.log(error));
mongoose.connection.once('open', () => console.log("Connected To Database"));

app.use(function(req, res, next) {
    global.login = req.isAuthenticated();
    next();
})

// Routes
const indexRouter = require('./routes/index');
const trendingRouter = require('./routes/trending');
const accountRouter = require('./routes/users/account');
const userRouter = require('./routes/users/user');
const postRouter = require('./routes/posts/posts');
const commentRouter = require('./routes/comments/comments');

app.use('/', indexRouter);
app.use('/trending', trendingRouter);
app.use('/account', accountRouter(passport));
app.use('/account', userRouter);
app.use('/account', postRouter);
app.use('/account', commentRouter);
app.get('*', function(req, res) {
    res.status(404).render('pages/error404', {
        pageQuery: "404"
    });
});

// Start Server
app.listen(3030);