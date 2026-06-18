"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Star, Zap } from "lucide-react";
import { useTheme } from "@/lib/theme";

// --- Хук для воспроизведения звуков ---
function useSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback((src: string) => {
    // Останавливаем предыдущий звук если играет
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const audio = new Audio(src);
    audio.volume = 0.7;
    audioRef.current = audio;
    audio.play().catch(() => {
      // Браузер может заблокировать автовоспроизведение — молча игнорируем
    });
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  return { play, stop };
}

// --- Типы ---
import { Question } from "@/lib/data";

interface QuizBlockProps {
  questions: Question[];
  lessonTitle: string;
  onComplete: () => void;
  onClose?: () => void;
  isCompleted: boolean;
}

type MascotState = "waiting" | "correct" | "wrong" | "victory";

const mascotImages: Record<MascotState, string> = {
  waiting: "/images/happiness.png",
  correct: "/images/happy.png",
  wrong: "/images/sad2.png",
  victory: "/images/victory.png",
};

const mascotMessages: Record<MascotState, string> = {
  waiting: "Ты справишься! Я верю в тебя 🎧",
  correct: "Правильно! Ты просто огонь! 🔥",
  wrong: "Не беда! Попробуй ещё раз 💪",
  victory: "НЕВЕРОЯТНО! Ты прошёл все задания! 🏆",
};

function Confetti() {
  const colors = ["#FF6B6B", "#FFE66D", "#4ECDC4", "#A8E6CF", "#6C5CE7", "#FD79A8"];
  const pieces = Array.from({ length: 40 });

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            backgroundColor: colors[i % colors.length],
            left: `${(i * 17) % 100}%`,
            top: "-10%",
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [`${((i * 29) % 200) - 100}px`],
            rotate: [0, (i * 72) % 720],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 2 + ((i * 13) % 21) / 10,
            delay: ((i * 7) % 9) / 10,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}

// Маскот компонент
function Mascot({ state }: { state: MascotState }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        key={state}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative"
      >
        {state === "correct" && (
          <motion.div
            className="absolute inset-0 rounded-full bg-green-300 opacity-30"
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 0.6, repeat: 2 }}
          />
        )}
        <motion.div
          animate={
            state === "correct"
              ? { rotate: [0, -10, 10, -10, 10, 0], y: [0, -8, 0] }
              : state === "victory"
                ? { y: [0, -12, 0], rotate: [0, 5, -5, 0] }
                : {}
          }
          transition={{ duration: 0.6, repeat: state === "victory" ? Infinity : 0, repeatDelay: 1 }}
        >
          <Image
            src={mascotImages[state]}
            alt="Лисёнок-маскот"
            width={120}
            height={120}
            className="object-contain drop-shadow-lg"
          />
        </motion.div>
      </motion.div>
      <motion.div
        key={`msg-${state}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-100 shadow-md rounded-2xl px-4 py-2 text-sm font-medium text-gray-700 text-center max-w-[140px]"
      >
        {mascotMessages[state]}
      </motion.div>
    </div>
  );
}

// Прогресс-бар
function XPBar({ current, total }: { current: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((current / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <Zap className="w-4 h-4 text-yellow-500 flex-shrink-0" />
      <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>
      <span className="text-xs font-bold text-gray-500 w-10 text-right">{pct}%</span>
    </div>
  );
}

// Главный блок квиза
export function QuizBlock({ questions, lessonTitle, onComplete, onClose, isCompleted }: QuizBlockProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [mascotState, setMascotState] = useState<MascotState>("waiting");
  const [showConfetti, setShowConfetti] = useState(false);
  const [allDone, setAllDone] = useState(isCompleted);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const { play, stop } = useSound();

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center text-gray-500 dark:text-gray-400">
        В этом уровне пока нет заданий. Вернитесь позже!
      </div>
    );
  }

  const question = questions[currentQ];
  const isCorrect = selected === question?.correctIndex;

  const handleSelect = (idx: number) => {
    if (answered || allDone) return;
    setSelected(idx);
    setAnswered(true);

    if (idx === question.correctIndex) {
      setCorrectCount((c) => c + 1);
      setMascotState("correct");
      play("/sounds/true.mp3");
    } else {
      setWrongAttempts((w) => w + 1);
      setMascotState("wrong");
      play("/sounds/false.mp3");
    }

    setTimeout(() => setShowExplanation(true), 600);
  };

  const handleNext = () => {
    const nextIndex = currentQ + 1;
    if (nextIndex >= questions.length) {
      // Все вопросы пройдены!
      setAllDone(true);
      setMascotState("victory");
      setShowConfetti(true);
      onComplete();
      stop(); // Останавливаем предыдущий звук
      play("/sounds/victory.mp3");
      setTimeout(() => setShowConfetti(false), 3500);
    } else {
      setCurrentQ(nextIndex);
      setSelected(null);
      setAnswered(false);
      setShowExplanation(false);
      setMascotState("waiting");
    }
  };

  const handleRetry = () => {
    setSelected(null);
    setAnswered(false);
    setShowExplanation(false);
    setMascotState("waiting");
  };

  if (allDone) {
    return (
      <div className="relative">
        {showConfetti && <Confetti />}
        <div className={cn(
          "rounded-2xl border p-8 text-center transition-colors duration-300",
          isDark
            ? "bg-[#0a1020]/60 border-blue-900/40 text-white"
            : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 text-gray-900"
        )}>
          <div className="flex justify-center mb-4">
            <Mascot state="victory" />
          </div>
          <h3 className={cn("text-2xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>🎉 Урок пройден!</h3>
          <p className={cn("mb-6", isDark ? "text-gray-300" : "text-gray-600")}>
            Ты правильно ответил на <span className={cn("font-bold", isDark ? "text-blue-400" : "text-blue-600")}>{correctCount}</span> из{" "}
            <span className="font-bold">{questions.length}</span> вопросов. Отличная работа!
          </p>
          <div className="flex items-center justify-center gap-2 text-yellow-600 font-bold text-lg mb-8">
            {Array.from({ length: Math.min(correctCount, 3) }).map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className={cn(
                "px-8 py-3 font-bold rounded-xl shadow-md transition-colors cursor-pointer",
                isDark
                  ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/50"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
              )}
            >
              Продолжить
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border-2 transition-all duration-300 overflow-hidden",
        answered
          ? isCorrect
            ? isDark
              ? "border-green-800/80 bg-green-950/20"
              : "border-green-200 bg-green-50/50"
            : isDark
              ? "border-red-800/80 bg-red-950/20"
              : "border-red-200 bg-red-50/50"
          : isDark
            ? "border-gray-800 bg-gray-900/60"
            : "border-gray-100 bg-white"
      )}
    >
      {/* Заголовок с прогрессом */}
      <div className={cn("p-5 border-b", isDark ? "border-gray-800" : "border-gray-100")}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={cn("text-sm font-bold uppercase tracking-wider", isDark ? "text-gray-400" : "text-gray-500")}>
            🎯 Проверь знания
          </h3>
          <span className={cn(
            "text-sm font-bold px-3 py-1 rounded-full",
            isDark ? "text-blue-400 bg-blue-950/50" : "text-blue-600 bg-blue-50"
          )}>
            {currentQ + 1} / {questions.length}
          </span>
        </div>
        <XPBar current={currentQ + (answered && isCorrect ? 1 : 0)} total={questions.length} />
      </div>

      <div className="p-5 flex flex-col md:flex-row gap-6">
        {/* Маскот (сайдбар) */}
        <div className="flex-shrink-0 flex md:flex-col items-center justify-center md:justify-start gap-4 md:gap-0 md:w-36">
          <Mascot state={mascotState} />
        </div>

        {/* Вопрос + варианты */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <p className={cn("text-lg font-semibold mb-5 leading-snug", isDark ? "text-white" : "text-gray-900")}>
                {question.text}
              </p>

              <div className="space-y-3">
                {question.options.map((opt, i) => {
                  let style = isDark
                    ? "bg-gray-800/40 border-gray-700 text-gray-300 hover:border-blue-400 hover:bg-blue-950/20"
                    : "bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50";
                  if (answered) {
                    if (i === question.correctIndex)
                      style = isDark
                        ? "bg-green-950/30 border-green-600 text-green-300 font-semibold"
                        : "bg-green-50 border-green-400 text-green-800 font-semibold";
                    else if (i === selected)
                      style = isDark
                        ? "bg-red-950/30 border-red-600 text-red-300"
                        : "bg-red-50 border-red-400 text-red-700";
                    else style = isDark
                      ? "bg-gray-950 border-gray-850 text-gray-600 opacity-60"
                      : "bg-white border-gray-100 text-gray-400 opacity-60";
                  }

                  return (
                    <motion.button
                      key={i}
                      whileHover={!answered ? { scale: 1.01 } : {}}
                      whileTap={!answered ? { scale: 0.99 } : {}}
                      onClick={() => handleSelect(i)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-3 text-sm font-medium",
                        style,
                        !answered && "cursor-pointer"
                      )}
                    >
                      <span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span>{opt}</span>
                      {answered && i === question.correctIndex && (
                        <CheckCircle className="w-5 h-5 text-green-500 ml-auto flex-shrink-0" />
                      )}
                      {answered && i === selected && i !== question.correctIndex && (
                        <XCircle className="w-5 h-5 text-red-500 ml-auto flex-shrink-0" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Объяснение */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={cn(
                      "mt-4 p-4 rounded-xl text-sm border",
                      isCorrect
                        ? isDark
                          ? "bg-green-950/30 text-green-300 border-green-800"
                          : "bg-green-100 text-green-800 border border-green-200"
                        : isDark
                          ? "bg-amber-950/30 text-amber-300 border-amber-800"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                    )}
                  >
                    <span className="font-bold">{isCorrect ? "✅ Верно! " : "💡 Объяснение: "}</span>
                    {question.explanation}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Кнопки действий */}
              {answered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 flex gap-3"
                >
                  {!isCorrect && wrongAttempts < 2 && (
                    <button
                      onClick={handleRetry}
                      className={cn(
                        "px-5 py-2.5 rounded-xl border-2 font-semibold text-sm transition-colors cursor-pointer",
                        isDark
                          ? "border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-800"
                          : "border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                      )}
                    >
                      Попробовать ещё раз
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    className={cn(
                      "flex-1 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-md cursor-pointer",
                      isDark
                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/50"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
                    )}
                  >
                    {currentQ < questions.length - 1 ? "Следующий вопрос →" : "Завершить урок 🏆"}
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

