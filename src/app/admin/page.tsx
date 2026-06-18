"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Opportunity, Course, Question } from "@/lib/data";
import { Plus, LayoutDashboard, Users, BookOpen, Compass, Video, HelpCircle, ChevronDown, ChevronRight, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminPanel() {
  const router = useRouter();
  const { profile, isLoading, opportunities, setOpportunities, courses, setCourses, addLesson, addQuestion, updateLessonVideoUrl } = useAppStore();
  
  const [activeTab, setActiveTab] = useState<"opportunities" | "courses" | "users">("opportunities");
  const [mounted, setMounted] = useState(false);

  // Admin Opp State
  const [showAddOpp, setShowAddOpp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Opportunity["category"]>("competition");
  const [field, setField] = useState<Opportunity["field"]>("business");
  const [deadline, setDeadline] = useState("");
  const [link, setLink] = useState("");

  // Mentor Courses State
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
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

  useEffect(() => {
    setMounted(true);
    if (!isLoading && (!profile || (profile.role !== "admin" && profile.role !== "mentor"))) {
      router.push("/");
    }
  }, [isLoading, profile, router]);

  // Opportunity Handlers
  const handleAddOpp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newOpp = {
      title,
      description,
      category,
      field,
      deadline,
      link,
      format: "online",
      grade: "9-12",
      requirements: []
    };
    
    const { data, error } = await supabase.from('opportunities').insert([newOpp]).select();
    
    if (!error && data) {
      setOpportunities([...opportunities, data[0] as Opportunity]);
      setShowAddOpp(false);
      setTitle("");
      setDescription("");
      setDeadline("");
      setLink("");
    } else {
      console.error("Error inserting opportunity:", error);
      alert("Ошибка при добавлении. Проверьте права доступа.");
    }
    
    setIsSubmitting(false);
  };

  const handleDeleteOpp = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту возможность?")) return;
    setIsDeleting(id);
    
    const { error } = await supabase.from('opportunities').delete().eq('id', id);
    
    if (!error) {
      setOpportunities(opportunities.filter(o => o.id !== id));
    } else {
      console.error("Error deleting opportunity:", error);
      alert("Ошибка при удалении.");
    }
    setIsDeleting(null);
  };

  // Course Handlers
  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const newCourse: Course = {
      id: `course-${Date.now()}`,
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
      id: `lesson-${Date.now()}`,
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
      id: `q-${Date.now()}`,
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white min-h-screen p-6 hidden md:block shrink-0 border-r border-gray-800">
        <h2 className="text-xl font-bold mb-8 flex items-center">
          <LayoutDashboard className="w-6 h-6 mr-2" />
          Панель
        </h2>
        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab("opportunities")} 
            className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "opportunities" ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
          >
            <Compass className="w-5 h-5 mr-3" />
            Возможности
          </button>
          <button 
            onClick={() => setActiveTab("courses")} 
            className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "courses" ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
          >
            <BookOpen className="w-5 h-5 mr-3" />
            Курсы
          </button>
          <button 
            onClick={() => setActiveTab("users")} 
            className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "users" ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
          >
            <Users className="w-5 h-5 mr-3" />
            Пользователи
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        <div className="max-w-5xl mx-auto">

          {/* Mobile Tabs */}
          <div className="md:hidden flex space-x-2 overflow-x-auto pb-4 mb-6 border-b border-gray-200 dark:border-gray-800 no-scrollbar">
            <button 
              onClick={() => setActiveTab("opportunities")} 
              className={`flex-shrink-0 flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === "opportunities" ? "bg-gray-900 dark:bg-gray-800 text-white" : "bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300"}`}
            >
              <Compass className="w-4 h-4 mr-2" />
              Возможности
            </button>
            <button 
              onClick={() => setActiveTab("courses")} 
              className={`flex-shrink-0 flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === "courses" ? "bg-gray-900 dark:bg-gray-800 text-white" : "bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300"}`}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Курсы
            </button>
            <button 
              onClick={() => setActiveTab("users")} 
              className={`flex-shrink-0 flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === "users" ? "bg-gray-900 dark:bg-gray-800 text-white" : "bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300"}`}
            >
              <Users className="w-4 h-4 mr-2" />
              Пользователи
            </button>
          </div>

          {/* OPPORTUNITIES TAB */}
          {activeTab === "opportunities" && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Возможности</h1>
                <button 
                  onClick={() => setShowAddOpp(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Добавить
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
                  <p className="text-gray-500 text-sm font-medium mb-1">Всего возможностей</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{opportunities.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
                  <p className="text-gray-500 text-sm font-medium mb-1">Всего курсов</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{courses.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
                  <p className="text-gray-500 text-sm font-medium mb-1">Активных учеников</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">124</p>
                </div>
              </div>

              {showAddOpp && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 mb-8">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Новая возможность</h2>
                  <form onSubmit={handleAddOpp} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Название</label>
                        <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ссылка</label>
                        <input required type="url" value={link} onChange={e => setLink(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Категория</label>
                        <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-800 dark:text-white">
                          <option value="competition">Конкурс</option>
                          <option value="program">Программа</option>
                          <option value="scholarship">Стипендия</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Направление</label>
                        <select value={field} onChange={e => setField(e.target.value as any)} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-800 dark:text-white">
                          <option value="business">Бизнес</option>
                          <option value="stem">STEM</option>
                          <option value="social">Социальное влияние</option>
                          <option value="finance">Финансы</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Дедлайн</label>
                        <input required type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Описание</label>
                      <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none resize-none dark:text-white" />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                      <button type="button" onClick={() => setShowAddOpp(false)} className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors">
                        Отмена
                      </button>
                      <button disabled={isSubmitting} type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50">
                        {isSubmitting ? "Сохранение..." : "Сохранить"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Название</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Категория</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Дедлайн</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    {opportunities.map(opp => (
                      <tr key={opp.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{opp.title}</div>
                          <div className="text-sm text-gray-500">{opp.field}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                            {opp.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(opp.deadline).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => handleDeleteOpp(opp.id)}
                            disabled={isDeleting === opp.id}
                            className="text-red-600 hover:text-red-900 dark:hover:text-red-400 disabled:opacity-50"
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
          )}

          {/* COURSES TAB */}
          {activeTab === "courses" && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Курсы</h1>
                <button 
                  onClick={() => setShowAddCourse(true)}
                  className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Создать курс
                </button>
              </div>

              {/* Форма создания курса */}
              {showAddCourse && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 mb-8">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Создание курса</h2>
                  <form onSubmit={handleAddCourse} className="max-w-2xl">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Название курса</label>
                        <input required value={courseTitle} onChange={e=>setCourseTitle(e.target.value)} type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 outline-none dark:text-white" placeholder="Например: Продвинутый Python" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Описание</label>
                        <textarea required value={courseDesc} onChange={e=>setCourseDesc(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 outline-none dark:text-white resize-none" placeholder="Чему научатся студенты?" />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button type="submit" className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors">Сохранить курс</button>
                        <button type="button" onClick={() => setShowAddCourse(false)} className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Отмена</button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-6">
                {courses.map((course) => {
                  const isExpanded = expandedCourseId === course.id;

                  return (
                    <div key={course.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                      <button 
                        onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
                      >
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{course.title}</h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{course.description}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm px-3 py-1 rounded-lg font-medium">
                            Уроков: {course.lessons.length}
                          </span>
                          {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-6 pb-6 pt-2 border-t border-gray-100 dark:border-gray-800">
                          <div className="space-y-4">
                            {course.lessons.map((lesson, idx) => (
                              <div key={lesson.id} className="bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm mr-3">
                                      {idx + 1}
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-gray-900 dark:text-white">{lesson.title}</h4>
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
                                      className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                                    >
                                      <Video className="w-4 h-4" /> Видео
                                    </button>
                                    <button 
                                      onClick={() => setAddingQuestionToLesson({courseId: course.id, lessonId: lesson.id})}
                                      className="text-sm font-semibold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                                    >
                                      <Plus className="w-4 h-4" /> Задача
                                    </button>
                                  </div>
                                </div>

                                {editingVideoLesson?.lessonId === lesson.id && (
                                  <div className="mb-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                                    <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-2">Ссылка на YouTube Embed</p>
                                    <div className="flex gap-2">
                                      <div className="relative flex-1">
                                        <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                          autoFocus
                                          value={editingVideoUrl}
                                          onChange={e => setEditingVideoUrl(e.target.value)}
                                          type="url"
                                          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                          placeholder="https://www.youtube.com/embed/VIDEO_ID"
                                        />
                                      </div>
                                      <button
                                        onClick={() => handleSaveVideoUrl(course.id, lesson.id)}
                                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg flex items-center gap-1.5 transition-colors"
                                      >
                                        <Check className="w-4 h-4" /> Сохранить
                                      </button>
                                      <button
                                        onClick={() => { setEditingVideoLesson(null); setEditingVideoUrl(""); }}
                                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-lg transition-colors"
                                      >
                                        Отмена
                                      </button>
                                    </div>
                                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1.5">Формат: youtube.com/embed/VIDEO_ID</p>
                                  </div>
                                )}

                                {lesson.questions && lesson.questions.length > 0 && (
                                  <div className="mt-4 pl-11 space-y-2">
                                    {lesson.questions.map((q) => (
                                      <div key={q.id} className="text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-3 flex items-start gap-3">
                                        <HelpCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                          <p className="font-medium text-gray-800 dark:text-gray-200">{q.text}</p>
                                          <p className="text-xs text-gray-500 mt-1">Опций: {q.options.length} | Правильный: {q.options[q.correctIndex]}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {addingQuestionToLesson?.lessonId === lesson.id && (
                                  <div className="mt-4 pl-11">
                                    <form onSubmit={(e) => handleAddQuestion(course.id, lesson.id, e)} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
                                      <h5 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <HelpCircle className="w-4 h-4 text-purple-600" />
                                        Новый тестовый вопрос
                                      </h5>
                                      
                                      <div className="space-y-4">
                                        <div>
                                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Текст вопроса</label>
                                          <input required value={qText} onChange={e=>setQText(e.target.value)} type="text" className="w-full text-sm px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-purple-500 dark:text-white" placeholder="Например: В каком году был основан..." />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
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
                                                  className="w-full text-sm pl-8 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-purple-500 dark:text-white" 
                                                  placeholder={`Вариант ${i+1}`} 
                                                />
                                              </div>
                                            );
                                          })}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Правильный вариант</label>
                                            <select value={qCorrectIdx} onChange={e=>setQCorrectIdx(Number(e.target.value))} className="w-full text-sm px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-purple-500 dark:text-white">
                                              <option value={0}>A ({qOptA || "..."})</option>
                                              <option value={1}>B ({qOptB || "..."})</option>
                                              <option value={2}>C ({qOptC || "..."})</option>
                                              <option value={3}>D ({qOptD || "..."})</option>
                                            </select>
                                          </div>
                                          <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Объяснение после ответа</label>
                                            <input required value={qExpl} onChange={e=>setQExpl(e.target.value)} type="text" className="w-full text-sm px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-purple-500 dark:text-white" placeholder="Почему именно этот ответ верный?" />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex justify-end gap-2 mt-5">
                                        <button type="button" onClick={cancelQuestion} className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg">Отмена</button>
                                        <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2">
                                          <Check className="w-4 h-4" /> Сохранить вопрос
                                        </button>
                                      </div>
                                    </form>
                                  </div>
                                )}
                              </div>
                            ))}

                            {addingLessonToCourse === course.id ? (
                              <form onSubmit={(e) => handleAddLesson(course.id, e)} className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-5 bg-white dark:bg-gray-900 mt-4">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Новый урок / уровень</h4>
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                  <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Название урока</label>
                                    <input required value={lessonTitle} onChange={e=>setLessonTitle(e.target.value)} type="text" className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-purple-500 dark:text-white" placeholder="Основы..." />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Продолжительность</label>
                                    <input required value={lessonDuration} onChange={e=>setLessonDuration(e.target.value)} type="text" className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-purple-500 dark:text-white" placeholder="15 min" />
                                  </div>
                                </div>
                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Ссылка на видео (YouTube Embed URL)
                                  </label>
                                  <div className="relative">
                                    <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                      value={lessonVideoUrl}
                                      onChange={e => setLessonVideoUrl(e.target.value)}
                                      type="url"
                                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
                                      placeholder="https://www.youtube.com/embed/VIDEO_ID"
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button type="submit" className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors">Сохранить</button>
                                  <button type="button" onClick={() => setAddingLessonToCourse(null)} className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-colors">Отмена</button>
                                </div>
                              </form>
                            ) : (
                              <button 
                                onClick={() => setAddingLessonToCourse(course.id)}
                                className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 flex items-center justify-center transition-colors"
                              >
                                <Plus className="w-5 h-5 mr-2" />
                                Добавить новый урок
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
          )}

          {/* USERS TAB */}
          {activeTab === "users" && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Пользователи</h1>
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 text-center text-gray-500 dark:text-gray-400">
                Модуль управления пользователями находится в разработке.
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
