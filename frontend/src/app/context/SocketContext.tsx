import { createContext, useContext, useEffect, useState } from "react";
import { connectSocket } from "../../api/socket";
import type { Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const token = localStorage.getItem("accessToken");
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      socket?.disconnect?.();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSocket(null);
      return;
    }

    if (!token) return;
    const s = connectSocket(token);

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = (): Socket | null => useContext(SocketContext);