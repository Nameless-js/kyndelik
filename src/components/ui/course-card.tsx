"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, Clock, BarChart2, BookOpen } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";

// Цвета превью для каждой категории, адаптированные под темную и светлую темы
const categoryConfig: Record<
  string, 
  { gradientDark: string; gradientLight: string; label: string; badgeDark: string; badgeLight: string }
> = {
  math: {
    gradientDark: "from-[#008fbf] to-[#0a1020]",
    gradientLight: "from-[#38bdf8] to-[#bae6fd]",
    label: "Математика",
    badgeDark: "bg-[#00BFFF]/10 text-[#59DFFF] border border-[#00BFFF]/25",
    badgeLight: "bg-[#0088cc]/10 text-[#0077b6] border border-[#0088cc]/15",
  },
  english: {
    gradientDark: "from-[#0a2e5c] to-[#050505]",
    gradientLight: "from-[#818cf8] to-[#c7d2fe]",
    label: "Английский",
    badgeDark: "bg-[#00BFFF]/10 text-[#59DFFF] border border-[#00BFFF]/25",
    badgeLight: "bg-[#0088cc]/10 text-[#0077b6] border border-[#0088cc]/15",
  },
  cs: {
    gradientDark: "from-[#1e1b4b] to-[#050505]",
    gradientLight: "from-[#a5b4fc] to-[#e0e7ff]",
    label: "Информатика",
    badgeDark: "bg-[#00BFFF]/10 text-[#59DFFF] border border-[#00BFFF]/25",
    badgeLight: "bg-[#0088cc]/10 text-[#0077b6] border border-[#0088cc]/15",
  },
  business: {
    gradientDark: "from-[#2e1065] to-[#0a1020]",
    gradientLight: "from-[#f472b6] to-[#fbcfe8]",
    label: "Бизнес",
    badgeDark: "bg-[#00BFFF]/10 text-[#59DFFF] border border-[#00BFFF]/25",
    badgeLight: "bg-[#0088cc]/10 text-[#0077b6] border border-[#0088cc]/15",
  },
  science: {
    gradientDark: "from-[#093047] to-[#050505]",
    gradientLight: "from-[#38bdf8] to-[#e0f2fe]",
    label: "Наука",
    badgeDark: "bg-[#00BFFF]/10 text-[#59DFFF] border border-[#00BFFF]/25",
    badgeLight: "bg-[#0088cc]/10 text-[#0077b6] border border-[#0088cc]/15",
  },
  test_prep: {
    gradientDark: "from-[#4c1d95] to-[#050505]",
    gradientLight: "from-[#c084fc] to-[#e9d5ff]",
    label: "Подготовка",
    badgeDark: "bg-[#00BFFF]/10 text-[#59DFFF] border border-[#00BFFF]/25",
    badgeLight: "bg-[#0088cc]/10 text-[#0077b6] border border-[#0088cc]/15",
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
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const cardRef = React.useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = React.useState(0);
  const [rotateY, setRotateY] = React.useState(0);
  const [glarePosition, setGlarePosition] = React.useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = React.useState(false);

  const config = categoryConfig[category] || categoryConfig.cs;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const glareX = (mouseX / width) * 100;
    const glareY = (mouseY / height) * 100;
    setGlarePosition({ x: glareX, y: glareY });

    const rX = -((mouseY - height / 2) / (height / 2)) * 6;
    const rY = ((mouseX - width / 2) / (width / 2)) * 6;
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const detailVariants = {
    hidden: { opacity: 0, height: 0, marginTop: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      marginTop: "0.75rem",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  } as const;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
      }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={cn(
        "w-full cursor-pointer relative rounded-2xl border transition-all duration-300 overflow-hidden shadow-lg",
        isDark
          ? "bg-[#0a1020]/75 border-[rgba(0,191,255,0.12)] hover:border-[#00BFFF]/40 hover:shadow-[0_12px_36px_rgba(0,191,255,0.18)]"
          : "bg-white/90 border-[rgba(0,136,204,0.15)] hover:border-[#0088cc]/40 hover:shadow-[0_12px_30px_rgba(0,136,204,0.08)]",
        className
      )}
    >
      {/* Dynamic Reflective Glare */}
      {isHovered && (
        <div 
          className="absolute inset-0 z-20 pointer-events-none opacity-45 mix-blend-overlay transition-opacity duration-300"
          style={{
            background: isDark
              ? `radial-gradient(circle 220px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.12), transparent 80%)`
              : `radial-gradient(circle 220px at ${glarePosition.x}% ${glarePosition.y}%, rgba(0,136,204,0.08), transparent 80%)`
          }}
        />
      )}
      
      {/* Превью видео с иконкой */}
      <div className={cn(
        "relative h-40 w-full bg-gradient-to-br transition-all duration-300", 
        isDark ? config.gradientDark : config.gradientLight
      )}>
        {/* Decorative Grid Overlay inside thumbnail */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40" />

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            animate={isHovered ? { scale: 1.12, opacity: 1 } : { scale: 1, opacity: 0.75 }}
            transition={{ duration: 0.3 }}
          >
            <PlayCircle className={cn(
              "w-14 h-14 transition-all duration-300",
              isDark 
                ? "text-[#00BFFF] drop-shadow-[0_0_12px_rgba(0,191,255,0.5)]" 
                : "text-[#0088cc] drop-shadow-[0_0_8px_rgba(0,136,204,0.35)]"
            )} />
          </motion.div>
        </div>
        
        {/* Метка "В процессе" */}
        {isEnrolled && (
          <div className={cn(
            "absolute top-3 right-3 border backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-colors",
            isDark
              ? "bg-[#050505]/70 border-[rgba(0,191,255,0.25)] text-[#59DFFF]"
              : "bg-white/80 border-[rgba(0,136,204,0.2)] text-[#0088cc]"
          )}>
            <span className={cn(
              "w-1.5 h-1.5 rounded-full inline-block animate-pulse", 
              isDark ? "bg-[#00BFFF] shadow-[0_0_6px_#00BFFF]" : "bg-[#0088cc] shadow-[0_0_4px_#0088cc]"
            )} />
            В процессе
          </div>
        )}

        {/* Категория */}
        <div className="absolute bottom-3 left-3">
          <span className={cn(
            "text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-full backdrop-blur-md shadow-sm border",
            isDark ? config.badgeDark : config.badgeLight
          )}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Основной контент */}
      <div className="p-5 relative z-10">
        {/* Метаданные */}
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider mb-2">
          <BarChart2 className={cn("w-3.5 h-3.5", isDark ? "text-[#00BFFF]" : "text-[#0088cc]")} />
          <span className={isDark ? "text-gray-400" : "text-gray-600"}>
            {levelLabel[level] || level}
          </span>
          <span className={isDark ? "text-gray-700" : "text-gray-300"}>•</span>
          <BookOpen className={cn("w-3.5 h-3.5", isDark ? "text-[#59DFFF]" : "text-[#00a3e0]")} />
          <span className={isDark ? "text-gray-400" : "text-gray-600"}>
            {lessonCount} уроков
          </span>
        </div>

        {/* Название */}
        <h3 className={cn(
          "text-base sm:text-lg font-bold leading-snug line-clamp-2 transition-colors duration-300 min-h-[44px]",
          isDark 
            ? "text-white group-hover:text-[#00BFFF]" 
            : "text-gray-900 group-hover:text-[#0088cc]"
        )}>
          {title}
        </h3>

        {/* Прогресс — всегда виден если записан */}
        {isEnrolled && (
          <div className="mt-4">
            <div className="flex justify-between text-[11px] mb-1.5 font-bold">
              <span className={isDark ? "text-gray-400" : "text-gray-500"}>Прогресс обучения</span>
              <span className={isDark ? "text-[#00BFFF]" : "text-[#0088cc]"}>{progress}%</span>
            </div>
            <div className={cn(
              "w-full rounded-full h-2 border overflow-hidden",
              isDark ? "bg-[#050505] border-white/5" : "bg-gray-100 border-black/5"
            )}>
              <motion.div
                className={cn(
                  "h-full rounded-full bg-gradient-to-r",
                  isDark 
                    ? "from-[#00BFFF] via-[#59DFFF] to-[#00BFFF] shadow-[0_0_8px_rgba(0,191,255,0.4)]" 
                    : "from-[#0088cc] via-[#00a3e0] to-[#0088cc]"
                )}
                style={{ backgroundSize: "200% auto" }}
                animate={{ backgroundPosition: ["0% center", "200% center"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                initial={{ width: 0 }}
                whileInView={{ width: `${progress}%` }}
                viewport={{ once: true }}
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
              <p className={cn(
                "text-xs sm:text-sm leading-relaxed pt-1",
                isDark ? "text-gray-400" : "text-gray-600"
              )}>
                {description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Футер с кнопкой */}
      <div className="px-5 pb-5 pt-0 relative z-10">
        <Link
          href={`/courses/${id}`}
          className={cn(
            "block w-full py-2.5 text-center rounded-xl font-bold text-sm transition-all duration-300 border relative overflow-hidden group/btn",
            isEnrolled
              ? isDark
                ? "bg-gradient-to-r from-[#00BFFF] to-[#008fbf] border-transparent text-[#050505] shadow-[0_4px_12px_rgba(0,191,255,0.15)] hover:shadow-[0_4px_20px_rgba(0,191,255,0.3)] hover:-translate-y-0.5"
                : "bg-gradient-to-r from-[#0088cc] to-[#0077b6] border-transparent text-white shadow-[0_4px_12px_rgba(0,136,204,0.15)] hover:shadow-[0_4px_20px_rgba(0,136,204,0.25)] hover:-translate-y-0.5"
              : isDark
                ? "bg-[#00BFFF]/5 text-[#00BFFF] border-[rgba(0,191,255,0.25)] hover:bg-[#00BFFF]/12 hover:border-[#00BFFF]/45"
                : "bg-[#0088cc]/5 text-[#0088cc] border-[rgba(0,136,204,0.2)] hover:bg-[#0088cc]/12 hover:border-[#0088cc]/45"
          )}
        >
          {isEnrolled ? "Продолжить обучение →" : "Подробнее"}
        </Link>
      </div>
    </motion.div>
  );
}

