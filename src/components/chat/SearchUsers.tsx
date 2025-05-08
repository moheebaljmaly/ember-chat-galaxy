
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock user data
const mockUsers = [
  { id: "1", name: "أحمد محمد", email: "ahmed@example.com", avatar: "" },
  { id: "2", name: "سارة أحمد", email: "sara@example.com", avatar: "" },
  { id: "3", name: "محمد علي", email: "mohamed@example.com", avatar: "" },
  { id: "4", name: "فاطمة حسن", email: "fatima@example.com", avatar: "" },
];

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

const SearchUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const filtered = mockUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setResults(filtered);
      setIsSearching(false);
    }, 500);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setResults([]);
  };

  const startChat = (userId: string) => {
    navigate(`/chat/${userId}`);
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

      {results.length > 0 ? (
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
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
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
