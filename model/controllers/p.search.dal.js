// Group 1 Final Sprint
// Chris, Mark, Will, Neil
// Rockbuster 
// December 10th


const dal = require("../../config/postgres.db.config");

// This is an async function that searches for movies by title in a PostgresSQL database. The function takes in the title of the film to be searched for as a parameter and uses the await keyword to wait for the query() method provided by a data access layer (DAL) to finish before moving on to the next line of code. The query() method is used to execute a SQL SELECT statement that gets up to 38 movies from the film_list table that have a title that contains the search term. The % wildcards are used in the LIKE clause to match any characters before and after the search term.

// The function returns the array of movies contained in the rows property of the response object. If an error occurs, it will be caught by the try-catch block and logged to the console using console.error(). The module.exports statement at the end of the code exports the titleSearch function so that it can be used in other modules.
const titleSearch = async (title) => {
  let response;
  try {
    response = await dal.query(
      // https://mode.com/sql-tutorial/sql-like/
      `SELECT * FROM film_list WHERE title ILIKE $1 LIMIT 38;`,
      [`%${title}%`]
    );
    return response.rows;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { titleSearch };
