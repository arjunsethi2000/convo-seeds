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

  const formatToE164 = (value: string): string => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, "");
    
    // Handle different formats
    if (cleaned.length === 10) {
      // 10 digits: assume US number, add +1
      return `+1${cleaned}`;
    } else if (cleaned.length === 11 && cleaned.startsWith("1")) {
      // 11 digits starting with 1: already has country code
      return `+${cleaned}`;
    } else if (cleaned.startsWith("1") && cleaned.length > 11) {
      // More than 11 digits starting with 1: take first 11
      return `+${cleaned.slice(0, 11)}`;
    } else if (cleaned.length > 10) {
      // More than 10 digits not starting with 1: take last 10 and add +1
      return `+1${cleaned.slice(-10)}`;
    }
    
    // Invalid or incomplete
    return "";
  };

  const isValidPhoneNumber = (value: string): boolean => {
    const cleaned = value.replace(/\D/g, "");
    return cleaned.length === 10 || (cleaned.length === 11 && cleaned.startsWith("1"));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handleSendCode = async () => {
    const e164Phone = formatToE164(phone);
    if (!e164Phone) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      phone: e164Phone,
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
      phone: formatToE164(phone),
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
                placeholder="4155552671 or (415) 555-2671"
                value={phone}
                onChange={handlePhoneChange}
                className="text-lg"
              />
              <Button 
                onClick={handleSendCode}
                disabled={loading || !isValidPhoneNumber(phone)}
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
