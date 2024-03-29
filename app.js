var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
//const userRouter = require('./routes/users');
const bookRouter = require('./routes/book');

mongoose.connect('mongodb+srv://admin:' + encodeURI('admin123') + '@cluster0-hbh4a.mongodb.net/bansach', { useNewUrlParser: true }, function(err) {
    if (err) throw err;
    console.log('Successfully connected');
});
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


// TODO - Why Do we need this key ?
app.use(session({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());


// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

app.use((req,res,next)=>{
    if(req.user) {
        res.locals.username=req.user.username;
    } else {
    }
    next();

});


app.use('/', indexRouter);
app.use('/book', bookRouter);

//app.use('/users', userRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;