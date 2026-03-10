import { cn } from "@/lib/utils";

interface PixelCharacterProps {
  variant: "user1" | "user2";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const PixelCharacter = ({ variant, className, size = "md" }: PixelCharacterProps) => {
  const sizeMap = {
    sm: { width: 60, height: 84 },
    md: { width: 80, height: 112 },
    lg: { width: 120, height: 168 },
  };

  const dimensions = sizeMap[size];
  const characterImage = variant === "user1" ? "/lovable-uploads/ff707779-68bb-46dc-a64d-3309f8feeac8.png" : "/lovable-uploads/2bad665d-89ac-44fa-9ffe-81659dba267f.png";

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
