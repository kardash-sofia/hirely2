import { useState, useEffect, useCallback } from "react";
import { useSocket } from "../../app/context/SocketContext";
import type { Chat, Message } from "./types";

type ErrorResponse = { error: string };

const isErrorResponse = (value: unknown): value is ErrorResponse => {
  return (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof (value as ErrorResponse).error === "string"
  );
};

export const useChat = (chatId?: string) => {
  const socket = useSocket();

  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    if (!socket || !chatId || chatId === "newChat") return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessages([]);

    socket.emit("joinChat", chatId, (response?: { success?: boolean; error?: string }) => {
      if (response?.error) {
        console.error("joinChat error:", response.error);
      }
    });

    const handleChatMessages = (msgs: Message[]) => {
      setMessages(msgs);
    };

    const handleNewMessage = (msg: Message) => {
      if (msg.chatId !== chatId) return;

      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });

      setChats((prev) => {
        const existing = prev.find((c) => c.id === msg.chatId);
        if (!existing) return prev;

        const updatedChat = {
          ...existing,
          lastMessage: msg,
        };

        return [updatedChat, ...prev.filter((c) => c.id !== msg.chatId)];
      });
    };

    socket.on("chatMessages", handleChatMessages);
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.emit("leaveChat", chatId);
      socket.off("chatMessages", handleChatMessages);
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, chatId]);

  const getChats = useCallback((): Promise<Chat[]> => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject(new Error("Socket not connected"));
        return;
      }

      socket.emit("getChats", {}, (response: Chat[] | ErrorResponse) => {
        if (!response) {
          reject(new Error("No response"));
          return;
        }

        if (isErrorResponse(response)) {
          reject(new Error(response.error));
          return;
        }

        setChats(response);
        resolve(response);
      });
    });
  }, [socket]);

  const createDirectChat = useCallback(
    (targetUserId: string): Promise<Chat> => {
      return new Promise((resolve, reject) => {
        if (!socket) {
          reject(new Error("Socket not connected"));
          return;
        }

        if (!targetUserId) {
          reject(new Error("Target user id is required"));
          return;
        }
        socket.emit(
          "createDirectChat",
          { targetUserId },
          (response: Chat | ErrorResponse) => {
            if (!response) {
              reject(new Error("No response"));
              return;
            }

            if (isErrorResponse(response)) {
              reject(new Error(response.error));
              return;
            }

            setChats((prev) => {
              const filtered = prev.filter((c) => c.id !== response.id);
              return [response, ...filtered];
            });

            resolve(response);
          }
        );
      });
    },
    [socket]
  );

  const sendMessage = useCallback(
    (content: string): Promise<Message> => {
      return new Promise((resolve, reject) => {
        if (!socket) {
          reject(new Error("Socket not connected"));
          return;
        }

        if (!chatId) {
          reject(new Error("Chat id is required"));
          return;
        }

        if (!content.trim()) {
          reject(new Error("Message is empty"));
          return;
        }

        socket.emit(
          "sendMessage",
          {
            chatId,
            content,
          },
          (response: Message | ErrorResponse) => {
            if (!response) {
              reject(new Error("No response"));
              return;
            }

            if (isErrorResponse(response)) {
              reject(new Error(response.error));
              return;
            }

            resolve(response);
          }
        );
      });
    },
    [socket, chatId]
  );

  return {
    messages,
    chats,
    getChats,
    createDirectChat,
    sendMessage,
    setChats,
  };
};