"use client";

import { useAppStore } from "@/lib/store";
import { Opportunity } from "@/lib/data";
import { Calendar as CalendarIcon, Clock, ArrowRight, X, Filter, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CalendarPage() {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <CalendarIcon className="w-8 h-8 mr-3 text-blue-600 dark:text-blue-400" />
              Календарь Дедлайнов
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Следите за важными датами конкурсов и программ.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            {/* Filter */}
            <div className="flex items-center bg-white dark:bg-gray-900 rounded-xl p-1 shadow-sm border border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setFilterType("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === "all" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
              >
                Все
              </button>
              <button
                onClick={() => setFilterType("saved")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${filterType === "saved" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
              >
                ⭐ Сохраненные
              </button>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-900 p-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
              <button onClick={prevMonth} className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-300 font-medium">
                Пред
              </button>
              <span className="font-bold text-gray-900 dark:text-white w-36 text-center">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <button onClick={nextMonth} className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-300 font-medium">
                След
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          {/* Calendar Grid Header */}
          <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
            {WEEK_DAYS.map(day => (
              <div key={day} className="py-4 text-center text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid Body */}
          <div className="grid grid-cols-7 auto-rows-fr">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[140px] p-2 border-r border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-950/30" />
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const deadlines = getDeadlinesForDay(day);
              const filteredDeadlines = deadlines.filter(opp => filterType === "all" || savedOpportunities.includes(opp.id));
              const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();
              const dateObj = new Date(currentYear, currentMonth, day);
              const isPast = dateObj < new Date(new Date().setHours(0,0,0,0));

              return (
                <div key={day} className={`min-h-[140px] p-2 border-r border-b border-gray-100 dark:border-gray-800 transition-colors ${isToday ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/30'}`}>
                  <div className={`text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full mb-2 ${isToday ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'text-gray-700 dark:text-gray-300'}`}>
                    {day}
                  </div>
                  <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1 custom-scrollbar">
                    {filteredDeadlines.map(opp => (
                      <div 
                        key={opp.id} 
                        onClick={() => setSelectedOpp(opp)}
                        className={`text-xs p-2 rounded-lg truncate cursor-pointer transition-all hover:scale-[1.02] shadow-sm border ${
                          isPast 
                            ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 opacity-70'
                            : 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-100 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-300 hover:shadow-md'
                        }`}
                      >
                        {savedOpportunities.includes(opp.id) && "⭐ "}
                        {opp.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming List View */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Ближайшие дедлайны</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities
              .filter(o => new Date(o.deadline) >= new Date(new Date().setHours(0,0,0,0)))
              .filter(o => filterType === "all" || savedOpportunities.includes(o.id))
              .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
              .slice(0, 3)
              .map(opp => (
                <div key={opp.id} className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                  <div className="flex items-center text-red-500 mb-4 text-sm font-bold bg-red-50 dark:bg-red-900/20 w-fit px-3 py-1.5 rounded-lg">
                    <Clock className="w-4 h-4 mr-2" />
                    Осталось {Math.ceil((new Date(opp.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24))} дней
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{opp.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 flex-grow">{opp.description}</p>
                  <button 
                    onClick={() => setSelectedOpp(opp)}
                    className="text-blue-600 dark:text-blue-400 font-bold text-sm flex items-center hover:underline mt-auto w-fit"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-800"
            >
              <div className="p-6 sm:p-8 relative">
                <button 
                  onClick={() => setSelectedOpp(null)} 
                  className="absolute top-6 right-6 p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
                
                <div className="mb-6 pr-10">
                  <span className="inline-flex px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg mb-3">
                    {selectedOpp.category === 'competition' ? 'Конкурс' : selectedOpp.category === 'program' ? 'Программа' : 'Стипендия'}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                    {selectedOpp.title}
                  </h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Описание</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {selectedOpp.description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Дедлайн</h3>
                      <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1.5 text-red-500" />
                        {new Date(selectedOpp.deadline).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Направление</h3>
                      <p className="text-sm font-bold text-gray-900 dark:text-white capitalize">
                        {selectedOpp.field}
                      </p>
                    </div>
                  </div>

                  {selectedOpp.requirements && selectedOpp.requirements.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Требования</h3>
                      <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        {selectedOpp.requirements.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex gap-3">
                  {selectedOpp.link && selectedOpp.link !== "#" ? (
                    <a 
                      href={selectedOpp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/20"
                    >
                      Подать заявку <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  ) : (
                    <button 
                      onClick={() => alert("Ссылка на заявку пока не добавлена организатором.")}
                      className="flex-1 flex items-center justify-center px-6 py-3.5 bg-gray-400 text-white font-bold rounded-xl cursor-not-allowed shadow-sm"
                    >
                      Заявки пока закрыты
                    </button>
                  )}
                  <button 
                    onClick={() => setSelectedOpp(null)}
                    className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-colors"
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
