import { cn } from "@/lib/utils";

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
  const characterImage = variant === "user1" ? characterUser1 : characterUser2;

  return (
    <div
      className={cn("flex items-center justify-center overflow-hidden", className)}
      style={{ 
        width: dimensions.width, 
        height: dimensions.height,
        imageRendering: "pixelated" 
      }}
    >
      <img
        src={characterImage}
        alt={variant === "user1" ? "User character" : "Maya character"}
        className="w-full h-full object-contain"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
};
