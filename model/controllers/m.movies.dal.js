// Group 1 Final Sprint
// Chris, Mark, Will, Neil
// Rockbuster 
// December 10th


const { ObjectId } = require("mongodb");

// This is an async function that displays a sample of movies from a MongoDB collection called movies. The function uses the aggregate() method to create a pipeline that selects 50 random documents from the collection using the $sample operator. The toArray() method is used to convert the resulting cursor to an array. The function uses the await keyword to wait for the aggregate() and toArray() methods to finish before returning the array of movies. If an error occurs, it will be caught by the try-catch block and logged to the console using console.error().
const displayAllMongoMovies = async () => {
  try {
    return await movies.aggregate([{ $sample: { size: 50 } }]).toArray();
  } catch (error) {
    console.error(error);
  }
};

// This is an async function that gets the details of a movie from a MongoDB collection called movies. The function takes in the _id of the movie to be searched for as a parameter. It first checks if the _id is a valid ObjectId using the isValid() method. If the _id is not valid, the function throws an error. If it is valid, the function uses the find() method to search for the movie in the collection and then uses the toArray() method to convert the resulting cursor to an array. The function uses the await keyword to wait for the find() and toArray() methods to finish before returning the array of movies. If an error occurs, it will be caught by the try-catch block and logged to the console using console.error().
const getMongoMovieDetails = async (_id) => {
  try {
    if (ObjectId.isValid(_id)) {
      return await movies.find({ _id: ObjectId(`${_id}`) }).toArray();
    } else {
      throw new Error(`Invalid ObjectId: ${_id}`);
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = { displayAllMongoMovies, getMongoMovieDetails };
