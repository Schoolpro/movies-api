
const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGODB_URI);

let database;

async function connectDB() {
  await client.connect();
  database = client.db('moviesdb');
  console.log('Connected to MongoDB!');
}

function getDB() {
  return database;
}

module.exports = { connectDB, getDB };
