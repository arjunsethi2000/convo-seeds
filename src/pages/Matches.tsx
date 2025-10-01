import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, MessageCircle, User } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Match {
  id: string;
  matched_at: string;
  other_user: {
    id: string;
    name: string;
    school: string;
    photo_url: string | null;
  };
}

const Matches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("matches")
        .select(`
          id,
          matched_at,
          user1_id,
          user2_id,
          profiles!matches_user1_id_fkey (id, name, school, photo_url),
          profiles!matches_user2_id_fkey (id, name, school, photo_url)
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order("matched_at", { ascending: false });

      if (error) throw error;

      const formattedMatches = data?.map((match: any) => {
        const isUser1 = match.user1_id === user.id;
        const otherUser = isUser1 ? match.profiles[1] : match.profiles[0];
        
        return {
          id: match.id,
          matched_at: match.matched_at,
          other_user: otherUser || { id: "", name: "Unknown", school: "", photo_url: null },
        };
      }) || [];

      setMatches(formattedMatches);
    } catch (error: any) {
      toast.error("Failed to load matches");
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 pb-24">
      <div className="max-w-2xl mx-auto pt-8">
        <h1 className="text-3xl font-bold mb-6">Your Matches</h1>
        
        {matches.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No matches yet. Keep swiping!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <Card
                key={match.id}
                className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer"
                onClick={() => navigate(`/chat/${match.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center flex-shrink-0">
                      {match.other_user.photo_url ? (
                        <img
                          src={match.other_user.photo_url}
                          alt={match.other_user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{match.other_user.name}</h3>
                      <p className="text-sm text-muted-foreground">{match.other_user.school}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Matched {new Date(match.matched_at).toLocaleDateString()}
                      </p>
                    </div>
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
