// Import required dependencies from npm and load the API key
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
const openai = new OpenAI(process.env.OPENAI_API_KEY);
import { Document, VectorStoreIndex, SimpleDirectoryReader } from "llamaindex";

// Load our data from a local directory
const documents = await new SimpleDirectoryReader().loadData({
  directoryPath: "./data",
});

// Initialize an index
const index = await VectorStoreIndex.fromDocuments(documents);

// Create a query engine
const queryEngine = index.asQueryEngine();

// lets ask a question
const response = await queryEngine.query({
  query: "What is  sympathetic nervous system ?",
});

console.log(response.toString());
