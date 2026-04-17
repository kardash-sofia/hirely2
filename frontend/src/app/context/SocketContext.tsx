import { createContext, useContext, useEffect, useState } from "react";
import { connectSocket } from "../../api/socket";
import type { Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const s = connectSocket(token);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(s);

    s.on("connect", () => {
      console.log("SOCKET CONNECTED", s.id);
    });

    s.on("disconnect", (reason) => {
      console.log("SOCKET DISCONNECTED", reason);
    });

    s.on("connect_error", (err) => {
      console.log("SOCKET CONNECT ERROR", err.message);
    });

    return () => {
      s.off("connect");
      s.off("disconnect");
      s.off("connect_error");
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = (): Socket | null => useContext(SocketContext);