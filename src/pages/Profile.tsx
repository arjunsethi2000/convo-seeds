import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, User, LogOut, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ProfileData {
  name: string;
  school: string;
  photo_url: string | null;
  responses: Array<{
    response_text: string;
    created_at: string;
    prompt: { question: string };
  }>;
}

const Profile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select(`
          name,
          school,
          photo_url,
          prompt_responses (
            response_text,
            created_at,
            prompts (question)
          )
        `)
        .eq("id", user.id)
        .order("created_at", { referencedTable: "prompt_responses", ascending: false })
        .limit(7, { referencedTable: "prompt_responses" })
        .single();

      if (error) throw error;

      setProfile({
        ...data,
        responses: data.prompt_responses.map((r: any) => ({
          response_text: r.response_text,
          created_at: r.created_at,
          prompt: r.prompts,
        })),
      });
    } catch (error: any) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const generateInvite = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      const { error } = await supabase.from("invites").insert({
        code: inviteCode,
        created_by: user.id,
      });

      if (error) throw error;

      const inviteUrl = `${window.location.origin}/auth?invite=${inviteCode}`;
      await navigator.clipboard.writeText(inviteUrl);
      toast.success("Invite link copied to clipboard!");
    } catch (error: any) {
      toast.error("Failed to generate invite");
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
      <div className="max-w-2xl mx-auto pt-8 space-y-6">
        <Card className="shadow-elevated">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                {profile?.photo_url ? (
                  <img src={profile.photo_url} alt={profile.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl">{profile?.name}</CardTitle>
                <p className="text-muted-foreground">{profile?.school}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={generateInvite} variant="outline" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Generate Invite
              </Button>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Responses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {profile?.responses && profile.responses.length > 0 ? (
              profile.responses.map((response, idx) => (
                <div key={idx} className="space-y-2 pb-4 border-b last:border-0">
                  <p className="text-sm font-medium text-primary">{response.prompt.question}</p>
                  <p className="text-foreground">{response.response_text}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(response.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">No responses yet. Answer today's prompt!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
