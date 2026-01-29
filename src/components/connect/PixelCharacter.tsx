import { cn } from "@/lib/utils";

interface PixelCharacterProps {
  variant: "user1" | "user2";
  className?: string;
  size?: "sm" | "md" | "lg";
}

// Pixel art character using CSS grid - each number represents a color
// 0 = transparent, 1 = skin, 2 = hair, 3 = eyes, 4 = shirt, 5 = mouth
const pixelMaps = {
  user1: [
    // Black hair character
    [0, 0, 2, 2, 2, 2, 0, 0],
    [0, 2, 2, 2, 2, 2, 2, 0],
    [0, 2, 1, 1, 1, 1, 2, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 3, 1, 1, 3, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 5, 5, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 0, 4, 4, 4, 4, 0, 0],
    [0, 4, 4, 4, 4, 4, 4, 0],
  ],
  user2: [
    // Purple/blue hair character (Maya)
    [0, 0, 6, 6, 6, 6, 0, 0],
    [0, 6, 6, 6, 6, 6, 6, 0],
    [0, 6, 1, 1, 1, 1, 6, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 3, 1, 1, 3, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 5, 5, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 0, 7, 7, 7, 7, 0, 0],
    [0, 7, 7, 7, 7, 7, 7, 0],
  ],
};

const colorPalette: Record<number, string> = {
  0: "transparent",
  1: "#FFD5B8", // skin
  2: "#2D1B14", // black hair
  3: "#1A1A2E", // eyes
  4: "#E85D75", // coral shirt
  5: "#C44569", // mouth
  6: "#7B68EE", // purple hair
  7: "#9B7ED9", // purple shirt
};

export const PixelCharacter = ({ variant, className, size = "md" }: PixelCharacterProps) => {
  const sizeMap = {
    sm: 3,
    md: 5,
    lg: 7,
  };

  const pixelSize = sizeMap[size];
  const pixels = pixelMaps[variant];

  return (
    <div
      className={cn("flex items-end justify-center", className)}
      style={{ imageRendering: "pixelated" }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(8, ${pixelSize}px)`,
          gridTemplateRows: `repeat(10, ${pixelSize}px)`,
        }}
      >
        {pixels.flat().map((colorIndex, i) => (
          <div
            key={i}
            style={{
              width: pixelSize,
              height: pixelSize,
              backgroundColor: colorPalette[colorIndex],
            }}
          />
        ))}
      </div>
    </div>
  );
};
