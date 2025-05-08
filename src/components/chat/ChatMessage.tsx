
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { Check } from "lucide-react";

type MessageStatus = "sent" | "delivered" | "read";

type ChatMessageProps = {
  content: string;
  timestamp: Date;
  isOutgoing: boolean;
  status?: MessageStatus;
};

const ChatMessage = ({ content, timestamp, isOutgoing, status = "sent" }: ChatMessageProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusIcon = () => {
    switch (status) {
      case "read":
        return <Check className="h-3 w-3 text-blue-500" />;
      case "delivered":
        return <Check className="h-3 w-3 text-gray-500" />;
      case "sent":
        return <Check className="h-3 w-3 text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <div 
      className={`flex ${isOutgoing ? "justify-end" : "justify-start"} mb-2`}
      onClick={() => setShowDetails(!showDetails)}
    >
      <div className={isOutgoing ? "chat-bubble-outgoing" : "chat-bubble-incoming"}>
        <p dir="auto">{content}</p>
        <div className="flex justify-end items-center space-x-1 rtl:space-x-reverse mt-1">
          {showDetails && (
            <span className="text-[10px] text-muted-foreground">
              {formatDistanceToNow(timestamp, { addSuffix: true, locale: ar })}
            </span>
          )}
          {isOutgoing && getStatusIcon()}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
