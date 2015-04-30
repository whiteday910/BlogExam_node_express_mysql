var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer  = require('multer');

// DB 설정을 위한 requrie
var mysql = require('mysql');
var pool = mysql.createPool({
    "connectionLimit" : 10,
    "host"            : "localhost",
    "user"            : "root",
    "password"        : "1234",
    "multipleStatements": true
});

var fs = require('fs');

var app = express();
app.use(multer(
    {
        dest: './public/images/upload',
        rename: function (fieldname, filename)
        {
            return filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
        }
        ,
        includeEmptyFields: true
    }));

// DB 초기화
pool.getConnection(function (err, connection)
{
    var initQueryString = fs.readFileSync('./models/db_init_query.sql').toString();
    if(err)
    {
        console.error('err : ',err);
    }
    connection.query(initQueryString, function (err, rows)
    {
        if (err)
        {
            console.error('DB 초기화 에러입니다. 에러메시지 : ', err);
        }
        else
        {
            console.log('DB 초기화에 성공하였습니다. 3000번 포트로 접속해 주세요');
        }
        connection.release();
    });
});


// 세션 사용을 위한 설정
var session = require('express-session');
app.set('trust proxy', 1); // trust first proxy
app.use(session(
{
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));


// route 설정
var routes = require('./routes/index');
var member = require('./routes/member');
var blog = require('./routes/blog');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/member', member);
app.use('/blog', blog);



// catch 404 and forward to error handler
app.use(function (req, res, next)
{
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development')
{
    app.use(function (err, req, res, next)
    {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next)
{
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
