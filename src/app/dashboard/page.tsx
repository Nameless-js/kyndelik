"use client";

import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, PlayCircle, Star, Calendar, ArrowRight, Sparkles, Trophy, BellRing } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const { 
    profile, 
    user,
    isLoading,
    savedOpportunities, 
    opportunities, 
    enrolledCourses, 
    courses,
    getRecommendedOpportunities,
    getRecommendedCourses
  } = useAppStore();

  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiModel, setAiModel] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [telegramLinked, setTelegramLinked] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isLoading && !profile) {
      router.push("/onboarding");
    } else if (profile) {
      // Fetch AI Recommendation
      const fetchRecommendation = async () => {
        setAiLoading(true);
        try {
          const res = await fetch('/api/ai-assistant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profile, courses, opportunities }),
          });
          const data = await res.json();
          setAiRecommendation(data.recommendation);
          setAiModel(data.model);
        } catch (error) {
          console.error("Failed to fetch AI", error);
        } finally {
          setAiLoading(false);
        }
      };
      fetchRecommendation();
    }
  }, [profile, isLoading, router, courses, opportunities]);

  if (!mounted || isLoading || !profile) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  const savedOppsList = opportunities.filter(o => savedOpportunities.includes(o.id));
  const recommendedOpps = getRecommendedOpportunities().slice(0, 3);
  const recommendedCourses = getRecommendedCourses();

  // Calculate score for leaderboard mock
  const userScore = enrolledCourses.reduce((acc, course) => acc + (course.completedLessons.length * 10), 0);
  
  const leaderboard = [
    { rank: 1, name: "Алихан Д.", score: 350 },
    { rank: 2, name: "Амина К.", score: 320 },
    { rank: 3, name: profile.name, score: userScore, isMe: true },
    { rank: 4, name: "Илья С.", score: userScore > 200 ? 200 : userScore - 10 },
  ].sort((a, b) => b.score - a.score).map((u, i) => ({ ...u, rank: i + 1 }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Profile Section */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Привет, {profile.name}! 👋</h1>
            <p className="text-gray-600 dark:text-gray-400">Твой класс: {profile.grade} • Цель: {profile.goals || "Не указана"}</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            {profile.interests.map(i => (
              <span key={i} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full">
                {i === "business" ? "Бизнес" : i === "stem" ? "STEM" : i}
              </span>
            ))}
          </div>
        </div>

        {/* AI Recommendations Block */}
        <div className="mb-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 shadow-lg text-white relative overflow-hidden">
          <div className="absolute -right-10 -top-10 opacity-10">
            <Sparkles className="w-64 h-64" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                AI-Ассистент Mentoria
                {aiModel && <span className="text-xs px-2 py-1 bg-white/20 rounded-full font-medium tracking-wider uppercase">{aiModel}</span>}
              </h2>
              <div className="text-purple-100 text-lg leading-relaxed min-h-[60px]">
                {aiLoading ? (
                  <div className="flex items-center gap-2 animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="ml-2 text-sm">Нейросеть генерирует персональный план...</span>
                  </div>
                ) : aiRecommendation ? (
                  <p dangerouslySetInnerHTML={{ __html: aiRecommendation.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                ) : (
                  <p>Основываясь на твоем профиле, я подберу идеальный путь. Секундочку...</p>
                )}
              </div>
            </div>
            <button className="shrink-0 px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 mt-4 md:mt-0">
              Построить Roadmap
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Active Courses */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Мои курсы</h2>
                <Link href="/courses" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                  Смотреть все
                </Link>
              </div>
              
              {enrolledCourses.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {enrolledCourses.map(enrolled => {
                    const course = courses.find(c => c.id === enrolled.courseId);
                    if (!course) return null;
                    const progress = Math.round((enrolled.completedLessons.length / course.lessons.length) * 100);
                    
                    return (
                      <Link key={course.id} href={`/courses/${course.id}`} className="block bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <PlayCircle className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{course.title}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{enrolled.completedLessons.length} из {course.lessons.length} уроков</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm text-center">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">У вас пока нет активных курсов.</p>
                  <Link href="/courses" className="inline-block px-6 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium rounded-xl hover:bg-blue-100 transition-colors">
                    Выбрать курс
                  </Link>
                </div>
              )}
            </section>

            {/* Saved Opportunities */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Сохраненные возможности</h2>
                <Link href="/opportunities" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                  Искать еще
                </Link>
              </div>
              
              {savedOppsList.length > 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm divide-y divide-gray-100 dark:divide-gray-800">
                  {savedOppsList.map(opp => (
                    <div key={opp.id} className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                          <Bookmark className="w-5 h-5 text-blue-600 dark:text-blue-400 fill-blue-50 dark:fill-blue-900/20" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white mb-1">{opp.title}</h3>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-3">
                            <span className="flex items-center"><Calendar className="w-3 h-3 mr-1"/> Дедлайн: {new Date(opp.deadline).toLocaleDateString()}</span>
                            <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">{opp.category}</span>
                          </div>
                        </div>
                      </div>
                      <a href={opp.link} className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <ArrowRight className="w-5 h-5" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm text-center">
                  <p className="text-gray-500 dark:text-gray-400">Вы еще не сохранили ни одной возможности.</p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            
            {/* Telegram Notifications */}
            <section className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <BellRing className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">Уведомления</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Получайте напоминания о дедлайнах и новых курсах прямо в Telegram.
              </p>
              {telegramLinked ? (
                <div className="px-4 py-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg text-sm font-medium text-center">
                  Telegram подключен
                </div>
              ) : (
                <button 
                  onClick={() => setTelegramLinked(true)}
                  className="w-full px-4 py-2 bg-[#0088cc] text-white rounded-lg text-sm font-medium hover:bg-[#0077b3] transition-colors"
                >
                  Подключить Telegram Bot
                </button>
              )}
            </section>

            {/* Leaderboard */}
            <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                  Рейтинг
                </h3>
                <span className="text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-md">Эта неделя</span>
              </div>
              <div className="space-y-4">
                {leaderboard.map((user, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-3 rounded-xl ${user.isMe ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/30" : ""}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        user.rank === 1 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400" :
                        user.rank === 2 ? "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300" :
                        user.rank === 3 ? "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400" :
                        "text-gray-500 dark:text-gray-400"
                      }`}>
                        {user.rank}
                      </div>
                      <span className={`text-sm font-medium ${user.isMe ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>
                        {user.name} {user.isMe && "(Вы)"}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{user.score}</span>
                  </div>
                ))}
              </div>
            </section>

          </div>

        </div>
      </div>
    </div>
  );
}
