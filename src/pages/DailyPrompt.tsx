import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DailyPrompt = () => {
  const [prompt, setPrompt] = useState<{ id: string; question: string } | null>(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadTodayPrompt();
  }, []);

  const loadTodayPrompt = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split("T")[0];

      const { data: promptData, error: promptError } = await supabase
        .from("prompts")
        .select("*")
        .eq("date", today)
        .single();

      if (promptError) throw promptError;
      setPrompt(promptData);

      const { data: responseData } = await supabase
        .from("prompt_responses")
        .select("*")
        .eq("user_id", user.id)
        .eq("prompt_id", promptData.id)
        .single();

      if (responseData) {
        setHasAnswered(true);
        setResponse(responseData.response_text);
      }
    } catch (error: any) {
      toast.error("Failed to load prompt");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || !response.trim()) return;

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("prompt_responses").upsert({
        user_id: user.id,
        prompt_id: prompt.id,
        response_text: response.trim(),
      });

      if (error) throw error;

      await supabase
        .from("profiles")
        .update({ last_prompt_answer_at: new Date().toISOString() })
        .eq("id", user.id);

      toast.success("Response saved!");
      setHasAnswered(true);
      navigate("/");
    } catch (error: any) {
      toast.error("Failed to save response");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 pb-24">
      <div className="max-w-2xl mx-auto pt-8">
        <Card className="shadow-elevated animate-fade-in">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-2xl flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Today's Prompt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {prompt && (
              <>
                <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                  <p className="text-xl font-medium text-center">{prompt.question}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="min-h-[200px] text-lg"
                    disabled={hasAnswered}
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{response.length}/500</span>
                    <Button type="submit" disabled={submitting || hasAnswered || !response.trim()}>
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : hasAnswered ? "Answered" : "Submit"}
                    </Button>
                  </div>
                </form>

                {hasAnswered && (
                  <p className="text-center text-sm text-muted-foreground">
                    You can edit your response anytime today
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyPrompt;
