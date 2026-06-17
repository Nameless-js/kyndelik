"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Search, Calendar, Bookmark, BookmarkCheck, X, ExternalLink, Info } from "lucide-react";
import { Opportunity } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function OpportunitiesPage() {
  const router = useRouter();
  const { opportunities, savedOpportunities, toggleSaveOpportunity, user } = useAppStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);

  const filteredOpps = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Filters */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Каталог возможностей</h1>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Поиск по названию или описанию..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-colors"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              {["all", "favorites", "competition", "program", "scholarship"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={cn(
                    "px-6 py-4 rounded-xl font-medium whitespace-nowrap border transition-all",
                    categoryFilter === cat 
                      ? "bg-gray-900 text-white border-gray-900 dark:bg-blue-600 dark:border-blue-600" 
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
                  )}
                >
                  {cat === "all" ? "Все" : 
                   cat === "favorites" ? "Избранные" : 
                   cat === "competition" ? "Конкурсы" : 
                   cat === "program" ? "Программы" : "Стипендии"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpps.map(opp => {
            const isSaved = savedOpportunities.includes(opp.id);
            return (
              <div key={opp.id} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full uppercase tracking-wider">
                    {opp.category}
                  </span>
                  <button 
                    onClick={() => toggleSaveOpportunity(opp.id)}
                    className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title={isSaved ? "Убрать из избранного" : "В избранное"}
                  >
                    {isSaved ? <BookmarkCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" /> : <Bookmark className="w-6 h-6" />}
                  </button>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {opp.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow line-clamp-3">
                  {opp.description}
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    Дедлайн: <span className="font-semibold text-gray-900 dark:text-gray-200 ml-1">{new Date(opp.deadline).toLocaleDateString("ru-RU")}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-medium text-gray-600 dark:text-gray-300">
                      Класс: {opp.grade}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-medium text-gray-600 dark:text-gray-300">
                      Формат: {opp.format}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedOpp(opp)}
                  className="block w-full py-3 text-center rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium hover:bg-gray-900 hover:text-white dark:hover:bg-gray-700 transition-colors"
                >
                  Узнать больше
                </button>
              </div>
            );
          })}
        </div>

        {filteredOpps.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 dark:text-gray-400">По вашему запросу ничего не найдено.</p>
          </div>
        )}
      </div>

      {/* Opportunity Details Modal */}
      <AnimatePresence>
        {selectedOpp && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOpp(null)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full uppercase tracking-wider mb-3">
                      {selectedOpp.category}
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedOpp.title}</h2>
                  </div>
                  <button 
                    onClick={() => setSelectedOpp(null)}
                    className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                      {selectedOpp.description}
                    </p>

                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-5 mb-8">
                      <h4 className="flex items-center text-sm font-bold text-blue-900 dark:text-blue-300 mb-3">
                        <Info className="w-4 h-4 mr-2" />
                        Требования к участникам
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        {Array.isArray(selectedOpp.requirements) && selectedOpp.requirements.length > 0 ? (
                          selectedOpp.requirements.map((req, i) => (
                            <li key={i}>{req}</li>
                          ))
                        ) : (
                          <li>Требования не указаны</li>
                        )}
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                        <span className="text-gray-500 dark:text-gray-400 block mb-1">Формат</span>
                        <span className="font-semibold text-gray-900 dark:text-white capitalize">{selectedOpp.format}</span>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                        <span className="text-gray-500 dark:text-gray-400 block mb-1">Дедлайн</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {new Date(selectedOpp.deadline).toLocaleDateString("ru-RU", { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                        <span className="text-gray-500 dark:text-gray-400 block mb-1">Классы</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{selectedOpp.grade}</span>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                        <span className="text-gray-500 dark:text-gray-400 block mb-1">Сфера</span>
                        <span className="font-semibold text-gray-900 dark:text-white capitalize">{selectedOpp.field}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between gap-4">
                  <button
                    onClick={() => toggleSaveOpportunity(selectedOpp.id)}
                    className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                  >
                    {savedOpportunities.includes(selectedOpp.id) ? (
                      <><BookmarkCheck className="w-5 h-5 mr-2 text-blue-600" /> В избранном</>
                    ) : (
                      <><Bookmark className="w-5 h-5 mr-2" /> Сохранить</>
                    )}
                  </button>
                  {user ? (
                    selectedOpp.link && selectedOpp.link !== "#" ? (
                      <a
                        href={selectedOpp.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
                      >
                        Подать заявку <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    ) : (
                      <button
                        onClick={() => alert("Ссылка на заявку пока не добавлена организатором.")}
                        className="flex-1 flex items-center justify-center px-6 py-3 bg-gray-400 text-white text-sm font-bold rounded-xl shadow-sm cursor-not-allowed"
                      >
                        Заявки пока закрыты
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => router.push("/onboarding")}
                      className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
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
