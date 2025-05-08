
import LoginForm from "@/components/auth/LoginForm";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full max-w-md text-center mb-8">
        <h1 className="text-3xl font-bold text-primary">تطبيق الدردشة</h1>
        <p className="text-muted-foreground mt-2">تسجيل الدخول للوصول إلى محادثاتك</p>
      </div>
      <LoginForm />
      <p className="mt-8 text-center text-sm text-muted-foreground">
        بالتسجيل الدخول، أنت توافق على{" "}
        <Link to="/terms" className="font-medium text-primary underline">
          شروط الاستخدام
        </Link>
        {" "}و{" "}
        <Link to="/privacy" className="font-medium text-primary underline">
          سياسة الخصوصية
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
