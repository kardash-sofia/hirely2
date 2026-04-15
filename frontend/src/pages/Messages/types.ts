export type Message = {
  id: number | string;      
  chatId: string;
  content: string;       
  senderId: string;       
  createdAt?: string | Date; 
};

export type Chat = {
  id: string;
  title: string;
  online: boolean;
  createdAt?: string | Date; 
};
