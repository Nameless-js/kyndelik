"use client";

import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bookmark, PlayCircle, Star, Calendar, ArrowRight,
  Sparkles, Trophy, BellRing, TrendingUp, Clock, CheckCircle2, Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

function StatsCard({ value, label, icon: Icon, isDark }: { value: number | string; label: string; icon: any; isDark: boolean }) {
  return (
    <div className={cn(
      "card-premium p-5 flex items-center gap-4 border transition-colors duration-300",
      isDark ? "border-[rgba(0,191,255,0.12)]" : "border-[rgba(0,136,204,0.12)]"
    )}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-[#00BFFF] to-[#59DFFF] shadow-[0_0_15px_rgba(0,191,255,0.25)]">
        <Icon className="w-6 h-6 text-[#050505] font-black" />
      </div>
      <div>
        <div className={cn("text-2xl font-black", isDark ? "text-white" : "text-gray-900")}>{value}</div>
        <div className={cn("text-xs font-semibold uppercase tracking-wider", isDark ? "text-gray-400" : "text-gray-500")}>{label}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const {
    profile,
    isLoading,
    savedOpportunities,
    opportunities,
    enrolledCourses,
    courses,
  } = useAppStore();

  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiModel, setAiModel] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [telegramLinked, setTelegramLinked] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => { setMounted(true); });
    if (!isLoading && !profile) {
      router.push("/onboarding");
    } else if (profile) {
      const fetchRecommendation = async () => {
        setAiLoading(true);
        try {
          const res = await fetch("/api/ai-assistant", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
    <div className={cn("min-h-screen flex items-center justify-center transition-colors duration-300", isDark ? "bg-[#050505]" : "bg-[#f0f4f8]")}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00BFFF] to-[#59DFFF] animate-pulse shadow-[0_0_20px_rgba(0,191,255,0.4)]" />
          <div className="absolute inset-0 rounded-2xl flex items-center justify-center text-[#050505] font-black text-2xl">M</div>
        </div>
        <div className={cn("text-xs font-bold uppercase tracking-widest animate-pulse mt-2", isDark ? "text-gray-400" : "text-gray-500")}>
          Инициализация кабинета...
        </div>
      </div>
    </div>
  );

  const savedOppsList = opportunities.filter(o => savedOpportunities.includes(o.id));
  const userScore = enrolledCourses.reduce((acc, course) => acc + (course.completedLessons.length * 10), 0);

  const leaderboard = [
    { rank: 1, name: "Алихан Д.", score: 350 },
    { rank: 2, name: "Амина К.", score: 320 },
    { rank: 3, name: profile.name, score: userScore, isMe: true },
    { rank: 4, name: "Илья С.", score: userScore > 200 ? 200 : userScore - 10 },
  ].sort((a, b) => b.score - a.score).map((u, i) => ({ ...u, rank: i + 1 }));

  return (
    <div className={cn("min-h-screen py-10 transition-colors duration-300 relative", isDark ? "bg-[#050505] text-white" : "bg-[#f0f4f8] text-gray-900")}>
      {/* ── Background Mesh ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-[10%] -left-[10%] w-[45%] h-[45%] rounded-full opacity-[0.08] animate-blob"
          style={{ background: isDark ? "radial-gradient(circle, rgba(0,191,255,0.35) 0%, transparent 70%)" : "radial-gradient(circle, rgba(0,136,204,0.12) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-[40%] right-[10%] w-[35%] h-[35%] rounded-full opacity-[0.06] animate-blob"
          style={{ background: isDark ? "radial-gradient(circle, rgba(89,223,255,0.25) 0%, transparent 70%)" : "radial-gradient(circle, rgba(0,163,224,0.08) 0%, transparent 70%)", animationDelay: "4s" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">

        {/* ── Profile Header ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={cn(
            "card-premium p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 overflow-hidden border shadow-lg",
            isDark ? "border-[rgba(0,191,255,0.15)]" : "border-[rgba(0,136,204,0.15)]"
          )}
        >
          <div className={cn("absolute right-0 top-0 w-48 h-48 rounded-bl-full pointer-events-none bg-gradient-to-bl", isDark ? "from-[rgba(0,191,255,0.08)] to-transparent" : "from-[rgba(0,136,204,0.05)] to-transparent")} />

          <div className="flex items-start gap-5 relative">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#00BFFF] to-[#59DFFF] flex items-center justify-center text-[#050505] font-black text-2xl shadow-[0_0_15px_rgba(0,191,255,0.3)] shrink-0">
              {profile.name?.charAt(0) || "U"}
            </div>
            <div>
              <p className={cn("text-xs font-bold uppercase tracking-wider mb-0.5", isDark ? "text-[#00BFFF]" : "text-[#0088cc]")}>Добро пожаловать!</p>
              <h1 className={cn("text-xl sm:text-2xl font-black mb-1", isDark ? "text-white" : "text-gray-900")}>
                {profile.name} 👋
              </h1>
              <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                {profile.grade} класс · {profile.goals || "Цель не указана"}
              </p>
            </div>
          </div>

          <div className="relative flex flex-wrap gap-2">
            {profile.interests.map(i => (
              <span
                key={i}
                className={cn(
                  "px-3.5 py-1.5 border text-xs font-bold rounded-full uppercase tracking-wider",
                  isDark
                    ? "bg-[#00BFFF]/5 border-[rgba(0,191,255,0.25)] text-[#59DFFF]"
                    : "bg-[#0088cc]/5 border-[rgba(0,136,204,0.2)] text-[#0088cc]"
                )}
              >
                {i === "business" ? "🏢 Бизнес" : i === "stem" ? "⚗️ STEM" : `📚 ${i}`}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ── Quick stats ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard value={enrolledCourses.length} label="Активных курсов" icon={PlayCircle} isDark={isDark} />
          <StatsCard value={savedOppsList.length} label="Сохранено" icon={Bookmark} isDark={isDark} />
          <StatsCard value={userScore} label="Очков рейтинга" icon={Trophy} isDark={isDark} />
          <StatsCard
            value={`${enrolledCourses.reduce((a, ec) => a + (ec.completedLessons?.length || 0), 0)}`}
            label="Уроков пройдено"
            icon={CheckCircle2}
            isDark={isDark}
          />
        </div>

        {/* ── AI Assistant ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={cn(
            "relative rounded-2xl overflow-hidden border",
            isDark
              ? "border-[rgba(0,191,255,0.25)] bg-[#0a1020]/80 shadow-[0_0_30px_rgba(0,191,255,0.15)]"
              : "border-[rgba(0,136,204,0.2)] bg-white/80 shadow-[0_4px_24px_rgba(0,136,204,0.1)]"
          )}
        >
          <div className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: isDark
                ? `linear-gradient(rgba(0,191,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,191,255,0.4) 1px, transparent 1px)`
                : `linear-gradient(rgba(0,136,204,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,136,204,0.2) 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
            }}
          />
          <div className={cn("absolute -right-16 -top-16 w-64 h-64 rounded-full blur-3xl pointer-events-none", isDark ? "bg-[#00BFFF]/5" : "bg-[#0088cc]/3")} />

          <div className="relative p-6 sm:p-8 flex flex-col md:flex-row gap-5 items-start md:items-center">
            <div className={cn(
              "w-14 h-14 border rounded-2xl flex items-center justify-center shrink-0 animate-pulse",
              isDark ? "bg-[#00BFFF]/10 border-[rgba(0,191,255,0.3)] shadow-[0_0_15px_rgba(0,191,255,0.15)]" : "bg-[#0088cc]/8 border-[rgba(0,136,204,0.25)]"
            )}>
              <Sparkles className={cn("w-7 h-7", isDark ? "text-[#59DFFF]" : "text-[#0088cc]")} />
            </div>

            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <h2 className={cn("text-lg font-bold tracking-tight", isDark ? "text-white" : "text-gray-900")}>AI-Ассистент Mentoria</h2>
                {aiModel && (
                  <span className={cn(
                    "px-2.5 py-0.5 border rounded-full text-[10px] font-bold uppercase tracking-wider",
                    isDark ? "bg-[rgba(0,191,255,0.1)] border-[rgba(0,191,255,0.25)] text-[#59DFFF]" : "bg-[rgba(0,136,204,0.08)] border-[rgba(0,136,204,0.2)] text-[#0088cc]"
                  )}>
                    {aiModel}
                  </span>
                )}
              </div>
              <div className={cn("text-sm leading-relaxed min-h-[48px]", isDark ? "text-gray-300" : "text-gray-600")}>
                {aiLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div key={i} className={cn("w-2 h-2 rounded-full animate-bounce", isDark ? "bg-[#00BFFF]" : "bg-[#0088cc]")} style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                    <span className={isDark ? "text-gray-400" : "text-gray-500"}>Нейросеть генерирует персональный план...</span>
                  </div>
                ) : aiRecommendation ? (
                  <p
                    className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base"
                    dangerouslySetInnerHTML={{ __html: aiRecommendation.replace(/\*\*(.*?)\*\*/g, `<strong class="${isDark ? "text-[#00BFFF]" : "text-[#0088cc]"}">$1</strong>`) }}
                  />
                ) : (
                  <p className={isDark ? "text-gray-400" : "text-gray-500"}>Основываясь на твоём профиле, подберём идеальный путь...</p>
                )}
              </div>
            </div>

            <button onClick={() => router.push("/roadmap")} className="btn-primary shrink-0 w-full md:w-auto px-6 py-3.5 font-bold rounded-xl text-sm">
              Построить Roadmap →
            </button>
          </div>
        </motion.div>

        {/* ── Main grid ─────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left: Courses + Saved Opportunities */}
          <div className="lg:col-span-2 space-y-6">

            {/* Courses */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className={cn("text-lg font-bold flex items-center gap-2", isDark ? "text-white" : "text-gray-900")}>
                  <PlayCircle className={cn("w-5 h-5", isDark ? "text-[#00BFFF]" : "text-[#0088cc]")} />
                  Мои курсы
                </h2>
                <Link href="/courses" className={cn("text-sm font-semibold hover:underline flex items-center gap-1", isDark ? "text-[#00BFFF]" : "text-[#0088cc]")}>
                  Все <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {enrolledCourses.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {enrolledCourses.map(enrolled => {
                    const course = courses.find(c => c.id === enrolled.courseId);
                    if (!course) return null;
                    const progress = Math.round((enrolled.completedLessons.length / course.lessons.length) * 100);
                    return (
                      <Link
                        key={course.id}
                        href={`/courses/${course.id}`}
                        className={cn("card-premium p-5 group block border transition-all duration-300", isDark ? "border-[rgba(0,191,255,0.12)]" : "border-[rgba(0,136,204,0.12)]")}
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#00BFFF] to-[#59DFFF] rounded-xl flex items-center justify-center text-[#050505] shadow-md group-hover:scale-105 transition-transform shrink-0">
                            <PlayCircle className="w-6 h-6 font-black" />
                          </div>
                          <div>
                            <h3 className={cn("font-bold text-sm mb-1 line-clamp-2 transition-colors", isDark ? "text-white group-hover:text-[#00BFFF]" : "text-gray-900 group-hover:text-[#0088cc]")}>
                              {course.title}
                            </h3>
                            <p className={cn("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>
                              {enrolled.completedLessons.length}/{course.lessons.length} уроков · {progress}%
                            </p>
                          </div>
                        </div>
                        <div className="progress-bar h-1.5">
                          <div className="progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className={cn("card-premium p-8 text-center border", isDark ? "border-[rgba(0,191,255,0.08)]" : "border-[rgba(0,136,204,0.08)]")}>
                  <div className="text-4xl mb-3">📚</div>
                  <p className={cn("mb-4 text-sm", isDark ? "text-gray-400" : "text-gray-500")}>Вы ещё не записаны ни на один курс</p>
                  <Link href="/courses" className="inline-flex items-center gap-2 px-5 py-2.5 btn-secondary text-sm rounded-xl font-semibold">
                    Выбрать курс <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </section>

            {/* Saved Opportunities */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className={cn("text-lg font-bold flex items-center gap-2", isDark ? "text-white" : "text-gray-900")}>
                  <Bookmark className={cn("w-5 h-5", isDark ? "text-[#59DFFF]" : "text-[#0088cc]")} />
                  Сохранённые возможности
                </h2>
                <Link href="/opportunities" className={cn("text-sm font-semibold hover:underline flex items-center gap-1", isDark ? "text-[#00BFFF]" : "text-[#0088cc]")}>
                  Искать <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {savedOppsList.length > 0 ? (
                <div className={cn("card-premium overflow-hidden divide-y border", isDark ? "divide-[rgba(0,191,255,0.12)] border-[rgba(0,191,255,0.12)]" : "divide-[rgba(0,136,204,0.1)] border-[rgba(0,136,204,0.12)]")}>
                  {savedOppsList.map(opp => (
                    <div key={opp.id} className={cn("p-4 flex items-center justify-between transition-colors group", isDark ? "hover:bg-[rgba(0,191,255,0.02)]" : "hover:bg-[rgba(0,136,204,0.02)]")}>
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={cn("mt-1 p-1.5 rounded-lg shrink-0", isDark ? "bg-[#00BFFF]/10" : "bg-[#0088cc]/8")}>
                          <Bookmark className={cn("w-4 h-4", isDark ? "text-[#00BFFF]" : "text-[#0088cc]")} />
                        </div>
                        <div className="min-w-0">
                          <h3 className={cn("font-semibold text-sm mb-0.5 truncate transition-colors", isDark ? "text-white group-hover:text-[#59DFFF]" : "text-gray-900 group-hover:text-[#0088cc]")}>
                            {opp.title}
                          </h3>
                          <div className={cn("flex items-center gap-2 text-xs", isDark ? "text-gray-400" : "text-gray-500")}>
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(opp.deadline).toLocaleDateString("ru-RU")}</span>
                            <span className={cn("w-1 h-1 rounded-full", isDark ? "bg-gray-600" : "bg-gray-400")} />
                            <span className="capitalize">{opp.category}</span>
                          </div>
                        </div>
                      </div>
                      <a href={opp.link} className={cn("ml-3 p-2 rounded-lg transition-all", isDark ? "text-gray-400 hover:text-[#00BFFF] hover:bg-[#00BFFF]/10" : "text-gray-400 hover:text-[#0088cc] hover:bg-[#0088cc]/8")}>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={cn("card-premium p-8 text-center border", isDark ? "border-[rgba(0,191,255,0.08)]" : "border-[rgba(0,136,204,0.08)]")}>
                  <div className="text-4xl mb-3">🔖</div>
                  <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                    Вы ещё не сохранили ни одной возможности
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">

            {/* Telegram */}
            <div className={cn("card-premium p-5 border", isDark ? "border-[rgba(0,191,255,0.15)] shadow-[0_0_20px_rgba(0,191,255,0.03)]" : "border-[rgba(0,136,204,0.15)]")}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00BFFF] to-[#59DFFF] flex items-center justify-center shadow-md">
                  <BellRing className="w-5 h-5 text-[#050505] font-black" />
                </div>
                <h3 className={cn("font-bold text-sm", isDark ? "text-white" : "text-gray-900")}>Уведомления</h3>
              </div>
              <p className={cn("text-xs mb-4 leading-relaxed", isDark ? "text-gray-400" : "text-gray-500")}>
                Получайте напоминания о дедлайнах и новых курсах в Telegram
              </p>
              {telegramLinked ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-green-950/20 border border-green-800/40 text-green-400 rounded-xl text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Telegram подключён
                </div>
              ) : (
                <button
                  onClick={() => setTelegramLinked(true)}
                  className="w-full px-4 py-2.5 bg-[#0088cc] hover:bg-[#0077b3] text-white rounded-xl text-xs font-bold transition-colors shadow-[0_4px_15px_rgba(0,136,204,0.3)] border border-[#0099e6]/20"
                >
                  Подключить Telegram Bot
                </button>
              )}
            </div>

            {/* Leaderboard */}
            <div className={cn("card-premium p-5 border", isDark ? "border-[rgba(0,191,255,0.12)]" : "border-[rgba(0,136,204,0.12)]")}>
              <div className="flex items-center justify-between mb-5">
                <h3 className={cn("font-bold flex items-center gap-2 text-sm", isDark ? "text-white" : "text-gray-900")}>
                  <Trophy className={cn("w-5 h-5", isDark ? "text-[#00BFFF]" : "text-[#0088cc]")} />
                  Рейтинг недели
                </h3>
                <span className="badge-blue">Топ</span>
              </div>
              <div className="space-y-2">
                {leaderboard.map((u, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl transition-colors border",
                      u.isMe
                        ? isDark ? "bg-[#00BFFF]/5 border-[rgba(0,191,255,0.25)] shadow-[0_0_10px_rgba(0,191,255,0.1)]" : "bg-[#0088cc]/5 border-[rgba(0,136,204,0.2)]"
                        : "hover:bg-[rgba(0,191,255,0.02)] border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0",
                        u.rank === 1 ? (isDark ? "bg-[#00BFFF]/20 text-[#00BFFF] border border-[#00BFFF]/30" : "bg-[#0088cc]/10 text-[#0088cc] border border-[#0088cc]/25") :
                        u.rank === 2 ? (isDark ? "bg-white/10 text-white border border-white/20" : "bg-gray-100 text-gray-700 border border-gray-200") :
                        u.rank === 3 ? (isDark ? "bg-white/5 text-gray-300 border border-white/10" : "bg-gray-50 text-gray-600 border border-gray-100") :
                        (isDark ? "bg-white/5 text-gray-500" : "bg-gray-50 text-gray-400")
                      )}>
                        {u.rank === 1 ? "🥇" : u.rank === 2 ? "🥈" : u.rank === 3 ? "🥉" : u.rank}
                      </div>
                      <span className={cn("text-sm font-semibold", u.isMe ? (isDark ? "text-[#59DFFF] font-bold" : "text-[#0088cc] font-bold") : (isDark ? "text-gray-300" : "text-gray-600"))}>
                        {u.name} {u.isMe && <span className={cn("text-xs", isDark ? "text-[#00BFFF]" : "text-[#0088cc]")}>(Вы)</span>}
                      </span>
                    </div>
                    <span className={cn("text-sm font-bold tabular-nums", isDark ? "text-[#00BFFF]" : "text-[#0088cc]")}>{u.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className={cn("card-premium p-5 border", isDark ? "border-[rgba(0,191,255,0.12)]" : "border-[rgba(0,136,204,0.12)]")}>
              <h3 className={cn("font-bold text-sm mb-4 flex items-center gap-2", isDark ? "text-white" : "text-gray-900")}>
                <Zap className={cn("w-4 h-4", isDark ? "text-[#00BFFF]" : "text-[#0088cc]")} />
                Быстрые действия
              </h3>
              <div className="space-y-2">
                {[
                  { href: "/courses", label: "Каталог курсов", icon: PlayCircle },
                  { href: "/opportunities", label: "Возможности", icon: Star },
                  { href: "/roadmap", label: "Дорожная карта", icon: TrendingUp },
                  { href: "/calendar", label: "Дедлайны", icon: Clock },
                ].map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent transition-colors group",
                      isDark ? "hover:bg-[rgba(0,191,255,0.03)] hover:border-[rgba(0,191,255,0.1)]" : "hover:bg-[rgba(0,136,204,0.03)] hover:border-[rgba(0,136,204,0.1)]"
                    )}
                  >
                    <link.icon className={cn("w-4 h-4 shrink-0", isDark ? "text-[#00BFFF]" : "text-[#0088cc]")} />
                    <span className={cn("text-sm font-semibold transition-colors", isDark ? "text-gray-300 group-hover:text-white" : "text-gray-600 group-hover:text-gray-900")}>{link.label}</span>
                    <ArrowRight className={cn("w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity", isDark ? "text-gray-500" : "text-gray-400")} />
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
