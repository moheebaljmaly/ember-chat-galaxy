
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ChatListItem from "@/components/chat/ChatListItem";
import SearchUsers from "@/components/chat/SearchUsers";
import { MessageCircle, Users, User, Bell, Settings, LogOut, Search, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock chat data
const mockChats = [
  {
    id: "1",
    name: "أحمد محمد",
    avatar: "",
    lastMessage: "مرحباً، كيف حالك؟",
    lastMessageTime: new Date(Date.now() - 15 * 60000),
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "2",
    name: "سارة أحمد",
    avatar: "",
    lastMessage: "هل انتهيت من المشروع؟",
    lastMessageTime: new Date(Date.now() - 2 * 3600000),
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: "3",
    name: "محمد علي",
    avatar: "",
    lastMessage: "سنلتقي غداً إن شاء الله",
    lastMessageTime: new Date(Date.now() - 1 * 86400000),
    unreadCount: 5,
    isOnline: true,
  },
  {
    id: "4",
    name: "فاطمة حسن",
    avatar: "",
    lastMessage: "أرسلت لك الملف المطلوب",
    lastMessageTime: new Date(Date.now() - 3 * 86400000),
    unreadCount: 0,
    isOnline: false,
  },
];

const ChatListPage = () => {
  const [chats, setChats] = useState(mockChats);
  const [user, setUser] = useState<{ email: string; username: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem("chatUser");
    if (!userData) {
      navigate("/login");
      return;
    }
    
    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل بيانات المستخدم",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem("chatUser");
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل الخروج بنجاح",
    });
    navigate("/login");
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="p-4 border-b flex justify-between items-center bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-xl font-bold">الدردشات</h1>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث عن محادثة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-right"
          />
        </div>
      </div>

      <Tabs defaultValue="chats" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2 mx-4">
          <TabsTrigger value="chats" className="flex items-center space-x-2 rtl:space-x-reverse">
            <MessageCircle className="h-4 w-4" />
            <span>الدردشات</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2 rtl:space-x-reverse">
            <Users className="h-4 w-4" />
            <span>البحث</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chats" className="flex-1 overflow-auto p-0 m-0">
          {filteredChats.length > 0 ? (
            <div className="divide-y">
              {filteredChats.map((chat) => (
                <ChatListItem key={chat.id} {...chat} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <MessageCircle className="h-12 w-12 mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">لا توجد محادثات</h3>
              <p className="text-muted-foreground">ابدأ محادثة جديدة عن طريق البحث عن مستخدم</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="users" className="flex-1 overflow-auto p-0 m-0">
          <SearchUsers />
        </TabsContent>
      </Tabs>

      <footer className="p-4 border-t bg-background/95 backdrop-blur-sm">
        <Card className="bg-muted/50">
          <CardHeader className="p-3">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.username || "مستخدم"}</p>
                <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </footer>
    </div>
  );
};

export default ChatListPage;
