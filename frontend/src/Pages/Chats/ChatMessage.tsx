import { checkIsStackMessage, getTimeString } from "../../utils/helpers";
import { MessageInterface } from "./ChatBox";
type ChatMessageProps = {
  message: MessageInterface;
  index: number;
  userId: string;
  nextMessage: MessageInterface;
};

const ChatMessage = ({
  message,
  index,
  nextMessage,
  userId,
}: ChatMessageProps) => {
  const { content, from } = message;
  const { messageText, timestamp } = content;
  // check is message sender is logged in user
  const isMessageByMe = userId === from;
  const timeString = getTimeString(timestamp);
  // check next message has same time and sender
  const isStackMessage = checkIsStackMessage(message, nextMessage);
  return (
    <div key={`message-${index}`} className="relative flex">
      <div
        className={`z-10 cursor-pointer flex items-end justify-between py-2 max-w-[80%]  ${
          isStackMessage ? "mb-0" : "mb-2"
        } m-1 px-4 drop-shadow-sm ${
          isMessageByMe
            ? "ml-auto rounded-tr-sm bg-blue-50"
            : "rounded-tl-sm bg-white"
        } rounded-xl w-fit`}
      >
        <p className="select-none font-semibold text-base text-gray-500">
          {messageText}
        </p>
        {!isStackMessage && (
          <span className="select-none text-xs text-gray-500 pl-2">
            {timeString}
          </span>
        )}
      </div>
    </div>
  );
};
export default ChatMessage;
