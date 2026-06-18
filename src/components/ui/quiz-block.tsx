"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Star, Zap } from "lucide-react";

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

// Конфетти компонент
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
            left: `${Math.random() * 100}%`,
            top: "-10%",
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [`${(Math.random() - 0.5) * 200}px`],
            rotate: [0, Math.random() * 720],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.8,
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
  if (!questions || questions.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center text-gray-500 dark:text-gray-400">
        В этом уровне пока нет заданий. Вернитесь позже!
      </div>
    );
  }

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(isCompleted ? questions.length : 0);
  const [mascotState, setMascotState] = useState<MascotState>("waiting");
  const [showConfetti, setShowConfetti] = useState(false);
  const [allDone, setAllDone] = useState(isCompleted);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const { play, stop } = useSound();

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
      setAllDone(true);
      if (correctCount === 0 && !isCompleted) {
        // Провал
        setMascotState("wrong");
      } else {
        // Успех
        setMascotState("victory");
        setShowConfetti(true);
        onComplete();
        stop(); // Останавливаем предыдущий звук
        play("/sounds/victory.mp3");
        setTimeout(() => setShowConfetti(false), 3500);
      }
    } else {
      setCurrentQ(nextIndex);
      setSelected(null);
      setAnswered(false);
      setShowExplanation(false);
      setMascotState("waiting");
    }
  };

  const handleResetQuiz = () => {
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setCorrectCount(0);
    setWrongAttempts(0);
    setShowExplanation(false);
    setMascotState("waiting");
    setAllDone(false);
  };

  const handleRetry = () => {
    setSelected(null);
    setAnswered(false);
    setShowExplanation(false);
    setMascotState("waiting");
  };

  if (allDone) {
    const isAllWrong = correctCount === 0 && !isCompleted;

    if (isAllWrong) {
      return (
        <div className="relative">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex flex-col items-center gap-3">
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="relative">
                  <Image src="/images/sad2.png" alt="Лисёнок-грустит" width={120} height={120} className="object-contain drop-shadow-lg" />
                </motion.div>
                <div className="bg-white border border-gray-100 shadow-md rounded-2xl px-4 py-2 text-sm font-medium text-gray-700 text-center max-w-[140px]">
                  Может в следующий раз получится!
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Не сдавайся!</h3>
            <p className="text-gray-600 mb-6">
              Ты ответил правильно на <span className="font-bold text-red-600">0</span> из <span className="font-bold">{questions.length}</span> вопросов.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <button
                onClick={handleResetQuiz}
                className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
              >
                Попробовать заново
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition-colors"
                >
                  Продолжить
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative">
        {showConfetti && <Confetti />}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-8 text-center">
          <div className="flex justify-center mb-4">
            <Mascot state="victory" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">🎉 Урок пройден!</h3>
          <p className="text-gray-600 mb-6">
            Ты правильно ответил на <span className="font-bold text-blue-600">{correctCount}</span> из{" "}
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
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition-colors"
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
            ? "border-green-200 bg-green-50/50"
            : "border-red-200 bg-red-50/50"
          : "border-gray-100 bg-white"
      )}
    >
      {/* Заголовок с прогрессом */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
            🎯 Проверь знания
          </h3>
          <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
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
              <p className="text-lg font-semibold text-gray-900 mb-5 leading-snug">
                {question.text}
              </p>

              <div className="space-y-3">
                {question.options.map((opt, i) => {
                  let style =
                    "bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50";
                  if (answered) {
                    if (i === question.correctIndex)
                      style = "bg-green-50 border-green-400 text-green-800 font-semibold";
                    else if (i === selected)
                      style = "bg-red-50 border-red-400 text-red-700";
                    else style = "bg-white border-gray-100 text-gray-400 opacity-60";
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
                      "mt-4 p-4 rounded-xl text-sm",
                      isCorrect
                        ? "bg-green-100 text-green-800 border border-green-200"
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
                      className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:border-gray-400 transition-colors"
                    >
                      Попробовать ещё раз
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    className="flex-1 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors shadow-md"
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

