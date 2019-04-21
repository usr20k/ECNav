/***********************
  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
***********************/
var express = require('express'); //Ensure our express framework has been added
var app = express();
var mysql = require('mysql');

//Used by auth0------------------------------------------------
var session = require('express-session');
var userProfile = null;
// config express-session
var sess = {
  secret: 'XLFLK98935jFnkfgsjp30',
  cookie: {},
  resave: false,
  saveUninitialized: true
};

if (app.get('env') === 'production') {
  sess.cookie.secure = true; // serve secure cookies, requires https
}

app.use(session(sess));

// Load environment variables from .env
var dotenv = require('dotenv');
dotenv.config();

// Load Passport
var passport = require('passport');
var Auth0Strategy = require('passport-auth0');

// Configure Passport to use Auth0
var strategy = new Auth0Strategy(
  {
    domain: 'rapid-fog-9438.auth0.com',
    clientID: 'C7chjSM8WSo4Uw2twH6p4SCI6QSy47EC',
    clientSecret: 'cKrsVhnif7G3dkhxkVpvJdc2uws7aXDCiH6Ugnx6RywL1nxT5xQ6-UIT9fuvY0HJ',
    callbackURL: 'https://ecmap.herokuapp.com/callback',
    state: false
  },

  function (accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
);


  //console.log(process.env.AUTH0_DOMAIN);
  //console.log(process.env.AUTH0_CLIENT_ID);
  //console.log(process.env.AUTH0_CALLBACK_URL);

// You can use this section to keep a smaller payload
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(strategy);

app.use(passport.initialize());
app.use(passport.session());

var userInViews = require('./lib/middleware/userInViews');
var authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');

// ..
app.use(userInViews());
app.use('/', authRouter);
app.use('/', usersRouter);

//-------------------------------------------------------------

var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Create Database Connection
var pgp = require('pg-promise')();

//This will allow us to check if a given character is a letter:
function isLetter(c) {
  return c.toLowerCase() != c.toUpperCase();
}

/**********************
  Database Connection information
  host: This defines the ip address of the server hosting our database.  We'll be using localhost and run our database on our local machine (i.e. can't be access via the Internet)
  port: This defines what port we can expect to communicate to our database.  We'll use 5432 to talk with PostgreSQL
  database: This is the name of our specific database.  From our previous lab, we created the football_db database, which holds our football data tables
  user: This should be left as postgres, the default user account created when PostgreSQL was installed
  password: This the password for accessing the database.  You'll need to set a password USING THE PSQL TERMINAL THIS IS NOT A PASSWORD FOR POSTGRES USER ACCOUNT IN LINUX!
**********************/

//Connection to the room database:
var con = mysql.createConnection({
  host: "138.68.243.154",
  port: "3306",
  user: "ecmapatc_reader",
  password: "mapreader@ccess",
  database: "ecmapatc_roomdata"
});

//**DEPRECATED** Connection to the user database:
var user_con = mysql.createConnection({
  host: "138.68.243.154",
  port: "3306",
  user: "ecmapatc_su",
  password: "u$eradm!n",
  database: "ecmapatc_users"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to room database.");
});

user_con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to user database.");
});


// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory

/**********************
  GET Requests:
**********************/

// home page
app.get('/', function(req, res) {

  if(req.user != null){
    console.log("profile found.");
    res.render('pages/home',{
          my_title: "EC Nav",
          search_result:null,
          userProfile:req.user
      })
  } else {
    console.log("no user profile found");
    res.render('pages/home',{
          my_title: "EC Nav",
          search_result:null,
          userProfile:null
      })
  }
  });

// test page
app.get('/test', function(req, res) {
  //var query1 = "select * from room_data"
  res.render('pages/test',{
//        local_css: "signin.css",
        my_title: "Test Page",
        search_result:null,
        user:null
      })
  });

//Our main search functionality:
app.get('/search', function(req, res) {
	var search_input = req.query.search_input;
  if(req.userProfile){
    var userProfile = req.userProfile;
  } else {
    var userProfile = null;
  }
  //If our input is valid:
  if (search_input != ''){

    console.log("Valid search requested.");

    //If they searched with alphas first:
    if (search_input.charAt(0).toLowerCase() != search_input.charAt(0).toUpperCase()){

      console.log("User searched alpha first.");
      var prefix = search_input.substring(0,4);
      var number = search_input.substring(4);

      //If they entered room number with a space:
      if (number && number.charAt(0) == ' ') {

        console.log("Entered room number w/ a space.")
        number = number.substring(1);

      }

      if (prefix && number){

        console.log("probably a properly formatted search.");
        var query1 = "select * from room_data where room_num like '" + number + "%' and wing_id like '" + prefix + "%';";
        console.log(query1);
        con.query(query1, function (err, result) {
            if (err){
              res.render('pages/home',{
      //        local_css: "signin.css",
              my_title: "Search Results",
              search_result:null,
              userProfile:userProfile
            });
            }
            res.render('pages/home',{
      //        local_css: "signin.css",
              my_title: "Search Results",
              search_result:result,
              userProfile:userProfile
            });
          console.log(result);
        });

      }
      else if (prefix && !number){

        console.log("no room number on alpha search.");
        var query1 = "select * from room_data where wing_id like '" + prefix + "%';";
        console.log(query1);
        con.query(query1, function (err, result) {
            if (err){
              res.render('pages/home',{
      //        local_css: "signin.css",
              my_title: "Search Results",
              search_result:null,
              userProfile:userProfile
            });
            }
            res.render('pages/home',{
      //        local_css: "signin.css",
              my_title: "Search Results",
              search_result:result,
              userProfile:userProfile
            });
          console.log(result);
        });

      }
      else {

        console.log("bad alpha search.");
        var query1 = "select * from room_data where room_num like '" + search_input + "%';";
        console.log(query1);
        con.query(query1, function (err, result) {
            if (err){
              res.render('pages/home',{
      //        local_css: "signin.css",
              my_title: "Search Results",
              search_result:null,
              userProfile:userProfile
            });
            }
            res.render('pages/home',{
      //        local_css: "signin.css",
              my_title: "Search Results",
              search_result:result,
              userProfile:userProfile
            });
          console.log(result);
        });

      }

    }
    //Else they searched a number first or invalid input:
    else {

      console.log("User searched a number.");

      var query1 = "select * from room_data where room_num like '" + search_input + "%';";
      console.log(query1);
      con.query(query1, function (err, result) {
          if (err){
            res.render('pages/home',{
    //        local_css: "signin.css",
            my_title: "Search Results",
            search_result:null,
            userProfile:userProfile
          });
          }
          res.render('pages/home',{
    //        local_css: "signin.css",
            my_title: "Search Results",
            search_result:result,
            userProfile:userProfile
          });
        console.log(result);
      });

    }

  }
  else {

    console.log("Invalid search requested.");

    res.render('pages/home',{
  //        local_css: "signin.css",
          my_title: "Search Results",
          search_result:null,
          userProfile:userProfile
        });

  }

});

//
//app.post('/home/pick_color', function(req, res) {
//	var color_hex = req.body.color_hex;
//	var color_name = req.body.color_name;
//	var color_message = req.body.color_message;
//	var insert_statement = "INSERT INTO favorite_colors(hex_value, name, color_msg) VALUES('" + color_hex + "','" +
//							color_name + "','" + color_message +"');";
//
//	var color_select = 'select * from favorite_colors;';
//	db.task('get-everything', task => {
//    return task.batch([
//      task.any(insert_statement),
//      task.any(color_select)
//    ]);
//  })
//  .then(info => {
//  	res.render('pages/home',{
//				my_title: "Home Page",
//				data: info[1],
//				color: color_hex,
//				color_msg: color_message
//			})
//  })
//  .catch(error => {
//    // display error message in case an error
//      request.flash('error', err);
//      response.render('pages/home', {
//        title: 'Home Page',
//        data: '',
//        color: '',
//        color_msg: ''
//      })
//  });
//});
//
// registration page

//
// app.post('/reg_user', function(req, res) {
//
//   var username = req.body.username;
//   var pass = req.body.pass;
//
//   if (username != '' && pass != ''){
// 	var insert_statement = "INSERT INTO users(username, password) VALUES('" + username + "','" + pass +"');";
//   console.log("uname and pass entered.");
//   user_con.query(insert_statement, function (err, result) {
//       if (err){
//         res.render('pages/home',{
// //        local_css: "signin.css",
//         my_title: "Search Results",
//         search_result:null,
//         user:null
//       });
//       }
//       res.render('pages/home',{
// //        local_css: "signin.css",
//         my_title: "Search Results",
//         search_result:null,
//         user:username
//       });
//     //console.log(username);
//   });
//   }
//   else {
//     console.log("You left your name or password blank.")
//       res.render('pages/home',{
// //        local_css: "signin.css",
//         my_title: "Search Results",
//         search_result:null,
//         user:null
//       });
//   }
// });

app.listen(process.env.PORT);
