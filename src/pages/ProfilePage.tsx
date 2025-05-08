
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Camera } from "lucide-react";
import { Navigate } from "react-router-dom";

const ProfilePage = () => {
  const { user, profile, isLoading, updateProfile, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");

  // If loading, show a loading message
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">جارِ التحميل...</div>;
  }

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Enable edit mode
  const handleEdit = () => {
    setUsername(profile?.username || "");
    setIsEditing(true);
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    await updateProfile({ username });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-8 px-4">
      <div className="max-w-md mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                  {profile?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">الملف الشخصي</CardTitle>
            <CardDescription>عرض وتعديل معلومات ملفك الشخصي</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">اسم المستخدم</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="text-right"
                  />
                </div>
                <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                  >
                    إلغاء
                  </Button>
                  <Button onClick={handleSaveProfile}>حفظ التغييرات</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">اسم المستخدم</p>
                      <p>{profile?.username || "-"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">البريد الإلكتروني</p>
                      <p>{user.email}</p>
                    </div>
                  </div>
                </div>

                <Button onClick={handleEdit} className="w-full">
                  تعديل الملف الشخصي
                </Button>
                
                <Button variant="outline" onClick={signOut} className="w-full">
                  تسجيل الخروج
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
