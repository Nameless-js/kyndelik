"use client";

import { useAppStore } from "@/lib/store";
import { CourseCard } from "@/components/ui/course-card";
import { BookOpen, Layers, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
} as const;

export default function CoursesPage() {
  const { courses, enrolledCourses } = useAppStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const totalEnrolled = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter(ec => {
    const course = courses.find(c => c.id === ec.courseId);
    return course && ec.completedLessons.length === course.lessons.length;
  }).length;

  return (
    <div 
      onMouseMove={handleMouseMove}
      className={cn(
        "min-h-screen py-20 transition-colors duration-300 relative overflow-hidden",
        isDark ? "bg-[#050505] text-white" : "bg-[#f0f4f8] text-gray-900"
      )}
    >
      {/* ── Cyber Dot Grid ── */}
      <div 
        className="absolute inset-0 z-0 opacity-35 pointer-events-none"
        style={{
          backgroundImage: isDark
            ? "radial-gradient(rgba(0, 191, 255, 0.15) 1px, transparent 1px)"
            : "radial-gradient(rgba(0, 136, 204, 0.1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Ambient Glow Orbs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-[0.08] dark:opacity-[0.05]"
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(0,191,255,0.4) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(0,136,204,0.2) 0%, transparent 70%)",
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -50, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute right-[-10%] bottom-[-10%] w-[50%] h-[50%] rounded-full opacity-[0.06] dark:opacity-[0.04]"
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(89,223,255,0.3) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(0,163,224,0.15) 0%, transparent 70%)",
          }}
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 50, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* ── Interactive Pointer Spotlight ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500 opacity-60"
        style={{
          background: isDark
            ? `radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 191, 255, 0.05), transparent 80%)`
            : `radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 136, 204, 0.04), transparent 80%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── Hero Section ── */}
        <div className="relative pt-8 pb-12 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={cn(
              "mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border backdrop-blur-md bg-white/5",
              isDark ? "border-white/10 text-gray-300" : "border-black/[0.05] text-gray-600"
            )}
          >
            <BookOpen className={cn("w-3.5 h-3.5", isDark ? "text-[#00BFFF]" : "text-[#0088cc]")} />
            Академия знаний
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse shadow-[0_0_8px_#22c55e]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight leading-none mb-6"
          >
            Интеллектуальные <br />
            <span className={cn(
              "gradient-text-animated bg-gradient-to-r",
              isDark ? "from-[#00BFFF] via-[#59DFFF] to-[#008fbf]" : "from-[#0088cc] via-[#00a3e0] to-[#0077b6]"
            )}>
              асинхронные курсы
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={cn("text-base sm:text-lg max-w-2xl mx-auto mb-4 leading-relaxed", isDark ? "text-gray-400" : "text-gray-600")}
          >
            Осваивайте новые дисциплины в индивидуальном ритме. Персонализированные ИИ-кейсы, интерактивные задания и автоматическая сертификация.
          </motion.p>
        </div>

        {/* ── Stats Section ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16"
        >
          {[
            { icon: Layers, label: "Доступно курсов", value: courses.length, glow: "rgba(0, 191, 255, 0.12)" },
            { icon: BookOpen, label: "Я обучаюсь", value: totalEnrolled, glow: "rgba(89, 223, 255, 0.12)" },
            { icon: Sparkles, label: "Завершено курсов", value: completedCourses, glow: "rgba(245, 158, 11, 0.12)" },
          ].map((s, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.015 }}
              className={cn(
                "relative p-6 rounded-2xl border overflow-hidden backdrop-blur-md shadow-lg transition-all duration-300 group",
                isDark 
                  ? "bg-white/[0.02] border-white/5 hover:border-[rgba(0,191,255,0.25)] hover:shadow-[0_8px_30px_rgba(0,191,255,0.1)]" 
                  : "bg-white/40 border-black/[0.05] hover:border-[rgba(0,136,204,0.25)] hover:shadow-[0_8px_30px_rgba(0,136,204,0.08)]"
              )}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at top left, ${s.glow}, transparent 60%)`,
                }}
              />
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className={cn("text-[10px] font-bold uppercase tracking-wider block", isDark ? "text-gray-400" : "text-gray-500")}>
                    {s.label}
                  </span>
                  <span className={cn("text-3xl font-black block tracking-tight", isDark ? "text-white" : "text-gray-900")}>
                    {s.value}
                  </span>
                </div>
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-500 group-hover:rotate-6",
                  isDark
                    ? "bg-white/5 border-white/10 text-[#00BFFF]"
                    : "bg-white border-black/[0.05] text-[#0088cc]"
                )}>
                  <s.icon className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Courses Grid ── */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {courses.map((course, idx) => {
            const enrolled = enrolledCourses.find(c => c.courseId === course.id);
            const totalLessons = course.lessons.length;
            const completedLessons = enrolled?.completedLessons.length || 0;
            const progress = totalLessons > 0
              ? Math.round((completedLessons / totalLessons) * 100)
              : 0;

            return (
              <motion.div key={course.id} variants={itemVariants}>
                <CourseCard
                  id={course.id}
                  title={course.title}
                  description={course.description}
                  category={course.category}
                  level={course.level}
                  lessonCount={course.lessons.length}
                  isEnrolled={!!enrolled}
                  progress={progress}
                />
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </div>
  );
}

