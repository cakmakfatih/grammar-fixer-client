import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { browserDb } from "../../services/BrowserDatabase";
import { Chat, ChatMessage, Sender } from "../../core/types";
import ChatHistoryItemComponent from "../../components/ChatHistoryItem";
import ChatMessageComponent from "../../components/ChatMessage";
import { apiService } from "../../services/ApiService";

export function HomePage() {
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const inputChatTitleRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [activeChatId, setActiveChatId] = useState<number>(0);
  const [chats, setChats] = useState<Chat[]>([]);
  const [isOpeningNewChat, setIsOpeningNewChat] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [_, startTransition] = useTransition();

  const submitMessage = (e: FormEvent) => {
    e.preventDefault();

    const sentMessage = message;

    if (!(message.length > 0 && message.length < 255)) {
      return;
    }

    const aiResponse = {
      from: Sender.AI,
      content: "pending",
      date: new Date(),
    };

    const newMessages = [
      ...chatMessages,
      {
        from: Sender.Human,
        content: sentMessage,
        date: new Date(),
      },
      aiResponse,
    ];

    setChatMessages(newMessages);
    setMessage("");

    if (chats.length === 0) {
      const newChat = {
        id: 0,
        title: `${sentMessage.substring(0, 50)}`,
        date: new Date(),
        messages: [],
      };
      const newChats = [newChat];

      setChats(newChats);
      setActiveChatId(0);

      browserDb.saveChats(newChats);
    }

    startTransition(async () => {
      const result = await apiService.checkGrammar(sentMessage);

      if (result !== null && result.choices.length > 0) {
        newMessages[newMessages.length - 1].content =
          result.choices[0].message.content;
        setChatMessages([...newMessages]);
        const activeChatIdx = chats.findIndex(
          (chat) => chat.id === activeChatId
        );

        if (activeChatIdx !== -1) {
          const newChats = [...chats];
          newChats[activeChatIdx].messages = newMessages;

          setChats(newChats);
          browserDb.saveChats(newChats);
        }
      }
    });
  };

  useEffect(() => {
    messagesContainerRef.current!.scrollTo({
      behavior: "smooth",
      top: messagesContainerRef.current!.scrollHeight,
    });
  }, [chatMessages]);

  useEffect(() => {
    const existingChats = browserDb.getChats();
    setChats(existingChats);

    if (existingChats.length > 0) {
      setActiveChatId(existingChats[0].id);
      setChatMessages(existingChats[0].messages);
    } else setActiveChatId(0);
  }, []);

  return (
    <>
      <aside className="flex-1 min-w-[450px] bg-neutral-950 flex flex-col p-4">
        {!isOpeningNewChat ? (
          <button
            onClick={(_) => {
              setIsOpeningNewChat(true);
            }}
            className="items-center hover:border-green-500 active:border-green-300 transition-colors duration-200 font-semibold rounded-xl text-white p-2 flex bg-neutral-900 border-2 border-neutral-900 justify-between"
          >
            <span className="ml-2">New Chat</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();

              const newChatId = chats.length;
              setActiveChatId(newChatId);

              const inputValue = inputChatTitleRef.current?.value;

              const chatTitle = inputValue ? inputValue : `Chat ${newChatId}`;
              const newChat = {
                id: newChatId,
                title: chatTitle,
                date: new Date(),
                messages: [],
              };

              const newChats = [newChat, ...chats];

              setChats(newChats);
              setIsOpeningNewChat(false);
              setChatMessages(newChat.messages);

              browserDb.saveChats(newChats);
            }}
            className="bg-neutral-900 border-green-500 border-2 flex text-white font-semibold rounded-xl py-2 px-2"
          >
            <input
              onBlur={(_) => setIsOpeningNewChat(false)}
              className="px-2 flex-1 bg-transparent border-none outline-none"
              placeholder="Chat Title"
              autoFocus={true}
              ref={inputChatTitleRef}
            />
            <button className="hover:opacity-65 transition-opacity duration-75">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </button>
          </form>
        )}
        <div className="mt-4 flex flex-col">
          {chats.map((chat) => (
            <ChatHistoryItemComponent
              onClick={() => {
                setActiveChatId(chat.id);
                setChatMessages([...chat.messages]);
              }}
              key={chat.id}
              chat={chat}
              isActive={activeChatId === chat.id}
            />
          ))}
        </div>
        <div className="flex-1"></div>
        <button
          onClick={(_) => {
            browserDb.clearHistory();
            setChats([]);
            setActiveChatId(0);
            setChatMessages([]);
          }}
          className="items-center hover:border-green-500 active:border-green-300 transition-colors duration-200 font-semibold rounded-xl text-white p-2 flex bg-red-900 border-2 border-neutral-900 justify-between"
        >
          <span className="ml-2">Clear History</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
      </aside>
      <div className="flex-[5] flex flex-col items-stretch bg-neutral-900 text-white">
        <div
          className="flex-1 flex flex-col overflow-y-scroll min-h-0 py-6"
          ref={messagesContainerRef}
        >
          {chatMessages.map((msg, idx) => (
            <ChatMessageComponent key={idx} message={msg} />
          ))}
        </div>
        <form
          className="flex items-stretch py-2 px-2 select-none"
          onSubmit={submitMessage}
        >
          <div
            className="flex-1 m-2 text-xl text-white ring-green-400 rounded-full bg-neutral-800 border border-neutral-950 flex transition-colors duration-200"
            ref={inputContainerRef}
          >
            <input
              type="text"
              className="py-4 px-7 rounded-full flex-1 border-none outline-none bg-transparent"
              placeholder="Send a message..."
              autoComplete="off"
              name="message"
              onFocus={(_) => {
                inputContainerRef.current?.classList.add("ring-2");
              }}
              onBlur={(_) => {
                inputContainerRef.current?.classList.remove("ring-2");
              }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="mr-2 text-neutral-600 cursor-default"
              type="submit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={
                  "size-12 -rotate-90 " +
                  (message.length > 0 ? "text-green-500" : "")
                }
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
