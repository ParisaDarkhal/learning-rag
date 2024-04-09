import logo from "./logo.svg";
import "./App.css";
import QuerySender from "./components/QuerySender";
import Chat from "./components/Chat";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <QuerySender /> */}
        <h1>Chat App</h1>
        <Chat />
      </header>
    </div>
  );
}

export default App;
