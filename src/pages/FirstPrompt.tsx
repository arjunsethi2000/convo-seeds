import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

const FirstPrompt = () => {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!response.trim()) {
      toast.error("Please write a response");
      return;
    }

    setLoading(true);
    // Placeholder - will save to backend later
    toast.success("Response saved!");
    setTimeout(() => {
      setLoading(false);
      navigate("/profile-setup");
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-elevated animate-scale-in">
        <CardHeader>
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center mb-2">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-center text-2xl">
            Today's Prompt
          </CardTitle>
          <p className="text-center text-muted-foreground mt-2">
            Answer this to unlock the app
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-lg font-medium text-center">
              What's a conversation topic you could talk about for hours?
            </p>
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="Write your answer here..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground text-right">
              {response.length} characters
            </p>
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={loading || !response.trim()}
            size="lg"
            className="w-full"
          >
            {loading ? "Submitting..." : "Submit Answer"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirstPrompt;
