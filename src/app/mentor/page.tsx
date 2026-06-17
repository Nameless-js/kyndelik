"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Video, Plus, HelpCircle, ChevronDown, ChevronRight, Check } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Course, Question } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function MentorPortal() {
  const router = useRouter();
  const { profile, isLoading, courses, setCourses, addLesson, addQuestion } = useAppStore();
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
      questions: []
    };
    await addLesson(courseId, newLesson);
    setAddingLessonToCourse(null);
    setLessonTitle("");
    setLessonDuration("");
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-end mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">
          <div>
            <span className="text-sm font-bold tracking-wider uppercase text-purple-600 dark:text-purple-400 mb-2 block">
              Портал преподавателя
            </span>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Мои курсы и материалы</h1>
          </div>
          <button 
            onClick={() => setShowAddCourse(true)}
            className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5 mr-2" />
            Создать новый курс
          </button>
        </div>

        {/* Форма создания курса */}
        {showAddCourse && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 mb-8 animate-in fade-in slide-in-from-top-4">
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
                {/* Заголовок курса (кнопка развертывания) */}
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

                {/* Содержимое курса */}
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
                                <span className="text-xs text-gray-500">{lesson.duration}</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => setAddingQuestionToLesson({courseId: course.id, lessonId: lesson.id})}
                              className="text-sm font-semibold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                            >
                              <Plus className="w-4 h-4" /> Добавить задачу
                            </button>
                          </div>

                          {/* Список вопросов */}
                          {lesson.questions && lesson.questions.length > 0 && (
                            <div className="mt-4 pl-11 space-y-2">
                              {lesson.questions.map((q, qIdx) => (
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

                          {/* Форма добавления вопроса */}
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
                                    <input required value={qText} onChange={e=>setQText(e.target.value)} type="text" className="w-full text-sm px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-purple-500" placeholder="Например: В каком году был основан..." />
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
                                            className="w-full text-sm pl-8 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-purple-500" 
                                            placeholder={`Вариант ${i+1}`} 
                                          />
                                        </div>
                                      );
                                    })}
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Правильный вариант</label>
                                      <select value={qCorrectIdx} onChange={e=>setQCorrectIdx(Number(e.target.value))} className="w-full text-sm px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-purple-500">
                                        <option value={0}>A ({qOptA || "..."})</option>
                                        <option value={1}>B ({qOptB || "..."})</option>
                                        <option value={2}>C ({qOptC || "..."})</option>
                                        <option value={3}>D ({qOptD || "..."})</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Объяснение после ответа</label>
                                      <input required value={qExpl} onChange={e=>setQExpl(e.target.value)} type="text" className="w-full text-sm px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-purple-500" placeholder="Почему именно этот ответ верный?" />
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

                      {/* Форма добавления нового урока */}
                      {addingLessonToCourse === course.id ? (
                        <form onSubmit={(e) => handleAddLesson(course.id, e)} className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-5 bg-white dark:bg-gray-900 mt-4">
                          <h4 className="font-bold text-gray-900 dark:text-white mb-4">Новый урок / уровень</h4>
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="col-span-2">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Название урока</label>
                              <input required value={lessonTitle} onChange={e=>setLessonTitle(e.target.value)} type="text" className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-purple-500" placeholder="Основы..." />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Продолжительность</label>
                              <input required value={lessonDuration} onChange={e=>setLessonDuration(e.target.value)} type="text" className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-purple-500" placeholder="15 min" />
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
