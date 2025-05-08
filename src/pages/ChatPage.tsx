
import { useState, useEffect, useRef } from "react";
import { useParams, Navigate } from "react-router-dom";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type Message = {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  read_at: string | null;
};

type ChatPartner = {
  id: string;
  username: string;
  avatar_url: string | null;
  status?: string;
};

const ChatPage = () => {
  const { id: chatId } = useParams<{ id: string }>();
  const { user, isLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatPartner, setChatPartner] = useState<ChatPartner | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!chatId || !user) return;

    const fetchChatDetails = async () => {
      try {
        // Get the chat partner
        const { data: participants, error: participantsError } = await supabase
          .from("chat_participants")
          .select(`
            user_id,
            profiles (
              id,
              username,
              avatar_url
            )
          `)
          .eq("chat_id", chatId)
          .neq("user_id", user.id);

        if (participantsError) throw participantsError;
        
        if (participants && participants.length > 0) {
          setChatPartner({
            id: participants[0].profiles.id,
            username: participants[0].profiles.username,
            avatar_url: participants[0].profiles.avatar_url,
            status: "متصل" // We could implement a presence system for this
          });
        }

        // Get messages
        const { data: messagesData, error: messagesError } = await supabase
          .from("messages")
          .select("*")
          .eq("chat_id", chatId)
          .order("created_at", { ascending: true });

        if (messagesError) throw messagesError;
        
        setMessages(messagesData || []);
        
        // Mark unread messages as read
        if (messagesData && messagesData.length > 0) {
          const unreadMessages = messagesData.filter(
            msg => msg.sender_id !== user.id && !msg.read_at
          );

          if (unreadMessages.length > 0) {
            const unreadIds = unreadMessages.map(msg => msg.id);
            
            await supabase
              .from("messages")
              .update({ read_at: new Date().toISOString() })
              .in("id", unreadIds);
          }
        }
        
      } catch (error: any) {
        console.error("Error fetching chat details:", error.message);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء تحميل المحادثة",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChatDetails();
    
    // Set up real-time listener for new messages
    const messagesSubscription = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`
        },
        async (payload) => {
          const newMessage = payload.new as Message;
          
          // If the new message is from the other user, mark it as read
          if (newMessage.sender_id !== user.id) {
            await supabase
              .from("messages")
              .update({ read_at: new Date().toISOString() })
              .eq("id", newMessage.id);
          }
          
          setMessages(currentMessages => [...currentMessages, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesSubscription);
    };
  }, [chatId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (content: string) => {
    if (!user || !chatId || !content.trim()) return;
    
    try {
      await supabase
        .from("messages")
        .insert({
          chat_id: chatId,
          sender_id: user.id,
          content: content.trim(),
        });
    } catch (error: any) {
      console.error("Error sending message:", error.message);
      toast({
        title: "خطأ",
        description: "فشل إرسال الرسالة",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">جارِ التحميل...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col h-screen">
      {loading ? (
        <>
          <div className="border-b p-3">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'} mb-2`}>
                <Skeleton className={`h-12 w-64 rounded-lg ${i % 2 === 0 ? 'rounded-tl-none' : 'rounded-tr-none'}`} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {chatPartner && (
            <ChatHeader
              name={chatPartner.username}
              status={chatPartner.status}
              avatar={chatPartner.avatar_url || undefined}
            />
          )}
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50 dark:bg-gray-900">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">ابدأ المحادثة الآن</p>
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  content={message.content}
                  timestamp={new Date(message.created_at)}
                  isOutgoing={message.sender_id === user.id}
                  status={message.read_at ? "read" : "sent"}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <ChatInput onSendMessage={handleSendMessage} />
        </>
      )}
    </div>
  );
};

export default ChatPage;
