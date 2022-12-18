const express = require("express");
const router = express.Router();

// .use the express.static() middleware to serve static files from the public directory
// This code is the final part of the file that exports the router object. The router.use() method mounts the express.static() middleware to serve static files from the public directory. This allows the application to serve static assets such as CSS and JavaScript files.

// The code then creates a new instance of the MyEmitter class, which extends the EventEmitter class from the events module. The EventEmitter class allows the application to define custom events and attach event listeners to them. In this case, the MyEmitter class is used to define a custom log event that is emitted whenever a log message is generated. The myEmitter object is then used to attach an event listener to the log event, which invokes the logEvent() function to log the event details.

// The code also imports the gresSearchData, pgData, and monData modules, which contain functions that query data from a Postgres database and a MongoDB database. These modules will be used by the application to retrieve data to display to the user.

router.use(express.static("public"));

const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const logEvent = require("../event_emitters/logEvents");

myEmitter.addListener("log", (msg, level, logName) =>
  logEvent(msg, level, logName)
);

const gresSearchData = require("../model/controllers/p.search.dal");
const pgData = require("../model/controllers/p.movies.dal");

const monData = require("../model/controllers/m.movies.dal");

//  Fuzzy Search query
// This code defines a route that processes a search query when a GET request is sent to the /mongo path. The route expects the search query to be sent as a query parameter in the URL. The callback function for this route uses the req.query.search property to retrieve the search query from the request. If the req.query.search property is not defined, the user is redirected to the home page.

// Next, the code uses the movies object to query the MongoDB database for movies that match the search query. The movies object is created earlier in the file and is connected to a collection of movies in the MongoDB database. The movies.aggregate() method is used to run an aggregation pipeline that uses the $search stage to perform a text search on the title field of the movie documents. The pipeline is configured to return up to 54 matching documents and to use fuzzy search matching with a maximum of 2 edits.

// The search results are then passed to the m_search view using the res.render() method and the mSearch and title variables are defined. The title variable is set to "Mongo Search" and the mSearch variable is set to the array of search results returned by the aggregation pipeline.

// Finally, the code uses the myEmitter object to emit a log event with details of the search query and the HTTP response status code. This will trigger the logEvent() function to log the event details. This allows the application to keep track of all search queries made by users.
router.get("/mongo", async (req, res) => {
  try {
    if (DEBUG) console.log(req.query);

    if (!req.query.search) {
      res.redirect("/");
      return;
    }

    let searchResults = movies
      .aggregate([
        {
          $search: {
            autocomplete: {
              query: `${req.query.search}`,
              path: "title",
              fuzzy: {
                maxEdits: 2,
              },
            },
          },
        },
      ])
      .limit(54);
    const mSearch = await searchResults.toArray();

    res.render("searchResults/m_search", { mSearch, title: "Mongo Search" });

    myEmitter.emit(
      "log",
      `UserID: ${user._id}\tUser: ${user.name}\tEmail: ${user.email}\tSearched: ${req.query.search}\tSTATUS: ${res.statusCode}`,
      "INFO",
      "searchLog.log"
    );
  } catch (error) {
    // res.status(503).render("503");
  }
});

// Query the film_list table in the Postgres database for movies with a title that matches the search query.
// This code defines a route that processes a search query when a GET request is sent to the /postgres path. The route expects the search query to be sent as a query parameter in the URL. The callback function for this route uses the req.query.search property to retrieve the search query from the request. If the req.query.search property is not defined, the user is redirected to the home page.

// Next, the code uses the gresSearchData.titleSearch() function to query the Postgres database for movies that match the search query. The gresSearchData object is created earlier in the file and contains the titleSearch() function that queries the film_list table in the Postgres database for movies with a title that matches the search query. The titleSearch() function returns an array of movies that match the search query.

// The search results are then passed to the p_search view using the res.render() method and the pSearch and title variables are defined. The title variable is set to "Postgres Search" and the pSearch variable is set to the array of search results returned by the titleSearch() function.

// Finally, the code uses the myEmitter object to emit a log event with details of the search query and the HTTP response status code. This will trigger the logEvent() function to log the event details. This allows the application to keep track of all search queries made by users.
router.get("/postgres", async (req, res) => {
  try {
    if (DEBUG) console.log(req.query);
    if (!req.query.search) {
      res.redirect("/");
    }
    let pSearch = await gresSearchData.titleSearch(req.query.search);

    res.render("searchResults/p_search", { pSearch, title: "Postgres Search" });

    myEmitter.emit(
      "log",
      `UserID: ${user._id} User: ${user.name}Email: ${user.email}\tSearched: ${req.query.search}\tSTATUS: ${res.statusCode}`,
      "INFO",
      "searchLog.log"
    );
  } catch (error) {
    console.error(error);
    // res.status(503).render("503");
  }
});

//  Get film details from MongoDB
// This code defines a route that processes a request for detailed information about a specific movie when a GET request is sent to the /mongo/:_id path. The :_id path parameter is used to specify the unique ID of the movie for which detailed information is requested. The callback function for this route uses the req.params._id property to retrieve the movie ID from the request.

// Next, the code uses the monData.getMongoMovieDetails() function to query the MongoDB database for detailed information about the movie with the specified ID. The monData object is created earlier in the file and contains the getMongoMovieDetails() function that queries the movies collection in the MongoDB database for the movie with the specified ID. The getMongoMovieDetails() function returns an array with the detailed information about the movie.

// If the array returned by the getMongoMovieDetails() function is empty, the code sends a HTTP 502 response to the client with a "Bad Gateway" error message. If the array is not empty, the detailed information about the movie is passed to the m_movieDetails view using the res.render() method and the mongoMovies and title variables are defined. The title variable is set to "Film Details" and the mongoMovies variable is set to the array of detailed information about the movie returned by the getMongoMovieDetails() function.
router.get("/mongo/:_id", async (req, res) => {
  try {
    if (DEBUG) console.log(req.params);
    const mongoMovies = await monData.getMongoMovieDetails(req.params._id);
    if (DEBUG) console.log(mongoMovies);

    if (mongoMovies.length === 0) {
      res.status(502).render("502");
    } else {
      res.render("mongo_movies", { mongoMovies, title: "Movie Details" });
    }
  } catch (error) {
    console.error(error);
    res.status(503).render("503");
  }
});

// Get film details from Postgres
// This code defines a route that processes a request for detailed information about a specific movie when a GET request is sent to the /postgres/:id path. The :id path parameter is used to specify the unique ID of the movie for which detailed information is requested. The callback function for this route uses the req.params.id property to retrieve the movie ID from the request.

// Next, the code uses the pgData.getPostgresFilmDetails() function to query the Postgres database for detailed information about the movie with the specified ID. The pgData object is created earlier in the file and contains the getPostgresFilmDetails() function that queries the movie_details table in the Postgres database for the movie with the specified ID. The getPostgresFilmDetails() function returns an array with the detailed information about the movie.

// If the array returned by the getPostgresFilmDetails() function is empty, the code sends a HTTP 502 response to the client with a "Bad Gateway" error message. If the array is not empty, the detailed information about the movie is passed to the p_filmDetails view using the res.render() method and the postMovies and title variables are defined. The title variable is set to "Film Details" and the postMovies variable is set to the array of detailed information about the movie returned by the getPostgresFilmDetails() function.
router.get("/postgres/:id", async (req, res) => {
  try {
    if (DEBUG) console.log(req.params);
    const postMovies = await pgData.getPostgresMovieDetails(req.params.id);
    if (DEBUG) console.log(postMovies);

    if (postMovies.length === 0) {
      res.status(502).render("502");
    } else {
      res.render("postgres_movies", { postMovies, title: "Movie Details" });
    }
  } catch (error) {
    console.error(error);
    res.status(503).render("503");
  }
});

module.exports = router;
