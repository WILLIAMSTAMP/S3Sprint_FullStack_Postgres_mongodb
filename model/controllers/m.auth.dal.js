// Group 1 Final Sprint
// Chris, Mark, Will, Neil
// Rockbuster 
// December 10th


const { ObjectId } = require("mongodb");

// This async function inserts a new user document into a collection called usersData.
// The function uses the await keyword to wait for the insertOne() method to finish before moving on to the next line of code.
// If an error occurs, it will be caught by the try-catch block and logged to the console using console.error().
async function addUser(user) {
  try {
    await usersData.insertOne(user);
  } catch (error) {
    console.error(error);
  }
}

// This is an async function that deletes a user from a collection called usersData. The function takes in the email of the user to be deleted as a parameter and uses the await keyword to wait for the deleteOne() method to finish before moving on to the next line of code. If the DEBUG constant is set to true, the function will log a message to the console before attempting to delete the user. If an error occurs, it will be caught by the try-catch block and logged to the console using console.error().
async function deleteUser(email) {
  try {
    DEBUG && console.log("Deleting..." + email);
    await usersData.deleteOne({ email: `${email}` });
  } catch (error) {
    console.error(error);
  }
}

// This is an async function that searches for a user by email in a collection called usersData. The function takes in the email of the user to be searched for as a parameter and uses the await keyword to wait for the findOne() method to finish before moving on to the next line of code. If the DEBUG constant is set to true, the function will log a message to the console before attempting to search for the user.
// If the user is found, the function will set the user global variable to the found user and log a success message to the console.  If the user is not found, the function will log a failure message to the console. If an error occurs, it will be caught by the try-catch block and logged to the console using console.error().
async function getUserByEmail(email) {
  DEBUG && console.log("getUserByEmail() searching: " + email);
  try {
    const user = await usersData.findOne({ email: email });
    global.user = user;
    if (user === null) {
      console.log("getUserByEmail() FAILED: Could not get User");
    } else {
      DEBUG && console.log("getUserByEmail() SUCCESS: User Found");
      return user;
    }
  } catch (error) {
    console.error(error);
  }
}

// This is another async function that searches for a user by id in a collection called usersData. The function takes in the id of the user to be searched for as a parameter and uses the await keyword to wait for the findOne() method to finish before moving on to the next line of code. If the DEBUG constant is set to true, the function will log a message to the console before attempting to search for the user.

// The function defines an object parameter called par which is initialized to the id of the user to be searched for, converted to an ObjectId type. This is used in the findOne() method to query the collection for the user.

// If the user is found, the function will log a success message to the console and return the user. If the user is not found, the function will log a failure message to the console. If an error occurs, it will be caught by the try-catch block and logged to the console using console.log().
async function getUserById(id) {
  DEBUG && console.log("getUserById() searching: " + id);

  // Defined object parameter to pass into database query
  const par = ObjectId(`${id}`);

  try {
    const user = await usersData.findOne({ _id: par });
    DEBUG && console.log(user);

    if (user === null) {
      console.log("getUserById() FAILED: Could not get User");
    } else {
      DEBUG && console.log("getUserById() SUCCESS: User Found");
      return user;
    }
  } catch (error) {
    console.error(error);
  }
}

// These are two functions that can be used to check the authentication status of a user in a web application. The checkAuthenticated() function checks if the user making the request is authenticated, and if so, allows the request to continue by calling the next() function. If the user is not authenticated, the function redirects the user to the login page.

// The checkNotAuthenticated() function does the opposite. It checks if the user making the request is authenticated, and if so, redirects the user to the homepage. If the user is not authenticated, the function allows the request to continue by calling the next() function.

// Both functions use the isAuthenticated() method, which is provided by an authentication middleware such as Passport.js. This method returns a boolean value indicating whether the user making the request is authenticated or not.
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

module.exports = {
  getUserByEmail,
  getUserById,
  addUser,
  deleteUser,
  checkAuthenticated,
  checkNotAuthenticated,
};
