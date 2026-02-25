import { cn } from "@/lib/utils";
import { DeviceScreen, ScreenState } from "./DeviceScreen";
import { DeviceControls } from "./DeviceControls";

interface ConnectDeviceProps {
  color: "coral" | "purple" | "yellow";
  screenState: ScreenState;
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
  onPressA?: () => void;
  onPressB?: () => void;
  onUp?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  onMenu?: () => void;
  questionChoices?: string[];
  cursorIndex?: number;
  selectedQuestionIndex?: number | null;
  className?: string;
}

const colorVariants = {
  coral: "from-orange-300 to-orange-400",
  purple: "from-purple-400 to-purple-500",
  yellow: "from-yellow-300 to-yellow-400",
};

// LED colors based on connection state
const getLedColor = (state: ScreenState) => {
  switch (state) {
    case "connection_found":
      return { bg: "bg-cyan-400", shadow: "shadow-[0_0_8px_2px_rgba(34,211,238,0.6)]" };
    case "searching":
    case "question_received":
    case "question_select":
    case "waiting_response":
    case "discuss":
    case "add_connection":
      return { bg: "bg-yellow-400", shadow: "shadow-[0_0_8px_2px_rgba(250,204,21,0.6)]" };
    case "connection_added":
    case "profile":
      return { bg: "bg-green-400", shadow: "shadow-[0_0_8px_2px_rgba(74,222,128,0.6)]" };
    default:
      return { bg: "bg-gray-400", shadow: "" };
  }
};

export const ConnectDevice = ({
  color,
  screenState,
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
  onPressA,
  onPressB,
  onUp,
  onDown,
  onLeft,
  onRight,
  onMenu,
  questionChoices,
  cursorIndex,
  selectedQuestionIndex,
  className,
}: ConnectDeviceProps) => {
  const ledColor = getLedColor(screenState);

  return (
    <div
      className={cn(
        "relative w-full max-w-[280px] rounded-3xl p-4 shadow-2xl bg-gradient-to-b",
        colorVariants[color],
        className
      )}
      style={{
        boxShadow: "inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.1), 0 10px 30px rgba(0,0,0,0.3)",
      }}
    >
      <div className={cn("absolute top-4 right-4 w-3 h-3 rounded-full transition-all duration-300", ledColor.bg, ledColor.shadow)} />
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-2 bg-black/20 rounded-full" />

      <div className="mt-4 p-2 bg-gray-800 rounded-xl shadow-inner">
        <DeviceScreen
          state={screenState}
          userName={userName}
          otherUserName={otherUserName}
          userVariant={userVariant}
          otherUserVariant={otherUserVariant}
          question={question}
          optionA={optionA}
          optionB={optionB}
          selectedOption={selectedOption}
          onSelectA={onSelectA}
          onSelectB={onSelectB}
          questionChoices={questionChoices}
          cursorIndex={cursorIndex}
          selectedQuestionIndex={selectedQuestionIndex}
        />
      </div>

      <div className="mt-4">
        <DeviceControls
          onA={onPressA}
          onB={onPressB}
          onUp={onUp}
          onDown={onDown}
          onLeft={onLeft}
          onRight={onRight}
          onMenu={onMenu}
        />
      </div>

      <div className="flex justify-center gap-3 mt-2">
        <div className="w-2 h-2 rounded-full bg-black/10" />
        <div className="w-2 h-2 rounded-full bg-black/10" />
        <div className="w-2 h-2 rounded-full bg-black/10" />
      </div>
    </div>
  );
};
