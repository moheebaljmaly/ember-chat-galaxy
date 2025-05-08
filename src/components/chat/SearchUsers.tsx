
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";

type UserType = {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
};

const SearchUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<UserType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      // Search for users by username or email
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, email, avatar_url")
        .or(`username.ilike.%${searchTerm}%, email.ilike.%${searchTerm}%`)
        .neq("id", user?.id) // Exclude current user
        .limit(10);
      
      if (error) throw error;
      
      setResults(data || []);
    } catch (error: any) {
      console.error("Error searching users:", error.message);
      toast({
        title: "خطأ في البحث",
        description: "حدث خطأ أثناء البحث عن المستخدمين",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setResults([]);
  };

  const startChat = async (otherUserId: string) => {
    if (!user) return;
    
    try {
      // Check if chat already exists
      const { data: existingChats, error: checkError } = await supabase
        .from("chat_participants")
        .select(`
          chat_id,
          chats!inner (
            id
          )
        `)
        .eq("user_id", user.id);

      if (checkError) throw checkError;
      
      let chatId: string | null = null;
      
      if (existingChats && existingChats.length > 0) {
        // Check if there's a chat with just these two users
        for (const chat of existingChats) {
          const { data: participants, error: partError } = await supabase
            .from("chat_participants")
            .select("user_id")
            .eq("chat_id", chat.chat_id);
            
          if (partError) throw partError;
          
          if (participants && participants.length === 2 && 
              participants.some(p => p.user_id === otherUserId)) {
            chatId = chat.chat_id;
            break;
          }
        }
      }
      
      // If no existing chat, create a new one
      if (!chatId) {
        // Create new chat
        const { data: newChat, error: chatError } = await supabase
          .from("chats")
          .insert({})
          .select()
          .single();
          
        if (chatError) throw chatError;
        
        chatId = newChat.id;
        
        // Add current user as participant
        const { error: currentUserError } = await supabase
          .from("chat_participants")
          .insert({
            chat_id: chatId,
            user_id: user.id
          });
          
        if (currentUserError) throw currentUserError;
        
        // Add other user as participant
        const { error: otherUserError } = await supabase
          .from("chat_participants")
          .insert({
            chat_id: chatId,
            user_id: otherUserId
          });
          
        if (otherUserError) throw otherUserError;
      }
      
      // Navigate to chat
      navigate(`/chat/${chatId}`);
    } catch (error: any) {
      console.error("Error starting chat:", error.message);
      toast({
        title: "خطأ في بدء المحادثة",
        description: "حدث خطأ أثناء محاولة بدء المحادثة",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <div className="relative flex-1">
          <Input
            placeholder="ابحث عن مستخدم بالبريد الإلكتروني أو الاسم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10 text-right"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? "جاري البحث..." : "بحث"}
        </Button>
      </div>

      {isSearching ? (
        <div className="space-y-2">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-accent rounded-lg">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-9 w-16" />
            </div>
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-2">
          <h3 className="font-medium text-lg">نتائج البحث</h3>
          <div className="space-y-2">
            {results.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-accent rounded-lg"
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Avatar>
                    <AvatarImage src={user.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Button onClick={() => startChat(user.id)}>دردشة</Button>
              </div>
            ))}
          </div>
        </div>
      ) : searchTerm && !isSearching ? (
        <div className="text-center py-8 text-muted-foreground">
          لم يتم العثور على نتائج
        </div>
      ) : null}
    </div>
  );
};

export default SearchUsers;
