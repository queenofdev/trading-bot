import { Avatar, Box, SvgIcon, TextareaAutosize } from "@mui/material";
import {
  MarkUnreadChatAltOutlined,
  FiberManualRecordRounded,
  ArrowForwardRounded,
} from "@mui/icons-material";
import { useWeb3Context } from "@fantohm/shared-web3";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";

import { ChatInbox } from "./chat-inbox";
import { socket } from "../../core/constants/basic";
import AvatarPlaceholder from "../../../assets/images/temp-avatar.png";
import { RootState } from "../../store";
import { addMessage } from "../../store/reducers/chat-slice";

const Chat = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.chat.messages);
  const { address } = useWeb3Context();
  const [message, setMessage] = useState<string>();
  const [available, setAvailable] = useState<boolean>(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const handleSendMessage = () => {
    if (message && message !== "") {
      const chat = {
        user: address ? address : "Anonymous",
        text: message,
      };
      socket.emit("chat", chat);
    }
    setMessage("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("users", (result) => {
      setOnlineUsers(result);
    });

    socket.on("newChat", (result) => {
      dispatch(addMessage(result));
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("newChat");
      socket.off("users");
    };
  }, []);

  return (
    <div className="chat w-full max-w-500">
      <div
        className={`chat-header xs:px-10 sm:px-25 xs:py-10 sm:py-15 ${
          available ? "rounded-3xl" : "rounded-t-3xl"
        } bg-woodsmoke text-primary flex justify-between items-center`}
        onClick={() => setAvailable(!available)}
      >
        <div className="chat-title flex items-center">
          <SvgIcon
            component={MarkUnreadChatAltOutlined}
            className="p-10 rounded-full text-primary bg-light-woodsmoke text-36"
          />
          <p className="xs:ml-5 sm:ml-15 xs:text-20 sm:text-24 text-primary">Chat</p>
        </div>
        <div className="online-users flex items-center rounded-3xl bg-lightgreen px-10">
          <SvgIcon
            component={FiberManualRecordRounded}
            className="rounded-full xs:text-16 sm:text-20 text-success"
          />
          <p className="ml-5 text-18 text-success">
            {onlineUsers}&nbsp;users&nbsp;online
          </p>
        </div>
      </div>
      <div
        className={`chat-body ${
          available ? "hidden" : "block"
        } w-full bg-woodsmoke rounded-b-3xl`}
      >
        <ChatInbox messages={messages} />
        <div className="min-h-60 xs:px-10 sm:px-25 pt-10 border-t border-t-second flex items-top">
          <Box sx={{ display: "block" }} className={""}>
            <Avatar
              sx={{
                mr: { sm: "0", md: "1em" },
                borderRadius: "2rem",
                bgcolor: "#161B1D",
                width: "35px",
                height: "35px",
                padding: "8px",
              }}
              src={AvatarPlaceholder}
              className="xs:block "
            />
          </Box>
          <TextareaAutosize
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write something…"
            onKeyUp={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                handleSendMessage();
              }
            }}
            className="text-primary p-0 mx-5 outline-none border-0 grow bg-woodsmoke"
          />
          <button onClick={handleSendMessage}>
            <SvgIcon
              component={ArrowForwardRounded}
              className="rounded-full text-25 text-success bg-light-woodsmoke"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
