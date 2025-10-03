import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-6">
      <div className="text-center space-y-8 max-w-md animate-fade-in">
        <div className="mx-auto w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-3xl flex items-center justify-center shadow-elevated">
          <Heart className="w-10 h-10 text-white" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Convo Seeds
          </h1>
          <p className="text-xl text-muted-foreground">
            Real conversations, authentic connections
          </p>
        </div>

        <Button 
          onClick={() => navigate("/signin")} 
          size="lg"
          className="w-full max-w-xs mt-8"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
