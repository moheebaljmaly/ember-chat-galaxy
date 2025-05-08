
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Smile, Mic } from "lucide-react";

type ChatInputProps = {
  onSendMessage: (message: string) => void;
};

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t p-3 bg-background/95 backdrop-blur-sm sticky bottom-0 z-10">
      <form onSubmit={handleSubmit} className="flex items-end space-x-2 rtl:space-x-reverse">
        <div className="flex-shrink-0 flex space-x-1 rtl:space-x-reverse">
          <Button type="button" size="icon" variant="ghost">
            <Paperclip className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="relative flex-grow">
          <Textarea
            placeholder="اكتب رسالة..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="resize-none pr-10 text-right"
            rows={1}
          />
          <Button 
            type="button" 
            size="icon" 
            variant="ghost" 
            className="absolute right-2 bottom-1 h-8 w-8"
          >
            <Smile className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-shrink-0">
          {message.trim() ? (
            <Button type="submit" size="icon" className="rounded-full h-10 w-10">
              <Send className="h-5 w-5" />
            </Button>
          ) : (
            <Button type="button" size="icon" variant="ghost" className="rounded-full h-10 w-10">
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
