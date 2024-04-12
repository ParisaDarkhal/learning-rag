//this uses Ollama
//this is for chat app connected to Chat.js in frontend
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { Ollama, Document, VectorStoreIndex, Settings } from "llamaindex";
import fs from "fs/promises";
const ollama = new Ollama({ model: "llama2", temperature: 0.75 });

dotenv.config();
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Use Ollama LLM and Embed Model
Settings.llm = ollama;
Settings.embedModel = ollama;

/////////////////////////////
//set up a storage context
const initializeServer = async () => {
  const essay = await fs.readFile("./data/neuropharmacology.pdf", "utf-8");

  const document = new Document({ text: essay, id_: "essay" });

  // Load and index documents
  const index = await VectorStoreIndex.fromDocuments([document]);

  // get retriever
  const retriever = index.asRetriever();

  // Create a query engine
  const queryEngine = index.asQueryEngine({
    retriever,
  });

  const query = "What is dopamine?";

  // Query
  const response = await queryEngine.query({
    query,
  });

  // Log the response
  console.log(response.response);

  //////////////
  app.use(express.static("build"));
  app.listen(port, () => {
    console.log(`🐱 Server listening on port ${port}`);
  });
};
initializeServer();
