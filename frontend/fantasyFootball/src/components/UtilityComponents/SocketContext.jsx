import { useState, createContext } from "react";

const SocketContext = createContext()

function SocketProvider({children}) {
    const [socket, setSocket] = useState("");
    return (
        <SocketContext.Provider value={{ socket, setSocket }}>
          {children}
        </SocketContext.Provider>
      );
  }

  export { SocketProvider, SocketContext };