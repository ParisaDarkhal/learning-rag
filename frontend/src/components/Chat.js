import React, { useState } from "react";
import axios from "axios";
import Message from "./Message";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");

  ////
  const sendMessage = async (e) => {
    try {
      const message = e.target.value;
      setMessages((previousMessages) => [
        ...previousMessages,
        { role: "user", content: message },
      ]);
      const responsetoSendMessages = await axios.post(
        "http://localhost:3001/messages",
        { message: message }
      );
      setValue("");

      setMessages((previousMessages) => [
        ...previousMessages,
        { role: "assistant", content: responsetoSendMessages.data },
      ]);
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };
  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
      </div>
      <div className="input">
        <label>Type your question here: </label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage(e);
            }
          }}
        />
      </div>
    </div>
  );
};
export default Chat;
