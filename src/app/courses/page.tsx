"use client";

import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { PlayCircle, Clock, BarChart } from "lucide-react";

export default function CoursesPage() {
  const { courses, enrolledCourses } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Асинхронные курсы</h1>
          <p className="text-xl text-gray-600">Изучай материалы в своем темпе. Все необходимое для достижения твоих целей.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => {
            const enrolled = enrolledCourses.find(c => c.courseId === course.id);
            const totalLessons = course.lessons.length;
            const completedLessons = enrolled?.completedLessons.length || 0;
            const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

            return (
              <div key={course.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col">
                <div className="h-48 bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center relative">
                  <PlayCircle className="w-16 h-16 text-white/50" />
                  {enrolled && (
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-medium">
                      В процессе
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                      {course.category}
                    </span>
                    <span className="flex items-center text-xs text-gray-500 font-medium">
                      <BarChart className="w-3 h-3 mr-1" />
                      {course.level}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-6 flex-grow">{course.description}</p>
                  
                  {enrolled ? (
                    <div className="mb-6">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-gray-700">Прогресс</span>
                        <span className="font-bold text-blue-600">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center text-sm text-gray-500 mb-6 font-medium">
                      <Clock className="w-4 h-4 mr-2" />
                      {course.lessons.length} уроков
                    </div>
                  )}
                  
                  <Link 
                    href={`/courses/${course.id}`}
                    className={`block w-full py-3 text-center rounded-xl font-medium transition-colors ${
                      enrolled 
                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    {enrolled ? "Продолжить обучение" : "Подробнее"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
