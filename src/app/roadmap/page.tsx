"use client";

import { useAppStore } from "@/lib/store";
import { Map, Plus, CheckCircle2, ChevronRight, Target, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

type Milestone = {
  id: string;
  title: string;
  completed: boolean;
  isCustom?: boolean;
};

type GradePlan = {
  grade: string;
  milestones: Milestone[];
};

const INITIAL_ROADMAP: GradePlan[] = [
  {
    grade: "9 класс",
    milestones: [
      { id: "m1", title: "Выбрать 2-3 профильных предмета", completed: true },
      { id: "m2", title: "Записаться на курс по английскому", completed: false },
      { id: "m3", title: "Участвовать в школьной олимпиаде", completed: false }
    ]
  },
  {
    grade: "10 класс",
    milestones: [
      { id: "m4", title: "Начать подготовку к SAT/IELTS", completed: false },
      { id: "m5", title: "Найти летнюю стажировку", completed: false },
      { id: "m6", title: "Запустить социальный проект", completed: false }
    ]
  },
  {
    grade: "11 класс",
    milestones: [
      { id: "m7", title: "Сдать SAT", completed: false },
      { id: "m8", title: "Сдать IELTS", completed: false },
      { id: "m9", title: "Собрать список из 10 университетов", completed: false }
    ]
  },
  {
    grade: "12 класс",
    milestones: [
      { id: "m10", title: "Написать мотивационное эссе", completed: false },
      { id: "m11", title: "Подать документы (Early Action)", completed: false },
      { id: "m12", title: "Получить оффер!", completed: false }
    ]
  }
];

export default function RoadmapPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [roadmap, setRoadmap] = useState<GradePlan[]>(INITIAL_ROADMAP);
  const [addingToGrade, setAddingToGrade] = useState<string | null>(null);
  const [newTask, setNewTask] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("mentoria_roadmap");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Promise.resolve().then(() => {
          setRoadmap(parsed);
        });
      } catch (e) {
        console.error("Failed to parse roadmap", e);
      }
    }
    Promise.resolve().then(() => {
      setIsLoaded(true);
    });
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("mentoria_roadmap", JSON.stringify(roadmap));
    }
  }, [roadmap, isLoaded]);

  const toggleMilestone = (gradeName: string, milestoneId: string) => {
    setRoadmap(prev => prev.map(g => {
      if (g.grade === gradeName) {
        return {
          ...g,
          milestones: g.milestones.map(m => m.id === milestoneId ? { ...m, completed: !m.completed } : m)
        };
      }
      return g;
    }));
  };

  const handleAddTask = (gradeName: string) => {
    if (!newTask.trim()) {
      setAddingToGrade(null);
      return;
    }
    
    setRoadmap(prev => prev.map(g => {
      if (g.grade === gradeName) {
        return {
          ...g,
          milestones: [...g.milestones, { id: `m-${Date.now()}`, title: newTask.trim(), completed: false, isCustom: true }]
        };
      }
      return g;
    }));
    
    setNewTask("");
    setAddingToGrade(null);
  };

  const handleDeleteTask = (gradeName: string, milestoneId: string) => {
    setRoadmap(prev => prev.map(g => {
      if (g.grade === gradeName) {
        return {
          ...g,
          milestones: g.milestones.filter(m => m.id !== milestoneId)
        };
      }
      return g;
    }));
  };

  if (!isLoaded) return null; // Prevent hydration mismatch

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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm",
            isDark ? "bg-[#00BFFF]/10 text-[#59DFFF]" : "bg-blue-100 text-blue-600"
          )}>
            <Map className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black mb-4">Твой Roadmap</h1>
          <p className={cn("text-lg", isDark ? "text-gray-400" : "text-gray-600")}>
            Пошаговый план от 9 до 12 класса. Выполняй задачи, добавляй свои цели и отслеживай прогресс к поступлению мечты.
          </p>
        </div>

        <div className="space-y-8">
          {roadmap.map((gradePlan, index) => {
            const completedCount = gradePlan.milestones.filter(m => m.completed).length;
            const progress = gradePlan.milestones.length > 0 ? Math.round((completedCount / gradePlan.milestones.length) * 100) : 0;
            
            return (
              <div 
                key={gradePlan.grade} 
                className={cn(
                  "card-premium p-8 border relative overflow-hidden transition-all duration-300",
                  isDark ? "bg-[#0a1020]/65 border-[rgba(0,191,255,0.12)]" : "bg-white/70 border-[rgba(0,136,204,0.12)] shadow-sm"
                )}
              >
                {/* Visual Connection line for desktop */}
                {index !== roadmap.length - 1 && (
                  <div className={cn(
                    "hidden md:block absolute left-16 top-[100%] h-8 w-0.5 z-0",
                    isDark ? "bg-neutral-800" : "bg-gray-200"
                  )} />
                )}
                
                <div className="flex flex-col md:flex-row gap-8 relative z-10">
                  {/* Grade Header */}
                  <div className="w-full md:w-64 shrink-0">
                    <h2 className="text-3xl font-black mb-2">{gradePlan.grade}</h2>
                    <div className="flex items-center mb-2">
                      <div className={cn(
                        "flex-1 rounded-full h-2 mr-3",
                        isDark ? "bg-neutral-800" : "bg-gray-150"
                      )}>
                        <div 
                          className={cn(
                            "h-2 rounded-full transition-all duration-500",
                            isDark ? "bg-[#00BFFF]" : "bg-blue-600"
                          )} 
                          style={{ width: `${progress}%` }} 
                        />
                      </div>
                      <span className={cn("text-sm font-bold", isDark ? "text-gray-300" : "text-gray-700")}>{progress}%</span>
                    </div>
                    <p className={cn("text-sm", isDark ? "text-gray-500" : "text-gray-400")}>{completedCount} из {gradePlan.milestones.length} выполнено</p>
                  </div>

                  {/* Milestones List */}
                  <div className="flex-1 space-y-3">
                    <AnimatePresence>
                      {gradePlan.milestones.map((milestone) => (
                        <motion.div
                          key={milestone.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={cn(
                            "w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300",
                            milestone.completed 
                              ? isDark 
                                ? "bg-neutral-900/40 border-neutral-800/80 opacity-60" 
                                : "bg-gray-50 border-gray-200 opacity-70"
                              : isDark
                                ? "bg-[#0a1020]/80 border-[rgba(0,191,255,0.15)] hover:border-[#00BFFF]/40 shadow-sm"
                                : "bg-white border-[rgba(0,136,204,0.15)] hover:border-[#0088cc]/40 shadow-sm hover:shadow-md"
                          )}
                        >
                          <button
                            onClick={() => toggleMilestone(gradePlan.grade, milestone.id)}
                            className="flex items-center flex-1 text-left cursor-pointer"
                          >
                            <CheckCircle2 className={cn(
                              "w-6 h-6 mr-4 flex-shrink-0 transition-colors duration-300",
                              milestone.completed 
                                ? "text-green-500" 
                                : isDark ? "text-gray-600" : "text-gray-300"
                            )} />
                            <span className={cn(
                              "font-medium transition-colors",
                              milestone.completed 
                                ? "line-through text-gray-500" 
                                : isDark ? "text-gray-100" : "text-gray-900"
                            )}>
                              {milestone.title}
                            </span>
                          </button>
                          {milestone.isCustom && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTask(gradePlan.grade, milestone.id);
                              }}
                              className={cn(
                                "p-2 ml-2 rounded-lg transition-colors flex-shrink-0 cursor-pointer",
                                isDark
                                  ? "text-gray-500 hover:text-red-400 hover:bg-red-500/10"
                                  : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                              )}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Add new task input */}
                    {addingToGrade === gradePlan.grade ? (
                      <div className="flex gap-2 mt-4">
                        <input
                          autoFocus
                          type="text"
                          value={newTask}
                          onChange={e => setNewTask(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleAddTask(gradePlan.grade)}
                          className={cn(
                            "input-premium flex-1 px-4 py-3 border rounded-xl outline-none transition-all duration-300",
                            isDark
                              ? "bg-[#050505] border-[rgba(0,191,255,0.25)] text-white focus:border-[#59DFFF]"
                              : "bg-white border-[rgba(0,136,204,0.25)] text-gray-900 focus:border-[#0088cc]"
                          )}
                          placeholder="Введите задачу..."
                        />
                        <button 
                          onClick={() => handleAddTask(gradePlan.grade)}
                          className="btn-primary px-6 py-3 text-white font-bold rounded-xl transition-all"
                        >
                          Сохранить
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setAddingToGrade(gradePlan.grade)}
                        className={cn(
                          "flex items-center text-sm font-bold transition-colors py-2 px-1 mt-2 cursor-pointer",
                          isDark ? "text-gray-500 hover:text-[#00BFFF]" : "text-gray-500 hover:text-blue-600"
                        )}
                      >
                        <Plus className="w-5 h-5 mr-1" />
                        Добавить свою цель
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
