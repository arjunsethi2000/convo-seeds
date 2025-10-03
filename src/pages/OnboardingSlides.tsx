import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Eye } from "lucide-react";

const slides = [
  {
    icon: Calendar,
    title: "Profiles update daily.",
    subtitle: "Your profile is built from your answers to daily prompts.",
  },
  {
    icon: Eye,
    title: "Your first answer unlocks the app.",
    subtitle: "If you're inactive for 7+ days, you'll be hidden from the feed.",
  },
];

const OnboardingSlides = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate("/first-prompt");
    }
  };

  const CurrentIcon = slides[currentSlide].icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-elevated animate-fade-in">
        <CardContent className="pt-12 pb-8 px-8">
          <div className="text-center space-y-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center">
              <CurrentIcon className="w-10 h-10 text-white" />
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold">
                {slides[currentSlide].title}
              </h2>
              <p className="text-lg text-muted-foreground">
                {slides[currentSlide].subtitle}
              </p>
            </div>

            <div className="flex justify-center gap-2 py-4">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? "w-8 bg-primary"
                      : "w-2 bg-muted"
                  }`}
                />
              ))}
            </div>

            <Button 
              onClick={handleNext}
              size="lg"
              className="w-full"
            >
              {currentSlide < slides.length - 1 ? "Next" : "Start Now"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingSlides;
