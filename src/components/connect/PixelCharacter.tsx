import { cn } from "@/lib/utils";
import charactersSprite from "@/assets/characters-sprite.png";

interface PixelCharacterProps {
  variant: "user1" | "user2";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const PixelCharacter = ({ variant, className, size = "md" }: PixelCharacterProps) => {
  const sizeMap = {
    sm: { width: 40, height: 56 },
    md: { width: 60, height: 84 },
    lg: { width: 80, height: 112 },
  };

  const dimensions = sizeMap[size];
  
  // The sprite shows two characters side by side
  // user1 (dark hair) is on the left, user2 (blue hair) is on the right
  // We'll crop and position to show the correct character
  const characterPosition = variant === "user1" 
    ? { objectPosition: "32% 72%" } // Left character
    : { objectPosition: "68% 72%" }; // Right character

  return (
    <div
      className={cn("flex items-end justify-center overflow-hidden", className)}
      style={{ 
        width: dimensions.width, 
        height: dimensions.height,
        imageRendering: "pixelated" 
      }}
    >
      <img
        src={charactersSprite}
        alt={variant === "user1" ? "User character" : "Maya character"}
        className="object-cover scale-[2.5]"
        style={{
          ...characterPosition,
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
};
