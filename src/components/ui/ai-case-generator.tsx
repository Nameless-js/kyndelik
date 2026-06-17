"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BrainCircuit, RefreshCw } from "lucide-react";
import { generatePersonalCase } from "@/app/actions/gemini";

interface AICaseGeneratorProps {
  lessonTitle: string;
  interests: string[];
}

export function AICaseGenerator({ lessonTitle, interests }: AICaseGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedCase, setGeneratedCase] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await generatePersonalCase(lessonTitle, interests);
      if (res.success && res.text) {
        setGeneratedCase(res.text);
      } else {
        setError(res.error || "Неизвестная ошибка");
      }
    } catch (err: any) {
      setError(err.message || "Ошибка соединения");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800/50 shadow-sm relative overflow-hidden">
      
      {/* Decorative background elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-400/20 dark:bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-400/20 dark:bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 flex items-start gap-4">
        <div className="w-12 h-12 shrink-0 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center shadow-sm border border-indigo-100 dark:border-indigo-800/50">
          <BrainCircuit className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Персональный практический кейс
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Сгенерируй уникальную задачу по пройденному уроку, основанную на твоих интересах (
            <span className="font-medium text-indigo-600 dark:text-indigo-400">
              {interests.length > 0 ? interests.join(", ") : "Общее развитие"}
            </span>).
          </p>

          <AnimatePresence mode="wait">
            {!generatedCase && !loading && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <button
                  onClick={handleGenerate}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  Сгенерировать задачу
                </button>
              </motion.div>
            )}

            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 text-sm font-medium"
              >
                <RefreshCw className="w-5 h-5 animate-spin" />
                ИИ анализирует урок и твои интересы...
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-200 dark:border-red-800/50"
              >
                {error}
                <button onClick={handleGenerate} className="ml-3 underline hover:text-red-800">
                  Попробовать снова
                </button>
              </motion.div>
            )}

            {generatedCase && !loading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 border border-indigo-100 dark:border-indigo-800/50 rounded-xl p-5 shadow-sm"
              >
                <div className="flex gap-3">
                  <div className="mt-1">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {generatedCase}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                  <button
                    onClick={handleGenerate}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Сгенерировать другой вариант
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
