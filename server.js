/***********************
  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
***********************/
var express = require('express'); //Ensure our express framework has been added
var app = express();
var mysql = require('mysql');

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
  var query1 = "select * from room_data"
  res.render('pages/home',{
//        local_css: "signin.css",
        my_title: "EC Nav",
        search_result:null,
        user:null
      })
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

app.get('/login', function(req, res) {
  //var query1 = "select * from room_data"
  res.render('pages/login',{
//        local_css: "signin.css",
        my_title: "Login Page"
      })
  });

//Our main search functionality:
app.get('/search', function(req, res) {
	var search_input = req.query.search_input;
  if(req.query.user){
    var user = req.query.user;
  } else {
    var user = null;
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
              username:user
            });
            }
            res.render('pages/home',{
      //        local_css: "signin.css",
              my_title: "Search Results",
              search_result:result,
              username:user
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
              username:user
            });
            }
            res.render('pages/home',{
      //        local_css: "signin.css",
              my_title: "Search Results",
              search_result:result,
              username:user
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
              username:user
            });
            }
            res.render('pages/home',{
      //        local_css: "signin.css",
              my_title: "Search Results",
              search_result:result,
              username:user
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
            username:user
          });
          }
          res.render('pages/home',{
    //        local_css: "signin.css",
            my_title: "Search Results",
            search_result:result,
            username:user
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
          username:user
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
app.get('/register', function(req, res) {
	res.render('pages/register',{
		my_title:"Registration Page"
	});
});

app.post('/reg_user', function(req, res) {

  var username = req.body.username;
  var pass = req.body.pass;

  if (username != '' && pass != ''){
	var insert_statement = "INSERT INTO users(username, password) VALUES('" + username + "','" + pass +"');";
  console.log("uname and pass entered.");
  user_con.query(insert_statement, function (err, result) {
      if (err){
        res.render('pages/home',{
//        local_css: "signin.css",
        my_title: "Search Results",
        search_result:null,
        user:null
      });
      }
      res.render('pages/home',{
//        local_css: "signin.css",
        my_title: "Search Results",
        search_result:null,
        user:username
      });
    //console.log(username);
  });
  }
  else {
    console.log("You left your name or password blank.")
      res.render('pages/home',{
//        local_css: "signin.css",
        my_title: "Search Results",
        search_result:null,
        user:null
      });
  }
});

/*Add your other get/post request handlers below here: */
// team stats:
//app.get('/team_stats', function(req, res) {
//  var query0 = 'SELECT * FROM football_games;';
//  var query1 = 'SELECT COUNT(*) FROM football_games AS count WHERE home_score > visitor_score;';
//  var query2 = 'SELECT COUNT(*) FROM football_games AS count WHERE home_score < visitor_score;';
//  db.task('get-everything', task => {
//      return task.batch([
//          task.any(query0),
//          task.any(query1),
//          task.any(query2)
//      ]);
//  })
//  .then(task => {
//    res.render('pages/team_stats',{
//        my_title: "Season Stats",
//        data: task[0],
//        wins: task[1][0].count,
//        losses: task[2][0].count
//      })
//  })
//  .catch(error => {
//      // display error message in case an error
//          request.flash('error', err);
//          res.render('pages/team_stats',{
//        my_title: "Season Stats",
//        data: '',
//        wins: '',
//        losses: ''
//      })
//  });
//});

//// registration page
//app.get('/player_info', function(req, res) {
//  var query0 = 'SELECT * FROM football_players ORDER BY name;';
//  db.task('get-everything', task => {
//      return task.batch([
//          task.any(query0)
//      ]);
//  })
//  .then(task => {
//    res.render('pages/player_info',{
//        my_title: "Player Information",
//        data: task[0],
//        played_games: null,
//        selected_player: null
//      })
//  })
//  .catch(error => {
//      // display error message in case an error
//          request.flash('error', err);
//          res.render('pages/player_info',{
//        my_title: "Player Information",
//        data: null,
//        played_games: null,
//        selected_player: null
//      })
//  });
//});
//
//app.get('/player_info/post', function(req, res) {
//  console.log(req.query.player_choice);
//  var q1 = 'SELECT * FROM football_players ORDER BY name;';
//  var q2 = "select * from football_players where id = '" + req.query.player_choice + "';";
//  console.log("SELECT COUNT(*) FROM football_games AS count WHERE " + req.query.player_choice + " = ANY(players);");
//  var q3  = "SELECT COUNT(*) FROM football_games AS count WHERE " + req.query.player_choice + " = ANY(players);";
//  db.task('get-everything', task => {
//        return task.batch([
//      task.any(q1),
//      task.any(q2),
//      task.any(q3)
//        ]);
//    })
//  .then(task => {
//    res.render('pages/player_info',{
//        my_title: "Player Information",
//        data: task[0],
//        selected_player: task[1],
//        played_games: task[2][0].count
//      })
//  })
//  .catch(error => {
//      // display error message in case an error
//          request.flash('error', err);
//          res.render('pages/player_info',{
//        my_title: "Player Information",
//        selected_player: null,
//        data: null,
//        played_games: null
//      })
//  });
//});
//
//
app.listen(process.env.PORT);
