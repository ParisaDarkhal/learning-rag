import React from "react";

const Message = ({ message }) => {
  return (
    <>
      {message.role === "user" && <div className="user">{message.content}</div>}
      {message.role === "assistant" && (
        <div className="assistant">{message.content}</div>
      )}
    </>
  );
};

export default Message;
