import { useState, useEffect } from "react";
import { ConnectDevice } from "./ConnectDevice";
import { ScreenState } from "./DeviceScreen";
import { Button } from "@/components/ui/button";
import { RotateCcw, Play, SkipForward } from "lucide-react";

// User 1's questions (sent to User 2 to pick from)
const USER1_QUESTIONS = [
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

// User 2's questions (sent to User 1 to pick from)
const USER2_QUESTIONS = [
  {
    question: "How do you recharge after a long week?",
    optionA: "Going out with friends",
    optionB: "Staying in with a good book",
  },
  {
    question: "What matters more in a friendship?",
    optionA: "Shared experiences",
    optionB: "Emotional understanding",
  },
  {
    question: "Your ideal weekend includes...",
    optionA: "Exploring somewhere new",
    optionB: "A cozy routine at home",
  },
];

type DemoStep =
  | "start"
  | "searching"
  | "found"
  | "user1_select"
  | "user2_select"
  | "user1_answer"
  | "user2_answer"
  | "both_answered"
  | "discuss"
  | "add_connection"
  | "complete";

export const ConnectDemo = () => {
  const [demoStep, setDemoStep] = useState<DemoStep>("start");
  const [user1Selection, setUser1Selection] = useState<"A" | "B" | null>(null);
  const [user2Selection, setUser2Selection] = useState<"A" | "B" | null>(null);
  const [user1Cursor, setUser1Cursor] = useState(0);
  const [user2Cursor, setUser2Cursor] = useState(0);
  const [user1SelectedQ, setUser1SelectedQ] = useState<number | null>(null);
  const [user2SelectedQ, setUser2SelectedQ] = useState<number | null>(null);
  const [user1Ready, setUser1Ready] = useState(false);
  const [user2Ready, setUser2Ready] = useState(false);
  const [user1ConnConfirm, setUser1ConnConfirm] = useState<"A" | "B" | null>(null);
  const [user2ConnConfirm, setUser2ConnConfirm] = useState<"A" | "B" | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);

  // User 1 picks from User 2's questions, User 2 picks from User 1's questions
  const user1QuestionChoices = USER2_QUESTIONS.map(q => q.question);
  const user2QuestionChoices = USER1_QUESTIONS.map(q => q.question);

  const user1ActiveQ = user1SelectedQ !== null ? USER2_QUESTIONS[user1SelectedQ] : null;
  const user2ActiveQ = user2SelectedQ !== null ? USER1_QUESTIONS[user2SelectedQ] : null;

  // Get screen states
  const getDeviceStates = (): { device1: ScreenState; device2: ScreenState } => {
    switch (demoStep) {
      case "start": return { device1: "idle", device2: "idle" };
      case "searching": return { device1: "searching", device2: "searching" };
      case "found": return { device1: "connection_found", device2: "connection_found" };
      case "user1_select": return { device1: "question_select", device2: "waiting_response" };
      case "user2_select": return {
        device1: user1SelectedQ !== null ? "waiting_response" : "question_select",
        device2: "question_select"
      };
      case "user1_answer": return { device1: "question_received", device2: "waiting_response" };
      case "user2_answer": return {
        device1: user1Selection ? "waiting_response" : "question_received",
        device2: "question_received"
      };
      case "both_answered": return { device1: "discuss", device2: "discuss" };
      case "discuss": return {
        device1: user1Ready ? "waiting_response" : "discuss",
        device2: user2Ready ? "waiting_response" : "discuss"
      };
      case "add_connection": return {
        device1: user1ConnConfirm ? "waiting_response" : "add_connection",
        device2: user2ConnConfirm ? "waiting_response" : "add_connection"
      };
      case "complete": return { device1: "connection_added", device2: "connection_added" };
      default: return { device1: "idle", device2: "idle" };
    }
  };

  const { device1: device1State, device2: device2State } = getDeviceStates();

  // Check if both ready to discuss → advance
  useEffect(() => {
    if (demoStep === "discuss" && user1Ready && user2Ready) {
      const t = setTimeout(() => {
        setDemoStep("add_connection");
        setUser1Cursor(0);
        setUser2Cursor(0);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [user1Ready, user2Ready, demoStep]);

  // Check if both confirmed connection → complete
  useEffect(() => {
    if (demoStep === "add_connection" && user1ConnConfirm && user2ConnConfirm) {
      const t = setTimeout(() => setDemoStep("complete"), 500);
      return () => clearTimeout(t);
    }
  }, [user1ConnConfirm, user2ConnConfirm, demoStep]);

  // Auto-advance for early steps
  useEffect(() => {
    if (!autoPlay) return;
    const timers: Partial<Record<DemoStep, number>> = {
      start: 1000,
      searching: 2000,
      found: 2500,
    };
    const delay = timers[demoStep];
    if (delay) {
      const timer = setTimeout(advanceDemo, delay);
      return () => clearTimeout(timer);
    }
  }, [demoStep, autoPlay]);

  const advanceDemo = () => {
    const steps: DemoStep[] = [
      "start", "searching", "found", "user1_select", "user2_select",
      "user1_answer", "user2_answer", "both_answered", "discuss",
      "add_connection", "complete",
    ];
    const idx = steps.indexOf(demoStep);
    if (idx < steps.length - 1) setDemoStep(steps[idx + 1]);
  };

  // Device 1 controls
  const handleDevice1Up = () => {
    if (demoStep === "user1_select" || (demoStep === "user2_select" && user1SelectedQ === null)) {
      setUser1Cursor(c => Math.max(0, c - 1));
    } else if (demoStep === "user1_answer" || (demoStep === "user2_answer" && !user1Selection)) {
      setUser1Cursor(c => Math.max(0, c - 1));
    } else if (demoStep === "add_connection" && !user1ConnConfirm) {
      setUser1Cursor(c => Math.max(0, c - 1));
    }
  };

  const handleDevice1Down = () => {
    if (demoStep === "user1_select" || (demoStep === "user2_select" && user1SelectedQ === null)) {
      setUser1Cursor(c => Math.min(2, c + 1));
    } else if (demoStep === "user1_answer" || (demoStep === "user2_answer" && !user1Selection)) {
      setUser1Cursor(c => Math.min(1, c + 1));
    } else if (demoStep === "add_connection" && !user1ConnConfirm) {
      setUser1Cursor(c => Math.min(1, c + 1));
    }
  };

  const handleDevice1PressA = () => {
    if (demoStep === "found") {
      setDemoStep("user1_select");
      setUser1Cursor(0);
    } else if (demoStep === "user1_select" && user1SelectedQ === null) {
      setUser1SelectedQ(user1Cursor);
      setUser1Cursor(0);
      setTimeout(() => setDemoStep("user2_select"), 500);
    } else if ((demoStep === "user1_answer" || demoStep === "user2_answer") && !user1Selection) {
      setUser1Selection(user1Cursor === 0 ? "A" : "B");
      if (user2Selection) {
        setTimeout(() => setDemoStep("both_answered"), 500);
      }
    } else if (demoStep === "both_answered" || demoStep === "discuss") {
      setUser1Ready(true);
      if (user2Ready) {
        setTimeout(() => setDemoStep("add_connection"), 500);
      } else {
        setDemoStep("discuss");
      }
    } else if (demoStep === "add_connection" && !user1ConnConfirm) {
      setUser1ConnConfirm(user1Cursor === 0 ? "A" : "B");
    }
  };

  const handleDevice1PressB = () => {
    // B can act as back/cancel in some contexts
  };

  // Device 2 controls
  const handleDevice2Up = () => {
    if (demoStep === "user2_select") {
      setUser2Cursor(c => Math.max(0, c - 1));
    } else if (demoStep === "user2_answer" && !user2Selection) {
      setUser2Cursor(c => Math.max(0, c - 1));
    } else if (demoStep === "add_connection" && !user2ConnConfirm) {
      setUser2Cursor(c => Math.max(0, c - 1));
    }
  };

  const handleDevice2Down = () => {
    if (demoStep === "user2_select") {
      setUser2Cursor(c => Math.min(2, c + 1));
    } else if (demoStep === "user2_answer" && !user2Selection) {
      setUser2Cursor(c => Math.min(1, c + 1));
    } else if (demoStep === "add_connection" && !user2ConnConfirm) {
      setUser2Cursor(c => Math.min(1, c + 1));
    }
  };

  const handleDevice2PressA = () => {
    if (demoStep === "found") {
      setDemoStep("user1_select");
      setUser2Cursor(0);
    } else if (demoStep === "user2_select" && user2SelectedQ === null) {
      setUser2SelectedQ(user2Cursor);
      setUser2Cursor(0);
      setTimeout(() => {
        setDemoStep("user1_answer");
        setUser1Cursor(0);
        setUser2Cursor(0);
      }, 500);
    } else if ((demoStep === "user2_answer" || demoStep === "user1_answer") && !user2Selection) {
      // user2 is answering in parallel once their question is ready
      if (demoStep === "user2_answer" || (demoStep === "user1_answer" && user2ActiveQ)) {
        setUser2Selection(user2Cursor === 0 ? "A" : "B");
        if (user1Selection) {
          setTimeout(() => setDemoStep("both_answered"), 500);
        }
      }
    } else if (demoStep === "both_answered" || demoStep === "discuss") {
      setUser2Ready(true);
      if (user1Ready) {
        setTimeout(() => setDemoStep("add_connection"), 500);
      } else {
        setDemoStep("discuss");
      }
    } else if (demoStep === "add_connection" && !user2ConnConfirm) {
      setUser2ConnConfirm(user2Cursor === 0 ? "A" : "B");
    }
  };

  const handleDevice2PressB = () => {};

  // Advance to user2_answer once user1 answers
  useEffect(() => {
    if (demoStep === "user1_answer" && user1Selection && !user2Selection) {
      const t = setTimeout(() => {
        setDemoStep("user2_answer");
        setUser2Cursor(0);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [user1Selection, demoStep, user2Selection]);

  const resetDemo = () => {
    setDemoStep("start");
    setUser1Selection(null);
    setUser2Selection(null);
    setUser1Cursor(0);
    setUser2Cursor(0);
    setUser1SelectedQ(null);
    setUser2SelectedQ(null);
    setUser1Ready(false);
    setUser2Ready(false);
    setUser1ConnConfirm(null);
    setUser2ConnConfirm(null);
    setAutoPlay(false);
  };

  const startDemo = () => {
    setAutoPlay(true);
    if (demoStep === "start") setDemoStep("searching");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4 md:p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          CONNECT Device Demo
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
          Two devices interacting to help users break the ice with meaningful conversation prompts.
        </p>
      </div>

      <div className="flex justify-center gap-3 mb-8">
        <Button onClick={startDemo} disabled={autoPlay || demoStep === "complete"} className="gap-2">
          <Play className="w-4 h-4" /> Start Demo
        </Button>
        <Button onClick={advanceDemo} variant="outline" className="gap-2">
          <SkipForward className="w-4 h-4" /> Next Step
        </Button>
        <Button onClick={resetDemo} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" /> Reset
        </Button>
      </div>

      <div className="text-center mb-6">
        <span className="inline-block px-4 py-2 bg-white/80 rounded-full text-sm font-medium shadow-sm">
          {demoStep === "start" && "Ready to connect..."}
          {demoStep === "searching" && "🔍 Searching for nearby users..."}
          {demoStep === "found" && "✨ Connection found! Press A to proceed."}
          {demoStep === "user1_select" && "You: Pick a question to answer from Maya's list"}
          {demoStep === "user2_select" && "Maya: Pick a question to answer from your list"}
          {demoStep === "user1_answer" && "Answer the question! Use ↑↓ and A."}
          {demoStep === "user2_answer" && "Maya is answering... You can answer too!"}
          {demoStep === "both_answered" && "Both answered! Press A to discuss."}
          {demoStep === "discuss" && "💬 Discuss! Each press A when ready."}
          {demoStep === "add_connection" && "Add to connections? ↑↓ and A."}
          {demoStep === "complete" && "🎉 Connected! You earned a gem."}
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
        <div className="flex flex-col items-center gap-3">
          <span className="text-sm font-medium text-foreground/70">You</span>
          <ConnectDevice
            color="coral"
            screenState={device1State}
            userName="You"
            otherUserName="Maya"
            userVariant="user1"
            otherUserVariant="user2"
            question={user1ActiveQ?.question}
            optionA={user1ActiveQ?.optionA}
            optionB={user1ActiveQ?.optionB}
            selectedOption={demoStep === "add_connection" ? user1ConnConfirm : user1Selection}
            onPressA={handleDevice1PressA}
            onPressB={handleDevice1PressB}
            onUp={handleDevice1Up}
            onDown={handleDevice1Down}
            questionChoices={user1QuestionChoices}
            cursorIndex={user1Cursor}
            selectedQuestionIndex={user1SelectedQ}
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className={`w-16 h-1 rounded-full transition-all duration-500 ${
            demoStep === "start" || demoStep === "searching" ? "bg-gray-300"
            : demoStep === "complete" ? "bg-green-500"
            : "bg-primary animate-pulse"
          }`} />
          <span className="text-xs text-muted-foreground">
            {demoStep === "complete" ? "Connected!" : "Signal"}
          </span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <span className="text-sm font-medium text-foreground/70">Maya</span>
          <ConnectDevice
            color="purple"
            screenState={device2State}
            userName="Maya"
            otherUserName="You"
            userVariant="user2"
            otherUserVariant="user1"
            question={user2ActiveQ?.question}
            optionA={user2ActiveQ?.optionA}
            optionB={user2ActiveQ?.optionB}
            selectedOption={demoStep === "add_connection" ? user2ConnConfirm : user2Selection}
            onPressA={handleDevice2PressA}
            onPressB={handleDevice2PressB}
            onUp={handleDevice2Up}
            onDown={handleDevice2Down}
            questionChoices={user2QuestionChoices}
            cursorIndex={user2Cursor}
            selectedQuestionIndex={user2SelectedQ}
          />
        </div>
      </div>

      <div className="mt-8 max-w-2xl mx-auto">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-foreground mb-2">How CONNECT Works</h3>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Each user pre-selects 3 questions that resonate with them</li>
            <li>When nearby, devices automatically find each other</li>
            <li>Each user picks one question from the other's list to answer</li>
            <li>Answer in A/B format using the device buttons</li>
            <li>Use the prompts to start a real conversation!</li>
            <li>Optionally add them to your connections list</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
