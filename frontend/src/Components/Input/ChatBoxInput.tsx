import {
  Dispatch,
  FormEvent,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Picker from "@emoji-mart/react";
import { MdOutlineEmojiEmotions, MdSend } from "react-icons/md";
import MessageSentSound from "../../assets/sounds/message-sent.wav";
import Button from "../Button/Button";
import data from "@emoji-mart/data";
import useClickOutside from "../../Hooks/useClickOutside";
import { setCurrentPage } from "../../Pages/Chats/chatSlice";
import { socket } from "../../ws/socket";
import { useAppDispatch, useAppSelector } from "../../Hooks/redux";
import { chatApiSlice } from "../../Pages/Chats/chatApiSlice";
interface ChatBoxInputProps {
  setMessage: Dispatch<SetStateAction<string>>;
  message: string;
  isShowEmojiInput: boolean;
  setIsShowEmojiInput: Dispatch<SetStateAction<boolean>>;
}
const ChatBoxInput = ({
  setMessage,
  message,
  setIsShowEmojiInput,
  isShowEmojiInput,
}: ChatBoxInputProps) => {
  const chatInputRef: RefObject<HTMLTextAreaElement | undefined> = useRef();

  const contextMenuRef: RefObject<HTMLDivElement | undefined> = useRef();
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const { groupId, participant } = useAppSelector(
    (state) => state.chat.currentInobx
  );
  const userId = useAppSelector((state) => state.auth.user?._id);
  const dispatch = useAppDispatch();
  const onCloseEmojiInput = () => setIsShowEmojiInput(false);
  useClickOutside(contextMenuRef, onCloseEmojiInput, anchorElement);

  const handleSendMessage = () => {
    const content = { messageText: message, timestamp: Date.now() };
    const messageSentSound = new Audio(MessageSentSound);
    messageSentSound.play();
    dispatch(setCurrentPage(0));
    socket.emit("group:message", {
      content,
      ...(groupId && { groupId: groupId }),
      ...(participant && { participantId: participant._id }),
    });
    dispatch(
      chatApiSlice.util.updateQueryData(
        "getMessagesByGroup",
        { groupId: groupId || "", currentPage: 0 },
        (data) => {
          data.messages.reverse();
          data.messages.push({ content, from: userId, status: 0 });
          data.messages.reverse();
        }
      )
    );
    dispatch(
      chatApiSlice.util.updateQueryData("getInboxList", {}, (inboxList) => {
        inboxList.map((inbox) => {
          if (inbox.group === groupId) {
            inbox.updatedAt = content.timestamp;
            inbox.lastMessage = { content, from: userId, status: 0 };
          }
          return inbox;
        });
      })
    );

    setMessage("");
    chatInputRef.current?.focus();
    if (chatInputRef.current) {
      chatInputRef.current.style.height = "auto";
    }
  };

  const textareaResize = useCallback(
    (e: FormEvent<HTMLTextAreaElement>) => {
      e.currentTarget.style.height = "auto";
      e.currentTarget.style.height = e.currentTarget?.scrollHeight + "px";
      if (isShowEmojiInput) {
        setIsShowEmojiInput(false);
      }
    },
    [isShowEmojiInput, message]
  );

  useEffect(() => {
    if (chatInputRef.current) {
      chatInputRef.current.style.height =
        chatInputRef.current?.scrollHeight + "px";
    }
  }, []);

  return (
    <div className="w-full m-auto flex flex-col items-center">
      {isShowEmojiInput && (
        <div ref={contextMenuRef as RefObject<HTMLDivElement>} className="mb-3">
          <Picker
            onEmojiSelect={(emoji: any) => {
              setMessage(`${message}${emoji.native}`);
            }}
            perLine={9}
            data={data}
            previewPosition="none"
            searchPosition="none"
          />
        </div>
      )}
      <div className="w-11/12 rounded-3xl pl-12 py-3 shadow flex justify-between items-end bg-gray-0 relative">
        <div className="absolute -bottom-1.5 left-1">
          <Button
            variant="icon-only"
            onClick={(e) => {
              setAnchorElement(e.currentTarget);
              setIsShowEmojiInput(!isShowEmojiInput);
            }}
            icon={
              <MdOutlineEmojiEmotions
                className={` ${
                  isShowEmojiInput ? "text-green-500" : "text-gray-600"
                } text-2xl`}
              />
            }
            className="flex justify-center items-center bg-transparent "
          />
        </div>
        <textarea
          ref={chatInputRef as RefObject<HTMLTextAreaElement>}
          placeholder="message"
          rows={1}
          onFocus={textareaResize}
          onChange={(e) => {
            let { value } = e.target;
            if (!/^\n+/g.test(value)) {
              setMessage(value);
              textareaResize(e);
            }
          }}
          onKeyDown={(e) => {
            const value = e.target.value;
            if (e.key === "Enter" && e.target.value && !/^\n+/g.test(value)) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          value={message}
          className="w-4/5 resize-none outline-none max-h-28 pr-2 font-semibold text-base h-5 overflow-auto caret-gray-500 text-gray-600 antialiased tracking-wide bg-transparent"
        ></textarea>
        {message && (
          <div className="absolute -bottom-1.5 right-2">
            <Button
              onClick={handleSendMessage}
              variant="icon-only"
              icon={<MdSend className="text-gray-600 text-2xl" />}
              className="flex justify-center items-center bg-transparent "
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBoxInput;
