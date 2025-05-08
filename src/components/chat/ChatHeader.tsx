
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Phone, Video, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ChatHeaderProps = {
  name: string;
  status?: string;
  avatar?: string;
};

const ChatHeader = ({ name, status = "متصل", avatar }: ChatHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <header className="flex items-center justify-between p-3 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/chats")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Avatar>
          <AvatarImage src={avatar} />
          <AvatarFallback className="bg-primary/20 text-primary">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{name}</span>
          <span className="text-xs text-muted-foreground">{status}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <Button variant="ghost" size="icon">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default ChatHeader;
