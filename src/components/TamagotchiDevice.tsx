import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart, Utensils, Sparkles, Moon, Droplets } from "lucide-react";
import { toast } from "sonner";

type PetMood = "happy" | "neutral" | "sad" | "sleeping";

interface PetStats {
  hunger: number;
  happiness: number;
  health: number;
  cleanliness: number;
  age: number;
}

export const TamagotchiDevice = () => {
  const [stats, setStats] = useState<PetStats>({
    hunger: 80,
    happiness: 75,
    health: 90,
    cleanliness: 85,
    age: 0,
  });
  const [mood, setMood] = useState<PetMood>("happy");
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-decrease stats over time
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        hunger: Math.max(0, prev.hunger - 1),
        happiness: Math.max(0, prev.happiness - 0.5),
        health: Math.max(0, prev.health - 0.3),
        cleanliness: Math.max(0, prev.cleanliness - 0.7),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Age increment
  useEffect(() => {
    const ageInterval = setInterval(() => {
      setStats((prev) => ({ ...prev, age: prev.age + 1 }));
    }, 30000);

    return () => clearInterval(ageInterval);
  }, []);

  // Update mood based on stats
  useEffect(() => {
    const avgStats = (stats.hunger + stats.happiness + stats.health + stats.cleanliness) / 4;
    
    if (avgStats > 70) setMood("happy");
    else if (avgStats > 40) setMood("neutral");
    else setMood("sad");
  }, [stats]);

  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const feed = () => {
    triggerAnimation();
    setStats((prev) => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + 25),
      health: Math.min(100, prev.health + 5),
    }));
    toast.success("Fed your pet!", { description: "Yum yum!" });
  };

  const play = () => {
    triggerAnimation();
    setStats((prev) => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 30),
      hunger: Math.max(0, prev.hunger - 10),
    }));
    toast.success("Playing with pet!", { description: "So much fun!" });
  };

  const clean = () => {
    triggerAnimation();
    setStats((prev) => ({
      ...prev,
      cleanliness: Math.min(100, prev.cleanliness + 35),
      happiness: Math.min(100, prev.happiness + 10),
    }));
    toast.success("Cleaned up!", { description: "Sparkly clean!" });
  };

  const sleep = () => {
    setMood("sleeping");
    triggerAnimation();
    setTimeout(() => {
      setStats((prev) => ({
        ...prev,
        health: Math.min(100, prev.health + 20),
        happiness: Math.min(100, prev.happiness + 15),
      }));
      toast.success("Pet is well-rested!", { description: "Zzz..." });
    }, 2000);
  };

  const getStatColor = (value: number) => {
    if (value > 70) return "hsl(var(--stat-good))";
    if (value > 40) return "hsl(var(--stat-medium))";
    return "hsl(var(--stat-low))";
  };

  const getPetEmoji = () => {
    if (mood === "sleeping") return "😴";
    if (mood === "happy") return "😊";
    if (mood === "neutral") return "😐";
    return "😢";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5 p-4">
      <Card className="relative w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-b from-primary to-primary/80 p-6 shadow-2xl">
        {/* Device Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-bold uppercase tracking-wider text-primary-foreground/80">
            Tamagotchi
          </div>
          <div className="text-xs text-primary-foreground/60">Age: {stats.age}</div>
        </div>

        {/* Screen */}
        <div className="relative mb-6 overflow-hidden rounded-2xl border-4 border-primary-foreground/20 bg-gradient-to-b from-[hsl(var(--device-screen))] to-[hsl(var(--device-screen-dark))] p-6 shadow-inner">
          {/* Pet Display */}
          <div className="mb-4 flex items-center justify-center">
            <div
              className={`text-8xl transition-transform duration-300 ${
                isAnimating ? "animate-bounce-subtle" : ""
              }`}
            >
              {getPetEmoji()}
            </div>
          </div>

          {/* Stats Display */}
          <div className="space-y-3">
            <StatBar
              icon={<Utensils className="h-4 w-4" />}
              label="Hunger"
              value={stats.hunger}
              color={getStatColor(stats.hunger)}
            />
            <StatBar
              icon={<Heart className="h-4 w-4" />}
              label="Happy"
              value={stats.happiness}
              color={getStatColor(stats.happiness)}
            />
            <StatBar
              icon={<Sparkles className="h-4 w-4" />}
              label="Health"
              value={stats.health}
              color={getStatColor(stats.health)}
            />
            <StatBar
              icon={<Droplets className="h-4 w-4" />}
              label="Clean"
              value={stats.cleanliness}
              color={getStatColor(stats.cleanliness)}
            />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={feed}
            variant="secondary"
            className="flex flex-col gap-1 h-20 bg-primary-foreground/90 hover:bg-primary-foreground text-primary"
          >
            <Utensils className="h-5 w-5" />
            <span className="text-xs font-semibold">Feed</span>
          </Button>
          <Button
            onClick={play}
            variant="secondary"
            className="flex flex-col gap-1 h-20 bg-primary-foreground/90 hover:bg-primary-foreground text-primary"
          >
            <Heart className="h-5 w-5" />
            <span className="text-xs font-semibold">Play</span>
          </Button>
          <Button
            onClick={clean}
            variant="secondary"
            className="flex flex-col gap-1 h-20 bg-primary-foreground/90 hover:bg-primary-foreground text-primary"
          >
            <Sparkles className="h-5 w-5" />
            <span className="text-xs font-semibold">Clean</span>
          </Button>
          <Button
            onClick={sleep}
            variant="secondary"
            className="flex flex-col gap-1 h-20 bg-primary-foreground/90 hover:bg-primary-foreground text-primary"
          >
            <Moon className="h-5 w-5" />
            <span className="text-xs font-semibold">Sleep</span>
          </Button>
        </div>

        {/* Device Details */}
        <div className="mt-4 flex justify-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary-foreground/30"></div>
          <div className="h-2 w-2 rounded-full bg-primary-foreground/30"></div>
          <div className="h-2 w-2 rounded-full bg-primary-foreground/30"></div>
        </div>
      </Card>
    </div>
  );
};

interface StatBarProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

const StatBar = ({ icon, label, value, color }: StatBarProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="text-foreground/70">{icon}</div>
      <div className="flex-1">
        <div className="mb-1 flex justify-between text-xs font-medium text-foreground/80">
          <span>{label}</span>
          <span>{Math.round(value)}%</span>
        </div>
        <Progress
          value={value}
          className="h-2"
          style={
            {
              "--progress-background": color,
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  );
};
