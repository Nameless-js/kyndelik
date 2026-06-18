"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Shield, Check, Lock, LogIn, Crown, GraduationCap, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SECRET_CODE = "mentoria2024";

type Role = "student" | "mentor" | "admin";

const ROLES: { value: Role; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
  {
    value: "student",
    label: "Студент",
    desc: "Обычный пользователь, доступ к курсам и возможностям",
    icon: <User className="w-6 h-6" />,
    color: "blue",
  },
  {
    value: "mentor",
    label: "Ментор",
    desc: "Создание курсов, добавление уроков и заданий",
    icon: <GraduationCap className="w-6 h-6" />,
    color: "purple",
  },
  {
    value: "admin",
    label: "Администратор",
    desc: "Полный доступ: управление курсами, возможностями и пользователями",
    icon: <Crown className="w-6 h-6" />,
    color: "amber",
  },
];

export default function SetupPage() {
  const router = useRouter();
  const { user, profile, isLoading } = useAppStore();

  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("admin");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Pre-select current role if known
    if (profile?.role) setSelectedRole(profile.role as Role);
  }, [profile]);

  const handleUnlock = () => {
    if (code === SECRET_CODE) {
      setUnlocked(true);
      setCodeError("");
    } else {
      setCodeError("Неверный код доступа");
    }
  };

  const handleSave = async () => {
    if (!user) {
      setError("Вы не авторизованы. Сначала войдите в аккаунт.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, role: selectedRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка сервера");
      setSaved(true);
      // Reload after 2s so profile refreshes
      setTimeout(() => {
        window.location.href = selectedRole === "admin" ? "/admin" : selectedRole === "mentor" ? "/mentor" : "/dashboard";
      }, 2000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Панель разработчика</h1>
          <p className="text-gray-400 text-sm mt-1">Управление ролью аккаунта</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">
          <AnimatePresence mode="wait">
            {!unlocked ? (
              /* Lock screen */
              <motion.div
                key="lock"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="text-center py-2">
                  <Lock className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Введите секретный код для доступа</p>
                </div>
                <input
                  type="password"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                  placeholder="Секретный код..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center tracking-widest"
                />
                {codeError && (
                  <p className="text-red-400 text-sm text-center">{codeError}</p>
                )}
                <button
                  onClick={handleUnlock}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
                >
                  Войти
                </button>
              </motion.div>
            ) : saved ? (
              /* Success */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Роль обновлена!</h3>
                <p className="text-gray-400 text-sm">
                  Роль <span className="text-green-400 font-semibold">{ROLES.find(r => r.value === selectedRole)?.label}</span> успешно назначена.
                  <br />Перенаправление...
                </p>
              </motion.div>
            ) : (
              /* Role selector */
              <motion.div
                key="selector"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {/* Current user info */}
                {user && (
                  <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl border border-gray-700/50 mb-2">
                    <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center">
                      <LogIn className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{user.email}</p>
                      <p className="text-gray-500 text-xs">
                        Текущая роль: <span className="text-purple-400 font-medium">{profile?.role || "student"}</span>
                      </p>
                    </div>
                  </div>
                )}

                {!user && (
                  <div className="p-3 bg-amber-900/20 border border-amber-800/40 rounded-xl text-amber-400 text-sm text-center">
                    ⚠️ Вы не авторизованы. <a href="/login" className="underline font-bold">Войдите</a> сначала.
                  </div>
                )}

                <p className="text-gray-400 text-sm font-medium">Выберите роль:</p>

                <div className="space-y-2">
                  {ROLES.map((role) => (
                    <button
                      key={role.value}
                      onClick={() => setSelectedRole(role.value)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                        selectedRole === role.value
                          ? role.color === "blue"
                            ? "bg-blue-600/10 border-blue-500/50 text-blue-400"
                            : role.color === "purple"
                            ? "bg-purple-600/10 border-purple-500/50 text-purple-400"
                            : "bg-amber-600/10 border-amber-500/50 text-amber-400"
                          : "bg-gray-800/40 border-gray-700/50 text-gray-400 hover:border-gray-600"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        selectedRole === role.value
                          ? role.color === "blue" ? "bg-blue-600/20" : role.color === "purple" ? "bg-purple-600/20" : "bg-amber-600/20"
                          : "bg-gray-700/50"
                      }`}>
                        {role.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{role.label}</span>
                          {profile?.role === role.value && (
                            <span className="text-xs px-1.5 py-0.5 bg-gray-700 text-gray-400 rounded-md">текущая</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{role.desc}</p>
                      </div>
                      {selectedRole === role.value && (
                        <Check className="w-5 h-5 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                {error && (
                  <div className="p-3 bg-red-900/20 border border-red-800/40 rounded-xl text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSave}
                  disabled={saving || !user}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2 mt-2"
                >
                  {saving ? (
                    <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Сохранение...</>
                  ) : (
                    <><Check className="w-4 h-4" /> Применить роль</>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-gray-600 text-xs mt-4">
          Эта страница только для разработчиков · /setup
        </p>
      </motion.div>
    </div>
  );
}
