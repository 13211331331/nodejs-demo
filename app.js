
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var ejs = require('ejs');
var SessionStore = require("session-mongoose")(express);

var app = express();
var store = new SessionStore({
    url: "mongodb://localhost:27017/session",
    interval: 120000
});


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));

app.engine('.html', ejs.__express);
app.set('view engine', 'html');// app.set('view engine', 'ejs');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.bodyParser());
app.use(express.urlencoded());
app.use(express.methodOverride());



app.use(express.cookieParser());
app.use(express.cookieSession({secret : 'fens.me'}));
app.use(express.session({
    secret : 'fens.me',
    store: store,
    cookie: { maxAge: 900000 }
}));
app.use(function(req, res, next){
    res.locals.user = req.session.user;
    next();
});


app.use(function(req, res, next){
    var err = req.session.error;
    delete req.session.error;
    res.locals.message = '';
    console.log( res.locals);
    if (err) res.locals.message = '<div class="alert alert-error">' + err + '</div>';
    next();
});




// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}







app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);

/*app.get('/login', routes.login);
app.post('/login', routes.doLogin);
app.get('/logout', routes.logout);
app.get('/home', routes.home);*/



app.all('/login', notAuthentication);
app.get('/login', routes.login);

app.post('/login', routes.doLogin);

app.get('/logout', authentication);
app.get('/logout', routes.logout);

app.get('/home', authentication);
app.get('/home', routes.home);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function authentication(req, res, next) {
    if (!req.session.user) {
        req.session.error='请先登陆';
        return res.redirect('/login');
    }
    next();
}
function notAuthentication(req, res, next) {
    if (req.session.user) {
        req.session.error='已登陆';
        return res.redirect('/');
    }
    next();
}
