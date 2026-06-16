"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Opportunity } from "@/lib/data";
import { Plus, LayoutDashboard, Users, BookOpen, Compass } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminPanel() {
  const { opportunities, setOpportunities, courses } = useAppStore();
  const [showAddOpp, setShowAddOpp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // New Opp Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Opportunity["category"]>("competition");
  const [field, setField] = useState<Opportunity["field"]>("business");
  const [deadline, setDeadline] = useState("");
  const [link, setLink] = useState("");

  const handleAddOpp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newOpp = {
      title,
      description,
      category,
      field,
      deadline,
      link,
      format: "online",
      grade: "9-12",
      requirements: []
    };
    
    const { data, error } = await supabase.from('opportunities').insert([newOpp]).select();
    
    if (!error && data) {
      // Data contains the generated UUID from Supabase
      setOpportunities([...opportunities, data[0] as Opportunity]);
      setShowAddOpp(false);
      // Reset
      setTitle("");
      setDescription("");
      setDeadline("");
      setLink("");
    } else {
      console.error("Error inserting opportunity:", error);
      alert("Ошибка при добавлении. Проверьте права доступа.");
    }
    
    setIsSubmitting(false);
  };

  const handleDeleteOpp = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту возможность?")) return;
    setIsDeleting(id);
    
    const { error } = await supabase.from('opportunities').delete().eq('id', id);
    
    if (!error) {
      setOpportunities(opportunities.filter(o => o.id !== id));
    } else {
      console.error("Error deleting opportunity:", error);
      alert("Ошибка при удалении.");
    }
    setIsDeleting(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white min-h-screen p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-8 flex items-center">
          <LayoutDashboard className="w-6 h-6 mr-2" />
          Admin
        </h2>
        <nav className="space-y-2">
          <a href="#" className="flex items-center px-4 py-3 bg-gray-800 rounded-xl text-sm font-medium">
            <Compass className="w-5 h-5 mr-3" />
            Возможности
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl text-sm font-medium transition-colors">
            <BookOpen className="w-5 h-5 mr-3" />
            Курсы
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl text-sm font-medium transition-colors">
            <Users className="w-5 h-5 mr-3" />
            Пользователи
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Управление контентом</h1>
            <button 
              onClick={() => setShowAddOpp(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Добавить возможность
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <p className="text-gray-500 text-sm font-medium mb-1">Всего возможностей</p>
              <p className="text-3xl font-bold text-gray-900">{opportunities.length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <p className="text-gray-500 text-sm font-medium mb-1">Всего курсов</p>
              <p className="text-3xl font-bold text-gray-900">{courses.length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <p className="text-gray-500 text-sm font-medium mb-1">Активных учеников</p>
              <p className="text-3xl font-bold text-gray-900">124</p>
            </div>
          </div>

          {showAddOpp && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Новая возможность</h2>
              <form onSubmit={handleAddOpp} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                    <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ссылка</label>
                    <input required type="url" value={link} onChange={e => setLink(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                    <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      <option value="competition">Конкурс</option>
                      <option value="program">Программа</option>
                      <option value="scholarship">Стипендия</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Направление</label>
                    <select value={field} onChange={e => setField(e.target.value as any)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      <option value="business">Бизнес</option>
                      <option value="stem">STEM</option>
                      <option value="social">Социальное влияние</option>
                      <option value="finance">Финансы</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Дедлайн</label>
                    <input required type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                  <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setShowAddOpp(false)} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">
                    Отмена
                  </button>
                  <button disabled={isSubmitting} type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50">
                    {isSubmitting ? "Сохранение..." : "Сохранить"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Название</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Категория</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дедлайн</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {opportunities.map(opp => (
                  <tr key={opp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{opp.title}</div>
                      <div className="text-sm text-gray-500">{opp.field}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {opp.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(opp.deadline).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleDeleteOpp(opp.id)}
                        disabled={isDeleting === opp.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {isDeleting === opp.id ? "Удаление..." : "Удалить"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
