import { useState, useEffect, useCallback } from "react";
import { useSocket } from "../../app/context/SocketContext";
import type { Chat, Message } from "./types";
import { useAuth } from "../Auth/useAuth";

export const useChat = (chatId?: string) => {
  const socket = useSocket();
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    if (!socket || !chatId) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessages([]);

    socket.emit("joinChat", chatId);

    const handleChatMessages = (msgs: Message[]) => {
      setMessages(msgs);
    };

    const handleNewMessage = (msg: Message) => {
      if (msg.chatId !== chatId) return;

      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
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

  useEffect(() => {
    if (!socket) return;

    const handleNewChat = (chat: Chat) => {
      setChats((prev) => {
        const filtered = prev.filter((c) => c.id !== chat.id);
        return [chat, ...filtered]; // останній зверху
      });
    };

    socket.on("newChat", handleNewChat);

    return () => {
      socket.off("newChat", handleNewChat);
    };
  }, [socket]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!socket || !chatId || !content.trim()) return;

      socket.emit("sendMessage", {
        chatId,
        content,
      });
    },
    [socket, chatId]
  );

  const createChat = useCallback(
    (userIds: string[], title?: string) => {
      if (!socket) return;

      socket.emit("createChat", {
        userIds,
        title,
      });
    },
    [socket]
  );

  const getChats = useCallback(() => {
    if (!socket) return;

    socket.emit("getChats", { userId: user?.id }, (response: Chat[]) => {
      setChats(response || []);
    });
  }, [socket, user?.id]);

  return {
    messages,
    chats,

    sendMessage,
    createChat,
    getChats,

    setChats,
  };
};