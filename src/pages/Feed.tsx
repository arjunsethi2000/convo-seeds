import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Profile {
  id: string;
  name: string;
  school: string;
  photo_url: string | null;
  responses: Array<{
    response_text: string;
    created_at: string;
    prompt: { question: string };
  }>;
}

const Feed = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState<"left" | "right" | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: swipedIds } = await supabase
        .from("swipes")
        .select("swiped_id")
        .eq("swiper_id", user.id);

      const alreadySwipedIds = swipedIds?.map((s) => s.swiped_id) || [];

      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          name,
          school,
          photo_url,
          prompt_responses!inner (
            response_text,
            created_at,
            prompts!inner (question)
          )
        `)
        .neq("id", user.id)
        .not("id", "in", `(${alreadySwipedIds.join(",")})`)
        .gte("prompt_responses.created_at", sevenDaysAgo.toISOString())
        .order("created_at", { referencedTable: "prompt_responses", ascending: false })
        .limit(7, { referencedTable: "prompt_responses" });

      if (error) throw error;

      const uniqueProfiles = data?.reduce((acc: any[], curr: any) => {
        if (!acc.find((p) => p.id === curr.id)) {
          acc.push({
            ...curr,
            responses: curr.prompt_responses.map((r: any) => ({
              response_text: r.response_text,
              created_at: r.created_at,
              prompt: r.prompts,
            })),
          });
        }
        return acc;
      }, []);

      setProfiles(uniqueProfiles || []);
    } catch (error: any) {
      toast.error("Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction: "left" | "right") => {
    if (swiping || currentIndex >= profiles.length) return;

    setSwiping(direction);
    const currentProfile = profiles[currentIndex];

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("swipes").insert({
        swiper_id: user.id,
        swiped_id: currentProfile.id,
        direction,
      });

      if (error) throw error;

      if (direction === "right") {
        const { data: match } = await supabase
          .from("matches")
          .select("*")
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
          .or(`user1_id.eq.${currentProfile.id},user2_id.eq.${currentProfile.id}`)
          .single();

        if (match) {
          toast.success(`It's a match with ${currentProfile.name}! 🎉`);
        }
      }

      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setSwiping(null);
      }, 400);
    } catch (error: any) {
      toast.error("Failed to swipe");
      setSwiping(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];

  if (!currentProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8">
          <CardContent className="space-y-4">
            <p className="text-xl font-semibold">No more profiles to show</p>
            <p className="text-muted-foreground">Check back later for more matches!</p>
            <Button onClick={() => navigate("/prompt")} className="w-full">
              Answer Today's Prompt
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 pb-24">
      <div className="max-w-md mx-auto pt-8">
        <Card
          className={`shadow-elevated overflow-hidden ${
            swiping === "left" ? "animate-swipe-left" : swiping === "right" ? "animate-swipe-right" : ""
          }`}
        >
          {currentProfile.photo_url && (
            <div className="h-64 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
              <img
                src={currentProfile.photo_url}
                alt={currentProfile.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardContent className="p-6 space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{currentProfile.name}</h2>
              <p className="text-muted-foreground">{currentProfile.school}</p>
            </div>

            <div className="space-y-4">
              {currentProfile.responses.map((response, idx) => (
                <div key={idx} className="space-y-2">
                  <p className="text-sm font-medium text-primary">{response.prompt.question}</p>
                  <p className="text-foreground">{response.response_text}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(response.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-6 mt-8">
          <Button
            size="lg"
            variant="outline"
            className="w-16 h-16 rounded-full border-2 hover:border-destructive hover:text-destructive"
            onClick={() => handleSwipe("left")}
            disabled={!!swiping}
          >
            <X className="w-8 h-8" />
          </Button>
          <Button
            size="lg"
            className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary"
            onClick={() => handleSwipe("right")}
            disabled={!!swiping}
          >
            <Heart className="w-8 h-8" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Feed;
