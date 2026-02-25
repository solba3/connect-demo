import { cn } from "@/lib/utils";
import { PixelCharacter } from "./PixelCharacter";

export type ScreenState =
  | "idle"
  | "searching"
  | "connection_found"
  | "question_received"
  | "waiting_response"
  | "discuss"
  | "add_connection"
  | "connection_added"
  | "profile";

interface DeviceScreenProps {
  state: ScreenState;
  userName: string;
  otherUserName: string;
  userVariant: "user1" | "user2";
  otherUserVariant: "user1" | "user2";
  question?: string;
  optionA?: string;
  optionB?: string;
  selectedOption?: "A" | "B" | null;
  onSelectA?: () => void;
  onSelectB?: () => void;
}

export const DeviceScreen = ({
  state,
  userName,
  otherUserName,
  userVariant,
  otherUserVariant,
  question,
  optionA,
  optionB,
  selectedOption,
  onSelectA,
  onSelectB,
}: DeviceScreenProps) => {
  const currentDate = new Date();
  const dateStr = currentDate.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  const timeStr = currentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const renderContent = () => {
    switch (state) {
      case "idle":
        return (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <PixelCharacter variant={userVariant} size="lg" />
            <p className="text-xs text-center font-pixel text-foreground/70 mt-2">
              Searching for connections...
            </p>
          </div>
        );

      case "searching":
        return (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <PixelCharacter variant={userVariant} size="lg" />
            <div className="flex gap-1 mt-2">
              <span className="w-2 h-2 bg-foreground/50 rounded-full animate-pulse" />
              <span className="w-2 h-2 bg-foreground/50 rounded-full animate-pulse delay-100" />
              <span className="w-2 h-2 bg-foreground/50 rounded-full animate-pulse delay-200" />
            </div>
          </div>
        );

      case "connection_found":
        return (
          <div className="flex flex-col items-center justify-center h-full px-3">
            <div className="bg-white/90 rounded-lg p-3 text-center shadow-sm">
              <p className="text-xs font-bold text-foreground mb-1">
                New connection in your area!
              </p>
              <p className="text-xs text-foreground/80">
                <span className="font-bold">{otherUserName}</span> wants to know:
              </p>
              <p className="text-xs text-foreground/90 mt-1 italic">
                "{question}"
              </p>
            </div>
            <div className="flex flex-col gap-2 mt-3 w-full max-w-[140px]">
              <div
                className={cn(
                  "px-3 py-2 text-xs rounded border-2 transition-all",
                  selectedOption === "A"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white/80 border-gray-300"
                )}
              >
                A: {optionA}
              </div>
              <div
                className={cn(
                  "px-3 py-2 text-xs rounded border-2 transition-all",
                  selectedOption === "B"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white/80 border-gray-300"
                )}
              >
                B: {optionB}
              </div>
            </div>
          </div>
        );

      case "question_received":
        return (
          <div className="flex flex-col items-center justify-center h-full px-3">
            <div className="flex gap-4 mb-2">
              <PixelCharacter variant={userVariant} size="md" />
              <PixelCharacter variant={otherUserVariant} size="md" />
            </div>
            <div className="bg-white/90 rounded-lg p-3 text-center shadow-sm">
              <p className="text-xs font-bold text-foreground mb-1">
                {otherUserName} asks:
              </p>
              <p className="text-xs text-foreground/90 italic">"{question}"</p>
            </div>
            <div className="flex gap-3 mt-3">
              <div
                className={cn(
                  "px-4 py-2 text-xs rounded border-2 transition-all",
                  selectedOption === "A"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white/80 border-gray-300"
                )}
              >
                A: {optionA}
              </div>
              <div
                className={cn(
                  "px-4 py-2 text-xs rounded border-2 transition-all",
                  selectedOption === "B"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white/80 border-gray-300"
                )}
              >
                B: {optionB}
              </div>
            </div>
          </div>
        );

      case "waiting_response":
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <PixelCharacter variant={otherUserVariant} size="lg" />
            <p className="text-xs text-center font-pixel text-foreground/70 mt-3">
              Waiting for {otherUserName}'s response...
            </p>
            <div className="flex gap-1 mt-2">
              <span className="w-2 h-2 bg-foreground/50 rounded-full animate-pulse" />
              <span className="w-2 h-2 bg-foreground/50 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
              <span className="w-2 h-2 bg-foreground/50 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        );

      case "discuss":
        return (
          <div className="flex flex-col items-center justify-center h-full px-3">
            <div className="flex gap-4 mb-3">
              <PixelCharacter variant={userVariant} size="md" />
              <PixelCharacter variant={otherUserVariant} size="md" />
            </div>
            <div className="bg-white/90 rounded-lg p-3 text-center shadow-sm">
              <p className="text-xs font-bold text-foreground mb-1">
                Discuss your answers!
              </p>
              <p className="text-xs text-foreground/70">
                [Press A to continue]
              </p>
            </div>
            <div className="mt-2 px-3 py-1 bg-accent/80 rounded text-xs font-bold">
              💬 REFLECTIONS
            </div>
          </div>
        );

      case "add_connection":
        return (
          <div className="flex flex-col items-center justify-center h-full px-3">
            <div className="bg-white/90 rounded-lg p-3 text-center shadow-sm">
              <p className="text-xs text-foreground">
                Would you like to add <span className="font-bold">{otherUserName}</span> to your connection list?
              </p>
            </div>
            <div className="flex gap-3 mt-3">
              <div
                className={cn(
                  "px-4 py-2 text-xs rounded border-2 transition-all",
                  selectedOption === "A"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white/80 border-gray-300"
                )}
              >
                A: Yes
              </div>
              <div
                className={cn(
                  "px-4 py-2 text-xs rounded border-2 transition-all",
                  selectedOption === "B"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white/80 border-gray-300"
                )}
              >
                B: No
              </div>
            </div>
          </div>
        );

      case "connection_added":
        return (
          <div className="flex flex-col items-center justify-center h-full px-3">
            <div className="flex gap-4 mb-3">
              <PixelCharacter variant={userVariant} size="md" />
              <PixelCharacter variant={otherUserVariant} size="md" />
            </div>
            <div className="bg-white/90 rounded-lg p-3 text-center shadow-sm">
              <p className="text-xs font-bold text-foreground mb-1">
                {otherUserName} has been added!
              </p>
              <p className="text-xs text-foreground/70">
                You earned 1 connection gem. 💎
              </p>
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="flex flex-col h-full p-3">
            <div className="flex items-start gap-3">
              <PixelCharacter variant={otherUserVariant} size="md" />
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">{otherUserName}</p>
                <p className="text-xs text-foreground/60">connected {dateStr}</p>
                <div className="w-12 h-1.5 bg-primary/50 rounded-full mt-1" />
              </div>
            </div>
            <div className="mt-3 text-xs text-foreground/80">
              <p className="font-bold mb-1">I'm open to...</p>
              <ol className="list-decimal list-inside space-y-0.5 text-foreground/70">
                <li>Get lunch</li>
                <li>Visit the zoo</li>
                <li>Go to the art fair</li>
              </ol>
            </div>
            <div className="mt-auto px-3 py-1.5 bg-white/80 border border-gray-300 rounded text-xs text-center">
              Press A to follow up!
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative w-full aspect-square rounded-lg overflow-hidden">
      {/* Sky and grass background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-green-400">
        {/* Pixel grass effect */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-green-500 to-green-400" />
      </div>

      {/* Header bar */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-2 py-1 bg-black/20 text-white text-[10px]">
        <span>{dateStr}</span>
        <div className="flex items-center gap-1">
          <div className="w-4 h-2 border border-white rounded-sm">
            <div className="w-3/4 h-full bg-green-400" />
          </div>
          <span>{timeStr}</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative h-full pt-6">{renderContent()}</div>
    </div>
  );
};
