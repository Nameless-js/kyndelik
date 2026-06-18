"use client";

import { useAppStore } from "@/lib/store";
import { Opportunity } from "@/lib/data";
import { Calendar as CalendarIcon, Clock, ArrowRight, X, Filter, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export default function CalendarPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { opportunities, savedOpportunities } = useAppStore();
  
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  const [filterType, setFilterType] = useState<"all" | "saved">("all");
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const rawFirstDay = new Date(currentYear, currentMonth, 1).getDay();
  // Adjust so Monday is 0, Sunday is 6
  const firstDayOfMonth = (rawFirstDay + 6) % 7;

  // Get deadlines for this month
  const getDeadlinesForDay = (day: number) => {
    return opportunities.filter(opp => {
      const d = new Date(opp.deadline);
      return d.getDate() === day && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  const WEEK_DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

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
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black flex items-center">
              <CalendarIcon className={cn("w-8 h-8 mr-3", isDark ? "text-[#00BFFF] drop-shadow-[0_0_10px_rgba(0,191,255,0.25)]" : "text-[#0088cc]")} />
              Календарь Дедлайнов
            </h1>
            <p className={cn("mt-2", isDark ? "text-gray-400" : "text-gray-500")}>Следите за важными датами конкурсов и программ.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            {/* Filter */}
            <div className={cn(
              "flex items-center rounded-xl p-1 shadow-sm border",
              isDark ? "bg-[#0a1020]/80 border-[rgba(0,191,255,0.15)]" : "bg-white border-[rgba(0,136,204,0.15)]"
            )}>
              <button
                onClick={() => setFilterType("all")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                  filterType === "all"
                    ? isDark
                      ? "bg-[#00BFFF]/10 text-[#59DFFF]"
                      : "bg-[#0088cc]/10 text-[#0077b6]"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Все
              </button>
              <button
                onClick={() => setFilterType("saved")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  filterType === "saved"
                    ? isDark
                      ? "bg-[#00BFFF]/10 text-[#59DFFF]"
                      : "bg-[#0088cc]/10 text-[#0077b6]"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                ⭐ Сохраненные
              </button>
            </div>

            {/* Controls */}
            <div className={cn(
              "flex items-center space-x-2 p-2 rounded-xl shadow-sm border",
              isDark ? "bg-[#0a1020]/80 border-[rgba(0,191,255,0.15)]" : "bg-white border-[rgba(0,136,204,0.15)]"
            )}>
              <button 
                onClick={prevMonth} 
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-colors font-bold text-xs cursor-pointer",
                  isDark ? "hover:bg-white/5 text-gray-300" : "hover:bg-gray-100 text-gray-700"
                )}
              >
                Пред
              </button>
              <span className="font-bold w-36 text-center text-sm uppercase tracking-wider">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <button 
                onClick={nextMonth} 
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-colors font-bold text-xs cursor-pointer",
                  isDark ? "hover:bg-white/5 text-gray-300" : "hover:bg-gray-100 text-gray-700"
                )}
              >
                След
              </button>
            </div>
          </div>
        </div>

        <div className={cn(
          "card-premium overflow-hidden transition-all duration-300",
          isDark ? "bg-[#0a1020]/65 border-[rgba(0,191,255,0.12)]" : "bg-white/75 border-[rgba(0,136,204,0.12)]"
        )}>
          {/* Calendar Grid Header */}
          <div className={cn(
            "grid grid-cols-7 border-b",
            isDark ? "border-[rgba(0,191,255,0.1)] bg-[#050505]/30" : "border-[rgba(0,136,204,0.1)] bg-gray-50/50"
          )}>
            {WEEK_DAYS.map(day => (
              <div key={day} className="py-4 text-center text-xs font-black text-gray-500 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid Body */}
          <div className="grid grid-cols-7 auto-rows-fr">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div 
                key={`empty-${i}`} 
                className={cn(
                  "min-h-[60px] md:min-h-[140px] p-1 md:p-2 border-r border-b",
                  isDark ? "border-[rgba(0,191,255,0.06)] bg-[#050505]/10" : "border-gray-100 bg-gray-100/10"
                )} 
              />
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const deadlines = getDeadlinesForDay(day);
              const filteredDeadlines = deadlines.filter(opp => filterType === "all" || savedOpportunities.includes(opp.id));
              const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();
              const dateObj = new Date(currentYear, currentMonth, day);
              const isPast = dateObj < new Date(new Date().setHours(0,0,0,0));

              return (
                <div 
                  key={day} 
                  className={cn(
                    "min-h-[60px] md:min-h-[140px] p-1 md:p-2 border-r border-b transition-colors",
                    isDark ? "border-[rgba(0,191,255,0.06)]" : "border-gray-100",
                    isToday 
                      ? isDark ? 'bg-[#00BFFF]/5' : 'bg-[#0088cc]/5' 
                      : 'hover:bg-gray-100/10 dark:hover:bg-white/5'
                  )}
                >
                  <div className={cn(
                    "text-xs md:text-sm font-bold w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full mb-1 md:mb-2 transition-all",
                    isToday 
                      ? isDark
                        ? 'bg-[#00BFFF] text-[#050505] shadow-[0_0_10px_rgba(0,191,255,0.4)]'
                        : 'bg-[#0088cc] text-white shadow-md'
                      : isDark ? 'text-gray-300' : 'text-gray-700'
                  )}>
                    {day}
                  </div>
                  <div className="space-y-1 max-h-[80px] overflow-y-auto pr-1 custom-scrollbar hidden sm:block">
                    {filteredDeadlines.map(opp => (
                      <div 
                        key={opp.id} 
                        onClick={() => setSelectedOpp(opp)}
                        className={cn(
                          "text-[10px] md:text-xs p-1.5 rounded-lg truncate cursor-pointer transition-all hover:scale-[1.02] shadow-sm border font-medium",
                          isPast 
                            ? isDark
                              ? 'bg-neutral-900/40 border-neutral-800 text-neutral-500 opacity-60'
                              : 'bg-gray-50 border-gray-200 text-gray-400 opacity-70'
                            : isDark
                              ? 'bg-[#00BFFF]/10 border-[#00BFFF]/20 text-[#59DFFF] hover:border-[#00BFFF]/40'
                              : 'bg-blue-50 border-blue-100 text-blue-700 hover:border-blue-300'
                        )}
                      >
                        {savedOpportunities.includes(opp.id) && "⭐ "}
                        {opp.title}
                      </div>
                    ))}
                  </div>
                  {/* Mobile: just show dot if there are events */}
                  {filteredDeadlines.length > 0 && (
                    <div className="sm:hidden flex flex-wrap gap-0.5 mt-1">
                      {filteredDeadlines.slice(0, 2).map(opp => (
                        <button
                          key={opp.id}
                          onClick={() => setSelectedOpp(opp)}
                          className={cn(
                            "w-2 h-2 rounded-full",
                            isPast ? 'bg-gray-400' : isDark ? 'bg-[#00BFFF]' : 'bg-blue-600'
                          )}
                          title={opp.title}
                        />
                      ))}
                      {filteredDeadlines.length > 2 && (
                        <span className="text-blue-500 text-xs leading-none">+{filteredDeadlines.length - 2}</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming List View */}
        <div className="mt-10 md:mt-16">
          <h2 className="text-xl md:text-2xl font-black mb-6">Ближайшие дедлайны</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {opportunities
              .filter(o => new Date(o.deadline) >= new Date(new Date().setHours(0,0,0,0)))
              .filter(o => filterType === "all" || savedOpportunities.includes(o.id))
              .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
              .slice(0, 3)
              .map(opp => (
                <div 
                  key={opp.id} 
                  className={cn(
                    "card-premium p-6 rounded-3xl border shadow-sm flex flex-col hover:shadow-md transition-all duration-300",
                    isDark ? "bg-[#0a1020]/65 border-[rgba(0,191,255,0.12)]" : "bg-white/70 border-[rgba(0,136,204,0.12)]"
                  )}
                >
                  <div className={cn(
                    "flex items-center mb-4 text-xs font-bold w-fit px-3 py-1.5 rounded-lg border",
                    isDark
                      ? "text-red-400 bg-red-950/20 border-red-900/30"
                      : "text-red-700 bg-red-50 border-red-100"
                  )}>
                    <Clock className="w-4 h-4 mr-2" />
                    Осталось {Math.ceil((new Date(opp.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24))} дней
                  </div>
                  <h3 className={cn("text-lg font-black mb-2", isDark ? "text-white" : "text-gray-900")}>{opp.title}</h3>
                  <p className={cn("text-sm mb-6 line-clamp-2 flex-grow", isDark ? "text-gray-400" : "text-gray-500")}>{opp.description}</p>
                  <button 
                    onClick={() => setSelectedOpp(opp)}
                    className={cn(
                      "font-bold text-sm flex items-center hover:underline mt-auto w-fit cursor-pointer",
                      isDark ? "text-[#00BFFF]" : "text-[#0088cc]"
                    )}
                  >
                    Смотреть детали <ArrowRight className="w-4 h-4 ml-1.5" />
                  </button>
                </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedOpp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={cn(
                "w-full max-w-lg rounded-3xl overflow-hidden border shadow-2xl transition-all duration-300",
                isDark 
                  ? "bg-[#0a1020]/95 border-[rgba(0,191,255,0.2)]" 
                  : "bg-white border-[rgba(0,136,204,0.18)]"
              )}
            >
              <div className="p-6 sm:p-8 relative">
                <button 
                  onClick={() => setSelectedOpp(null)} 
                  className={cn(
                    "absolute top-6 right-6 p-2 rounded-full transition-colors cursor-pointer",
                    isDark ? "bg-white/5 hover:bg-white/10 text-gray-400" : "bg-gray-100 hover:bg-gray-200 text-gray-500"
                  )}
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="mb-6 pr-10">
                  <span className={cn(
                    "inline-flex px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg mb-3 border",
                    isDark
                      ? "text-[#59DFFF] bg-[#00BFFF]/10 border-[#00BFFF]/20"
                      : "text-blue-700 bg-blue-100/50 border-blue-200"
                  )}>
                    {selectedOpp.category === 'competition' ? 'Конкурс' : selectedOpp.category === 'program' ? 'Программа' : 'Стипендия'}
                  </span>
                  <h2 className={cn("text-xl sm:text-2xl font-black leading-tight", isDark ? "text-white" : "text-gray-900")}>
                    {selectedOpp.title}
                  </h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Описание</h3>
                    <p className={cn("text-sm leading-relaxed", isDark ? "text-gray-300" : "text-gray-600")}>
                      {selectedOpp.description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className={cn(
                      "p-4 rounded-2xl border",
                      isDark ? "bg-[#050505]/40 border-[rgba(0,191,255,0.1)]" : "bg-gray-50 border-[rgba(0,136,204,0.1)]"
                    )}>
                      <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Дедлайн</h3>
                      <p className={cn("text-sm font-bold flex items-center", isDark ? "text-white" : "text-gray-900")}>
                        <CalendarIcon className="w-4 h-4 mr-1.5 text-red-500" />
                        {new Date(selectedOpp.deadline).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <div className={cn(
                      "p-4 rounded-2xl border",
                      isDark ? "bg-[#050505]/40 border-[rgba(0,191,255,0.1)]" : "bg-gray-50 border-[rgba(0,136,204,0.1)]"
                    )}>
                      <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Направление</h3>
                      <p className={cn("text-sm font-bold capitalize", isDark ? "text-white" : "text-gray-900")}>
                        {selectedOpp.field}
                      </p>
                    </div>
                  </div>

                  {selectedOpp.requirements && selectedOpp.requirements.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Требования</h3>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {selectedOpp.requirements.map((req, i) => (
                          <li key={i} className={isDark ? "text-gray-300" : "text-gray-600"}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className={cn(
                  "mt-8 pt-6 border-t flex gap-3",
                  isDark ? "border-[rgba(0,191,255,0.1)]" : "border-gray-150"
                )}>
                  {selectedOpp.link && selectedOpp.link !== "#" ? (
                    <a 
                      href={selectedOpp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 btn-primary flex items-center justify-center px-6 py-3.5 text-white font-bold rounded-xl transition-all shadow-lg"
                    >
                      Подать заявку <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  ) : (
                    <button 
                      onClick={() => alert("Ссылка на заявку пока не добавлена организатором.")}
                      className="flex-1 flex items-center justify-center px-6 py-3.5 bg-gray-400 text-white font-bold rounded-xl cursor-not-allowed shadow-sm border border-transparent"
                    >
                      Заявки пока закрыты
                    </button>
                  )}
                  <button 
                    onClick={() => setSelectedOpp(null)}
                    className={cn(
                      "px-6 py-3.5 font-bold rounded-xl transition-colors cursor-pointer border",
                      isDark 
                        ? "bg-white/5 hover:bg-white/10 text-gray-300 border-white/5" 
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-100"
                    )}
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
      `}} />
    </div>
  );
}
