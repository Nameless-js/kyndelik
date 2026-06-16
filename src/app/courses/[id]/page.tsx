"use client";

import { use, useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { PlayCircle, CheckCircle, ArrowLeft, Check, Award, Download } from "lucide-react";
import Link from "next/link";
import { QuizBlock, generateQuestionsForLesson } from "@/components/ui/quiz-block";
import { motion, AnimatePresence } from "framer-motion";

export default function CourseViewer({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { courses, enrolledCourses, enrollCourse, markLessonComplete, profile } = useAppStore();
  
  const course = courses.find(c => c.id === resolvedParams.id);
  const enrolled = enrolledCourses.find(c => c.courseId === resolvedParams.id);
  
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (course && course.lessons.length > 0 && !activeLessonId) {
      setActiveLessonId(course.lessons[0].id);
    }
  }, [course, activeLessonId]);

  // Sync with already completed lessons
  useEffect(() => {
    if (enrolled) {
      const completed: Record<string, boolean> = {};
      enrolled.completedLessons.forEach(id => { completed[id] = true; });
      setQuizCompleted(completed);
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
    enrollCourse(course.id);
  };

  const handleQuizComplete = () => {
    if (activeLessonId) {
      markLessonComplete(course.id, activeLessonId);
      setQuizCompleted(prev => ({ ...prev, [activeLessonId]: true }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col md:flex-row transition-colors duration-300">
      
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-shrink-0 flex flex-col h-[calc(100vh-4rem)] sticky top-16">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <Link href="/courses" className="flex items-center text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Назад к курсам
          </Link>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h2>
          
          {enrolled && (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-gray-700 dark:text-gray-300">Прогресс курса</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{progress}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {completedLessons} из {totalLessons} уроков пройдено
              </div>
            </div>
          )}

          {progress === 100 && (
            <button 
              onClick={() => setShowCertificate(true)}
              className="w-full mt-6 flex items-center justify-center py-2 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 font-bold rounded-xl border border-yellow-200 dark:border-yellow-900/50 hover:bg-yellow-100 transition-colors"
            >
              <Award className="w-5 h-5 mr-2" />
              Мой Сертификат
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Уроки</h3>
          {course.lessons.map((lesson, index) => {
            const isCompleted = enrolled?.completedLessons.includes(lesson.id);
            const isActive = activeLessonId === lesson.id && !showCertificate;
            const hasQuiz = quizCompleted[lesson.id];
            
            return (
              <button
                key={lesson.id}
                onClick={() => {
                  setActiveLessonId(lesson.id);
                  setShowCertificate(false);
                }}
                className={`w-full flex items-start text-left p-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800" 
                    : "hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent"
                }`}
              >
                <div className="mt-0.5 mr-3">
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                      isActive ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400" : "border-gray-300 text-gray-400 dark:border-gray-700"
                    }`}>
                      {index + 1}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${isActive ? "text-blue-900 dark:text-blue-100" : "text-gray-700 dark:text-gray-300"}`}>
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
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          
          <AnimatePresence mode="wait">
            {showCertificate ? (
              <motion.div
                key="certificate"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-3xl p-12 text-center border-8 border-gray-100 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600" />
                <Award className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
                <h1 className="text-4xl font-serif text-gray-900 mb-2">СЕРТИФИКАТ</h1>
                <p className="text-gray-500 font-medium tracking-widest uppercase mb-10">Об окончании курса</p>
                
                <p className="text-lg text-gray-600 mb-2">Настоящим подтверждается, что</p>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4 inline-block px-12">
                  {profile?.name || "Студент Mentoria"}
                </h2>
                
                <p className="text-lg text-gray-600 mb-2">успешно завершил(а) курс</p>
                <h3 className="text-2xl font-bold text-blue-600 mb-12">«{course.title}»</h3>
                
                <div className="flex justify-between items-end mt-16 px-12">
                  <div className="text-left">
                    <div className="border-b border-gray-400 w-40 mb-2"></div>
                    <p className="text-sm font-bold text-gray-900">Mentoria Hub</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 mb-1">{new Date().toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">Дата выдачи</p>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center">
                  <button 
                    onClick={() => window.print()}
                    className="flex items-center px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors print:hidden"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Скачать PDF
                  </button>
                </div>
              </motion.div>
            ) : !enrolled ? (
              <motion.div
                key="enroll"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl p-10 text-center border border-gray-200 dark:border-gray-800 shadow-sm mt-10"
              >
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <PlayCircle className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Начать изучение курса</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto text-lg">
                  Запишитесь на курс, чтобы получить доступ к видео-урокам, заданиям и отслеживать свой прогресс.
                </p>
                <button 
                  onClick={handleEnroll}
                  className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Записаться на курс
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={activeLessonId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Video Player */}
                <div className="w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden relative shadow-xl">
                  {activeLesson?.videoUrl ? (
                    <iframe
                      src={activeLesson.videoUrl}
                      className="w-full h-full"
                      allowFullScreen
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
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {activeLesson?.title}
                      </h1>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{activeLesson?.duration} • {course.title}</p>
                    </div>
                    {enrolled?.completedLessons.includes(activeLessonId || "") && (
                      <div className="flex items-center px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg font-medium text-sm">
                        <Check className="w-4 h-4 mr-2" />
                        Урок пройден
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
                    Посмотри видео выше и проверь свои знания в интерактивном блоке ниже. Ответь правильно, чтобы засчитать урок и продвинуться в курсе!
                  </p>
                </div>

                {/* 🎮 Gamification Quiz Block */}
                {activeLessonId && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <span className="text-lg">🎮</span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Интерактивные задания
                      </h2>
                      <span className="text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-full">
                        Duolingo-режим
                      </span>
                    </div>

                    <QuizBlock
                      questions={generateQuestionsForLesson(activeLessonId, activeLesson?.title || "")}
                      lessonTitle={activeLesson?.title || ""}
                      onComplete={handleQuizComplete}
                      isCompleted={!!enrolled?.completedLessons.includes(activeLessonId)}
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
