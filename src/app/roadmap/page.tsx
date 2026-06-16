"use client";

import { useAppStore } from "@/lib/store";
import { Map, Plus, CheckCircle2, ChevronRight, Target } from "lucide-react";
import { useState } from "react";

type Milestone = {
  id: string;
  title: string;
  completed: boolean;
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
  const [roadmap, setRoadmap] = useState<GradePlan[]>(INITIAL_ROADMAP);
  const [addingToGrade, setAddingToGrade] = useState<string | null>(null);
  const [newTask, setNewTask] = useState("");

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
          milestones: [...g.milestones, { id: `m-${Date.now()}`, title: newTask, completed: false }]
        };
      }
      return g;
    }));
    
    setNewTask("");
    setAddingToGrade(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto mb-6 shadow-sm">
            <Map className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Твой Roadmap</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Пошаговый план от 9 до 12 класса. Выполняй задачи, добавляй свои цели и отслеживай прогресс к поступлению мечты.
          </p>
        </div>

        <div className="space-y-8">
          {roadmap.map((gradePlan, index) => {
            const completedCount = gradePlan.milestones.filter(m => m.completed).length;
            const progress = gradePlan.milestones.length > 0 ? Math.round((completedCount / gradePlan.milestones.length) * 100) : 0;
            
            return (
              <div key={gradePlan.grade} className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden">
                {/* Visual Connection line for desktop */}
                {index !== roadmap.length - 1 && (
                  <div className="hidden md:block absolute left-16 top-[100%] h-8 w-0.5 bg-gray-200 dark:bg-gray-800 z-0" />
                )}
                
                <div className="flex flex-col md:flex-row gap-8 relative z-10">
                  {/* Grade Header */}
                  <div className="w-full md:w-64 shrink-0">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{gradePlan.grade}</h2>
                    <div className="flex items-center mb-2">
                      <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2 mr-3">
                        <div className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{progress}%</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{completedCount} из {gradePlan.milestones.length} выполнено</p>
                  </div>

                  {/* Milestones List */}
                  <div className="flex-1 space-y-3">
                    {gradePlan.milestones.map((milestone) => (
                      <button
                        key={milestone.id}
                        onClick={() => toggleMilestone(gradePlan.grade, milestone.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                          milestone.completed 
                            ? "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-75" 
                            : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-center">
                          <CheckCircle2 className={`w-6 h-6 mr-4 flex-shrink-0 transition-colors ${
                            milestone.completed ? "text-green-500" : "text-gray-300 dark:text-gray-600"
                          }`} />
                          <span className={`text-left font-medium ${
                            milestone.completed ? "text-gray-500 dark:text-gray-400 line-through" : "text-gray-900 dark:text-gray-100"
                          }`}>
                            {milestone.title}
                          </span>
                        </div>
                      </button>
                    ))}

                    {/* Add new task input */}
                    {addingToGrade === gradePlan.grade ? (
                      <div className="flex gap-2 mt-4">
                        <input
                          autoFocus
                          type="text"
                          value={newTask}
                          onChange={e => setNewTask(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleAddTask(gradePlan.grade)}
                          className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-blue-300 dark:border-blue-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                          placeholder="Введите задачу..."
                        />
                        <button 
                          onClick={() => handleAddTask(gradePlan.grade)}
                          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                        >
                          Сохранить
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setAddingToGrade(gradePlan.grade)}
                        className="flex items-center text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2 px-1 mt-2"
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
