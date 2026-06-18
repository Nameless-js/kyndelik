"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Opportunity } from "@/lib/data";
import { Plus, LayoutDashboard, Users, BookOpen, Compass } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export default function AdminPanel() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { profile, isLoading, opportunities, setOpportunities, courses } = useAppStore();
  const [showAddOpp, setShowAddOpp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => {
      setMounted(true);
    });
    if (!isLoading && (!profile || profile.role !== "admin")) {
      router.push("/");
    }
  }, [isLoading, profile, router]);

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

  if (!mounted || isLoading || !profile || profile.role !== "admin") {
    return (
      <div className={cn(
        "min-h-screen flex items-center justify-center transition-colors duration-300",
        isDark ? "bg-[#050505]" : "bg-[#f0f4f8]"
      )}>
        <div className={cn(
          "animate-spin rounded-full h-12 w-12 border-b-2",
          isDark ? "border-[#00BFFF]" : "border-[#0088cc]"
        )}></div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300 relative overflow-hidden flex",
      isDark ? "bg-[#050505] text-white" : "bg-[#f0f4f8] text-gray-900"
    )}>
      {/* Sidebar */}
      <div className={cn(
        "w-64 min-h-screen p-6 hidden md:block border-r transition-all duration-300",
        isDark ? "bg-[#0a1020]/90 border-[rgba(0,191,255,0.15)] text-white" : "bg-white border-gray-200 text-gray-900"
      )}>
        <h2 className="text-xl font-bold mb-8 flex items-center">
          <LayoutDashboard className={cn("w-6 h-6 mr-2", isDark ? "text-[#00BFFF]" : "text-[#0088cc]")} />
          Панель Admin
        </h2>
        <nav className="space-y-2">
          <a 
            href="#" 
            className={cn(
              "flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all",
              isDark ? "bg-white/5 text-[#59DFFF]" : "bg-blue-50 text-blue-700"
            )}
          >
            <Compass className="w-5 h-5 mr-3" />
            Возможности
          </a>
          <a 
            href="#" 
            className={cn(
              "flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all",
              isDark ? "text-gray-400 hover:bg-white/5 hover:text-white" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <BookOpen className="w-5 h-5 mr-3" />
            Курсы
          </a>
          <a 
            href="#" 
            className={cn(
              "flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all",
              isDark ? "text-gray-400 hover:bg-white/5 hover:text-white" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <Compass className="w-5 h-5 mr-3" />
            Пользователи
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 relative overflow-y-auto">
        {/* ── Background Mesh ── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div
            className="absolute -top-[10%] -left-[10%] w-[45%] h-[45%] rounded-full opacity-[0.08] animate-blob"
            style={{ background: isDark ? "radial-gradient(circle, rgba(0,191,255,0.35) 0%, transparent 70%)" : "radial-gradient(circle, rgba(0,136,204,0.15) 0%, transparent 70%)" }}
          />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h1 className="text-3xl font-black">Управление контентом</h1>
            <button 
              onClick={() => setShowAddOpp(true)}
              className="btn-primary flex items-center px-5 py-2.5 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-5 h-5 mr-2" />
              Добавить возможность
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: "Всего возможностей", val: opportunities.length },
              { label: "Всего курсов", val: courses.length },
              { label: "Активных учеников", val: 124 },
            ].map(({ label, val }) => (
              <div 
                key={label} 
                className={cn(
                  "card-premium p-6 rounded-2xl border transition-all duration-300",
                  isDark ? "bg-[#0a1020]/65 border-[rgba(0,191,255,0.12)]" : "bg-white border-gray-200 shadow-sm"
                )}
              >
                <p className={cn("text-xs font-bold uppercase tracking-wider mb-1", isDark ? "text-gray-400" : "text-gray-500")}>{label}</p>
                <p className="text-3xl font-black">{val}</p>
              </div>
            ))}
          </div>

          {showAddOpp && (
            <div className={cn(
              "card-premium p-6 mb-8 border shadow-lg transition-all duration-300",
              isDark ? "bg-[#0a1020]/95 border-[rgba(0,191,255,0.2)]" : "bg-white border-gray-200"
            )}>
              <h2 className="text-xl font-bold mb-6">Новая возможность</h2>
              <form onSubmit={handleAddOpp} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Название</label>
                    <input 
                      required 
                      type="text" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)} 
                      className={cn(
                        "input-premium w-full px-4 py-2.5 rounded-lg border outline-none bg-transparent transition-all duration-300",
                        isDark
                          ? "bg-[#050505] border-[rgba(0,191,255,0.25)] text-white focus:border-[#59DFFF]"
                          : "bg-white border-[rgba(0,136,204,0.25)] text-gray-900 focus:border-[#0088cc]"
                      )}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Ссылка</label>
                    <input 
                      required 
                      type="url" 
                      value={link} 
                      onChange={e => setLink(e.target.value)} 
                      className={cn(
                        "input-premium w-full px-4 py-2.5 rounded-lg border outline-none bg-transparent transition-all duration-300",
                        isDark
                          ? "bg-[#050505] border-[rgba(0,191,255,0.25)] text-white focus:border-[#59DFFF]"
                          : "bg-white border-[rgba(0,136,204,0.25)] text-gray-900 focus:border-[#0088cc]"
                      )}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Категория</label>
                    <select 
                      value={category} 
                      onChange={e => setCategory(e.target.value as any)} 
                      className={cn(
                        "input-premium w-full px-4 py-2.5 rounded-lg border outline-none transition-all duration-300",
                        isDark
                          ? "bg-[#050505] border-[rgba(0,191,255,0.25)] text-white focus:border-[#59DFFF]"
                          : "bg-white border-[rgba(0,136,204,0.25)] text-gray-900 focus:border-[#0088cc]"
                      )}
                    >
                      <option value="competition" className="dark:bg-neutral-900">Конкурс</option>
                      <option value="program" className="dark:bg-neutral-900">Программа</option>
                      <option value="scholarship" className="dark:bg-neutral-900">Стипендия</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Направление</label>
                    <select 
                      value={field} 
                      onChange={e => setField(e.target.value as any)} 
                      className={cn(
                        "input-premium w-full px-4 py-2.5 rounded-lg border outline-none transition-all duration-300",
                        isDark
                          ? "bg-[#050505] border-[rgba(0,191,255,0.25)] text-white focus:border-[#59DFFF]"
                          : "bg-white border-[rgba(0,136,204,0.25)] text-gray-900 focus:border-[#0088cc]"
                      )}
                    >
                      <option value="business" className="dark:bg-neutral-900">Бизнес</option>
                      <option value="stem" className="dark:bg-neutral-900">STEM</option>
                      <option value="social" className="dark:bg-neutral-900">Социальное влияние</option>
                      <option value="finance" className="dark:bg-neutral-900">Финансы</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Дедлайн</label>
                    <input 
                      required 
                      type="date" 
                      value={deadline} 
                      onChange={e => setDeadline(e.target.value)} 
                      className={cn(
                        "input-premium w-full px-4 py-2.5 rounded-lg border outline-none bg-transparent transition-all duration-300",
                        isDark
                          ? "bg-[#050505] border-[rgba(0,191,255,0.25)] text-white focus:border-[#59DFFF]"
                          : "bg-white border-[rgba(0,136,204,0.25)] text-gray-900 focus:border-[#0088cc]"
                      )}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Описание</label>
                  <textarea 
                    required 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    rows={3} 
                    className={cn(
                      "input-premium w-full px-4 py-2.5 rounded-lg border outline-none resize-none transition-all duration-300",
                      isDark
                        ? "bg-[#050505] border-[rgba(0,191,255,0.25)] text-white focus:border-[#59DFFF]"
                        : "bg-white border-[rgba(0,136,204,0.25)] text-gray-900 focus:border-[#0088cc]"
                    )}
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button 
                    type="button" 
                    onClick={() => setShowAddOpp(false)} 
                    className={cn(
                      "px-4 py-2.5 font-bold rounded-lg transition-colors cursor-pointer border",
                      isDark 
                        ? "bg-white/5 hover:bg-white/10 text-gray-300 border-white/5" 
                        : "bg-gray-150 hover:bg-gray-200 text-gray-750 border-gray-150"
                    )}
                  >
                    Отмена
                  </button>
                  <button disabled={isSubmitting} type="submit" className="btn-primary px-4 py-2.5 font-bold rounded-lg transition-colors disabled:opacity-50 cursor-pointer">
                    {isSubmitting ? "Сохранение..." : "Сохранить"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List */}
          <div className={cn(
            "card-premium overflow-hidden border transition-all duration-300",
            isDark ? "bg-[#0a1020]/65 border-[rgba(0,191,255,0.12)]" : "bg-white border-gray-200 shadow-sm"
          )}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-800">
                <thead className={isDark ? "bg-[#050505]/40" : "bg-gray-50"}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Название</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Категория</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Дедлайн</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Действия</th>
                  </tr>
                </thead>
                <tbody className={cn("divide-y", isDark ? "divide-neutral-800" : "divide-gray-150")}>
                  {opportunities.map(opp => (
                    <tr key={opp.id} className={cn("transition-colors", isDark ? "hover:bg-white/5" : "hover:bg-gray-50")}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={cn("text-sm font-bold", isDark ? "text-white" : "text-gray-900")}>{opp.title}</div>
                        <div className={cn("text-xs font-semibold uppercase tracking-wider mt-0.5", isDark ? "text-gray-500" : "text-gray-400")}>{opp.field}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          "px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full border",
                          isDark 
                            ? "bg-[#00BFFF]/10 border-[#00BFFF]/20 text-[#59DFFF]" 
                            : "bg-blue-50 border-blue-100 text-blue-800"
                        )}>
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
                          className="text-red-500 hover:text-red-400 disabled:opacity-50 cursor-pointer font-bold"
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
    </div>
  );
}
