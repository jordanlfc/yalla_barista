var LocalStrategy = require("passport-local").Strategy;

var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

function getRandomInt(max) {
  var randomNumber = Math.floor(Math.random() * Math.floor(max));
  return randomNumber.toString()
}

module.exports = function(passport) {
 passport.serializeUser(function(user, done){
  done(null, user.id);
 });

 passport.deserializeUser(function(id, done){
  connection.query("SELECT * FROM users WHERE id = ? ", [id],
   function(err, rows){
    done(err, rows[0]);
   });
 });

 passport.use(
  'business-signup',
  new LocalStrategy({
   usernameField : 'email',
   passwordField: 'password',
   passReqToCallback: true
  },
  function(req, email, password, done){
   connection.query("SELECT * FROM users WHERE email = ? ", 
   [email], function(err, rows){
    if(err)
     return done(err);
    if(rows.length){
     return done(null, false, req.flash('signupMessage', 'That is already taken'));
    }else{
     var newUserMysql = {
      email: email,
      password: bcrypt.hashSync(password, null, null)
     };

     var insertQuery = "INSERT INTO users (email, password , company_name, is_business, membership_active, phone, country, city, employees_number, is_admin, is_candidate, agreed) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

     connection.query(insertQuery, [ 
       newUserMysql.email, 
       newUserMysql.password, 
       req.body.name,
       1,
       1,
       req.body.phone,
       req.body.country, 
       req.body.city,
       req.body.numemp,
       0,
       0,
       req.body.agreed,
      ],
      function(err, rows){
       newUserMysql.id = rows.insertId;

       return done(null, newUserMysql);
      });
    }
   });
  })
 );
 passport.use(
  'local-signup',
  new LocalStrategy({
   usernameField : 'email',
   passwordField: 'password',
   passReqToCallback: true
  },
  function(req, email, password, done){
   connection.query("SELECT * FROM users WHERE email = ? ", 
   [email], function(err, rows){
    if(err)
     return done(err);
    if(rows.length){
     return done(null, false, req.flash('signupMessage', 'That is already taken'));
    }else{
     var newUserMysql = {
      email: email,
      password: bcrypt.hashSync(password, null, null)
     };

     var insertQuery = "INSERT INTO users (email, password , fname, lname, is_candidate, membership_active, agreed) values (?, ?, ?, ?, ?, ?, ?)";

     connection.query(insertQuery, [ 
       newUserMysql.email, 
       newUserMysql.password, 
       req.body.fname,
       req.body.lname,
       1,
       0,
       req.body.agreed,
      ],
      function(err, rows){
       newUserMysql.id = rows.insertId;

       return done(null, newUserMysql);
      });
    }
   });
  })
 );

 passport.use(
  'local-login',
  new LocalStrategy({
   usernameField : 'email',
   passwordField: 'password',
   passReqToCallback: true
  },
  function(req, email, password, done){
   connection.query("SELECT * FROM users WHERE email = ? ", [email],
   function(err, rows){
    if(err)
     return done(err);
    if(!rows.length){
     return done(null, false, req.flash('loginMessage', 'No User Found'));
    }
    if(!bcrypt.compareSync(password, rows[0].password))
     return done(null, false, req.flash('loginMessage', 'Wrong Password'));

    return done(null, rows[0]);
   });
  })
 );
};