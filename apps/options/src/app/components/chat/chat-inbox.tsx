import { Avatar, Box } from "@mui/material";
import { addressEllipsis } from "@fantohm/shared-helpers";
import { useEffect } from "react";

import AvatarPlaceholder from "../../../assets/images/temp-avatar.png";
import { ChatInterface } from "../../core/interfaces/basic.interface";
import { convertTime } from "../../helpers/data-translations";

export const ChatInbox = (props: { messages: ChatInterface[] }) => {
  const scrollIntoView = require("scroll-into-view");
  const messages = props.messages;
  useEffect(() => {
    if (messages.length > 0) {
      const targetElement = document.getElementsByClassName("lastElement")[0];
      scrollIntoView(targetElement, {
        isWindow: function (target: any) {
          // If you need special detection of the window object for some reason, you can do it here.
          return target.self === target;
        },
        isScrollable: function (target: any, defaultIsScrollable: any) {
          return (
            defaultIsScrollable(target) ||
            (target !== window && ~target.className.indexOf("scrollable"))
          );
        },
      });
    }
  }, [messages]);
  return (
    <div className="message-box max-h-200 overflow-y-scroll scrollbar-hide">
      {messages.map((message: ChatInterface, index: number) => (
        <div
          className={`min-h-85 flex items-start xs:px-10 sm:px-25 py-10 ${
            index === messages.length - 1 ? "lastElement" : ""
          }`}
          key={index}
        >
          <Box sx={{ display: "block", marginRight: "5px" }} className={""}>
            <Avatar
              sx={{
                mr: { sm: "0", md: "1em" },
                borderRadius: "2rem",
                bgcolor: "#161B1D",
                width: "38px",
                height: "38px",
                padding: "8px",
              }}
              src={AvatarPlaceholder}
              className="xs:block "
            />
          </Box>
          <div className="overflow-hidden">
            <div className="flex items-center pb-5 text-15">
              <p className="text-success mr-10">
                {message.user.startsWith("0x")
                  ? addressEllipsis(message.user)
                  : message.user}
              </p>
              <p className="text-second">
                {convertTime(new Date(message.createdAt)).time}
              </p>
            </div>
            <div className="text-primary">
              <p className="text-17 break-words">{message.text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
