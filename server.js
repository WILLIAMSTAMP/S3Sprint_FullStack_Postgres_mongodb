// Group 1 Final Sprint
// Chris, Mark, Will, Neil
// Rockbuster 
// December 10th
// This is our server file that starts the backend server.

const express = require("express");
const app = express();

const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const morgan = require("morgan");
const moment = require("moment");
const { ObjectId } = require("mongodb");
require("dotenv").config();

const initializePassport = require("./config/passport");
initializePassport(passport);

const { checkAuthenticated } = require("./model/controllers/m.auth.dal");

global.DEBUG = false;

// Defines a constant named PORT that sets the server's port number to the value of the PORT environment variable, or 3030 if the variable is not set. This allows the server to run on the specified port and makes it easy to change the port number by setting the environment variable.
const PORT = process.env.PORT || 3030;

// This code is setting up an Express.js web server. It configures the "view engine" to use Embedded JavaScript (EJS) templates, sets up the server to use the Morgan HTTP request logger in "dev" mode if the DEBUG flag is set to true, sets up the server to serve static files from the "public" directory, configures the server to parse URL-encoded and JSON-encoded request bodies, configures the server to use the flash middleware for displaying messages, configures the server to use the session middleware for managing sessions, initializes the Passport.js authentication middleware and configures it to use sessions, and sets up the methodOverride middleware to allow clients to use HTTP methods other than GET and POST by overriding the _method query parameter. Additionally, if the DEBUG flag is set to true, it sets up a middleware that logs the req.session object to the console on each request.
// ejs view engine
app.set("view engine", "ejs");

// Sets up the Morgan HTTP request logger middleware to log requests to the server in "dev" mode if the DEBUG flag is set to true. When the logger is in "dev" mode, it will produce detailed logs of each request, including the request method, URL, response status, and response time. This can be useful for debugging and monitoring the server.
if (DEBUG) app.use(morgan("dev"));

// Sets up the Express.js static middleware to serve static files from the "public" directory. This allows the server to serve files such as images, stylesheets, and client-side JavaScript files from the specified directory. 
app.use(express.static("public"));

// Sets up the Express.js urlencoded middleware to parse URL-encoded request bodies. This middleware is typically used to parse the data in application/x-www-form-urlencoded format, which is often used to submit HTML form data. When a client sends an HTTP request with a URL-encoded request body, the middleware will parse the body and make the data available in the request.body object. The { extended: true } option is used to enable the use of the qs library to parse the request body, which allows for more advanced parsing options.
app.use(express.urlencoded({ extended: true }));

// Sets up the Express.js json middleware to parse JSON-encoded request bodies. This middleware is typically used to parse the data in application/json format, which is often used to send data from a client-side JavaScript application to a server. 
app.use(express.json());

// Sets up the flash middleware for the Express.js app. The flash middleware allows messages to be stored in the session and displayed on the next request. This is often used to display success or error messages after form submission. To use the flash middleware, a message can be set in the session using req.flash(key, value), where key is the name of the message and value is the message itself. 
app.use(flash());

// Sets up the session middleware for the Express.js app. The session middleware allows the server to store data in the session and make it available on subsequent requests. This is often used to store user authentication information or other data that needs to persist across requests. The session middleware requires a secret to sign the session ID cookie, which is provided as the value of the SESSION_SECRET environment variable. The resave and saveUninitialized options are set to false to prevent the session from being automatically saved to the session store. The cookie option is used to configure the session ID cookie, such as setting its maximum age to 900000 milliseconds (15 minutes).
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 900000 },
  })
);
// This code sets up the Passport.js authentication middleware for the Express.js app. The passport.initialize() middleware is used to initialize Passport and restore authentication state from the session. The passport.session() middleware is used to establish persistent login sessions. The methodOverride middleware is used to allow clients to use HTTP methods other than GET and POST by overriding the _method query parameter. For example, a client could use a POST request with the _method parameter set to DELETE to simulate a DELETE request. This can be useful for working around the limitations of HTML forms, which only support GET and POST methods.
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

DEBUG &&
  app.use((req, res, next) => {
    console.log(req.session);
    next();
  });



// This code is defining routes for an Express.js web server. It sets up two routes that use imported routers to handle requests to the /search and /auth paths. It also sets up a listener that connects to a MongoDB server and exposes the movies and usersData collections to the global scope. It then defines a route that displays all movies from MongoDB and PostgreSQL databases on the "home" page. It also defines two routes that return the data for all movies in the MongoDB and PostgreSQL databases, respectively. It defines another route that displays the details of a movie with a given ID from either the MongoDB or PostgreSQL database, depending on the URL. This route requires the client to be authenticated, as indicated by the checkAuthenticated middleware. It also defines a route that displays the details of a movie with a given ID from the MongoDB database. This route requires the client to be authenticated, as indicated by the checkAuthenticated middleware. Finally, it defines a route that displays the details of a movie with a given ID from the PostgreSQL database. This route requires the client to be authenticated, as indicated by the checkAuthenticated middleware.
const pgData = require("./model/controllers/p.movies.dal");
const monData = require("./model/controllers/m.movies.dal");
const searchRouter = require("./authRoutes/search");
const authRouter = require("./authRoutes/auth");


// These lines of code set up two routes that use imported routers to handle requests to the /search and /auth paths. The app.use() method sets up a route that will match any request path that starts with the specified path. This means that requests to paths such as /search/foo, /search/bar, and /search/baz will all be handled by the searchRouter and requests to paths such as /auth/foo, /auth/bar, and /auth/baz will all be handled by the authRouter. This allows the main app to delegate requests to these paths to the imported routers, which can contain their own route definitions and middleware. This can help to organize the app's route handlers and make the code easier to maintain.
app.use("/search", searchRouter);

app.use("/auth", authRouter);



// This code sets up a listener for the Express.js app that will start the server and listen for incoming requests on the specified port. The listener uses the async keyword to define an asynchronous function that will be called when the server starts. The function first imports a module named mongo.db.config and uses it to connect to a MongoDB server. If the connection is successful, it exports the movies and usersData collections to the global scope using global.movies and global.usersData, respectively. It then logs a message to the console indicating that the server is running and listening on the specified port. If the connection to the MongoDB server fails, it logs the error to the console.
app.listen(PORT, "localhost", async () => {
  const dal = require("./config/mongo.db.config");
  try {
    await dal.connect();
    global.movies = dal.db("sample_mflix").collection("movies");
    global.usersData = dal.db("sample_mflix").collection("users");

    console.log(
      `Server is running on http://localhost:${PORT}; Ctrl-C to terminate...`
    );
  } catch (error) {
    console.error(error);
  }
});


// This code defines a route that will match requests to the root path (/). The route uses the checkAuthenticated middleware to ensure that the client is authenticated before continuing. If the client is not authenticated, the middleware will redirect the client to the login page. If the client is authenticated, the route will attempt to retrieve all movies from the MongoDB and PostgreSQL databases using the displayAllMongoMovies and displayAllPostgresMovies methods from the monData and pgData modules, respectively. If the data is successfully retrieved, the route will render the "home" view, passing the movies data and a title as local variables. If either of the data retrieval methods fails, the route will return an HTTP 502 Bad Gateway error. If an error occurs in the route handler itself, the route will return an HTTP 503 Service Unavailable error.
app.get("/", checkAuthenticated, async (req, res) => {
  try {
    const mongoMovies = await monData.displayAllMongoMovies();

    const postMovies = await pgData.displayAllPostgresMovies();
    if (DEBUG) console.log(postMovies);

    if (mongoMovies.length === 0 || postMovies.length === 0) {
      res.status(502).render("502");
    } else {
      res.render("home", {
        mongoMovies,
        postMovies,
        title: "Home",
      });
    }
  } catch (error) {
    console.error(error);

    res.status(503).render("503");
  }
});

// This code defines a route that will match requests to the /allMongoMovies path. When a request is made to this path, the route will use the displayAllMongoMovies method from the monData module to retrieve all movies from the MongoDB database. The route will then return the movie data as a JSON response to the client. This allows the client to retrieve the data without rendering a view.
app.get("/allMongoMovies", async (req, res) => {
  const movie_data = await monData.displayAllMongoMovies();
  res.json(movie_data);
});

// This code defines a route that will match requests to the /allPostgresMovies path. When a request is made to this path, the route will use the displayAllPostgresMovies method from the pgData module to retrieve all movies from the PostgreSQL database. The route will then return the movie data as a JSON response to the client. This allows the client to retrieve the data without rendering a view.
app.get("/allPostgresMovies", async (req, res) => {
  const movie_data = await pgData.displayAllPostgresMovies();
  res.json(movie_data);
});

// This code defines a route that will match requests to paths with a dynamic parameter named id. When a request is made to this route, the checkAuthenticated middleware will be run to ensure that the client is authenticated. If the client is not authenticated, the middleware will redirect the client to the login page. If the client is authenticated, the route will check the URL of the request to determine whether to retrieve movie details from the MongoDB or PostgreSQL database. If the URL contains the letter a, the route will use the getMongoMovieDetails method from the monData module to retrieve the details for the movie with the specified id from the MongoDB database. If the movie data is successfully retrieved, the route will render the "mongo_movies" view, passing the movie data and a title as local variables. If the movie data could not be retrieved, the route will return an HTTP 502 Bad Gateway error. If the URL does not contain the letter a, the route will use the getPostgresMovieDetails method from the pgData module to retrieve the details for the movie with the specified id from the PostgreSQL database. If the movie data is successfully retrieved, the route will render the "posgres_movies" view, passing the movie data and a title as local variables. If the movie data could not be retrieved, the route will return an HTTP 502 Bad Gateway error. If an error occurs in the route handler itself, the route will return an HTTP 503 Service Unavailable error.
app.get("/:id", checkAuthenticated, async (req, res) => {
  try {
    if (DEBUG) console.log(req.params);

    if (req.url.includes("a")) {
      const mongoMovies = await monData.getMongoMovieDetails(req.params.id);
      if (DEBUG) console.log(mongoMovies);

      if (mongoMovies.length === 0) {
        res.status(502).render("502");
      } else {
        res.render("mongo_movies", { mongoMovies, title: "Home" });
      }
    } else {
      const postMovies = await pgData.getPostgresMovieDetails(req.params.id);
      if (DEBUG) console.log(postMovies);

      if (postMovies.length === 0) {
        res.status(502).render("502");
      } else {
        res.render("posgres_movies", { postMovies, title: "Home" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(503).render("503");
  }
});
