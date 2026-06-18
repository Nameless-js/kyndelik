"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { PlayCircle, CheckCircle, ArrowLeft, Check, Award, Download, Video, ListChecks, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { QuizBlock } from "@/components/ui/quiz-block";
import { LearningPath, PathNode } from "@/components/ui/learning-path";
import { AICaseGenerator } from "@/components/ui/ai-case-generator";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";

type SidebarTab = "lessons" | "tasks";

export default function CourseViewer({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { courses, enrolledCourses, enrollCourse, markLessonComplete, profile, user } = useAppStore();
  
  const course = courses.find(c => c.id === resolvedParams.id);
  const enrolled = enrolledCourses.find(c => c.courseId === resolvedParams.id);
  
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SidebarTab>("lessons");
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [mascotImg, setMascotImg] = useState("/images/happiness.png");
  const [showCertificate, setShowCertificate] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (course && course.lessons.length > 0 && !activeLessonId) {
      Promise.resolve().then(() => {
        setActiveLessonId(course.lessons[0].id);
      });
    }
  }, [course, activeLessonId]);

  useEffect(() => {
    const images = [
      "/images/1.png", 
      "/images/2.png", 
      "/images/3.png", 
      "/images/4.png", 
      "/images/happiness.png"
    ];
    setMascotImg(images[Math.floor(Math.random() * images.length)]);
  }, []);

  useEffect(() => {
    if (enrolled) {
      const completed: Record<string, boolean> = {};
      enrolled.completedLessons.forEach(id => { completed[id] = true; });
      Promise.resolve().then(() => {
        setQuizCompleted(completed);
      });
    }
  }, [enrolled]);

  if (!course) {
    return <div className="p-20 text-center">Курс не найден</div>;
  }

  const activeLesson = course.lessons.find(l => l.id === activeLessonId);
  const totalLessons = course.lessons.length;
  const completedLessons = enrolled?.completedLessons.length || 0;
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const handleEnroll = () => {
    if (!user) {
      router.push("/onboarding");
      return;
    }
    enrollCourse(course.id);
  };

  const handleQuizComplete = (lessonId: string) => {
    markLessonComplete(course.id, lessonId);
    setQuizCompleted(prev => ({ ...prev, [lessonId]: true }));
  };

  // Determine which levels are unlocked: level N is unlocked if level N-1 is completed (or it's level 1)
  const isLevelUnlocked = (index: number) => {
    if (index === 0) return true;
    const prevLesson = course.lessons[index - 1];
    return !!enrolled?.completedLessons.includes(prevLesson.id);
  };

  return (
    <div className={cn("min-h-screen flex flex-col md:flex-row transition-colors duration-300", isDark ? "bg-[#050505] text-white" : "bg-[#f0f4f8] text-gray-900")}>
      
      {/* Sidebar */}
      <div className={cn(
        "w-full md:w-80 flex-shrink-0 flex flex-col h-[calc(100vh-4rem)] sticky top-16 border-r transition-colors duration-300",
        isDark ? "bg-[#0a1020]/80 border-gray-800" : "bg-white/90 border-gray-200"
      )}>
        {/* Header */}
        <div className={cn("p-6 border-b", isDark ? "border-gray-800" : "border-gray-200")}>
          <Link href="/courses" className={cn("flex items-center text-sm mb-4 transition-colors", isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900")}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Назад к курсам
          </Link>
          <h2 className={cn("text-xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>{course.title}</h2>
          
          {enrolled && (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className={cn("font-medium", isDark ? "text-gray-300" : "text-gray-700")}>Прогресс курса</span>
                <span className={cn("font-bold", isDark ? "text-blue-400" : "text-blue-600")}>{progress}%</span>
              </div>
              <div className={cn("w-full rounded-full h-2.5", isDark ? "bg-gray-800" : "bg-gray-100")}>
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <div className={cn("mt-2 text-xs", isDark ? "text-gray-400" : "text-gray-500")}>
                {completedLessons} из {totalLessons} уроков пройдено
              </div>
            </div>
          )}

          {progress === 100 && (
            <button 
              onClick={() => { setShowCertificate(true); setSelectedLevel(null); }}
              className="w-full mt-6 flex items-center justify-center py-2 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 font-bold rounded-xl border border-yellow-200 dark:border-yellow-900/50 hover:bg-yellow-100 transition-colors"
            >
              <Award className="w-5 h-5 mr-2" />
              Мой Сертификат
            </button>
          )}
        </div>
        
        {/* Tab Switcher */}
        <div className={cn("flex border-b", isDark ? "border-gray-800" : "border-gray-200")}>
          <button
            onClick={() => { setActiveTab("lessons"); setSelectedLevel(null); }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all border-b-2 cursor-pointer",
              activeTab === "lessons"
                ? isDark
                  ? "text-[#00BFFF] border-[#00BFFF] bg-[#00BFFF]/5"
                  : "text-[#0088cc] border-[#0088cc] bg-[#0088cc]/5"
                : isDark
                  ? "text-gray-400 border-transparent hover:text-white"
                  : "text-gray-500 border-transparent hover:text-gray-900"
            )}
          >
            <Video className="w-4 h-4" />
            Видео-уроки
          </button>
          <button
            onClick={() => { setActiveTab("tasks"); setActiveLessonId(null); }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all border-b-2 cursor-pointer",
              activeTab === "tasks"
                ? isDark
                  ? "text-green-400 border-green-400 bg-green-400/5"
                  : "text-green-600 border-green-600 bg-green-600/5"
                : isDark
                  ? "text-gray-400 border-transparent hover:text-white"
                  : "text-gray-500 border-transparent hover:text-gray-900"
            )}
          >
            <ListChecks className="w-4 h-4" />
            Задачи
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === "lessons" ? (
              <motion.div
                key="lessons"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="p-4 space-y-2"
              >
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Уроки</h3>
                {course.lessons.map((lesson, index) => {
                  const isCompleted = enrolled?.completedLessons.includes(lesson.id);
                  const isActive = activeLessonId === lesson.id && !showCertificate;
                  
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        setActiveLessonId(lesson.id);
                        setShowCertificate(false);
                        setSelectedLevel(null);
                      }}
                      className={cn(
                        "w-full flex items-start text-left p-3 rounded-xl transition-all cursor-pointer border",
                        isActive 
                          ? isDark 
                            ? "bg-[#00BFFF]/10 border-[#00BFFF]/30" 
                            : "bg-[#0088cc]/10 border-[#0088cc]/30" 
                          : isDark
                            ? "hover:bg-white/5 border-transparent"
                            : "hover:bg-gray-100/60 border-transparent"
                      )}
                    >
                      <div className="mt-0.5 mr-3">
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold",
                            isActive 
                              ? isDark 
                                ? "border-[#00BFFF] text-[#00BFFF]" 
                                : "border-[#0088cc] text-[#0088cc]" 
                              : isDark 
                                ? "border-gray-700 text-gray-400" 
                                : "border-gray-300 text-gray-500"
                          )}>
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={cn(
                          "text-sm font-medium",
                          isActive ? (isDark ? "text-white" : "text-gray-900") : (isDark ? "text-gray-300" : "text-gray-700")
                        )}>
                          {lesson.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                          {lesson.duration}
                          {isCompleted && <span className="text-green-500 font-medium">✓ Пройден</span>}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="tasks"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="p-4 space-y-2"
              >
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Уровни</h3>
                {course.lessons.map((lesson, index) => {
                  const isCompleted = !!enrolled?.completedLessons.includes(lesson.id);
                  const unlocked = isLevelUnlocked(index);
                  const isActive = selectedLevel === index;
                  
                  return (
                    <button
                      key={lesson.id}
                      disabled={!unlocked || !enrolled}
                      onClick={() => {
                        setSelectedLevel(index);
                        setActiveLessonId(null);
                        setShowCertificate(false);
                      }}
                      className={cn(
                        "w-full flex items-center text-left p-3 rounded-xl transition-all border",
                        isActive 
                          ? isDark 
                            ? "bg-green-950/30 border-green-800 text-green-300"
                            : "bg-green-50 border-green-300 text-green-800"
                          : unlocked && enrolled
                            ? isDark
                              ? "hover:bg-white/5 border-transparent cursor-pointer"
                              : "hover:bg-gray-100/60 border-transparent cursor-pointer"
                            : "opacity-50 cursor-not-allowed border-transparent"
                      )}
                    >
                      <div className="mr-3">
                        {isCompleted ? (
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-md">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        ) : unlocked && enrolled ? (
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md",
                            isActive
                              ? "bg-green-500 text-white"
                              : isDark
                                ? "bg-green-950/40 text-green-400"
                                : "bg-green-100 text-green-700"
                          )}>
                            {index + 1}
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                            <Lock className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={cn(
                          "text-sm font-medium",
                          isActive ? (isDark ? "text-green-300" : "text-green-800") : (isDark ? "text-gray-300" : "text-gray-700")
                        )}>
                          Уровень {index + 1}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {lesson.title}
                          {isCompleted && <span className="text-green-500 ml-2 font-medium">★ Пройден</span>}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        "flex-1 p-6 md:p-10 overflow-y-auto transition-colors duration-300",
        isDark ? "bg-[#050505]" : "bg-white"
      )}>
        <div className="max-w-4xl mx-auto">
          
          <AnimatePresence mode="wait">
            {showCertificate ? (
              /* Certificate */
              <motion.div
                key="certificate"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "rounded-3xl p-12 text-center border-8 shadow-2xl relative overflow-hidden transition-all duration-300",
                  isDark
                    ? "bg-gray-900 border-gray-800 text-white"
                    : "bg-white border-gray-100 text-gray-900"
                )}
              >
                <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600" />
                <Award className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
                <h1 className={cn("text-4xl font-serif mb-2", isDark ? "text-white" : "text-gray-900")}>СЕРТИФИКАТ</h1>
                <p className={cn("font-medium tracking-widest uppercase mb-10 text-xs", isDark ? "text-gray-400" : "text-gray-500")}>Об окончании курса</p>
                <p className="text-lg mb-2">Настоящим подтверждается, что</p>
                <h2 className={cn("text-3xl font-bold mb-8 border-b pb-4 inline-block px-12", isDark ? "text-white border-gray-800" : "text-gray-900 border-gray-200")}>
                  {profile?.name || "Студент Mentoria"}
                </h2>
                <p className="text-lg mb-2">успешно завершил(а) курс</p>
                <h3 className={cn("text-2xl font-bold mb-12", isDark ? "text-blue-400" : "text-blue-600")}>«{course.title}»</h3>
                <div className="flex justify-between items-end mt-16 px-12">
                  <div className="text-left">
                    <div className="border-b border-gray-400 w-40 mb-2"></div>
                    <p className={cn("text-sm font-bold", isDark ? "text-white" : "text-gray-900")}>Mentoria Hub</p>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-sm font-bold mb-1", isDark ? "text-white" : "text-gray-900")}>{new Date().toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">Дата выдачи</p>
                  </div>
                </div>
                <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center">
                  <button 
                    onClick={() => window.print()}
                    className={cn(
                      "flex items-center px-6 py-3 rounded-xl font-medium transition-colors print:hidden cursor-pointer",
                      isDark ? "bg-white text-gray-900 hover:bg-gray-200" : "bg-gray-900 text-white hover:bg-gray-800"
                    )}
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Скачать PDF
                  </button>
                </div>
              </motion.div>

            ) : !enrolled ? (
              /* Enroll */
              <motion.div
                key="enroll"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "rounded-2xl p-10 text-center border shadow-lg mt-10 transition-colors duration-300",
                  isDark ? "bg-gray-900/60 border-gray-800" : "bg-white border-gray-200"
                )}
              >
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <PlayCircle className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className={cn("text-3xl font-bold mb-4", isDark ? "text-white" : "text-gray-900")}>Начать изучение курса</h2>
                <p className={cn("mb-8 max-w-xl mx-auto text-lg", isDark ? "text-gray-400" : "text-gray-600")}>
                  Запишитесь на курс, чтобы получить доступ к видео-урокам, заданиям и отслеживать свой прогресс.
                </p>
                <button 
                  onClick={handleEnroll}
                  className={cn(
                    "px-8 py-4 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer",
                    isDark ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-600 hover:bg-blue-700"
                  )}
                >
                  Записаться на курс
                </button>
              </motion.div>

            ) : activeTab === "tasks" && selectedLevel !== null ? (
              /* Quiz for selected level */
              <motion.div
                key={`quiz-${selectedLevel}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className={cn(
                  "rounded-2xl p-6 border shadow-sm transition-colors duration-300",
                  isDark ? "bg-gray-900/60 border-gray-800" : "bg-white border-gray-100"
                )}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
                      {selectedLevel + 1}
                    </div>
                    <div>
                      <h1 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                        Уровень {selectedLevel + 1}: {course.lessons[selectedLevel].title}
                      </h1>
                      <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                        Ответь на вопросы, чтобы пройти уровень
                      </p>
                    </div>
                  </div>
                </div>

                <QuizBlock
                  questions={course.lessons[selectedLevel].questions || []}
                  lessonTitle={course.lessons[selectedLevel].title}
                  onComplete={() => handleQuizComplete(course.lessons[selectedLevel].id)}
                  onClose={() => setSelectedLevel(null)}
                  isCompleted={!!enrolled?.completedLessons.includes(course.lessons[selectedLevel].id)}
                />
              </motion.div>

            ) : activeTab === "tasks" && selectedLevel === null ? (
              /* Duolingo-style level path — main area */
              <motion.div
                key="level-path"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "flex flex-col items-center py-8 relative min-h-[800px] rounded-3xl overflow-hidden shadow-inner transition-colors duration-300 border",
                  isDark ? "bg-gray-900/40 border-gray-800" : "bg-white border-gray-100"
                )}
              >
                <div className="relative z-10 w-full flex flex-col items-center">

                {/* Маскот сверху */}
                <motion.div 
                  className="mb-8"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image
                    src={mascotImg}
                    alt="Лисёнок"
                    width={100}
                    height={100}
                    className="drop-shadow-lg"
                  />
                  <p className={cn("text-center text-sm mt-2 font-medium", isDark ? "text-gray-400" : "text-gray-500")}>
                    Выбери уровень! 🎯
                  </p>
                </motion.div>

                {/* Zigzag path using LearningPath component */}
                <div className="relative w-full mt-4">
                  <LearningPath 
                    nodes={course.lessons.map((lesson, index) => {
                      const isCompleted = !!enrolled?.completedLessons.includes(lesson.id);
                      const unlocked = isLevelUnlocked(index);
                      const isActive = unlocked && !isCompleted;
                      
                      let state: "completed" | "active" | "locked" = "locked";
                      if (isCompleted) state = "completed";
                      else if (isActive) state = "active";

                      return {
                        id: lesson.id,
                        label: lesson.title,
                        state,
                        progress: state === "active" ? 0 : undefined,
                      };
                    })}
                    onNodeClick={(id, index) => {
                      setSelectedLevel(index);
                    }}
                  />
                </div>

                  {/* Treasure chest at the bottom if all completed */}
                  {progress === 100 && (
                    <motion.div
                      className="flex justify-center mt-6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: [0, -5, 5, 0] }}
                      transition={{ type: "spring", delay: 0.3 }}
                    >
                      <button
                        onClick={() => { setShowCertificate(true); setSelectedLevel(null); }}
                        className="w-24 h-24 bg-gradient-to-b from-yellow-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"
                      >
                        <Award className="w-12 h-12 text-white" />
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>

            ) : activeLessonId && activeTab === "lessons" ? (
              /* Video lesson view */
              <motion.div
                key={`lesson-${activeLessonId}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Video Player */}
                <div className="w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden relative shadow-xl border border-white/5">
                  {activeLesson?.videoUrl ? (
                    <iframe
                      src={(() => {
                        const url = activeLesson.videoUrl;
                        if (url.includes("youtube.com/embed/") || url.includes("youtube-nocookie.com/embed/")) return url;
                        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
                        return match && match[1] ? `https://www.youtube.com/embed/${match[1]}` : url;
                      })()}
                      className="w-full h-full animate-fade-in"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      title={activeLesson.title}
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center flex-col text-white">
                      <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                        <PlayCircle className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-lg font-medium opacity-75">{activeLesson?.title}</p>
                      <p className="text-sm opacity-40 mt-1">Видео скоро появится</p>
                    </div>
                  )}
                </div>

                {/* Lesson Info */}
                <div className={cn(
                  "rounded-2xl p-6 border shadow-sm transition-colors duration-300",
                  isDark ? "bg-gray-900/60 border-gray-800" : "bg-white border-gray-100"
                )}>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h1 className={cn("text-2xl font-bold mb-1", isDark ? "text-white" : "text-gray-900")}>
                        {activeLesson?.title}
                      </h1>
                      <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>{activeLesson?.duration} • {course.title}</p>
                    </div>
                    {enrolled?.completedLessons.includes(activeLessonId || "") && (
                      <div className="flex items-center px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg font-medium text-sm">
                        <Check className="w-4 h-4 mr-2" />
                        Урок пройден
                      </div>
                    )}
                  </div>
                  <p className={cn("mt-4 leading-relaxed", isDark ? "text-gray-300" : "text-gray-600")}>
                    Посмотри видео выше, затем перейди во вкладку «Задачи» чтобы проверить знания и пройти уровень!
                  </p>
                </div>

                {/* AI Case Generator */}
                <AICaseGenerator 
                  lessonTitle={activeLesson?.title || course.title} 
                  interests={profile?.interests || []} 
                />
              </motion.div>
            ) : (
              /* Default state for tasks tab without selection */
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <Video className={cn("w-16 h-16 mb-4", isDark ? "text-gray-700" : "text-gray-300")} />
                <h2 className={cn("text-xl font-bold", isDark ? "text-gray-500" : "text-gray-400")}>Выберите урок</h2>
                <p className={cn("mt-2", isDark ? "text-gray-600" : "text-gray-400")}>Выберите урок из списка слева</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
