"use client";

import { useState, useEffect, useRef } from "react";
import { Settings, X, Type, Eye, Palette, Mic, Sun, Moon, CheckCircle2 } from "lucide-react";
import { useAccessibility } from "@/lib/accessibility";
import { useTheme } from "@/lib/theme";

export function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const {
    fontSize, setFontSize,
    highContrast, setHighContrast,
    dyslexia, setDyslexia,
    voiceEnabled, setVoiceEnabled,
  } = useAccessibility();

  const { theme, setTheme } = useTheme();

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const Toggle = ({
    checked,
    onChange,
    color,
  }: {
    checked: boolean;
    onChange: (v: boolean) => void;
    color: string;
  }) => (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 shrink-0 ${checked ? color : "bg-gray-200 dark:bg-gray-700"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${checked ? "translate-x-6" : ""}`}
      />
    </button>
  );

  return (
    <div ref={panelRef} className="fixed bottom-6 left-6 z-[300]">
      {/* Gear Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Открыть настройки доступности"
        className={`w-13 h-13 w-[52px] h-[52px] rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          open
            ? "bg-indigo-600 text-white rotate-90"
            : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-400 hover:text-indigo-600"
        }`}
        style={{ transition: "transform 0.4s ease, background-color 0.2s" }}
      >
        <Settings className="w-6 h-6" style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.4s ease" }} />
      </button>

      {/* Panel */}
      {open && (
        <div
          className="absolute bottom-16 left-0 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
          style={{ animation: "slideUp 0.25s ease" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-indigo-50 dark:bg-indigo-950/40">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="font-semibold text-gray-900 dark:text-white text-sm">Доступность</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-5">

            {/* Font Size */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Type className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Размер текста</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(["sm", "md", "lg"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFontSize(s)}
                    className={`relative py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                      fontSize === s
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300"
                        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-300"
                    }`}
                    style={{ fontSize: s === "sm" ? 12 : s === "md" ? 14 : 17 }}
                  >
                    {s === "sm" ? "А" : s === "md" ? "А" : "А"}
                    <span className="block text-[10px] mt-0.5 font-normal">
                      {s === "sm" ? "мелкий" : s === "md" ? "средний" : "крупный"}
                    </span>
                    {fontSize === s && (
                      <CheckCircle2 className="absolute top-1 right-1 w-3 h-3 text-indigo-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Palette className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Тема</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm border-2 transition-all ${
                    theme === "light"
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-emerald-300"
                  }`}
                >
                  <Sun className="w-4 h-4" /> Светлая
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm border-2 transition-all ${
                    theme === "dark"
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-emerald-700"
                  }`}
                >
                  <Moon className="w-4 h-4" /> Тёмная
                </button>
              </div>
            </div>

            {/* High Contrast */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <Eye className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Высокий контраст</p>
                  <p className="text-xs text-gray-400 mt-0.5">Увеличивает чёткость</p>
                </div>
              </div>
              <Toggle checked={highContrast} onChange={setHighContrast} color="bg-orange-500" />
            </div>

            {/* Dyslexia */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <span className="text-base leading-none mt-0.5 shrink-0">Аа</span>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Шрифт Lexend</p>
                  <p className="text-xs text-gray-400 mt-0.5">Для людей с дислексией</p>
                </div>
              </div>
              <Toggle checked={dyslexia} onChange={setDyslexia} color="bg-blue-500" />
            </div>

            {/* Voice */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <Mic className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Голосовой помощник</p>
                  <p className="text-xs text-gray-400 mt-0.5">Навигация голосом</p>
                </div>
              </div>
              <Toggle checked={voiceEnabled} onChange={setVoiceEnabled} color="bg-purple-500" />
            </div>

            {/* Voice commands hint */}
            {voiceEnabled && (
              <div className="rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-3">
                <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-2">Команды:</p>
                <div className="grid grid-cols-2 gap-1">
                  {["«Главная»", "«Курсы»", "«Кабинет»", "«Карта»", "«Ментор»", "«Стоп»"].map((c) => (
                    <span key={c} className="text-xs text-purple-600 dark:text-purple-300 bg-white dark:bg-purple-900/30 rounded-lg px-2 py-1">
                      {c}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-purple-500 dark:text-purple-400 mt-2">
                  Нажмите кнопку микрофона (справа снизу) для начала
                </p>
              </div>
            )}

          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
