require("dotenv").config();
const OpenAI = require("openai");
const openai = new OpenAI(process.env.OPENAI_API_KEY);
////
import { Document, VectorStoreIndex, SimpleDirectoryReader } from "llamaindex";
