import { cn } from "@/lib/utils";
import { PixelCharacter } from "./PixelCharacter";

export type ScreenState =
"idle" |
"searching" |
"connection_found" |
"question_select" |
"question_received" |
"waiting_response" |
"discuss" |
"add_connection" |
"connection_added" |
"profile";

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
  // Question selection
  questionChoices?: string[];
  cursorIndex?: number;
  selectedQuestionIndex?: number | null;
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
  questionChoices,
  cursorIndex = 0,
  selectedQuestionIndex
}: DeviceScreenProps) => {
  const currentDate = new Date();
  const dateStr = currentDate.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
  const timeStr = currentDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

  const renderContent = () => {
    switch (state) {
      case "idle":
        return (
          <div className="flex flex-col items-center justify-center h-full gap-2 px-4">
            <PixelCharacter variant={userVariant} size="lg" />
            <p className="text-xs text-center font-pixel text-foreground/70 mt-2 my-[10px]">
              Searching for connections...
            </p>
          </div>);


      case "searching":
        return (
          <div className="flex flex-col items-center justify-center h-full gap-2 px-4">
            <PixelCharacter variant={userVariant} size="lg" />
            <div className="flex gap-1 mt-2">
              <span className="w-2 h-2 bg-foreground/50 rounded-full animate-pulse" />
              <span className="w-2 h-2 bg-foreground/50 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
              <span className="w-2 h-2 bg-foreground/50 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>);


      case "connection_found":
        return (
          <div className="flex flex-col items-center justify-center h-full px-4">
            <div className="flex gap-3 mb-2">
              <PixelCharacter variant={userVariant} size="md" />
              <PixelCharacter variant={otherUserVariant} size="md" />
            </div>
            <div className="rounded-lg p-2 text-center bg-white/80">
              <p className="text-xs font-bold text-foreground mb-1">
                Connection found!
              </p>
              <p className="text-xs text-foreground/80">
                <span className="font-bold">{otherUserName}</span> is nearby
              </p>
              <p className="text-[10px] text-foreground/60 mt-1">[Press A to continue]</p>
            </div>
          </div>);


      case "question_select":
        return (
          <div className="flex flex-col h-full px-4 pt-2">
            <p className="text-xs font-bold text-foreground mb-1 text-center">
              {otherUserName}'s questions:
            </p>
            <p className="text-[10px] text-foreground/60 mb-2 text-center">Pick one to answer</p>
            <div className="flex flex-col gap-1.5 flex-1">
              {(questionChoices || []).map((q, i) =>
              <div
                key={i}
                className={cn(
                  "px-2 py-1.5 text-[10px] rounded border-2 transition-all leading-tight",
                  selectedQuestionIndex === i ?
                  "bg-emerald-500/20 border-emerald-500 text-foreground font-bold" :
                  cursorIndex === i ?
                  "border-foreground/60 bg-foreground/10 text-foreground" :
                  "border-transparent bg-foreground/5 text-foreground/70"
                )}>
                
                  {cursorIndex === i && selectedQuestionIndex === null && "▶ "}{q}
                </div>
              )}
            </div>
            <p className="text-[10px] text-foreground/50 text-center pb-1">↑↓ navigate · A select</p>
          </div>);


      case "question_received":
        return (
          <div className="flex flex-col items-center justify-center h-full px-4">
            <div className="flex gap-3 mb-2">
              <PixelCharacter variant={userVariant} size="sm" />
              <PixelCharacter variant={otherUserVariant} size="sm" />
            </div>
            <div className="rounded-lg p-2 text-center bg-white/80">
              <p className="text-xs font-bold text-foreground mb-1">
                {otherUserName} asks:
              </p>
              <p className="text-[10px] text-foreground/90 italic leading-tight">"{question}"</p>
            </div>
            <div className="flex flex-col gap-1.5 mt-2 w-full">
              <div className={cn(
                "px-2 py-1.5 text-[10px] rounded border-2 transition-all",
                selectedOption === "A" ?
                "bg-emerald-500/20 border-emerald-500 font-bold" :
                cursorIndex === 0 ?
                "border-foreground/60 bg-foreground/10" :
                "border-transparent bg-foreground/5"
              )}>
                {cursorIndex === 0 && !selectedOption && "▶ "}A: {optionA}
              </div>
              <div className={cn(
                "px-2 py-1.5 text-[10px] rounded border-2 transition-all",
                selectedOption === "B" ?
                "bg-emerald-500/20 border-emerald-500 font-bold" :
                cursorIndex === 1 ?
                "border-foreground/60 bg-foreground/10" :
                "border-transparent bg-foreground/5"
              )}>
                {cursorIndex === 1 && !selectedOption && "▶ "}B: {optionB}
              </div>
            </div>
          </div>);


      case "waiting_response":
        return (
          <div className="flex flex-col items-center justify-center h-full px-4">
            <PixelCharacter variant={otherUserVariant} size="lg" />
            <p className="text-xs text-center font-pixel text-foreground/70 mt-3">
              Waiting for {otherUserName}...
            </p>
            <div className="flex gap-1 mt-2">
              <span className="w-2 h-2 bg-foreground/50 rounded-full animate-pulse" />
              <span className="w-2 h-2 bg-foreground/50 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
              <span className="w-2 h-2 bg-foreground/50 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>);


      case "discuss":
        return (
          <div className="flex flex-col items-center justify-center h-full px-4">
            <div className="flex gap-3 mb-3">
              <PixelCharacter variant={userVariant} size="md" />
              <PixelCharacter variant={otherUserVariant} size="md" />
            </div>
            <div className="rounded-lg p-2 text-center bg-white/80">
              <p className="text-xs font-bold text-foreground mb-1">
                💬 Discuss your answers!
              </p>
              <p className="text-[10px] text-foreground/60">
                [Press A when ready]
              </p>
            </div>
          </div>);


      case "add_connection":
        return (
          <div className="flex flex-col items-center justify-center h-full px-4">
            <div className="rounded-lg p-2 text-center bg-white/80">
              <p className="text-xs text-foreground">
                Add <span className="font-bold">{otherUserName}</span> to connections?
              </p>
            </div>
            <div className="flex flex-col gap-1.5 mt-3 w-full">
              <div className={cn(
                "px-2 py-1.5 text-[10px] rounded border-2 transition-all",
                selectedOption === "A" ?
                "bg-emerald-500/20 border-emerald-500 font-bold" :
                cursorIndex === 0 ?
                "border-foreground/60 bg-foreground/10" :
                "border-transparent bg-foreground/5"
              )}>
                {cursorIndex === 0 && !selectedOption && "▶ "}A: Yes
              </div>
              <div className={cn(
                "px-2 py-1.5 text-[10px] rounded border-2 transition-all",
                selectedOption === "B" ?
                "bg-emerald-500/20 border-emerald-500 font-bold" :
                cursorIndex === 1 ?
                "border-foreground/60 bg-foreground/10" :
                "border-transparent bg-foreground/5"
              )}>
                {cursorIndex === 1 && !selectedOption && "▶ "}B: No
              </div>
            </div>
          </div>);


      case "connection_added":
        return (
          <div className="flex flex-col items-center justify-center h-full px-4">
            <div className="flex gap-3 mb-3">
              <PixelCharacter variant={userVariant} size="md" />
              <PixelCharacter variant={otherUserVariant} size="md" />
            </div>
            <div className="rounded-lg p-2 text-center bg-white/80">
              <p className="text-xs font-bold text-foreground mb-1">
                {otherUserName} added!
              </p>
              <p className="text-xs text-foreground/70">
                You earned 1 gem 💎
              </p>
            </div>
          </div>);


      case "profile":
        return (
          <div className="flex flex-col h-full p-4">
            <div className="flex items-start gap-3">
              <PixelCharacter variant={otherUserVariant} size="md" />
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">{otherUserName}</p>
                <p className="text-xs text-foreground/60">connected {dateStr}</p>
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
            <div className="mt-auto px-3 py-1.5 border border-foreground/20 rounded text-xs text-center text-foreground/60">
              Press A to follow up!
            </div>
          </div>);


      default:
        return null;
    }
  };

  return (
    <div className="relative w-full aspect-square rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-green-400">
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-green-500 to-green-400" />
      </div>

      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-2 py-1 bg-black/20 text-white text-[10px]">
        <span>{dateStr}</span>
        <div className="flex items-center gap-1">
          <div className="w-4 h-2 border border-white rounded-sm">
            <div className="w-3/4 h-full bg-green-400" />
          </div>
          <span>{timeStr}</span>
        </div>
      </div>

      <div className="relative h-full pt-6">{renderContent()}</div>
    </div>);

};