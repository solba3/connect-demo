import { cn } from "@/lib/utils";

interface PixelCharacterProps {
  variant: "user1" | "user2";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const PixelCharacter = ({ variant, className, size = "md" }: PixelCharacterProps) => {
  const sizeClasses = {
    sm: "text-3xl",
    md: "text-5xl",
    lg: "text-6xl",
  };

  // Using emoji as pixel art stand-in - in production these would be actual pixel art sprites
  const characters = {
    user1: "👧", // Black hair character
    user2: "👩‍🦱", // Purple/blue hair character (Maya)
  };

  return (
    <div
      className={cn(
        "flex items-end justify-center",
        sizeClasses[size],
        className
      )}
      style={{
        imageRendering: "pixelated",
        fontFamily: "'Press Start 2P', monospace",
      }}
    >
      {characters[variant]}
    </div>
  );
};
