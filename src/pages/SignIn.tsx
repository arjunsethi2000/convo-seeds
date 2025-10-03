import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Heart, Apple, Phone, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"method" | "phone" | "otp">("method");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleAppleSignIn = async () => {
    setLoading(true);
    toast.info("Apple Sign In will be implemented with backend");
    setTimeout(() => {
      setLoading(false);
      navigate("/onboarding");
    }, 1000);
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 1) return cleaned;
    if (cleaned.length <= 4) return `+1 (${cleaned.slice(1)}`;
    if (cleaned.length <= 7) return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4)}`;
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const getCleanPhone = (formatted: string) => {
    return "+1" + formatted.replace(/\D/g, "").slice(1);
  };

  const handleSendCode = async () => {
    const cleanPhone = getCleanPhone(phone);
    if (cleanPhone.length < 12) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      phone: cleanPhone,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Code sent!");
    setStep("otp");
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      phone: getCleanPhone(phone),
      token: otp,
      type: "sms",
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      // Check if profile exists and is complete
      const { data: profile } = await supabase
        .from("profiles")
        .select("name, school")
        .eq("id", data.session.user.id)
        .single();

      if (!profile || !profile.name || !profile.school) {
        navigate("/onboarding");
      } else {
        navigate("/feed");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-elevated animate-scale-in">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            {step === "method" ? "Welcome Back" : step === "phone" ? "Enter Phone" : "Verify Code"}
          </CardTitle>
          <CardDescription>
            {step === "method" ? "Sign in to continue" : step === "phone" ? "We'll send you a code" : "Enter the 6-digit code"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === "method" && (
            <>
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
                onClick={() => setStep("phone")}
                disabled={loading}
                variant="outline"
                size="lg"
                className="w-full"
              >
                <Phone className="w-5 h-5 mr-2" />
                Continue with Phone Number
              </Button>
            </>
          )}

          {step === "phone" && (
            <>
              <Button
                onClick={() => setStep("method")}
                variant="ghost"
                size="sm"
                className="mb-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Input
                type="tel"
                placeholder="+1 (___) ___-____"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={18}
                className="text-lg"
              />
              <Button 
                onClick={handleSendCode}
                disabled={loading || phone.length < 18}
                size="lg"
                className="w-full"
              >
                Send Code
              </Button>
            </>
          )}

          {step === "otp" && (
            <>
              <Button
                onClick={() => setStep("phone")}
                variant="ghost"
                size="sm"
                className="mb-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button 
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                size="lg"
                className="w-full"
              >
                Verify
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
