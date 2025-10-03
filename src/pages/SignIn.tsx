import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Apple, Phone } from "lucide-react";
import { toast } from "sonner";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAppleSignIn = async () => {
    setLoading(true);
    // Placeholder for Apple Sign In
    toast.info("Apple Sign In will be implemented with backend");
    setTimeout(() => {
      setLoading(false);
      // For demo, navigate to onboarding
      navigate("/onboarding");
    }, 1000);
  };

  const handlePhoneSignIn = async () => {
    setLoading(true);
    // Placeholder for Phone Sign In
    toast.info("Phone Sign In will be implemented with backend");
    setTimeout(() => {
      setLoading(false);
      // For demo, navigate to onboarding
      navigate("/onboarding");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-elevated animate-scale-in">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Welcome Back
          </CardTitle>
          <CardDescription>
            Sign in to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleAppleSignIn}
            disabled={loading}
            variant="outline"
            size="lg"
            className="w-full"
          >
            <Apple className="w-5 h-5 mr-2" />
            Continue with Apple
          </Button>
          
          <Button 
            onClick={handlePhoneSignIn}
            disabled={loading}
            variant="outline"
            size="lg"
            className="w-full"
          >
            <Phone className="w-5 h-5 mr-2" />
            Continue with Phone Number
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
