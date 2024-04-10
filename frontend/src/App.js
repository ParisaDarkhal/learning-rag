import "./App.css";
import QuerySender from "./components/QuerySender";
import Chat from "./components/Chat";
import Naplex from "./components/images/NAPLEX.jpg";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <QuerySender /> */}
        <h1>Chat with Comprehensive Pharmacy Review for NAPLEX.</h1>
        <img src={Naplex} style={{ width: "150px" }} />
        <Chat />
      </header>
    </div>
  );
}

export default App;
