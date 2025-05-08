
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-primary/5 to-background">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-muted mx-auto flex items-center justify-center">
          <span className="text-4xl">🔍</span>
        </div>
        
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          عذراً، الصفحة التي تبحث عنها غير موجودة
        </p>
        
        <Button onClick={() => navigate("/")} size="lg">
          العودة إلى الصفحة الرئيسية
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
