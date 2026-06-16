"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, Clock, BarChart2, BookOpen } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Цвета превью для каждой категории
const categoryConfig: Record<string, { gradient: string; label: string; badge: string }> = {
  math: {
    gradient: "from-blue-600 to-indigo-800",
    label: "Математика",
    badge: "bg-blue-100 text-blue-700",
  },
  english: {
    gradient: "from-emerald-500 to-teal-700",
    label: "Английский",
    badge: "bg-emerald-100 text-emerald-700",
  },
  cs: {
    gradient: "from-violet-600 to-purple-800",
    label: "Информатика",
    badge: "bg-violet-100 text-violet-700",
  },
  business: {
    gradient: "from-orange-500 to-red-700",
    label: "Бизнес",
    badge: "bg-orange-100 text-orange-700",
  },
  science: {
    gradient: "from-cyan-500 to-blue-700",
    label: "Наука",
    badge: "bg-cyan-100 text-cyan-700",
  },
  test_prep: {
    gradient: "from-rose-500 to-pink-700",
    label: "Подготовка",
    badge: "bg-rose-100 text-rose-700",
  },
};

const levelLabel: Record<string, string> = {
  beginner: "Начинающий",
  intermediate: "Средний",
  advanced: "Продвинутый",
};

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  lessonCount: number;
  isEnrolled: boolean;
  progress: number;
  className?: string;
}

export function CourseCard({
  id,
  title,
  description,
  category,
  level,
  lessonCount,
  isEnrolled,
  progress,
  className,
}: CourseCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const config = categoryConfig[category] || categoryConfig.cs;

  const detailVariants = {
    hidden: { opacity: 0, height: 0, marginTop: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      marginTop: "0.75rem",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
      className={cn("w-full cursor-pointer", className)}
    >
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md hover:shadow-2xl transition-shadow duration-300">
        
        {/* Превью видео */}
        <div className={cn("relative h-40 w-full bg-gradient-to-br", config.gradient)}>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              animate={isHovered ? { scale: 1.15, opacity: 0.9 } : { scale: 1, opacity: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <PlayCircle className="w-14 h-14 text-white" />
            </motion.div>
          </div>
          
          {/* Метка "В процессе" */}
          {isEnrolled && (
            <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              В процессе
            </div>
          )}

          {/* Категория */}
          <div className="absolute bottom-3 left-3">
            <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white")}>
              {config.label}
            </span>
          </div>
        </div>

        {/* Основной контент */}
        <div className="p-4">
          {/* Метаданные */}
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <BarChart2 className="w-3 h-3" />
            <span>{levelLabel[level] || level}</span>
            <span>•</span>
            <BookOpen className="w-3 h-3" />
            <span>{lessonCount} уроков</span>
          </div>

          {/* Название */}
          <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2">
            {title}
          </h3>

          {/* Прогресс — всегда виден если записан */}
          {isEnrolled && (
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500 font-medium">Прогресс</span>
                <span className="font-bold text-blue-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          )}

          {/* Описание — появляется при наведении */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                key="description"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={detailVariants}
                className="overflow-hidden"
              >
                <p className="text-sm text-gray-500 leading-relaxed">
                  {description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Футер с кнопкой */}
        <div className="px-4 pb-4 pt-0">
          <Link
            href={`/courses/${id}`}
            className={cn(
              "block w-full py-2.5 text-center rounded-xl font-semibold text-sm transition-all",
              isEnrolled
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200"
                : "bg-gray-50 text-gray-800 border border-gray-200 hover:bg-gray-100"
            )}
          >
            {isEnrolled ? "Продолжить обучение →" : "Подробнее"}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
