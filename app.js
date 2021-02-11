var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
const flash = require('connect-flash');

var options = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'video'
};

var sessionStore = new MySQLStore(options);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var myAccountRouter = require('./routes/my-account');
var videosRouter = require('./routes/videos');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  key: 'videos_session',
  secret: 'secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));

app.use(flash())
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.success = req.flash('success')
  res.locals.failure = req.flash('failure')
  next()
})


app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/my-account', myAccountRouter);
app.use('/users', usersRouter);
app.use('/watch', videosRouter);

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
