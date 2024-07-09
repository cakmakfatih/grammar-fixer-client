import { Chat } from "../core/types";

const CHATS_KEY = "CHATS";

interface BrowserDatabase {
  getChats(): Chat[];
  saveChats(chat: Chat[]): void;
  clearHistory(): void;
}

class BrowserDatabaseImpl implements BrowserDatabase {
  clearHistory(): void {
    localStorage.removeItem(CHATS_KEY);
  }

  getChats(): Chat[] {
    const chats: Chat[] = JSON.parse(localStorage.getItem(CHATS_KEY) ?? "[]");

    return chats.map((chat) => ({ ...chat, date: new Date(chat.date) }));
  }

  saveChats(chats: Chat[]): void {
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
  }
}

const browserDb = new BrowserDatabaseImpl();

export { browserDb };
