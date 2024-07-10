export enum Sender {
  AI,
  Human,
}

export interface Chat {
  id: number;
  date: Date;
  title: string;
  messages: ChatMessage[];
}

export interface ChatMessage {
  from: Sender;
  content: string;
  date: Date;
}
