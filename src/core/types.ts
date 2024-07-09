export enum Sender {
  AI,
  Human,
}

export interface Chat {
  id: number;
  date: Date;
  title: string;
  messages: Message[];
}

export interface Message {
  from: Sender;
  content: string;
  date: Date;
}
