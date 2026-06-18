"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Search, Calendar, Bookmark, BookmarkCheck, X, ExternalLink, Info, Filter } from "lucide-react";
import { Opportunity } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";

const categoryConfig: Record<string, { label: string; color: string; dot: string }> = {
  all:         { label: "Все",        color: "text-gray-300",  dot: "bg-gray-400" },
  favorites:   { label: "Избранные",  color: "text-amber-400", dot: "bg-amber-400" },
  competition: { label: "Конкурсы",   color: "text-[#00BFFF]",  dot: "bg-[#00BFFF]" },
  program:     { label: "Программы",  color: "text-[#59DFFF]", dot: "bg-[#59DFFF]" },
  scholarship: { label: "Стипендии",  color: "text-[#00BFFF]", dot: "bg-[#00BFFF]" },
};

const badgeMap: Record<string, string> = {
  competition: "badge-blue",
  program:     "badge-purple",
  scholarship: "badge-cyan",
};

export default function OpportunitiesPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { opportunities, savedOpportunities, toggleSaveOpportunity, user } = useAppStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);

  const filteredOpps = opportunities.filter(opp => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesCategory = true;
    if (categoryFilter === "favorites") {
      matchesCategory = savedOpportunities.includes(opp.id);
    } else if (categoryFilter !== "all") {
      matchesCategory = opp.category === categoryFilter;
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`min-h-screen py-12 transition-colors duration-300 relative ${isDark ? "bg-[#050505] text-white" : "bg-[#f0f4f8] text-gray-900"}`}>
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

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="mb-10">
          <div className={cn(
            "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm border",
            isDark ? "bg-[#00BFFF]/5 border-[rgba(0,191,255,0.25)] text-[#59DFFF]" : "bg-[#0088cc]/5 border-[rgba(0,136,204,0.2)] text-[#0088cc]"
          )}>
            <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_6px_#00BFFF]", isDark ? "bg-[#00BFFF]" : "bg-[#0088cc]")} />
            Каталог
          </div>
          <h1 className={`text-3xl sm:text-4xl font-black mb-2 leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>
            Возможности
          </h1>
          <p className={isDark ? "text-gray-400" : "text-gray-500"}>
            {filteredOpps.length} программ найдено · Найди своё идеальное направление
          </p>
        </div>

        {/* ── Search & Filters ────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Поиск по названию или описанию..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                "input-premium w-full pl-12 pr-4 py-4 border outline-none transition-all duration-300",
                isDark
                  ? "text-white bg-[#0a1020]/70 border-[rgba(0,191,255,0.15)] focus:border-[#59DFFF]"
                  : "text-gray-900 bg-white/70 border-[rgba(0,136,204,0.15)] focus:border-[#0088cc]"
              )}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1.5 hide-scrollbar">
            {Object.entries(categoryConfig).map(([cat, cfg]) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold whitespace-nowrap border transition-all duration-300 text-sm cursor-pointer",
                  categoryFilter === cat
                    ? isDark
                      ? "bg-gradient-to-r from-[#00BFFF] to-[#008fbf] text-[#050505] border-transparent shadow-[0_0_15px_rgba(0,191,255,0.25)]"
                      : "bg-gradient-to-r from-[#0088cc] to-[#0077b6] text-white border-transparent shadow-[0_0_12px_rgba(0,136,204,0.2)]"
                    : isDark
                      ? "bg-[#0a1020]/60 text-gray-400 border-[rgba(0,191,255,0.12)] hover:border-[#00BFFF]/40 hover:text-white"
                      : "bg-white/75 text-gray-500 border-[rgba(0,136,204,0.12)] hover:border-[#0088cc]/40 hover:text-gray-950"
                )}
              >
                <span className={cn("w-2 h-2 rounded-full shrink-0", categoryFilter === cat ? (isDark ? "bg-[#050505]" : "bg-white") : cfg.dot)} />
                {cfg.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Grid ────────────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOpps.map((opp, idx) => {
            const isSaved = savedOpportunities.includes(opp.id);
            const badge = badgeMap[opp.category] || "badge-blue";
            return (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.35 }}
                className={cn(
                  "card-premium p-6 flex flex-col h-full group border transition-all duration-300",
                  isDark ? "bg-[#0a1020]/65 border-[rgba(0,191,255,0.12)]" : "bg-white/70 border-[rgba(0,136,204,0.12)]"
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={badge}>{opp.category}</span>
                  <button
                    onClick={() => toggleSaveOpportunity(opp.id)}
                    className={cn(
                      "p-1.5 rounded-lg transition-all cursor-pointer",
                      isSaved
                        ? isDark
                          ? "text-[#00BFFF] bg-[#00BFFF]/10 border border-[#00BFFF]/20"
                          : "text-[#0088cc] bg-[#0088cc]/10 border border-[#0088cc]/20"
                        : "text-gray-500 hover:text-[#00BFFF] dark:hover:text-[#00BFFF] hover:bg-gray-100 dark:hover:bg-[#00BFFF]/5"
                    )}
                    title={isSaved ? "Убрать из избранного" : "В избранное"}
                  >
                    {isSaved
                      ? <BookmarkCheck className={cn("w-5 h-5", isDark ? "shadow-[0_0_8px_rgba(0,191,255,0.2)] text-[#00BFFF]" : "text-[#0088cc]")} />
                      : <Bookmark className="w-5 h-5" />
                    }
                  </button>
                </div>

                <h3 className={cn(
                  "text-lg font-bold mb-2 transition-colors duration-300 line-clamp-2",
                  isDark ? "text-white group-hover:text-[#00BFFF]" : "text-gray-900 group-hover:text-[#0088cc]"
                )}>
                  {opp.title}
                </h3>

                <p className={cn(
                  "mb-5 flex-grow line-clamp-3 text-sm leading-relaxed transition-colors duration-300",
                  isDark ? "text-gray-400 group-hover:text-gray-200" : "text-gray-500 group-hover:text-gray-700"
                )}>
                  {opp.description}
                </p>

                <div className={cn(
                  "space-y-2.5 mb-5 border-t pt-4",
                  isDark ? "border-[rgba(0,191,255,0.08)]" : "border-[rgba(0,136,204,0.08)]"
                )}>
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className={cn("w-4 h-4 mr-2 shrink-0", isDark ? "text-[#00BFFF]" : "text-[#0088cc]")} />
                    <span className={isDark ? "text-gray-400" : "text-gray-500"}>Дедлайн:</span>
                    <span className={cn("font-bold ml-1.5", isDark ? "text-white" : "text-gray-900")}>
                      {new Date(opp.deadline).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={cn(
                      "px-2.5 py-1 border rounded-lg text-xs font-bold",
                      isDark ? "bg-[#050505]/40 border-[rgba(0,191,255,0.1)] text-gray-300" : "bg-gray-100/50 border-[rgba(0,136,204,0.12)] text-gray-600"
                    )}>
                      Класс: {opp.grade}
                    </span>
                    <span className={cn(
                      "px-2.5 py-1 border rounded-lg text-xs font-bold",
                      isDark ? "bg-[#050505]/40 border-[rgba(0,191,255,0.1)] text-gray-300" : "bg-gray-100/50 border-[rgba(0,136,204,0.12)] text-gray-600"
                    )}>
                      {opp.format}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedOpp(opp)}
                  className={cn(
                    "block w-full py-3 text-center rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer border",
                    isDark
                      ? "bg-[rgba(0,191,255,0.06)] border-[rgba(0,191,255,0.25)] text-[#00BFFF] hover:bg-[#00BFFF] hover:text-[#050505] shadow-[0_0_10px_rgba(0,191,255,0.05)]"
                      : "bg-[rgba(0,136,204,0.06)] border-[rgba(0,136,204,0.25)] text-[#0088cc] hover:bg-[#0088cc] hover:text-white shadow-[0_0_8px_rgba(0,136,204,0.05)]"
                  )}
                >
                  Узнать больше →
                </button>
              </motion.div>
            );
          })}
        </div>

        {filteredOpps.length === 0 && (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <p className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
              Ничего не найдено
            </p>
            <p className={isDark ? "text-gray-500" : "text-gray-400"}>
              Попробуйте изменить запрос или фильтры
            </p>
          </div>
        )}
      </div>

      {/* ── Details Modal ── */}
      <AnimatePresence>
        {selectedOpp && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOpp(null)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className={cn(
                "w-full max-w-2xl rounded-3xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh] border transition-all duration-300",
                isDark
                  ? "bg-[#0a1020]/90 backdrop-blur-2xl border-[rgba(0,191,255,0.2)] shadow-[0_0_50px_rgba(0,191,255,0.25)]"
                  : "bg-white/95 backdrop-blur-2xl border-[rgba(0,136,204,0.2)] shadow-2xl"
              )}>

                {/* Header */}
                <div className={cn(
                  "flex items-start justify-between p-6 border-b",
                  isDark ? "border-[rgba(0,191,255,0.12)]" : "border-[rgba(0,136,204,0.12)]"
                )}>
                  <div>
                    <span className={cn(badgeMap[selectedOpp.category] || "badge-blue", "mb-3 inline-block")}>
                      {selectedOpp.category}
                    </span>
                    <h2 className={cn("text-xl sm:text-2xl font-black leading-tight", isDark ? "text-white" : "text-gray-900")}>
                      {selectedOpp.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedOpp(null)}
                    className={cn(
                      "ml-4 p-2 rounded-xl transition-all shrink-0 cursor-pointer",
                      isDark ? "text-gray-500 hover:text-white hover:bg-white/5" : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1">
                  <p className={cn("leading-relaxed mb-6 text-sm sm:text-base", isDark ? "text-gray-300" : "text-gray-600")}>
                    {selectedOpp.description}
                  </p>

                  <div className={cn(
                    "border rounded-2xl p-5 mb-6",
                    isDark
                      ? "bg-[#00BFFF]/5 border-[rgba(0,191,255,0.25)]"
                      : "bg-[#0088cc]/5 border-[rgba(0,136,204,0.25)]"
                  )}>
                    <h4 className={cn(
                      "flex items-center text-sm font-black mb-3 uppercase tracking-wider",
                      isDark ? "text-[#00BFFF]" : "text-[#0088cc]"
                    )}>
                      <Info className="w-4 h-4 mr-2" />
                      Требования к участникам
                    </h4>
                    <ul className="list-none space-y-2">
                      {Array.isArray(selectedOpp.requirements) && selectedOpp.requirements.length > 0
                        ? selectedOpp.requirements.map((req, i) => (
                          <li key={i} className={cn("flex items-start gap-2.5 text-sm", isDark ? "text-gray-300" : "text-gray-600")}>
                            <span className={cn("mt-1.5 w-1.5 h-1.5 rounded-full shrink-0", isDark ? "bg-[#00BFFF]" : "bg-[#0088cc]")} />
                            {req}
                          </li>
                        ))
                        : <li className="text-sm text-gray-500">Требования не указаны</li>
                      }
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Формат", val: selectedOpp.format },
                      { label: "Дедлайн", val: new Date(selectedOpp.deadline).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }) },
                      { label: "Классы", val: selectedOpp.grade },
                      { label: "Сфера", val: selectedOpp.field },
                    ].map(({ label, val }) => (
                      <div key={label} className={cn(
                        "border p-4 rounded-xl",
                        isDark ? "bg-[#050505]/40 border-[rgba(0,191,255,0.1)]" : "bg-gray-50 border-[rgba(0,136,204,0.1)]"
                      )}>
                        <span className="text-[10px] text-gray-500 block mb-1 font-bold uppercase tracking-wider">{label}</span>
                        <span className={cn("font-bold text-sm sm:text-base capitalize", isDark ? "text-white" : "text-gray-900")}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className={cn(
                  "p-5 border-t flex items-center justify-between gap-3",
                  isDark ? "border-[rgba(0,191,255,0.12)]" : "border-[rgba(0,136,204,0.12)]"
                )}>
                  <button
                    onClick={() => toggleSaveOpportunity(selectedOpp.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer",
                      isDark
                        ? "text-[#00BFFF] hover:bg-[#00BFFF]/10 border-[rgba(0,191,255,0.25)] bg-[rgba(0,191,255,0.04)]"
                        : "text-[#0088cc] hover:bg-[#0088cc]/10 border-[rgba(0,136,204,0.25)] bg-[rgba(0,136,204,0.04)]"
                    )}
                  >
                    {savedOpportunities.includes(selectedOpp.id)
                      ? <><BookmarkCheck className={cn("w-4 h-4 shadow-sm", isDark ? "text-[#00BFFF]" : "text-[#0088cc]")} /> В избранном</>
                      : <><Bookmark className="w-4 h-4" /> Сохранить</>
                    }
                  </button>

                  {user ? (
                    selectedOpp.link && selectedOpp.link !== "#" ? (
                      <a
                        href={selectedOpp.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary flex-1 flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold"
                      >
                        Подать заявку <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    ) : (
                      <button className={cn(
                        "flex-1 flex items-center justify-center px-6 py-3 text-sm font-bold rounded-xl cursor-not-allowed border",
                        isDark ? "bg-white/5 text-gray-500 border-white/5" : "bg-gray-100 text-gray-400 border-gray-100"
                      )}>
                        Заявки закрыты
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => router.push("/onboarding")}
                      className="btn-primary flex-1 flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold"
                    >
                      Войти, чтобы подать заявку <ExternalLink className="w-4 h-4 ml-2" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
