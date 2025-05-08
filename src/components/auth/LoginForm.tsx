
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeIcon, EyeOffIcon, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailNotConfirmed, setIsEmailNotConfirmed] = useState(false);
  
  const navigate = useNavigate();
  const { signIn, resendConfirmationEmail } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsEmailNotConfirmed(false);
    
    if (!email || !password) {
      setError("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signIn(email, password);
    } catch (error: any) {
      console.error("Login error:", error);
      
      if (error.message.includes("Email not confirmed")) {
        setError("لم يتم تأكيد البريد الإلكتروني بعد. يرجى التحقق من بريدك الإلكتروني للتأكيد أو إعادة إرسال رسالة التأكيد.");
        setIsEmailNotConfirmed(true);
      } else if (error.message.includes("Invalid login credentials")) {
        setError("بيانات تسجيل الدخول غير صحيحة. يرجى التحقق من البريد الإلكتروني وكلمة المرور.");
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setError("يرجى إدخال البريد الإلكتروني أولاً");
      return;
    }

    setIsResending(true);
    
    try {
      await resendConfirmationEmail(email);
    } catch (error) {
      console.error("Error resending confirmation:", error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md animate-fade-in">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">تسجيل الدخول</CardTitle>
        <CardDescription>
          أدخل بيانات تسجيل الدخول الخاصة بك أدناه
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-right pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            
            {isEmailNotConfirmed && (
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={handleResendConfirmation}
                disabled={isResending}
              >
                <Mail className="h-4 w-4" />
                {isResending ? "جارٍ إرسال رابط التأكيد..." : "إعادة إرسال رابط التأكيد"}
              </Button>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 text-center">
        <div className="text-sm text-muted-foreground">
          ليس لديك حساب؟{" "}
          <Button
            variant="link"
            className="p-0 h-auto"
            onClick={() => navigate("/register")}
          >
            إنشاء حساب جديد
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
