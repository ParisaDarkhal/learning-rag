import express from "express";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";

// Import required dependencies from npm and load the API key
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
const openai = new OpenAI(process.env.OPENAI_API_KEY);
import { Document, VectorStoreIndex, SimpleDirectoryReader } from "llamaindex";

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 3001;
//////////////
// Load our data from a local directory
const documents = await new SimpleDirectoryReader().loadData({
  directoryPath: "./data",
});

// Initialize an index
const index = await VectorStoreIndex.fromDocuments(documents);

// Create a query engine
const queryEngine = index.asQueryEngine();

//create a new handler to accept a query as input and respond from the query engine
app.post("/", async (req, res) => {
  try {
    //expect incoming query to be a JSON object of the from {query:...}
    const { query } = req.body;
    // Perform query using queryEngine
    const answer = await queryEngine.query({ query });
    // Send response
    res.status(200).json({ response: answer.toString() });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: error.message });
  }
});
// Route handler for other HTTP methods (e.g., GET)
app.all("/", (req, res) => {
  res.status(404).send("Not found");
});

// Handler for other routes
app.use((req, res) => {
  res.status(404).send("Not found");
});
//////////////
app.use(express.static("build"));
app.listen(port, () => {
  console.log(`🐱 Server listening on port ${port}`);
});
