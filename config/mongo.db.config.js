// Group 1 Final Sprint
// Chris, Mark, Will, Neil
// Rockbuster 
// December 10th


const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URI;
const pool = new MongoClient(uri);

module.exports = pool;
