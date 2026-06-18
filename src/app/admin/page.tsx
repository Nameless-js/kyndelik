"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Opportunity, Course, Question } from "@/lib/data";
import {
  Plus, LayoutDashboard, Users, BookOpen, Compass,
  Video, HelpCircle, ChevronDown, ChevronRight, Check,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export default function AdminPanel() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const {
    profile, isLoading,
    opportunities, setOpportunities,
    courses, setCourses,
    addLesson, addQuestion, updateLessonVideoUrl,
  } = useAppStore();

  const [mounted, setMounted] = useState(false);

  // ── Opportunity state ────────────────────────────────────────────────────────
  const [showAddOpp, setShowAddOpp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Opportunity["category"]>("competition");
  const [field, setField] = useState<Opportunity["field"]>("business");
  const [deadline, setDeadline] = useState("");
  const [link, setLink] = useState("");

  // ── Course state ─────────────────────────────────────────────────────────────
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  // ── Lesson state ─────────────────────────────────────────────────────────────
  const [addingLessonToCourse, setAddingLessonToCourse] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDuration, setLessonDuration] = useState("");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");

  // ── Video URL edit state ─────────────────────────────────────────────────────
  const [editingVideoLesson, setEditingVideoLesson] = useState<{ courseId: string; lessonId: string } | null>(null);
  const [editingVideoUrl, setEditingVideoUrl] = useState("");

  // ── Question state ───────────────────────────────────────────────────────────
  const [addingQuestionToLesson, setAddingQuestionToLesson] = useState<{ courseId: string; lessonId: string } | null>(null);
  const [qText, setQText] = useState("");
  const [qOptA, setQOptA] = useState("");
  const [qOptB, setQOptB] = useState("");
  const [qOptC, setQOptC] = useState("");
  const [qOptD, setQOptD] = useState("");
  const [qCorrectIdx, setQCorrectIdx] = useState(0);
  const [qExpl, setQExpl] = useState("");

  useEffect(() => {
    Promise.resolve().then(() => setMounted(true));
    if (!isLoading && (!profile || (profile.role !== "admin" && profile.role !== "mentor"))) {
      router.push("/");
    }
  }, [isLoading, profile, router]);

  // ── Opportunity handlers ─────────────────────────────────────────────────────
  const handleAddOpp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newOpp = { title, description, category, field, deadline, link, format: "online", grade: "9-12", requirements: [] };
    const { data, error } = await supabase.from("opportunities").insert([newOpp]).select();
    if (!error && data) {
      setOpportunities([...opportunities, data[0] as Opportunity]);
      setShowAddOpp(false);
      setTitle(""); setDescription(""); setDeadline(""); setLink("");
    } else {
      console.error("Error inserting opportunity:", error);
      alert("Ошибка при добавлении. Проверьте права доступа.");
    }
    setIsSubmitting(false);
  };

  const handleDeleteOpp = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту возможность?")) return;
    setIsDeleting(id);
    const { error } = await supabase.from("opportunities").delete().eq("id", id);
    if (!error) {
      setOpportunities(opportunities.filter((o) => o.id !== id));
    } else {
      console.error("Error deleting opportunity:", error);
      alert("Ошибка при удалении.");
    }
    setIsDeleting(null);
  };

  // ── Course handlers ──────────────────────────────────────────────────────────
  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: courseTitle,
      description: courseDesc,
      level: "beginner",
      category: "cs",
      lessons: [],
    };
    setCourses([...courses, newCourse]);
    setShowAddCourse(false);
    setCourseTitle(""); setCourseDesc("");
  };

  const handleAddLesson = async (courseId: string, e: React.FormEvent) => {
    e.preventDefault();
    const newLesson = {
      id: `lesson-${Date.now()}`,
      title: lessonTitle,
      duration: lessonDuration,
      videoUrl: lessonVideoUrl.trim() || undefined,
      questions: [],
    };
    await addLesson(courseId, newLesson);
    setAddingLessonToCourse(null);
    setLessonTitle(""); setLessonDuration(""); setLessonVideoUrl("");
  };

  const handleSaveVideoUrl = async (courseId: string, lessonId: string) => {
    await updateLessonVideoUrl(courseId, lessonId, editingVideoUrl.trim());
    setEditingVideoLesson(null);
    setEditingVideoUrl("");
  };

  const handleAddQuestion = async (courseId: string, lessonId: string, e: React.FormEvent) => {
    e.preventDefault();
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      text: qText,
      options: [qOptA, qOptB, qOptC, qOptD],
      correctIndex: qCorrectIdx,
      explanation: qExpl,
    };
    await addQuestion(courseId, lessonId, newQuestion);
    setAddingQuestionToLesson(null);
    setQText(""); setQOptA(""); setQOptB(""); setQOptC(""); setQOptD(""); setQCorrectIdx(0); setQExpl("");
  };

  const cancelQuestion = () => {
    setAddingQuestionToLesson(null);
    setQText(""); setQOptA(""); setQOptB(""); setQOptC(""); setQOptD(""); setQCorrectIdx(0); setQExpl("");
  };

  // ── Shared input class ───────────────────────────────────────────────────────
  const inputCls = cn(
    "w-full px-4 py-2.5 rounded-lg border outline-none transition-all duration-300 bg-transparent",
    isDark
      ? "bg-[#050505] border-[rgba(0,191,255,0.25)] text-white focus:border-[#59DFFF] placeholder:text-gray-600"
      : "bg-white border-[rgba(0,136,204,0.25)] text-gray-900 focus:border-[#0088cc] placeholder:text-gray-400"
  );

  // ── Loading / access guard ───────────────────────────────────────────────────
  if (!mounted || isLoading || !profile || (profile.role !== "admin" && profile.role !== "mentor")) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", isDark ? "bg-[#050505]" : "bg-[#f0f4f8]")}>
        <div className={cn("animate-spin rounded-full h-12 w-12 border-b-2", isDark ? "border-[#00BFFF]" : "border-[#0088cc]")} />
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen flex transition-colors duration-300", isDark ? "bg-[#050505] text-white" : "bg-[#f0f4f8] text-gray-900")}>

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <div className={cn(
        "w-64 min-h-screen p-6 hidden md:flex flex-col border-r transition-all duration-300",
        isDark ? "bg-[#0a1020]/90 border-[rgba(0,191,255,0.15)]" : "bg-white border-gray-200"
      )}>
        <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
          <LayoutDashboard className={cn("w-6 h-6", isDark ? "text-[#00BFFF]" : "text-[#0088cc]")} />
          Панель Admin
        </h2>
        <nav className="space-y-1">
          {[
            { label: "Возможности", icon: Compass },
            { label: "Курсы", icon: BookOpen },
            { label: "Пользователи", icon: Users },
          ].map(({ label, icon: Icon }, i) => (
            <a
              key={label}
              href="#"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                i === 0
                  ? isDark ? "bg-white/8 text-[#59DFFF]" : "bg-blue-50 text-blue-700"
                  : isDark ? "text-gray-400 hover:bg-white/5 hover:text-white" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="w-5 h-5" />
              {label}
            </a>
          ))}
        </nav>
      </div>

      {/* ── Main Content ────────────────────────────────────────────────────── */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto relative">

        {/* Background blob */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div
            className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full opacity-[0.06] animate-blob"
            style={{ background: isDark ? "radial-gradient(circle, rgba(0,191,255,0.4) 0%, transparent 70%)" : "radial-gradient(circle, rgba(0,136,204,0.2) 0%, transparent 70%)" }}
          />
        </div>

        <div className="max-w-5xl mx-auto relative z-10 space-y-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-black">Управление контентом</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddCourse(true)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all",
                  isDark ? "border-[rgba(0,191,255,0.3)] text-[#00BFFF] hover:bg-[rgba(0,191,255,0.08)]" : "border-[rgba(0,136,204,0.3)] text-[#0088cc] hover:bg-[rgba(0,136,204,0.06)]"
                )}
              >
                <Plus className="w-4 h-4" /> Добавить курс
              </button>
              <button
                onClick={() => setShowAddOpp(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#00BFFF] to-[#59DFFF] hover:opacity-90 shadow-lg shadow-[#00BFFF]/20 transition-all"
              >
                <Plus className="w-4 h-4" /> Добавить возможность
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Возможностей", val: opportunities.length },
              { label: "Курсов", val: courses.length },
              { label: "Учеников", val: 124 },
            ].map(({ label, val }) => (
              <div
                key={label}
                className={cn(
                  "p-6 rounded-2xl border transition-all duration-300",
                  isDark ? "bg-[#0a1020]/65 border-[rgba(0,191,255,0.12)]" : "bg-white border-gray-200 shadow-sm"
                )}
              >
                <p className={cn("text-xs font-bold uppercase tracking-wider mb-1", isDark ? "text-gray-400" : "text-gray-500")}>{label}</p>
                <p className="text-3xl font-black">{val}</p>
              </div>
            ))}
          </div>

          {/* ── Add Course Form ────────────────────────────────────────────── */}
          {showAddCourse && (
            <div className={cn("rounded-2xl border p-6 shadow-lg", isDark ? "bg-[#0a1020]/95 border-[rgba(0,191,255,0.2)]" : "bg-white border-gray-200")}>
              <h2 className="text-xl font-bold mb-5">Новый курс</h2>
              <form onSubmit={handleAddCourse} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Название курса</label>
                  <input required value={courseTitle} onChange={e => setCourseTitle(e.target.value)} className={inputCls} placeholder="Введите название" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Описание</label>
                  <textarea required value={courseDesc} onChange={e => setCourseDesc(e.target.value)} rows={3} className={cn(inputCls, "resize-none")} placeholder="Краткое описание курса" />
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowAddCourse(false)} className={cn("px-4 py-2 rounded-lg font-bold text-sm border transition-all", isDark ? "border-white/10 text-gray-400 hover:bg-white/5" : "border-gray-200 text-gray-600 hover:bg-gray-50")}>
                    Отмена
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-lg font-bold text-sm text-white bg-gradient-to-r from-[#00BFFF] to-[#59DFFF] hover:opacity-90 transition-all">
                    Создать курс
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── Courses List ───────────────────────────────────────────────── */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold">Курсы</h2>
            {courses.map(course => (
              <div
                key={course.id}
                className={cn("rounded-2xl border overflow-hidden transition-all duration-300", isDark ? "bg-[#0a1020]/65 border-[rgba(0,191,255,0.12)]" : "bg-white border-gray-200 shadow-sm")}
              >
                {/* Course header */}
                <button
                  onClick={() => setExpandedCourseId(expandedCourseId === course.id ? null : course.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <div>
                    <p className="font-bold">{course.title}</p>
                    <p className={cn("text-xs mt-0.5", isDark ? "text-gray-400" : "text-gray-500")}>{course.lessons.length} уроков</p>
                  </div>
                  {expandedCourseId === course.id
                    ? <ChevronDown className="w-5 h-5 text-[#00BFFF]" />
                    : <ChevronRight className={cn("w-5 h-5", isDark ? "text-gray-500" : "text-gray-400")} />
                  }
                </button>

                {/* Expanded: lessons */}
                {expandedCourseId === course.id && (
                  <div className={cn("border-t px-5 py-4 space-y-3", isDark ? "border-[rgba(0,191,255,0.1)]" : "border-gray-100")}>
                    {course.lessons.map(lesson => (
                      <div
                        key={lesson.id}
                        className={cn("rounded-xl p-4 border", isDark ? "bg-[#050505]/60 border-[rgba(0,191,255,0.08)]" : "bg-gray-50 border-gray-100")}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm">{lesson.title}</p>
                            <p className={cn("text-xs mt-0.5", isDark ? "text-gray-500" : "text-gray-400")}>{lesson.duration}</p>

                            {/* Video URL display / edit */}
                            {editingVideoLesson?.courseId === course.id && editingVideoLesson?.lessonId === lesson.id ? (
                              <div className="mt-2 flex gap-2">
                                <input
                                  value={editingVideoUrl}
                                  onChange={e => setEditingVideoUrl(e.target.value)}
                                  placeholder="YouTube embed URL..."
                                  className={cn(inputCls, "text-xs py-1.5 flex-1")}
                                />
                                <button onClick={() => handleSaveVideoUrl(course.id, lesson.id)} className="px-3 py-1.5 rounded-lg bg-[#00BFFF] text-white text-xs font-bold hover:opacity-90">
                                  <Check className="w-4 h-4" />
                                </button>
                                <button onClick={() => { setEditingVideoLesson(null); setEditingVideoUrl(""); }} className={cn("px-3 py-1.5 rounded-lg text-xs font-bold border", isDark ? "border-white/10 text-gray-400" : "border-gray-200 text-gray-500")}>
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => { setEditingVideoLesson({ courseId: course.id, lessonId: lesson.id }); setEditingVideoUrl(lesson.videoUrl || ""); }}
                                className={cn("mt-2 flex items-center gap-1.5 text-xs font-semibold transition-colors", isDark ? "text-gray-500 hover:text-[#00BFFF]" : "text-gray-400 hover:text-[#0088cc]")}
                              >
                                <Video className="w-3.5 h-3.5" />
                                {lesson.videoUrl ? "Изменить видео" : "Добавить видео"}
                              </button>
                            )}
                          </div>

                          {/* Question count */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <HelpCircle className={cn("w-4 h-4", isDark ? "text-gray-600" : "text-gray-400")} />
                            <span className="text-xs font-bold">{lesson.questions?.length ?? 0}</span>
                          </div>
                        </div>

                        {/* Add question */}
                        {addingQuestionToLesson?.courseId === course.id && addingQuestionToLesson?.lessonId === lesson.id ? (
                          <form onSubmit={e => handleAddQuestion(course.id, lesson.id, e)} className="mt-3 space-y-3">
                            <input required value={qText} onChange={e => setQText(e.target.value)} placeholder="Текст вопроса" className={cn(inputCls, "text-sm")} />
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { val: qOptA, set: setQOptA, label: "A" },
                                { val: qOptB, set: setQOptB, label: "B" },
                                { val: qOptC, set: setQOptC, label: "C" },
                                { val: qOptD, set: setQOptD, label: "D" },
                              ].map(({ val, set, label }) => (
                                <input key={label} required value={val} onChange={e => set(e.target.value)} placeholder={`Вариант ${label}`} className={cn(inputCls, "text-sm")} />
                              ))}
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Правильный:</label>
                              {["A", "B", "C", "D"].map((l, i) => (
                                <button
                                  key={l}
                                  type="button"
                                  onClick={() => setQCorrectIdx(i)}
                                  className={cn("w-8 h-8 rounded-lg text-xs font-bold border transition-all", qCorrectIdx === i ? "bg-[#00BFFF] text-white border-[#00BFFF]" : isDark ? "border-white/10 text-gray-400 hover:border-[#00BFFF]/50" : "border-gray-200 text-gray-500 hover:border-[#0088cc]/50")}
                                >
                                  {l}
                                </button>
                              ))}
                            </div>
                            <input value={qExpl} onChange={e => setQExpl(e.target.value)} placeholder="Объяснение (необязательно)" className={cn(inputCls, "text-sm")} />
                            <div className="flex gap-2">
                              <button type="submit" className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-[#00BFFF] to-[#59DFFF] hover:opacity-90">
                                Сохранить вопрос
                              </button>
                              <button type="button" onClick={cancelQuestion} className={cn("px-4 py-2 rounded-lg text-sm font-bold border transition-all", isDark ? "border-white/10 text-gray-400" : "border-gray-200 text-gray-500")}>
                                Отмена
                              </button>
                            </div>
                          </form>
                        ) : (
                          <button
                            onClick={() => setAddingQuestionToLesson({ courseId: course.id, lessonId: lesson.id })}
                            className={cn("mt-3 flex items-center gap-1.5 text-xs font-semibold transition-colors", isDark ? "text-gray-500 hover:text-[#00BFFF]" : "text-gray-400 hover:text-[#0088cc]")}
                          >
                            <Plus className="w-3.5 h-3.5" /> Добавить вопрос
                          </button>
                        )}
                      </div>
                    ))}

                    {/* Add lesson */}
                    {addingLessonToCourse === course.id ? (
                      <form onSubmit={e => handleAddLesson(course.id, e)} className="space-y-3">
                        <input required value={lessonTitle} onChange={e => setLessonTitle(e.target.value)} placeholder="Название урока" className={inputCls} />
                        <div className="grid grid-cols-2 gap-3">
                          <input required value={lessonDuration} onChange={e => setLessonDuration(e.target.value)} placeholder="Длительность (15 min)" className={inputCls} />
                          <input value={lessonVideoUrl} onChange={e => setLessonVideoUrl(e.target.value)} placeholder="Video URL (необязательно)" className={inputCls} />
                        </div>
                        <div className="flex gap-2">
                          <button type="submit" className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-[#00BFFF] to-[#59DFFF] hover:opacity-90">
                            Добавить урок
                          </button>
                          <button type="button" onClick={() => setAddingLessonToCourse(null)} className={cn("px-4 py-2 rounded-lg text-sm font-bold border transition-all", isDark ? "border-white/10 text-gray-400" : "border-gray-200 text-gray-500")}>
                            Отмена
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button
                        onClick={() => setAddingLessonToCourse(course.id)}
                        className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all", isDark ? "border-[rgba(0,191,255,0.2)] text-[#00BFFF] hover:bg-[rgba(0,191,255,0.06)]" : "border-[rgba(0,136,204,0.2)] text-[#0088cc] hover:bg-[rgba(0,136,204,0.04)]")}
                      >
                        <Plus className="w-4 h-4" /> Добавить урок
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
            {courses.length === 0 && (
              <p className={cn("text-sm", isDark ? "text-gray-500" : "text-gray-400")}>Курсов пока нет. Нажмите «Добавить курс».</p>
            )}
          </div>

          {/* ── Add Opportunity Form ───────────────────────────────────────── */}
          {showAddOpp && (
            <div className={cn("rounded-2xl border p-6 shadow-lg", isDark ? "bg-[#0a1020]/95 border-[rgba(0,191,255,0.2)]" : "bg-white border-gray-200")}>
              <h2 className="text-xl font-bold mb-5">Новая возможность</h2>
              <form onSubmit={handleAddOpp} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Название</label>
                    <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Ссылка</label>
                    <input required type="url" value={link} onChange={e => setLink(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Категория</label>
                    <select value={category} onChange={e => setCategory(e.target.value as Opportunity["category"])} className={cn(inputCls, "cursor-pointer")}>
                      <option value="competition">Конкурс</option>
                      <option value="program">Программа</option>
                      <option value="scholarship">Стипендия</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Направление</label>
                    <select value={field} onChange={e => setField(e.target.value as Opportunity["field"])} className={cn(inputCls, "cursor-pointer")}>
                      <option value="business">Бизнес</option>
                      <option value="stem">STEM</option>
                      <option value="social">Социальное влияние</option>
                      <option value="finance">Финансы</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Дедлайн</label>
                    <input required type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Описание</label>
                  <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3} className={cn(inputCls, "resize-none")} />
                </div>
                <div className="flex justify-end gap-3 mt-2">
                  <button type="button" onClick={() => setShowAddOpp(false)} className={cn("px-4 py-2.5 rounded-lg font-bold text-sm border transition-all", isDark ? "border-white/10 text-gray-400 hover:bg-white/5" : "border-gray-200 text-gray-600 hover:bg-gray-50")}>
                    Отмена
                  </button>
                  <button disabled={isSubmitting} type="submit" className="px-4 py-2.5 rounded-lg font-bold text-sm text-white bg-gradient-to-r from-[#00BFFF] to-[#59DFFF] hover:opacity-90 transition-all disabled:opacity-50">
                    {isSubmitting ? "Сохранение..." : "Сохранить"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── Opportunities table ────────────────────────────────────────── */}
          <div>
            <h2 className="text-lg font-bold mb-3">Возможности</h2>
            <div className={cn("rounded-2xl border overflow-hidden transition-all duration-300", isDark ? "bg-[#0a1020]/65 border-[rgba(0,191,255,0.12)]" : "bg-white border-gray-200 shadow-sm")}>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className={isDark ? "bg-[#050505]/40" : "bg-gray-50"}>
                    <tr>
                      {["Название", "Категория", "Дедлайн", "Действия"].map((h, i) => (
                        <th key={h} className={cn("px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-500", i === 3 ? "text-right" : "text-left")}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className={cn("divide-y", isDark ? "divide-[rgba(0,191,255,0.06)]" : "divide-gray-100")}>
                    {opportunities.length === 0 ? (
                      <tr>
                        <td colSpan={4} className={cn("px-6 py-8 text-center text-sm", isDark ? "text-gray-500" : "text-gray-400")}>
                          Нет возможностей. Добавьте первую.
                        </td>
                      </tr>
                    ) : opportunities.map(opp => (
                      <tr key={opp.id} className={cn("transition-colors", isDark ? "hover:bg-white/[0.02]" : "hover:bg-gray-50")}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold">{opp.title}</div>
                          <div className={cn("text-xs uppercase tracking-wider mt-0.5", isDark ? "text-gray-500" : "text-gray-400")}>{opp.field}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={cn("px-2.5 py-1 text-xs font-bold rounded-full border", isDark ? "bg-[#00BFFF]/10 border-[#00BFFF]/20 text-[#59DFFF]" : "bg-blue-50 border-blue-100 text-blue-700")}>
                            {opp.category}
                          </span>
                        </td>
                        <td className={cn("px-6 py-4 whitespace-nowrap text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                          {new Date(opp.deadline).toLocaleDateString("ru-RU")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleDeleteOpp(opp.id)}
                            disabled={isDeleting === opp.id}
                            className="text-red-500 hover:text-red-400 disabled:opacity-40 text-sm font-bold transition-colors"
                          >
                            {isDeleting === opp.id ? "Удаление..." : "Удалить"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
