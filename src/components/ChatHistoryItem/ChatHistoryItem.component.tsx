import { motion } from "framer-motion";
import { MouseEventHandler, useMemo } from "react";
import { Chat } from "../../core/types";

export function ChatHistoryItemComponent({
  isActive = false,
  chat,
  onClick,
}: {
  isActive?: boolean;
  chat: Chat;
  onClick: MouseEventHandler;
}) {
  const date = useMemo(() => {
    return `${chat.date.getDate()}/${
      chat.date.getMonth() + 1
    }/${chat.date.getFullYear()} - ${chat.date.getHours()}:${chat.date.getMinutes()}`;
  }, [chat.date]);

  return (
    <motion.div
      viewport={{
        once: true,
      }}
      initial={{
        translateX: -125,
      }}
      animate={{
        translateX: 0,
      }}
      onClick={onClick}
      className={
        isActive
          ? "text-white justify-between py-1 font-semibold mx-2 flex items-center border-l-2 border-green-500 select-none mt-2"
          : "text-white justify-between py-1 font-semibold mx-2 flex items-center border-l-2 border-transparent cursor-pointer hover:border-green-500 mt-2 select-none transition-opacity duration-75"
      }
    >
      <span className="px-4 text-xl truncate">{chat.title}</span>
      <span className="py-1 px-2 border border-neutral-800 bg-green-600 text-sm font-bold rounded-md text-nowrap">
        {date}
      </span>
    </motion.div>
  );
}
