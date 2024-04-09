//this is for chat app connected to Chat.js in frontend
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";
import {
  Document,
  VectorStoreIndex,
  SimpleDirectoryReader,
  RouterQueryEngine,
  storageContextFromDefaults,
  ContextChatEngine,
} from "llamaindex";

dotenv.config();
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Set up OpenAI API
const openai = new OpenAI(process.env.OPENAI_API_KEY);

/////////////////////////////
//set up a storage context
const initializeServer = async () => {
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

  //set a retriever
  const retriever = await index.asRetriever();

  //handle incomming messages
  app.post("/messages", async (req, res) => {
    const userMessage = req.body.message;
    console.log("userMessage :>> ", userMessage);
    try {
      //create a new chat engine
      retriever.similarityTopK = 3;
      let chatEngine = new ContextChatEngine({
        retriever,
      });
      //send user message to openAI for processing
      const result = await chatEngine.chat({ message: userMessage });
      console.log("response :>> ", result.response);
      const assistantResponse = result.response;
      res.send(assistantResponse);
    } catch (error) {
      console.error("Error processin message: ", error);
      res.status(500).send("Error processing message.");
    }
  });

  //////////////
  app.use(express.static("build"));
  app.listen(port, () => {
    console.log(`🐱 Server listening on port ${port}`);
  });
};
initializeServer();
