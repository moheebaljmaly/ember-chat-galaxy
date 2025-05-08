
import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import ChatListItem from "@/components/chat/ChatListItem";
import SearchUsers from "@/components/chat/SearchUsers";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

type ChatListItemType = {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  isOnline: boolean;
  otherUserId: string;
};

const ChatListPage = () => {
  const { user, profile, isLoading, signOut } = useAuth();
  const [chats, setChats] = useState<ChatListItemType[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    
    const fetchChats = async () => {
      try {
        // Get all chats where the current user is a participant
        const { data: chatParticipants, error: chatError } = await supabase
          .from("chat_participants")
          .select(`
            chat_id,
            chats (
              id,
              created_at
            )
          `)
          .eq("user_id", user.id);

        if (chatError) throw chatError;
        
        if (!chatParticipants || chatParticipants.length === 0) {
          setLoadingChats(false);
          return;
        }

        const chatData: ChatListItemType[] = [];

        // For each chat, get the other participants and the last message
        for (const chatParticipant of chatParticipants) {
          const chatId = chatParticipant.chat_id;

          // Get other participants
          const { data: otherParticipants, error: participantsError } = await supabase
            .from("chat_participants")
            .select(`
              user_id,
              profiles (
                username,
                avatar_url
              )
            `)
            .eq("chat_id", chatId)
            .neq("user_id", user.id);

          if (participantsError) throw participantsError;

          if (!otherParticipants || otherParticipants.length === 0) continue;

          // Get last message
          const { data: messages, error: messagesError } = await supabase
            .from("messages")
            .select("content, created_at, read_at, sender_id")
            .eq("chat_id", chatId)
            .order("created_at", { ascending: false })
            .limit(1);

          if (messagesError) throw messagesError;
          
          const otherUser = otherParticipants[0];
          const lastMessage = messages && messages.length > 0 ? messages[0] : null;
          
          // Count unread messages (where current user is not the sender and read_at is null)
          const { count: unreadCount, error: countError } = await supabase
            .from("messages")
            .select("id", { count: "exact" }) // Change from true to "exact"
            .eq("chat_id", chatId)
            .neq("sender_id", user.id)
            .is("read_at", null);

          if (countError) throw countError;

          chatData.push({
            id: chatId,
            name: otherUser.profiles.username || "مستخدم",
            avatar: otherUser.profiles.avatar_url || undefined,
            lastMessage: lastMessage ? lastMessage.content : undefined,
            lastMessageTime: lastMessage ? new Date(lastMessage.created_at) : undefined,
            unreadCount: unreadCount || 0,
            isOnline: false, // We could implement a presence system for this
            otherUserId: otherUser.user_id
          });
        }
        
        setChats(chatData);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoadingChats(false);
      }
    };

    fetchChats();
  }, [user]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">جارِ التحميل...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/profile")}
          >
            <User className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">الدردشات</h1>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <Tabs defaultValue="chats" className="flex-1 flex flex-col">
        <div className="px-4 pt-2">
          <TabsList className="w-full">
            <TabsTrigger value="chats" className="flex-1">الدردشات</TabsTrigger>
            <TabsTrigger value="search" className="flex-1">البحث</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chats" className="flex-1 overflow-y-auto">
          <div className="py-2">
            {loadingChats ? (
              <>
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="p-3 flex items-center space-x-4 rtl:space-x-reverse">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </>
            ) : chats.length > 0 ? (
              <>
                {chats.map((chat) => (
                  <ChatListItem
                    key={chat.id}
                    id={chat.id}
                    name={chat.name}
                    avatar={chat.avatar}
                    lastMessage={chat.lastMessage}
                    lastMessageTime={chat.lastMessageTime}
                    unreadCount={chat.unreadCount}
                    isOnline={chat.isOnline}
                  />
                ))}
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground px-4">
                <p className="mb-4">لا توجد محادثات</p>
                <p className="text-sm">ابدأ محادثة جديدة عن طريق البحث عن مستخدم</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="search" className="flex-1 overflow-y-auto">
          <SearchUsers />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatListPage;
