import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("/");

function App() {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handlerSubmit = (e) => {
    e.preventDefault();
    const myMessage = {
      body: message,
      from: "Me"
    }
    setMessages([...messages, myMessage]);
    socket.emit("message", message);
    setMessage("");
  };

  useEffect(() => {
    socket.on("message", receiveMessage);

    return () => {
      socket.off("message", receiveMessage);
    };
  }, []);

  const receiveMessage = (message) => setMessages(state => [...state, message]);

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="bg-cyan-900 rounded-md p-3 w-[300px] sm:w-[300px]">
        <h1 className="text-center text-2xl font-semibold w-full mb-3">Chat</h1>
        <div className="w-full bg-white h-[300px] rounded-md mb-3 overflow-auto max-h-[100%] p-2">
          <ul>
            {
              messages.map((msg, i) => {
                return (
                  <li 
                    key={i}
                    className={`flex ${msg.from == "Me" && "justify-end"}`}
                  >
                    <p 
                      className={
                        `text-black font-medium inline-block  px-2 py-1 rounded-md mb-2
                        ${msg.from === "Me" ? "bg-cyan-500" : "bg-green-500"}`
                      }
                    > <span className="text-xs font-normal text-gray-700">{msg.from}:</span> {msg.body}</p>
                  </li>
                );
              })
            }
          </ul>
        </div>
        <form className="flex flex-col justify-center gap-2 items-center"
          onSubmit={handlerSubmit}>
          <div className="flex gap-x-1 items-center justify-end w-full">
            <input className="px-2 py-1 rounded-md w-full text-black focus:outline-none focus:border focus:border-black"
              type="text" 
              placeholder="Write your massage..."
              value={message}
              onChange={e => setMessage(e.target.value)}/>
            <button className="bg-cyan-500 font-semibold hover:bg-cyan-600 px-2 py-1 rounded-md"
              type="onsubmit">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App
