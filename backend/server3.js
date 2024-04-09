//this is for chat engine

import express from "express";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";

// Import required dependencies from npm and load the API key
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
const openai = new OpenAI(process.env.OPENAI_API_KEY);
import {
  Document,
  VectorStoreIndex,
  SimpleDirectoryReader,
  RouterQueryEngine,
  storageContextFromDefaults,
  ContextChatEngine,
} from "llamaindex";

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 3001;
//////////////
//set up a storage context
const storageContext = await storageContextFromDefaults({
  persistDir: "./storage",
});
// Load our data from a local directory
const documents = await new SimpleDirectoryReader().loadData({
  directoryPath: "./data",
});

// Initialize an index
const index = await VectorStoreIndex.fromDocuments(documents, {
  storageContext,
});

// Create a query engine
const engine = await index.asQueryEngine();
let response = await engine.query({ query: "What is dopamine?" });
console.log(response.toString());

//now getting an index w/o parsing the document
let storageContext2 = await storageContextFromDefaults({
  persistDir: "./storage",
});
//initialize the index
const index2 = await VectorStoreIndex.init({
  storageContext: storageContext2,
});
//now query it
let engine2 = await index2.asQueryEngine();
let response2 = await engine2.query({ query: "What is serotonine?" });
console.log(response2.toString());

/////now we want to chat with our data
//create a retriever and a new chat engine
const retriever = index2.asRetriever();
retriever.similarityTopK = 3;
let chatEngine = new ContextChatEngine({
  retriever,
});

//now we try it
let messageHistory = [
  {
    role: "user",
    content: "What is serotonine?",
  },
  {
    role: "assistant",
    content:
      "Serotonin is a neurotransmitter that is involved in regulating mood, behavior, appetite, and sleep. It is not specifically mentioned in the provided context information.",
  },
];
console.log("messageHistory :>> ", messageHistory);
let newMessage = "What was the last thing you mentioned?";
const response3 = await chatEngine.chat({
  message: newMessage,
  chatHistory: messageHistory,
  stream: true,
});
console.log("response3 :>>", response3.toString());
//check the response
for await (const data of response3) {
  console.log(data.response);
}

//////////////
app.use(express.static("build"));
app.listen(port, () => {
  console.log(`🐱 Server listening on port ${port}`);
});
