
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";

// Mock chat data for different users
const mockChatsData: Record<string, any> = {
  "1": {
    user: { id: "1", name: "أحمد محمد", status: "متصل الآن" },
    messages: [
      { id: "1", content: "مرحباً، كيف حالك؟", timestamp: new Date(Date.now() - 2 * 3600000), isOutgoing: false },
      { id: "2", content: "أنا بخير، شكراً على السؤال! ماذا عنك؟", timestamp: new Date(Date.now() - 1.9 * 3600000), isOutgoing: true, status: "read" },
      { id: "3", content: "أنا جيد أيضاً. هل انتهيت من العمل على المشروع؟", timestamp: new Date(Date.now() - 1.8 * 3600000), isOutgoing: false },
      { id: "4", content: "نعم، انتهيت منه البارحة. سأرسل لك الملفات قريباً", timestamp: new Date(Date.now() - 15 * 60000), isOutgoing: true, status: "read" },
    ],
  },
  "2": {
    user: { id: "2", name: "سارة أحمد", status: "غير متصل" },
    messages: [
      { id: "1", content: "هل انتهيت من المشروع؟", timestamp: new Date(Date.now() - 2 * 3600000), isOutgoing: false },
      { id: "2", content: "أحتاج إلى يوم إضافي لإكماله", timestamp: new Date(Date.now() - 1.9 * 3600000), isOutgoing: true, status: "delivered" },
      { id: "3", content: "حسناً، لا مشكلة. أخبرني عندما تنتهي منه", timestamp: new Date(Date.now() - 1.8 * 3600000), isOutgoing: false },
    ],
  },
  "3": {
    user: { id: "3", name: "محمد علي", status: "آخر ظهور اليوم 10:30 صباحاً" },
    messages: [
      { id: "1", content: "سنلتقي غداً إن شاء الله", timestamp: new Date(Date.now() - 1 * 86400000), isOutgoing: false },
      { id: "2", content: "في نفس المكان؟", timestamp: new Date(Date.now() - 23 * 3600000), isOutgoing: true, status: "read" },
      { id: "3", content: "نعم، في الساعة الثالثة", timestamp: new Date(Date.now() - 22 * 3600000), isOutgoing: false },
      { id: "4", content: "تمام، سأكون هناك", timestamp: new Date(Date.now() - 21 * 3600000), isOutgoing: true, status: "read" },
    ],
  },
  "4": {
    user: { id: "4", name: "فاطمة حسن", status: "آخر ظهور اليوم 9:15 مساءً" },
    messages: [
      { id: "1", content: "أرسلت لك الملف المطلوب", timestamp: new Date(Date.now() - 3 * 86400000), isOutgoing: false },
      { id: "2", content: "شكراً جزيلاً! سأراجعه وأرد عليك", timestamp: new Date(Date.now() - 3 * 86400000 + 1 * 3600000), isOutgoing: true, status: "read" },
    ],
  },
};

const ChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const [chatData, setChatData] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chat data
  useEffect(() => {
    if (!id) return;
    
    // Simulate API call with timeout
    const timer = setTimeout(() => {
      const data = mockChatsData[id];
      
      if (data) {
        setChatData(data);
        setMessages(data.messages);
      }
      
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [id]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle send message
  const handleSendMessage = (content: string) => {
    if (!content.trim() || !chatData) return;
    
    const newMessage = {
      id: `temp-${Date.now()}`,
      content,
      timestamp: new Date(),
      isOutgoing: true,
      status: "sent" as const,
    };
    
    setMessages((prev) => [...prev, newMessage]);
    
    // Simulate message sending and status updates
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg
        )
      );
      
      // Simulate reply after some time
      if (Math.random() > 0.5) {
        setTimeout(() => {
          const replies = [
            "حسناً",
            "تمام، فهمت",
            "شكراً لك",
            "سأكون متواجد لاحقاً",
            "أراك قريباً",
          ];
          
          const replyMessage = {
            id: `reply-${Date.now()}`,
            content: replies[Math.floor(Math.random() * replies.length)],
            timestamp: new Date(),
            isOutgoing: false,
          };
          
          setMessages((prev) => [...prev, replyMessage]);
          
          // Mark messages as read
          setMessages((prev) =>
            prev.map((msg) =>
              msg.isOutgoing && msg.status === "delivered"
                ? { ...msg, status: "read" }
                : msg
            )
          );
        }, 3000 + Math.random() * 5000);
      }
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>جاري تحميل المحادثة...</p>
        </div>
      </div>
    );
  }

  if (!chatData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg font-medium">لم يتم العثور على المحادثة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-chat-light dark:bg-chat-dark">
      <ChatHeader name={chatData.user.name} status={chatData.user.status} />
      
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            content={message.content}
            timestamp={new Date(message.timestamp)}
            isOutgoing={message.isOutgoing}
            status={message.status}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatPage;
