"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Video, Plus, HelpCircle, ChevronDown, ChevronRight, Check } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Course, Question } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";

// Pure helper function for generating IDs outside the component render phase
function generateUniqueId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export default function MentorPortal() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { profile, isLoading, courses, setCourses, addLesson, addQuestion, updateLessonVideoUrl } = useAppStore();
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => {
      setMounted(true);
    });
    if (!isLoading && (!profile || (profile.role !== "admin" && profile.role !== "mentor"))) {
      router.push("/");
    }
  }, [isLoading, profile, router]);

  // Accordion state
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  
  // Add Lesson State
  const [addingLessonToCourse, setAddingLessonToCourse] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDuration, setLessonDuration] = useState("");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");

  // Edit Video URL State
  const [editingVideoLesson, setEditingVideoLesson] = useState<{courseId: string, lessonId: string} | null>(null);
  const [editingVideoUrl, setEditingVideoUrl] = useState("");

  // Add Question State
  const [addingQuestionToLesson, setAddingQuestionToLesson] = useState<{courseId: string, lessonId: string} | null>(null);
  const [qText, setQText] = useState("");
  const [qOptA, setQOptA] = useState("");
  const [qOptB, setQOptB] = useState("");
  const [qOptC, setQOptC] = useState("");
  const [qOptD, setQOptD] = useState("");
  const [qCorrectIdx, setQCorrectIdx] = useState(0);
  const [qExpl, setQExpl] = useState("");

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const newCourse: Course = {
      id: generateUniqueId("course"),
      title: courseTitle,
      description: courseDesc,
      level: "beginner",
      category: "cs",
      lessons: []
    };
    setCourses([...courses, newCourse]);
    setShowAddCourse(false);
    setCourseTitle("");
    setCourseDesc("");
  };

  const handleAddLesson = async (courseId: string, e: React.FormEvent) => {
    e.preventDefault();
    const newLesson = {
      id: generateUniqueId("lesson"),
      title: lessonTitle,
      duration: lessonDuration,
      videoUrl: lessonVideoUrl.trim() || undefined,
      questions: []
    };
    await addLesson(courseId, newLesson);
    setAddingLessonToCourse(null);
    setLessonTitle("");
    setLessonDuration("");
    setLessonVideoUrl("");
  };

  const handleSaveVideoUrl = async (courseId: string, lessonId: string) => {
    await updateLessonVideoUrl(courseId, lessonId, editingVideoUrl.trim());
    setEditingVideoLesson(null);
    setEditingVideoUrl("");
  };

  const handleAddQuestion = async (courseId: string, lessonId: string, e: React.FormEvent) => {
    e.preventDefault();
    const newQuestion: Question = {
      id: generateUniqueId("q"),
      text: qText,
      options: [qOptA, qOptB, qOptC, qOptD],
      correctIndex: qCorrectIdx,
      explanation: qExpl
    };
    await addQuestion(courseId, lessonId, newQuestion);
    setAddingQuestionToLesson(null);
    setQText(""); setQOptA(""); setQOptB(""); setQOptC(""); setQOptD(""); setQCorrectIdx(0); setQExpl("");
  };

  const cancelQuestion = () => {
    setAddingQuestionToLesson(null);
    setQText(""); setQOptA(""); setQOptB(""); setQOptC(""); setQOptD(""); setQCorrectIdx(0); setQExpl("");
  };

  if (!mounted || isLoading || !profile || (profile.role !== "admin" && profile.role !== "mentor")) {
    return (
      <div className={cn(
        "min-h-screen flex items-center justify-center transition-colors duration-300",
        isDark ? "bg-[#050505]" : "bg-[#f0f4f8]"
      )}>
        <div className={cn(
          "animate-spin rounded-full h-12 w-12 border-b-2",
          isDark ? "border-[#00BFFF]" : "border-[#0088cc]"
        )}></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 transition-colors duration-300 relative overflow-hidden ${isDark ? "bg-[#050505] text-white" : "bg-[#f0f4f8] text-gray-900"}`}>
      {/* ── Background Mesh ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-[10%] -left-[10%] w-[45%] h-[45%] rounded-full opacity-[0.08] animate-blob"
          style={{ background: isDark ? "radial-gradient(circle, rgba(0,191,255,0.35) 0%, transparent 70%)" : "radial-gradient(circle, rgba(0,136,204,0.15) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-[10%] -right-[10%] w-[45%] h-[45%] rounded-full opacity-[0.06] animate-blob"
          style={{ background: isDark ? "radial-gradient(circle, rgba(89,223,255,0.25) 0%, transparent 70%)" : "radial-gradient(circle, rgba(0,163,224,0.12) 0%, transparent 70%)", animationDelay: "3s" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className={cn(
          "flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b pb-6 gap-4",
          isDark ? "border-[rgba(0,191,255,0.15)]" : "border-[rgba(0,136,204,0.15)]"
        )}>
          <div>
            <span className={cn(
              "text-xs font-bold tracking-wider uppercase mb-2 block",
              isDark ? "text-[#59DFFF]" : "text-blue-700"
            )}>
              Портал преподавателя
            </span>
            <h1 className="text-3xl font-black">Мои курсы и материалы</h1>
          </div>
          <button 
            onClick={() => setShowAddCourse(true)}
            className="btn-primary flex items-center px-6 py-3 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5 mr-2" />
            Создать новый курс
          </button>
        </div>

        {/* Форма создания курса */}
        {showAddCourse && (
          <div className={cn(
            "card-premium p-8 mb-8 animate-in fade-in slide-in-from-top-4 border shadow-xl transition-all duration-300",
            isDark ? "bg-[#0a1020]/90 border-[rgba(0,191,255,0.2)]" : "bg-white border-[rgba(0,136,204,0.2)]"
          )}>
            <h2 className="text-xl font-bold mb-6">Создание курса</h2>
            <form onSubmit={handleAddCourse} className="max-w-2xl">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-1">Название курса</label>
                  <input 
                    required 
                    value={courseTitle} 
                    onChange={e=>setCourseTitle(e.target.value)} 
                    type="text" 
                    className={cn(
                      "input-premium w-full px-4 py-3 border rounded-xl outline-none transition-all duration-300",
                      isDark
                        ? "bg-[#050505] border-[rgba(0,191,255,0.2)] text-white focus:border-[#59DFFF]"
                        : "bg-white border-[rgba(0,136,204,0.2)] text-gray-900 focus:border-[#0088cc]"
                    )}
                    placeholder="Например: Продвинутый Python" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-1">Описание</label>
                  <textarea 
                    required 
                    value={courseDesc} 
                    onChange={e=>setCourseDesc(e.target.value)} 
                    rows={3} 
                    className={cn(
                      "input-premium w-full px-4 py-3 border rounded-xl outline-none transition-all duration-300 resize-none",
                      isDark
                        ? "bg-[#050505] border-[rgba(0,191,255,0.2)] text-white focus:border-[#59DFFF]"
                        : "bg-white border-[rgba(0,136,204,0.2)] text-gray-900 focus:border-[#0088cc]"
                    )}
                    placeholder="Чему научатся студенты?" 
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-primary px-6 py-3 font-bold rounded-xl cursor-pointer">Сохранить курс</button>
                  <button 
                    type="button" 
                    onClick={() => setShowAddCourse(false)} 
                    className={cn(
                      "px-6 py-3 font-bold rounded-xl transition-all cursor-pointer border",
                      isDark 
                        ? "bg-white/5 hover:bg-white/10 text-gray-300 border-white/5" 
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-100"
                    )}
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-6">
          {courses.map((course) => {
            const isExpanded = expandedCourseId === course.id;

            return (
              <div 
                key={course.id} 
                className={cn(
                  "card-premium border overflow-hidden transition-all duration-300",
                  isDark ? "bg-[#0a1020]/65 border-[rgba(0,191,255,0.12)]" : "bg-white/70 border-[rgba(0,136,204,0.12)] shadow-sm"
                )}
              >
                {/* Заголовок курса (кнопка развертывания) */}
                <button 
                  onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                  className={cn(
                    "w-full px-6 py-5 flex items-center justify-between transition-colors text-left cursor-pointer",
                    isDark ? "hover:bg-white/5" : "hover:bg-gray-100/30"
                  )}
                >
                  <div>
                    <h3 className="text-xl font-black">{course.title}</h3>
                    <p className={cn("text-sm mt-1 line-clamp-1", isDark ? "text-gray-400" : "text-gray-500")}>{course.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      "text-xs px-3 py-1 rounded-lg font-bold border",
                      isDark 
                        ? "bg-[#050505]/40 border-[rgba(0,191,255,0.1)] text-gray-300" 
                        : "bg-gray-100/70 border-[rgba(0,136,204,0.1)] text-gray-600"
                    )}>
                      Уроков: {course.lessons.length}
                    </span>
                    {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                  </div>
                </button>

                {/* Содержимое курса */}
                {isExpanded && (
                  <div className={cn(
                    "px-6 pb-6 pt-2 border-t",
                    isDark ? "border-[rgba(0,191,255,0.08)]" : "border-gray-150"
                  )}>
                    <div className="space-y-4">
                      {course.lessons.map((lesson, idx) => (
                        <div 
                          key={lesson.id} 
                          className={cn(
                            "rounded-xl border p-4 transition-all duration-300",
                            isDark 
                              ? "bg-neutral-900/40 border-neutral-800/80" 
                              : "bg-gray-50/50 border-gray-200"
                          )}
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-3">
                            <div className="flex items-center">
                              <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3 shrink-0 border",
                                isDark
                                  ? "bg-[#00BFFF]/10 border-[#00BFFF]/20 text-[#59DFFF]"
                                  : "bg-blue-50 border-blue-100 text-blue-700"
                              )}>
                                {idx + 1}
                              </div>
                              <div>
                                <h4 className="font-bold">{lesson.title}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs text-gray-500">{lesson.duration}</span>
                                  {lesson.videoUrl ? (
                                    <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                                      <Video className="w-3 h-3" /> Видео загружено
                                    </span>
                                  ) : (
                                    <span className="text-xs text-amber-500 flex items-center gap-1">
                                      <Video className="w-3 h-3" /> Нет видео
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setEditingVideoLesson({courseId: course.id, lessonId: lesson.id});
                                  setEditingVideoUrl(lesson.videoUrl || "");
                                }}
                                className={cn(
                                  "text-xs font-bold px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer border",
                                  isDark
                                    ? "text-[#59DFFF] bg-[#00BFFF]/10 border-[#00BFFF]/20 hover:border-[#00BFFF]/40"
                                    : "text-blue-700 bg-blue-50 border-blue-100 hover:border-blue-300"
                                )}
                              >
                                <Video className="w-4 h-4" /> Видео
                              </button>
                              <button 
                                onClick={() => setAddingQuestionToLesson({courseId: course.id, lessonId: lesson.id})}
                                className={cn(
                                  "text-xs font-bold px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer border",
                                  isDark
                                    ? "text-[#59DFFF] bg-[#00BFFF]/10 border-[#00BFFF]/20 hover:border-[#00BFFF]/40"
                                    : "text-blue-700 bg-blue-50 border-blue-100 hover:border-blue-300"
                                )}
                              >
                                <Plus className="w-4 h-4" /> Задача
                              </button>
                            </div>
                          </div>

                          {/* Inline video URL editor */}
                          {editingVideoLesson?.lessonId === lesson.id && (
                            <div className={cn(
                              "mb-3 rounded-xl p-4 border transition-all duration-300",
                              isDark 
                                ? "bg-blue-950/20 border-blue-900/30" 
                                : "bg-blue-50 border-blue-100"
                            )}>
                              <p className={cn("text-xs font-bold uppercase tracking-wider mb-2", isDark ? "text-blue-400" : "text-blue-700")}>Ссылка на YouTube Embed</p>
                              <div className="flex gap-2">
                                <div className="relative flex-1">
                                  <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                  <input
                                    autoFocus
                                    value={editingVideoUrl}
                                    onChange={e => setEditingVideoUrl(e.target.value)}
                                    type="url"
                                    className={cn(
                                      "input-premium w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none",
                                      isDark
                                        ? "bg-[#050505] border-[rgba(0,191,255,0.2)] text-white focus:border-[#59DFFF]"
                                        : "bg-white border-[rgba(0,136,204,0.2)] text-gray-900 focus:border-[#0088cc]"
                                    )}
                                    placeholder="https://www.youtube.com/embed/VIDEO_ID"
                                  />
                                </div>
                                <button
                                  onClick={() => handleSaveVideoUrl(course.id, lesson.id)}
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                  <Check className="w-4 h-4" /> Сохранить
                                </button>
                                <button
                                  onClick={() => { setEditingVideoLesson(null); setEditingVideoUrl(""); }}
                                  className={cn(
                                    "px-4 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer border",
                                    isDark 
                                      ? "bg-white/5 hover:bg-white/10 text-gray-300 border-white/5" 
                                      : "bg-gray-150 hover:bg-gray-200 text-gray-700 border-gray-150"
                                  )}
                                >
                                  Отмена
                                </button>
                              </div>
                              <p className="text-[10px] text-gray-500 mt-1.5">Формат: youtube.com/embed/VIDEO_ID (скопируй из «Поделиться → Встроить»)</p>
                            </div>
                          )}

                          {/* Список вопросов */}
                          {lesson.questions && lesson.questions.length > 0 && (
                            <div className="mt-4 pl-0 sm:pl-11 space-y-2">
                              {lesson.questions.map((q, qIdx) => (
                                <div 
                                  key={q.id} 
                                  className={cn(
                                    "text-sm border rounded-lg p-3 flex items-start gap-3 transition-colors duration-300",
                                    isDark 
                                      ? "bg-[#050505]/40 border-[rgba(0,191,255,0.1)]" 
                                      : "bg-white border-gray-200"
                                  )}
                                >
                                  <HelpCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="font-bold">{q.text}</p>
                                    <p className={cn("text-[11px] mt-1 font-medium", isDark ? "text-gray-500" : "text-gray-400")}>
                                      Опций: {q.options.length} | Правильный: {q.options[q.correctIndex]}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Форма добавления вопроса */}
                          {addingQuestionToLesson?.lessonId === lesson.id && (
                            <div className="mt-4 pl-0 sm:pl-11">
                              <form 
                                onSubmit={(e) => handleAddQuestion(course.id, lesson.id, e)} 
                                className={cn(
                                  "border rounded-xl p-5 shadow-sm transition-colors duration-300",
                                  isDark ? "bg-[#050505]/80 border-[rgba(0,191,255,0.15)]" : "bg-white border-gray-200"
                                )}
                              >
                                <h5 className="font-bold mb-4 flex items-center gap-2">
                                  <HelpCircle className="w-4 h-4 text-blue-500" />
                                  Новый тестовый вопрос
                                </h5>
                                
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Текст вопроса</label>
                                    <input 
                                      required 
                                      value={qText} 
                                      onChange={e=>setQText(e.target.value)} 
                                      type="text" 
                                      className={cn(
                                        "input-premium w-full text-sm px-3 py-2 rounded-lg border outline-none",
                                        isDark
                                          ? "bg-[#050505] border-[rgba(0,191,255,0.2)] text-white focus:border-[#59DFFF]"
                                          : "bg-white border-[rgba(0,136,204,0.2)] text-gray-900 focus:border-[#0088cc]"
                                      )}
                                      placeholder="Например: В каком году был основан..." 
                                    />
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[qOptA, qOptB, qOptC, qOptD].map((opt, i) => {
                                      const setters = [setQOptA, setQOptB, setQOptC, setQOptD];
                                      return (
                                        <div key={i} className="relative">
                                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-xs font-bold text-gray-400">{String.fromCharCode(65 + i)}</span>
                                          </div>
                                          <input 
                                            required 
                                            value={opt} 
                                            onChange={e=>setters[i](e.target.value)} 
                                            type="text" 
                                            className={cn(
                                              "input-premium w-full text-sm pl-8 pr-3 py-2 rounded-lg border outline-none",
                                              isDark
                                                ? "bg-[#050505] border-[rgba(0,191,255,0.2)] text-white focus:border-[#59DFFF]"
                                                : "bg-white border-[rgba(0,136,204,0.2)] text-gray-900 focus:border-[#0088cc]"
                                            )}
                                            placeholder={`Вариант ${i+1}`} 
                                          />
                                        </div>
                                      );
                                    })}
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Правильный вариант</label>
                                      <select 
                                        value={qCorrectIdx} 
                                        onChange={e=>setQCorrectIdx(Number(e.target.value))} 
                                        className={cn(
                                          "input-premium w-full text-sm px-3 py-2 rounded-lg border outline-none bg-transparent",
                                          isDark
                                            ? "bg-[#050505] border-[rgba(0,191,255,0.2)] text-white focus:border-[#59DFFF]"
                                            : "bg-white border-[rgba(0,136,204,0.2)] text-gray-900 focus:border-[#0088cc]"
                                        )}
                                      >
                                        <option value={0} className="dark:bg-neutral-900">A ({qOptA || "..."})</option>
                                        <option value={1} className="dark:bg-neutral-900">B ({qOptB || "..."})</option>
                                        <option value={2} className="dark:bg-neutral-900">C ({qOptC || "..."})</option>
                                        <option value={3} className="dark:bg-neutral-900">D ({qOptD || "..."})</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Объяснение после ответа</label>
                                      <input 
                                        required 
                                        value={qExpl} 
                                        onChange={e=>setQExpl(e.target.value)} 
                                        type="text" 
                                        className={cn(
                                          "input-premium w-full text-sm px-3 py-2 rounded-lg border outline-none",
                                          isDark
                                            ? "bg-[#050505] border-[rgba(0,191,255,0.2)] text-white focus:border-[#59DFFF]"
                                            : "bg-white border-[rgba(0,136,204,0.2)] text-gray-900 focus:border-[#0088cc]"
                                        )}
                                        placeholder="Почему именно этот ответ верный?" 
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="flex justify-end gap-2 mt-5">
                                  <button 
                                    type="button" 
                                    onClick={cancelQuestion} 
                                    className={cn(
                                      "px-4 py-2 text-sm font-bold rounded-lg cursor-pointer border",
                                      isDark 
                                        ? "bg-white/5 hover:bg-white/10 text-gray-300 border-white/5" 
                                        : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-100"
                                    )}
                                  >
                                    Отмена
                                  </button>
                                  <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2 cursor-pointer shadow-sm border border-transparent">
                                    <Check className="w-4 h-4" /> Сохранить вопрос
                                  </button>
                                </div>
                              </form>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Форма добавления нового урока */}
                      {addingLessonToCourse === course.id ? (
                        <form 
                          onSubmit={(e) => handleAddLesson(course.id, e)} 
                          className={cn(
                            "border-2 border-dashed rounded-xl p-5 mt-4 transition-colors duration-300",
                            isDark ? "bg-[#050505]/80 border-neutral-700" : "bg-white border-gray-300"
                          )}
                        >
                          <h4 className="font-bold mb-4">Новый урок / уровень</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                            <div className="sm:col-span-2">
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Название урока</label>
                              <input 
                                required 
                                value={lessonTitle} 
                                onChange={e=>setLessonTitle(e.target.value)} 
                                type="text" 
                                className={cn(
                                  "input-premium w-full px-3 py-2 text-sm rounded-lg border outline-none",
                                  isDark
                                    ? "bg-[#050505] border-[rgba(0,191,255,0.2)] text-white focus:border-[#59DFFF]"
                                    : "bg-white border-[rgba(0,136,204,0.2)] text-gray-900 focus:border-[#0088cc]"
                                )}
                                placeholder="Основы..." 
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Продолжительность</label>
                              <input 
                                required 
                                value={lessonDuration} 
                                onChange={e=>setLessonDuration(e.target.value)} 
                                type="text" 
                                className={cn(
                                  "input-premium w-full px-3 py-2 text-sm rounded-lg border outline-none",
                                  isDark
                                    ? "bg-[#050505] border-[rgba(0,191,255,0.2)] text-white focus:border-[#59DFFF]"
                                    : "bg-white border-[rgba(0,136,204,0.2)] text-gray-900 focus:border-[#0088cc]"
                                )}
                                placeholder="15 min" 
                              />
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                              Ссылка на видео (YouTube Embed URL)
                            </label>
                            <div className="relative">
                              <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                value={lessonVideoUrl}
                                onChange={e => setLessonVideoUrl(e.target.value)}
                                type="url"
                                className={cn(
                                  "input-premium w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none",
                                  isDark
                                    ? "bg-[#050505] border-[rgba(0,191,255,0.2)] text-white focus:border-[#59DFFF]"
                                    : "bg-white border-[rgba(0,136,204,0.2)] text-gray-900 focus:border-[#0088cc]"
                                )}
                                placeholder="https://www.youtube.com/embed/VIDEO_ID"
                              />
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1">Используй формат embed: youtube.com/embed/... (не обязательно)</p>
                          </div>
                          <div className="flex gap-2">
                            <button type="submit" className="btn-primary px-4 py-2 text-sm font-bold rounded-lg cursor-pointer">Сохранить</button>
                            <button 
                              type="button" 
                              onClick={() => setAddingLessonToCourse(null)} 
                              className={cn(
                                "px-4 py-2 text-sm font-bold rounded-lg cursor-pointer border",
                                isDark 
                                  ? "bg-white/5 hover:bg-white/10 text-gray-300 border-white/5" 
                                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-100"
                              )}
                            >
                              Отмена
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button 
                          onClick={() => setAddingLessonToCourse(course.id)}
                          className={cn(
                            "w-full py-4 border-2 border-dashed rounded-xl text-sm font-bold flex items-center justify-center transition-all cursor-pointer",
                            isDark 
                              ? "border-neutral-800 text-gray-400 hover:border-[#00BFFF]/40 hover:text-[#00BFFF]" 
                              : "border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600"
                          )}
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          Добавить новый урок (уровень)
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
