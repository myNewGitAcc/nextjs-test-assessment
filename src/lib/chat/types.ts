export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

export type MessageStatus = 'pending' | 'sent' | 'failed';

export type ChatMessage = {
  id: string;
  text: string;
  role: 'user' | 'consultant';
  status: MessageStatus;
  createdAt: number;
};

export type WireMessage = {
  id: string;
  text: string;
};
