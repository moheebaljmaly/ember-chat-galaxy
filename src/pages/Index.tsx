
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    const userData = localStorage.getItem("chatUser");
    if (userData) {
      // User already logged in, redirect to chats
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-md w-full text-center space-y-8 animate-slide-up">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-primary">تطبيق الدردشة</h1>
          <p className="text-xl text-muted-foreground">
            تواصل مع أصدقائك وعائلتك في أي وقت وأي مكان
          </p>
        </div>
        
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-chat-primary to-chat-secondary mx-auto flex items-center justify-center">
          <span className="text-4xl text-white">💬</span>
        </div>
        
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Button 
              onClick={() => navigate("/register")} 
              size="lg"
              className="w-full"
            >
              إنشاء حساب جديد
            </Button>
            
            <Button 
              onClick={() => navigate("/login")} 
              variant="outline" 
              size="lg"
              className="w-full"
            >
              تسجيل الدخول
            </Button>
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm pt-8">
          تطبيق المراسلة الآمن والسريع للتواصل مع من تحب
        </p>
      </div>
    </div>
  );
};

export default Index;
