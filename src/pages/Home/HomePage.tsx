import { useEffect, useMemo, useRef, useState } from "react";
import { browserDb } from "../../services/BrowserDatabase";
import { Chat } from "../../core/types";

function ChatHistoryItem({
  isActive = false,
  chat,
}: {
  isActive?: boolean;
  chat: Chat;
}) {
  const date = useMemo(() => {
    return `${chat.date.getDate()}/${
      chat.date.getMonth() + 1
    }/${chat.date.getFullYear()} - ${chat.date.getHours()}:${chat.date.getMinutes()}`;
  }, [chat.date]);

  return (
    <div
      className={
        isActive
          ? "text-white justify-between py-1 font-semibold mx-2 flex items-center border-l-2 border-green-500 select-none"
          : "text-white justify-between py-1 font-semibold mx-2 flex items-center border-l-2 border-transparent cursor-pointer hover:border-green-500 opacity-35 hover:opacity-75 mt-2 select-none transition-opacity duration-75"
      }
    >
      <span className="px-4 text-xl">{chat.title}</span>
      <span className="py-1 px-2 border border-neutral-800 bg-green-600 text-sm font-bold rounded-md">
        {date}
      </span>
    </div>
  );
}

export function HomePage() {
  const inputContainerRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeChatId, setActiveChatId] = useState<number>(0);
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    setChats(browserDb.getChats());
    setIsLoading(false);
  }, []);

  return (
    <>
      <aside className="flex-1 min-w-[450px] bg-neutral-950 flex flex-col p-4">
        <button className="items-center hover:border-green-500 active:border-green-300 transition-colors duration-200 font-semibold rounded-xl text-white p-2 flex bg-neutral-900 border-2 border-neutral-900 justify-between">
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
        <div className="mt-4 flex flex-col">
          {chats.map((chat) => (
            <ChatHistoryItem
              key={chat.id}
              chat={chat}
              isActive={activeChatId === chat.id}
            />
          ))}
        </div>
      </aside>
      <div className="flex-[5] flex flex-col items-stretch bg-neutral-900 text-white">
        <div className="flex-1 flex flex-col p-8">
          <div className="flex flex-row items-start m-2">
            <div className="rounded-full bg-green-500 size-10 flex items-center border border-neutral-400 justify-center text-white">
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
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </div>
            <div className="flex flex-col ml-3">
              <h2 className="font-semibold text-md">You</h2>
              <span className="">test</span>
            </div>
          </div>
          <div className="flex flex-row items-start m-2">
            <div className="rounded-full bg-neutral-700 border border-neutral-600 size-10 flex items-center justify-center text-white">
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
                  d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
                />
              </svg>
            </div>
            <div className="flex flex-col ml-3">
              <h2 className="font-semibold text-md">G-AI</h2>
              <span className="">Hello, how can I help you?</span>
              <button className="mt-2 p-1 bg-neutral-950 self-start rounded-md hover:ring-2 ring-green-500 active:ring-green-300">
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
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-stretch py-2 px-2 select-none">
          <div
            className="flex-1 m-2 text-xl text-white ring-green-400 rounded-full bg-neutral-800 border border-neutral-950 flex transition-colors duration-200"
            ref={inputContainerRef}
          >
            <input
              type="text"
              className="py-4 px-7 rounded-full flex-1 border-none outline-none bg-transparent"
              placeholder="Send a message..."
              onFocus={(_) => {
                inputContainerRef.current?.classList.add("ring-2");
              }}
              onBlur={(_) => {
                inputContainerRef.current?.classList.remove("ring-2");
              }}
            />
            <button className="mr-2 text-neutral-600 cursor-default">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-12 -rotate-90"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
