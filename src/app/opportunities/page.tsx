"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Search, Filter, Calendar, Bookmark, BookmarkCheck } from "lucide-react";

export default function OpportunitiesPage() {
  const { opportunities, savedOpportunities, toggleSaveOpportunity } = useAppStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredOpps = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          opp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || opp.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Filters */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Каталог возможностей</h1>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Поиск по названию или описанию..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              {["all", "competition", "program", "scholarship"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-6 py-4 rounded-xl font-medium whitespace-nowrap border transition-all ${
                    categoryFilter === cat 
                      ? "bg-gray-900 text-white border-gray-900" 
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {cat === "all" ? "Все" : 
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
              <div key={opp.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
                    {opp.category}
                  </span>
                  <button 
                    onClick={() => toggleSaveOpportunity(opp.id)}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {isSaved ? <BookmarkCheck className="w-6 h-6 text-blue-600" /> : <Bookmark className="w-6 h-6" />}
                  </button>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {opp.title}
                </h3>
                
                <p className="text-gray-600 mb-6 flex-grow line-clamp-3">
                  {opp.description}
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    Дедлайн: <span className="font-semibold text-gray-900 ml-1">{new Date(opp.deadline).toLocaleDateString("ru-RU")}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-600">
                      Класс: {opp.grade}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-600">
                      Формат: {opp.format}
                    </span>
                  </div>
                </div>
                
                <a 
                  href={opp.link}
                  className="block w-full py-3 text-center rounded-xl bg-gray-50 text-gray-900 font-medium hover:bg-gray-900 hover:text-white transition-colors"
                >
                  Узнать больше
                </a>
              </div>
            );
          })}
        </div>

        {filteredOpps.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">По вашему запросу ничего не найдено.</p>
          </div>
        )}
      </div>
    </div>
  );
}
