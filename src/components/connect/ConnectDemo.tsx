import { useState, useEffect } from "react";
import { ConnectDevice } from "./ConnectDevice";
import { ScreenState } from "./DeviceScreen";
import { Button } from "@/components/ui/button";
import { RotateCcw, Play, SkipForward } from "lucide-react";

// Sample questions for the demo
const SAMPLE_QUESTIONS = [
  {
    question: "What feels more true to you?",
    optionA: "I live for spontaneous adventures",
    optionB: "I prefer a well-planned day",
  },
  {
    question: "When meeting someone new, do you prefer...",
    optionA: "Deep conversations right away",
    optionB: "Starting with small talk",
  },
  {
    question: "What energizes you more?",
    optionA: "Being around people",
    optionB: "Quiet alone time",
  },
];

type DemoStep =
  | "start"
  | "searching"
  | "found"
  | "user1_answer"
  | "user1_waiting"
  | "user2_answer"
  | "user2_waiting"
  | "discuss"
  | "add_connection"
  | "complete";

export const ConnectDemo = () => {
  const [demoStep, setDemoStep] = useState<DemoStep>("start");
  const [user1Selection, setUser1Selection] = useState<"A" | "B" | null>(null);
  const [user2Selection, setUser2Selection] = useState<"A" | "B" | null>(null);
  const [currentQuestionIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const currentQuestion = SAMPLE_QUESTIONS[currentQuestionIndex];

  // Get screen states for both devices based on demo step
  const getDeviceStates = (): { device1: ScreenState; device2: ScreenState } => {
    switch (demoStep) {
      case "start":
        return { device1: "idle", device2: "idle" };
      case "searching":
        return { device1: "searching", device2: "searching" };
      case "found":
        return { device1: "connection_found", device2: "connection_found" };
      case "user1_answer":
        return { device1: "question_received", device2: "waiting_response" };
      case "user1_waiting":
        return { device1: "waiting_response", device2: "question_received" };
      case "user2_answer":
        return { device1: "waiting_response", device2: "question_received" };
      case "user2_waiting":
        return { device1: "discuss", device2: "waiting_response" };
      case "discuss":
        return { device1: "discuss", device2: "discuss" };
      case "add_connection":
        return { device1: "add_connection", device2: "add_connection" };
      case "complete":
        return { device1: "connection_added", device2: "connection_added" };
      default:
        return { device1: "idle", device2: "idle" };
    }
  };

  const { device1: device1State, device2: device2State } = getDeviceStates();

  // Auto-advance demo
  useEffect(() => {
    if (!autoPlay) return;

    const timers: { [key in DemoStep]?: number } = {
      start: 1000,
      searching: 2000,
      found: 2500,
    };

    const delay = timers[demoStep];
    if (delay) {
      const timer = setTimeout(() => {
        advanceDemo();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [demoStep, autoPlay]);

  const advanceDemo = () => {
    const steps: DemoStep[] = [
      "start",
      "searching",
      "found",
      "user1_answer",
      "user1_waiting",
      "user2_answer",
      "discuss",
      "add_connection",
      "complete",
    ];

    const currentIndex = steps.indexOf(demoStep);
    if (currentIndex < steps.length - 1) {
      setDemoStep(steps[currentIndex + 1]);
    }
  };

  const handleUser1SelectA = () => {
    setUser1Selection("A");
    if (demoStep === "found" || demoStep === "user1_answer") {
      setTimeout(() => setDemoStep("user1_waiting"), 500);
    } else if (demoStep === "add_connection") {
      setTimeout(() => setDemoStep("complete"), 500);
    }
  };

  const handleUser1SelectB = () => {
    setUser1Selection("B");
    if (demoStep === "found" || demoStep === "user1_answer") {
      setTimeout(() => setDemoStep("user1_waiting"), 500);
    }
  };

  const handleUser2SelectA = () => {
    setUser2Selection("A");
    if (demoStep === "user1_waiting" || demoStep === "user2_answer") {
      setTimeout(() => setDemoStep("discuss"), 500);
    } else if (demoStep === "add_connection") {
      setTimeout(() => setDemoStep("complete"), 500);
    }
  };

  const handleUser2SelectB = () => {
    setUser2Selection("B");
    if (demoStep === "user1_waiting" || demoStep === "user2_answer") {
      setTimeout(() => setDemoStep("discuss"), 500);
    }
  };

  const handleDevice1PressA = () => {
    if (demoStep === "found" || demoStep === "user1_answer") {
      handleUser1SelectA();
    } else if (demoStep === "discuss") {
      setDemoStep("add_connection");
    } else if (demoStep === "add_connection") {
      handleUser1SelectA();
    }
  };

  const handleDevice1PressB = () => {
    if (demoStep === "found" || demoStep === "user1_answer") {
      handleUser1SelectB();
    } else if (demoStep === "add_connection") {
      handleUser1SelectB();
    }
  };

  const handleDevice2PressA = () => {
    if (demoStep === "user1_waiting" || demoStep === "user2_answer") {
      handleUser2SelectA();
    } else if (demoStep === "discuss") {
      setDemoStep("add_connection");
    } else if (demoStep === "add_connection") {
      handleUser2SelectA();
    }
  };

  const handleDevice2PressB = () => {
    if (demoStep === "user1_waiting" || demoStep === "user2_answer") {
      handleUser2SelectB();
    } else if (demoStep === "add_connection") {
      handleUser2SelectB();
    }
  };

  const resetDemo = () => {
    setDemoStep("start");
    setUser1Selection(null);
    setUser2Selection(null);
    setAutoPlay(false);
  };

  const startDemo = () => {
    setAutoPlay(true);
    if (demoStep === "start") {
      setDemoStep("searching");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          CONNECT Device Demo
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
          Two devices interacting to help users break the ice with meaningful
          conversation prompts.
        </p>
      </div>

      {/* Demo Controls */}
      <div className="flex justify-center gap-3 mb-8">
        <Button onClick={startDemo} disabled={autoPlay || demoStep === "complete"} className="gap-2">
          <Play className="w-4 h-4" />
          Start Demo
        </Button>
        <Button onClick={advanceDemo} variant="outline" className="gap-2">
          <SkipForward className="w-4 h-4" />
          Next Step
        </Button>
        <Button onClick={resetDemo} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>

      {/* Step indicator */}
      <div className="text-center mb-6">
        <span className="inline-block px-4 py-2 bg-white/80 rounded-full text-sm font-medium shadow-sm">
          {demoStep === "start" && "Ready to connect..."}
          {demoStep === "searching" && "🔍 Searching for nearby users..."}
          {demoStep === "found" && "✨ Connection found! Answer the question."}
          {demoStep === "user1_answer" && "You (coral) answer Maya's question"}
          {demoStep === "user1_waiting" && "Maya is answering your question..."}
          {demoStep === "user2_answer" && "Maya answers your question"}
          {demoStep === "user2_waiting" && "Processing responses..."}
          {demoStep === "discuss" && "💬 Time to discuss! Press A to continue."}
          {demoStep === "add_connection" && "Add to connections?"}
          {demoStep === "complete" && "🎉 Connected! You earned a gem."}
        </span>
      </div>

      {/* Devices */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
        {/* Device 1 - User (Coral) */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-sm font-medium text-foreground/70">You</span>
          <ConnectDevice
            color="coral"
            screenState={device1State}
            userName="You"
            otherUserName="Maya"
            userVariant="user1"
            otherUserVariant="user2"
            question={currentQuestion.question}
            optionA={currentQuestion.optionA}
            optionB={currentQuestion.optionB}
            selectedOption={user1Selection}
            onSelectA={handleUser1SelectA}
            onSelectB={handleUser1SelectB}
            onPressA={handleDevice1PressA}
            onPressB={handleDevice1PressB}
          />
        </div>

        {/* Connection indicator */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={`w-16 h-1 rounded-full transition-all duration-500 ${
              demoStep === "start" || demoStep === "searching"
                ? "bg-gray-300"
                : demoStep === "complete"
                ? "bg-green-500"
                : "bg-primary animate-pulse"
            }`}
          />
          <span className="text-xs text-muted-foreground">
            {demoStep === "complete" ? "Connected!" : "Signal"}
          </span>
        </div>

        {/* Device 2 - Maya (Purple) */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-sm font-medium text-foreground/70">Maya</span>
          <ConnectDevice
            color="purple"
            screenState={device2State}
            userName="Maya"
            otherUserName="You"
            userVariant="user2"
            otherUserVariant="user1"
            question={currentQuestion.question}
            optionA={currentQuestion.optionA}
            optionB={currentQuestion.optionB}
            selectedOption={user2Selection}
            onSelectA={handleUser2SelectA}
            onSelectB={handleUser2SelectB}
            onPressA={handleDevice2PressA}
            onPressB={handleDevice2PressB}
          />
        </div>
      </div>

      {/* Info panel */}
      <div className="mt-8 max-w-2xl mx-auto">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-foreground mb-2">How CONNECT Works</h3>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Choose 3 questions that resonate with you from the list</li>
            <li>When nearby, devices automatically find each other</li>
            <li>The other user receives your questions and answers one (A/B format)</li>
            <li>You also answer one of their questions</li>
            <li>Use the prompts to start a real conversation!</li>
            <li>Optionally add them to your connections list</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
