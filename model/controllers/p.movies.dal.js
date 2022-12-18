// Group 1 Final Sprint
// Chris, Mark, Will, Neil
// Rockbuster 
// December 10th


const dal = require("../../config/postgres.db.config");

// This is an async function that displays a sample of movies from a PostgresSQL database. The function uses the query() method provided by a data access layer (DAL) to execute a SQL SELECT statement that gets a random sample of 53 movies from the film_list table. The function uses the await keyword to wait for the query() method to finish before returning the array of movies contained in the rows property of the response object. If an error occurs, it will be caught by the try-catch block and logged to the console using console.error().
const displayAllPostgresMovies = async () => {
  let response;
  try {
    response = await dal.query(
      "SELECT fid, title, release_year FROM film_list ORDER BY random() LIMIT 53;"
    );
    return response.rows;
  } catch (error) {
    console.error(error);
  }
};

// This is an async function that gets the details of a film from a PostgresSQL database. The function takes in the fid of the film to be searched for as a parameter. It uses the query() method provided by a data access layer (DAL) to execute a SQL SELECT statement that gets the details of the film with the fid specified in the parameter. The function uses the await keyword to wait for the query() method to finish before returning the array of movies contained in the rows property of the response object. If an error occurs, it will be caught by the try-catch block and logged to the console using console.error().
const getPostgresMovieDetails = async (id) => {
  let response;
  try {
    response = await dal.query("SELECT * FROM film_list WHERE fid = $1;", [id]);
    return response.rows;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  displayAllPostgresMovies,
  getPostgresMovieDetails,
};
