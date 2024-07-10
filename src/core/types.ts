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

export interface ApiGrammarResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choice[];
  usage: Usage;
  system_fingerprint: any;
}

export interface Choice {
  index: number;
  message: Message;
  logprobs: any;
  finish_reason: string;
}

export interface Message {
  role: string;
  content: string;
}

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}
