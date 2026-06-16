"use client";

import { useAppStore } from "@/lib/store";
import { Calendar as CalendarIcon, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CalendarPage() {
  const { opportunities, savedOpportunities } = useAppStore();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <CalendarIcon className="w-8 h-8 mr-3 text-blue-600" />
              Календарь Дедлайнов
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Следите за важными датами конкурсов и программ.</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4 bg-white dark:bg-gray-900 p-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <button onClick={prevMonth} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-300">
              Пред
            </button>
            <span className="font-bold text-gray-900 dark:text-white w-32 text-center">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button onClick={nextMonth} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-300">
              След
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          {/* Calendar Grid Header */}
          <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800">
            {["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"].map(day => (
              <div key={day} className="py-3 text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid Body */}
          <div className="grid grid-cols-7 auto-rows-fr">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[120px] p-2 border-r border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50" />
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const deadlines = getDeadlinesForDay(day);
              const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();

              return (
                <div key={day} className={`min-h-[120px] p-2 border-r border-b border-gray-100 dark:border-gray-800 transition-colors ${isToday ? 'bg-blue-50 dark:bg-blue-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
                  <div className={`text-sm font-semibold w-8 h-8 flex items-center justify-center rounded-full mb-2 ${isToday ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {deadlines.map(opp => (
                      <div key={opp.id} className="text-xs p-1.5 rounded-md bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-300 truncate cursor-pointer group relative">
                        {savedOpportunities.includes(opp.id) && "⭐ "}
                        {opp.title}
                        {/* Tooltip */}
                        <div className="absolute z-10 hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-normal">
                          <p className="font-bold mb-1">{opp.title}</p>
                          <p className="text-gray-300">{opp.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming List View */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Ближайшие дедлайны</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities
              .filter(o => new Date(o.deadline) >= new Date())
              .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
              .slice(0, 3)
              .map(opp => (
                <div key={opp.id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
                  <div className="flex items-center text-red-500 mb-3 text-sm font-bold">
                    <Clock className="w-4 h-4 mr-2" />
                    Осталось {Math.ceil((new Date(opp.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24))} дней
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{opp.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 flex-grow">{opp.description}</p>
                  <Link href="/opportunities" className="text-blue-600 dark:text-blue-400 font-medium text-sm flex items-center hover:underline mt-auto">
                    Смотреть детали <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
