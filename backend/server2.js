// we need LLM to answer questions and embedding model to encode them
// Import required dependencies from npm and load the API key
import dotenv from "dotenv";
dotenv.config();
import * as llamaindex from "llamaindex";

let customLLM = new llamaindex.OpenAI();
let customEmbedding = new llamaindex.OpenAIEmbedding();

// Load our data from a local directory
const documents = await new llamaindex.SimpleDirectoryReader().loadData({
  directoryPath: "./data",
});

//initialize an index
const index = await llamaindex.VectorStoreIndex.fromDocuments(documents);

// put the LLM and the embedding model inot a ServiceContext Object
let customServiceContext = new llamaindex.serviceContextFromDefaults({
  llm: customLLM,
  embedModel: customEmbedding,
});

//making custom prompt
let customQaPrompt = function ({ context = "", query = "" }) {
  return `Context information is below.
    ------------------------
    ${context}
    ------------------------
    Given the context informatin, anwer the query. Include a random fun fact about cats in your answer.\ The cat fun fact can come from your training data.
    Query: ${query}
    Answer:
        `;
};

//now create a responseBuilder that uses the given prompt and the service context
let customResponseBuilder = new llamaindex.SimpleResponseBuilder(
  customServiceContext,
  customQaPrompt
);
//the response builder goesto a synthesizer, which also needs a service context
let customSynthesizer = new llamaindex.ResponseSynthesizer({
  responseBuilder: customResponseBuilder,
  serviceContext: customServiceContext,
});

//a retriver is also needed
let customRetriver = new llamaindex.VectorIndexRetriever({
  index,
});

//the synthesizer and retriver go to our query engine
let customQueryEngine = new llamaindex.RetrieverQueryEngine(
  customRetriver,
  customSynthesizer
);

//here check the response
let response = await customQueryEngine.query({
  query: "What is  sympathetic nervous system ?",
});

console.log(response.toString());
