"use client";

import { useAppStore } from "@/lib/store";
import { CourseCard } from "@/components/ui/course-card";

export default function CoursesPage() {
  const { courses, enrolledCourses } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Асинхронные курсы</h1>
          <p className="text-xl text-gray-500">
            Изучай материалы в своём темпе. Наведи на карточку, чтобы узнать подробности.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => {
            const enrolled = enrolledCourses.find(c => c.courseId === course.id);
            const totalLessons = course.lessons.length;
            const completedLessons = enrolled?.completedLessons.length || 0;
            const progress = totalLessons > 0
              ? Math.round((completedLessons / totalLessons) * 100)
              : 0;

            return (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                description={course.description}
                category={course.category}
                level={course.level}
                lessonCount={course.lessons.length}
                isEnrolled={!!enrolled}
                progress={progress}
              />
            );
          })}
        </div>

      </div>
    </div>
  );
}
