// Group 1 Final Sprint
// Chris, Mark, Will, Neil
// Rockbuster 
// December 10th


const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");


// This code imports the getUserByEmail() and getUserById() functions from the m.auth.dal module. The getUserByEmail() function searches for a user by email in a database and returns the user if found. The getUserById() function searches for a user by id in a database and returns the user if found.
const {
  getUserByEmail,
  getUserById,
} = require("../model/controllers/m.auth.dal");


// This function initializes authentication in a web application using the Passport.js authentication middleware. The function takes in a passport object as a parameter and defines an authenticateUser() function that can be used to authenticate a user. The authenticateUser() function takes in the user's email and password as arguments and uses the getUserByEmail() function to search for the user in a database. If the user is not found, the function calls the done() callback with an error message.

// If the user is found, the function uses the bcrypt module to compare the password provided by the user with the hashed password stored in the database. If the passwords match, the function calls the done() callback with the user object as the argument. If the passwords do not match, the function calls the done() callback with an error message. If any errors occur during the authentication process, the function calls the done() callback with the error as the argument.
function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    DEBUG && console.log("Authenticating..." + email);
    const user = await getUserByEmail(email);
    DEBUG && console.log("Authenticated User: " + user);
    if (user == null) {
      return done(null, false, {
        message: `There is no user with email ${email}`,
      });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password Incorrect" });
      }
    } catch (err) {
      return done(err);
    }
  };

  passport.use(new localStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id));
  });
}

module.exports = initialize;
