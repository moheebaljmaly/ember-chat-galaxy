
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

type ChatListItemProps = {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
  isOnline?: boolean;
};

const ChatListItem = ({
  id,
  name,
  avatar,
  lastMessage = "",
  lastMessageTime,
  unreadCount = 0,
  isOnline = false,
}: ChatListItemProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/chat/${id}`);
  };

  return (
    <div
      className="flex items-center space-x-4 rtl:space-x-reverse p-3 hover:bg-accent rounded-lg cursor-pointer transition-colors"
      onClick={handleClick}
    >
      <div className="relative">
        <Avatar>
          <AvatarImage src={avatar} />
          <AvatarFallback className="bg-primary/20 text-primary">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background"></span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-medium truncate">{name}</h3>
          {lastMessageTime && (
            <span className="text-xs text-muted-foreground">
              {format(lastMessageTime, "p", { locale: ar })}
            </span>
          )}
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground truncate">{lastMessage}</p>
          {unreadCount > 0 && (
            <Badge variant="default" className="ml-1 h-5 min-w-5 px-1.5">
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;
