var express = require('express');
var app = express();
var fs = require('fs');
var path=require('path');
var bodyParser = require('body-parser');
var multer = require('multer');
var Session = require('express-session');
var cookieParser = require('cookie-parser'); 
var http = require('http').Server(app);

require('./router/main')(app);
app.set('views',__dirname + '/views');
var io = require("socket.io").listen(http);
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname+'/public'));
 app.use(express.static('./views/'));
 app.use(bodyParser.json()); 
http://localhost:3000/css/style.css
app.engine('html', require('ejs').renderFile);
//veiw engin
app.set('views',path.join(__dirname,'views'));


app.use(bodyParser.urlencoded({extended:false}));
//set static folder
app.use(express.static(path.join(__dirname,'public')));
// the session is stored in a cookie, so we use this to parse it
app.use(cookieParser());

var Session= Session({
    secret:'secrettokenhere',
    saveUninitialized: true,
    resave: true
});


io.use(function(socket, next) {
      Session(socket.request, socket.request.res, next);
});


app.use(Session);

var sessionInfo;

/* requiring config file starts*/
var config =require('./middleware/config.js')(app);
/* requiring config file ends*/

/* requiring config db.js file starts*/
var db = require("./middleware/db.js");
var connection_object= new db();
var connection=connection_object.connection; // getting conncetion object here 

require('./middleware/auth-routes.js')(app,connection,Session,cookieParser,sessionInfo);

require('./middleware/routes.js')(app,connection,io,Session,cookieParser,sessionInfo);

 //http = require('http');
// var app = express();
// var server = http.createServer(app);

// var io = require('socket.io').listen(server);
    
// app.listen('3000', function(){
//         console.log('running on 3000...');
//  });
   http.listen('3000',function(){
    console.log("Listening on http://127.0.0.1:81");
});