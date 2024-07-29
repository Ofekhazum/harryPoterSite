
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const username = encodeURIComponent(process.env.DB_USERNAME);
const password = encodeURIComponent(process.env.DB_PASSWORD);
const cluster = process.env.DB_CLUSTER;
const dbName = process.env.DB_NAME;

const serverURI = `mongodb+srv://${username}:${password}@${cluster}/?retryWrites=true&w=majority&appName=HarryPotterStore`;

const client = new MongoClient(serverURI);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
  }
}




module.exports = { client, connectToDatabase, dbName, serverURI };
