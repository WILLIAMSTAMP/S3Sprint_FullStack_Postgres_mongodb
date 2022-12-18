const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const {
  checkAuthenticated,
  checkNotAuthenticated,
  getUserByEmail,
  addUser,
  deleteUser,
} = require("../model/controllers/m.auth.dal");

router.use(express.static("public"));

// Login Route
// This code defines a route that renders a login page when a GET request is sent to the /login path. The router.get() method takes in the path and a callback function as arguments. The callback function uses the checkNotAuthenticated() function to check if the user making the request is authenticated. If the user is authenticated, the callback function redirects the user to the homepage. If the user is not authenticated, the callback function uses the res.render() method to render the auth/login view and pass in a title variable set to "Login". This allows the view to display a title for the page.
router.get("/login", checkNotAuthenticated, async (req, res) => {
  res.render("auth/login", { title: "Login" });
});

// Authentication Strategy
// This code defines a route that processes a login form when a POST request is sent to the /login path. The router.post() method takes in the path and a callback function as arguments. The callback function uses the checkNotAuthenticated() function to check if the user making the request is authenticated. If the user is authenticated, the callback function redirects the user to the homepage. If the user is not authenticated, the callback function uses the passport.authenticate() method provided by the Passport.js authentication middleware to authenticate the user.

// The passport.authenticate() method takes in the authentication strategy (in this case, local) and an options object as arguments. The options object specifies the behavior of the authentication process. If the authentication is successful, the user is redirected to the homepage using the successRedirect property. If the authentication fails, the user is redirected to the login page using the failureRedirect property. The failureFlash property is set to true to enable flash messages, which allows the application to display error messages to the user.
router.get("/login", checkNotAuthenticated, async (req, res) => {
  res.render("auth/login", { title: "Login" });
});
router.post(
  "/login",
  checkNotAuthenticated,
  // calls function from passport.js
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })
);

// Logout route handler
// This code is the handler for logging a user out of an application. The router.get() method creates a route that listens for HTTP GET requests at the specified path ("/logout"). The checkAuthenticated middleware is then executed to check if the user is authenticated before proceeding.

// If the user is authenticated, the req.logout() method is called. This method is typically provided by a middleware like Passport.js and is used to log the user out of the application. A callback function is passed to req.logout(), which is executed after the logout operation is complete. If an error occurs during the logout process, the next(error) method is called to pass the error to the error handling middleware. If the logout is successful, the user is redirected to the login page.
router.get("/logout", checkAuthenticated, async (req, res) => {
  // Call the logout method on the request object, passing a callback function
  req.logout(function (error) {
    if (error) {
      // Handle any errors that occurred during the logout operation
      return next(error);
    }

    // Redirect the user to the login page
    res.redirect("/auth/login");
  });
});

// Sign up Route
// This code defines a route that renders a registration page when a GET request is sent to the /register path. The router.get() method takes in the path and a callback function as arguments. The callback function uses the checkNotAuthenticated() function to check if the user making the request is authenticated. If the user is authenticated, the callback function redirects the user to the homepage. If the user is not authenticated, the callback function uses the res.render() method to render the auth/register view and pass in a title variable set to "Sign Up". This allows the view to display a title for the page.
router.get("/register", checkNotAuthenticated, async (req, res) => {
  res.render("auth/register", { title: "Sign Up" });
});
// Submits user information to database
// This code defines a route that processes a registration form when a POST request is sent to the /register path. The router.post() method takes in the path and a callback function as arguments. The callback function uses the checkNotAuthenticated() function to check if the user making the request is authenticated. If the user is authenticated, the callback function redirects the user to the homepage. If the user is not authenticated, the callback function uses the bcrypt module to hash the user's password before storing it in a database.

// The bcrypt.hash() method takes in the password and a salt as arguments and returns a hashed version of the password. The salt is a random string of characters that is used to create a unique hash for the password. This makes it more difficult for an attacker to crack the password by using a pre-computed hash table.

// After hashing the password, the callback function creates a user object with the form data and the hashed password. The user object is then stored in the database using the addUser() function. If any errors occur during the registration process, they will be caught by the try-catch block and logged to the console using console.error().
router.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    // encrypt password before storing in database
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // object created to insert into database
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    };
    // if statements to handle optional input fields
    // This code is part of the callback function for the POST /register route defined earlier. It checks if a user with the same email already exists in the database using the getUserByEmail() function. If the user already exists, the code logs an error message to the console and uses the req.flash() method to display an error message to the user. The user is then redirected to the registration page.

    // If the user does not already exist, the code logs a success message to the console and uses the addUser() function to add the user to the database. The code then uses the req.flash() method to display a success message to the user and redirects the user to the login page. If any errors occur during the registration process, they will be caught by the try-catch block and logged to the console using console.error(). A generic error message is also displayed to the user and the user is redirected to the registration page.
    const userCheck = await getUserByEmail(user.email);
    if (userCheck != null) {
      console.log("User already exists");
      req.flash("error", "User with this email already exists");
      res.redirect("/auth/register");
    } else {
      DEBUG && console.log("Registering User: " + user.name);
      addUser(user);
      DEBUG && console.log("Registered User: " + user.name);
      req.flash("success", "User succesfully created");
      res.redirect("/auth/login");
    }
  } catch (error) {
    console.error(error);
    req.flash("error", "Oops, Something went wrong");
    res.redirect("/auth/register");
  }
});

// Route to User Account page
// This code defines two routes for a user profile page. The first route, GET /profile, renders the profile page when a GET request is sent to the /profile path. The callback function for this route uses the checkAuthenticated() function to check if the user making the request is authenticated. If the user is not authenticated, the user is redirected to the login page. If the user is authenticated, the callback function uses the res.render() method to render the auth/profile view and pass in a title variable set to "My Profile" and a user variable set to the user object stored in the req.body.user property.

// The second route, POST /profile, processes a form submission to delete the user from the database when a POST request is sent to the /profile path. The callback function for this route uses the checkAuthenticated() function to check if the user making the request is authenticated. If the user is not authenticated, the user is redirected to the login page. If the user is authenticated, the callback function uses the deleteUser() function to delete the user from the database and logs the user out of the application.

// If the user is successfully unsubscribed and logged out, a success message is displayed to the user and the user is redirected to the login page. If any errors occur during the unsubscription process, they will be caught by the try-catch block and logged to the console using console.error(). An error message is also displayed to the user and the user is redirected to the profile page.
router.get("/account", checkAuthenticated, async (req, res) => {
  res.render("auth/account", { title: "My Account" });
});
// Submits a request to delete user from database
router.post("/account", checkAuthenticated, async (req, res) => {
  console.log("Unsubscribing..." + user.name);
  try {
    await deleteUser(user.email);
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success", "Successfully Unsubscribed");

      user = null;
      res.redirect("/auth/login");
    });
  } catch (error) {
    req.flash("error2", "Oops, Something went wrong");
    console.error(error);
    res.redirect("/auth/profile");
  }
});

// Route to call function to log out user
// This code defines a route that logs a user out of the application when a DELETE request is sent to the /logout path. The router.delete() method takes in the path and a callback function as arguments. The callback function uses the req.logout() method provided by the Passport.js authentication middleware to log the user out of the application. The req.logout() method takes in a callback function as an argument, which is called after the user is logged out.

// The DELETE HTTP method is used for this route because it is the appropriate method for logging a user out of the application. The DELETE method is used to delete a resource from the server, and in this case, the user's authenticated session is deleted from the server.
router.delete("/logout", (req, res, next) => {
  DEBUG && console.log("logout initialized");

  req.logout(function (error) {
    if (error) {
      return next(error);
    }
    user = null;
    res.redirect("/auth/login");
  });
});

module.exports = router;
