"use client";

import { useState } from "react";
import { UploadCloud, Video, FileText, CheckCircle, Plus } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Course } from "@/lib/data";

export default function MentorPortal() {
  const { courses, setCourses } = useAppStore();
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  
  // Quick mock add course
  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: courseTitle,
      description: courseDesc,
      level: "beginner",
      category: "cs",
      lessons: [
        { id: "l1", title: "Вводный урок", duration: "10 min" }
      ]
    };
    setCourses([...courses, newCourse]);
    setShowAddCourse(false);
    setCourseTitle("");
    setCourseDesc("");
  };

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
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Управление уроками</h2>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{course.title}</h3>
                  <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-md font-medium">
                    Уроков: {course.lessons.length}
                  </span>
                </div>
                
                <div className="space-y-3 flex-grow mb-6">
                  {course.lessons.map((lesson, idx) => (
                    <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700/50">
                      <div className="flex items-center">
                        <Video className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{idx + 1}. {lesson.title}</span>
                      </div>
                      <span className="text-xs text-gray-500">{lesson.duration}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-auto border-t border-gray-100 dark:border-gray-800 pt-4">
                  <button className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 flex items-center justify-center transition-colors">
                    <UploadCloud className="w-5 h-5 mr-2" />
                    Загрузить новое видео
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
