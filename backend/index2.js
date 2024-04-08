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
  OpenAIAgent,
  QueryEngineTool,
  FunctionTool,
} from "llamaindex";

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 3001;
//load our data from local directory document 1
const document1 = await new SimpleDirectoryReader().loadData({
  directoryPath: "./data",
});
const index1 = await VectorStoreIndex.fromDocuments(document1);
const queryEngine1 = index1.asQueryEngine();
const response1 = await queryEngine1.query({
  query: "What are  Sympathomimetics?",
});
console.log("* " + response1.toString());

//load our data from local directory document 1
const document2 = await new SimpleDirectoryReader().loadData({
  directoryPath: "./data2",
});
const index2 = await VectorStoreIndex.fromDocuments(document2);
const queryEngine2 = index2.asQueryEngine();
const response2 = await queryEngine2.query({
  query: "How does alcohol affect brain structure?",
});
console.log("** " + response2.toString());
///////
//////////////
app.use(express.static("build"));
app.listen(port, () => {
  console.log(`🐱 Server listening on port ${port}`);
});
