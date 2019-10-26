const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose  = require('mongoose');
const methodOverride = require('method-override')
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');

const port = process.env.PORT || 5000; 
var app = express();

// LOAD routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport config
require('./config/passport')(passport);
//DB config 
const db = require('./config/database');

// connect to mongoose
mongoose.connect(db.mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
 .then(() => console.log("MongoDB connected"))
 .catch(err => console.log(err));


 
app.use('/assets', [
    express.static(__dirname + '/node_modules/jquery/dist/'),   
    express.static(__dirname + '/node_modules/popper.js/dist'),
    express.static(__dirname + '/node_modules/bootstrap/dist')
]);

app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');
 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//Status folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'));

//EXPRESS SESSION
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true  
}));

//password middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//GROBAL VERIABLE
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});


app.get('/', function (req, res) {
	const title = "Welcome";
    res.render('index', {
    	title: title
    });
});

app.get('/about', function (req, res) {
    const title = "About";
    res.render('index', {
    	title: title
    });
});

//USE ROUTES
app.use('/ideas', ideas);
app.use('/users', users);


app.listen(port, () => {
	console.log('Server Started on port ${port}' + port);	 
});

