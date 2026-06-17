"use client";

import { useState } from "react";
import { Typewriter } from "@/components/ui/typewriter";
import { Mail, Lock, User, ArrowRight, Github, Chrome } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate register
    alert("Registration submitted!");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 relative overflow-hidden px-4">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 dark:bg-purple-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 dark:bg-blue-600/20 blur-[120px] pointer-events-none" />

      {/* Header with Typewriter */}
      <div className="mb-8 md:mb-12 text-center z-10 w-full max-w-2xl px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            Mentoria Hub
          </span>{" "}
          <span className="text-gray-800 dark:text-gray-100">это</span>
        </h1>
        <div className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-600 dark:text-gray-300 min-h-[40px]">
          <Typewriter
            text={[
              "твой путь к новым знаниям",
              "лучшая платформа для роста",
              "сообщество крутых менторов",
              "удобный интерактивный формат",
              "пространство для твоих идей",
            ]}
            speed={60}
            waitTime={2000}
            deleteSpeed={30}
            cursorChar={"_"}
            className="text-purple-600 dark:text-purple-400 font-bold"
          />
        </div>
      </div>

      {/* Registration Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Создать аккаунт</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Присоединяйся к нам и начни обучаться уже сегодня
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
              Имя пользователя
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-purple-500 transition-colors">
                <User className="w-5 h-5" />
              </div>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-gray-900 dark:text-white"
                placeholder="Иван Иванов"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
              Email адрес
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-purple-500 transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-gray-900 dark:text-white"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
              Пароль
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-purple-500 transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-gray-900 dark:text-white tracking-widest"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Зарегистрироваться
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 flex items-center justify-between">
          <div className="h-px w-full bg-gray-200 dark:bg-gray-800"></div>
          <span className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
            Или войти через
          </span>
          <div className="h-px w-full bg-gray-200 dark:bg-gray-800"></div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm text-gray-700 dark:text-gray-300 font-medium">
            <Chrome className="w-5 h-5" />
            Google
          </button>
          <button className="flex items-center justify-center gap-2 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm text-gray-700 dark:text-gray-300 font-medium">
            <Github className="w-5 h-5" />
            GitHub
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="font-bold text-purple-600 dark:text-purple-400 hover:underline">
            Войти
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
