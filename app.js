var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/mainPage');
var aboutRouter = require('./routes/about');
var contactRouter = require('./routes/contact');
var projectRouter = require('./routes/projects');
var usersRouter = require('./routes/users');
var supremeVillainRouter = require('./routes/supremeVillain');

var app = express();



//Handle middle ware file setup
// Only rewrite files that are actually compressed
app.get('*.wasm', (req, res, next) => {
    if (!req.url.endsWith('.br') && req.headers['accept-encoding']?.includes('br')) {
        req.url += '.br';
        res.set('Content-Encoding', 'br');
        res.set('Content-Type', 'application/wasm');
    }
    next();
});

app.get('*.data', (req, res, next) => {
    if (!req.url.endsWith('.br') && req.headers['accept-encoding']?.includes('br')) {
        req.url += '.br';
        res.set('Content-Encoding', 'br');
        res.set('Content-Type', 'application/octet-stream');
    }
    next();
});
app.use((req, res, next) => {
    if (req.url.endsWith('.br')) {
        res.set('Content-Encoding', 'br');

        if (req.url.endsWith('.js.br')) {
            res.set('Content-Type', 'application/javascript');
        } else if (req.url.endsWith('.wasm.br')) {
            res.set('Content-Type', 'application/wasm');
        } else if (req.url.endsWith('.data.br')) {
            res.set('Content-Type', 'application/octet-stream');
        }
    }
    next();
});

app.use(express.static(path.join(__dirname, 'public')));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/contact', contactRouter);
app.use('/projects', projectRouter);
app.use('/users', usersRouter);
app.use('/supremeVillainDemo', supremeVillainRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

//Set up the server to listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
