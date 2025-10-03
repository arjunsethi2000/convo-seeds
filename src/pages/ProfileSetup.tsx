import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { User, Upload } from "lucide-react";

const ProfileSetup = () => {
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePhotoUpload = () => {
    // Placeholder for photo upload
    toast.info("Photo upload will be implemented with backend");
  };

  const handleFinish = async () => {
    setLoading(true);
    // Placeholder - will save to backend later
    toast.success("Profile setup complete!");
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-elevated animate-scale-in">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Here's how others will see you
          </CardTitle>
          <p className="text-center text-muted-foreground mt-2">
            Your latest prompt response will appear on your profile
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preview of prompt response */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Your Answer:</p>
            <p className="text-sm">
              What's a conversation topic you could talk about for hours?
            </p>
            <p className="mt-2 italic">
              "Your response will appear here..."
            </p>
          </div>

          {/* Photo upload */}
          <div className="space-y-3">
            <Label>Profile Photo (Optional)</Label>
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={photoUrl} />
                <AvatarFallback>
                  <User className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <Button 
                onClick={handlePhotoUpload}
                variant="outline"
                size="sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
            </div>
          </div>

          {/* Name input */}
          <div className="space-y-2">
            <Label htmlFor="name">First Name (Optional)</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your first name"
            />
          </div>

          <Button 
            onClick={handleFinish}
            disabled={loading}
            size="lg"
            className="w-full"
          >
            {loading ? "Setting up..." : "Finish Setup"}
          </Button>

          <Button 
            onClick={() => navigate("/")}
            variant="ghost"
            size="sm"
            className="w-full"
          >
            Skip for now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;
