import { Chat } from "../core/types";

const CHATS_KEY = "CHATS";

interface BrowserDatabase {
  getChats(): Chat[];
  saveChats(chat: Chat[]): void;
}

class BrowserDatabaseImpl implements BrowserDatabase {
  getChats(): Chat[] {
    const chats: Chat[] = JSON.parse(localStorage.getItem(CHATS_KEY) ?? "[]");

    return chats;
  }

  saveChats(chats: Chat[]): void {
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
  }
}

const browserDb = new BrowserDatabaseImpl();

export { browserDb };
