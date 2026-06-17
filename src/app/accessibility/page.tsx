"use client";

import { useAccessibility } from "@/lib/accessibility";
import { useTheme } from "@/lib/theme";
import { Settings, Eye, Type, Mic, Palette, CheckCircle2 } from "lucide-react";

export default function AccessibilityPage() {
  const {
    fontSize, setFontSize,
    highContrast, setHighContrast,
    dyslexia, setDyslexia,
    voiceEnabled, setVoiceEnabled,
  } = useAccessibility();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
            <Settings className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Настройки доступности</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Настройте платформу под свои потребности</p>
          </div>
        </div>

        {/* Font Size */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-5">
            <Type className="w-5 h-5 text-indigo-500" />
            <h2 className="font-semibold text-gray-900 dark:text-white text-lg">Размер текста</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(["sm", "md", "lg"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFontSize(s)}
                className={`relative py-4 rounded-xl border-2 font-medium transition-all ${
                  fontSize === s
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-300 dark:hover:border-indigo-700"
                }`}
                style={{ fontSize: s === "sm" ? 13 : s === "md" ? 16 : 20 }}
              >
                {s === "sm" ? "Мелкий" : s === "md" ? "Средний" : "Крупный"}
                {fontSize === s && (
                  <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-indigo-500" />
                )}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-400">
            Пример: <span style={{ fontSize: fontSize === "sm" ? 13 : fontSize === "md" ? 16 : 20 }}>
              Образование — это инвестиция в будущее.
            </span>
          </p>
        </section>

        {/* Theme */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-5">
            <Palette className="w-5 h-5 text-emerald-500" />
            <h2 className="font-semibold text-gray-900 dark:text-white text-lg">Тема интерфейса</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(["light", "dark"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`relative py-4 rounded-xl border-2 font-medium transition-all flex items-center justify-center gap-2 ${
                  theme === t
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-emerald-300"
                }`}
              >
                <span>{t === "light" ? "☀️ Светлая" : "🌙 Тёмная"}</span>
                {theme === t && <CheckCircle2 className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </section>

        {/* High Contrast */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <label className="flex items-start justify-between gap-4 cursor-pointer">
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold text-gray-900 dark:text-white text-lg">Высокая контрастность</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm mt-1 leading-relaxed">
                  Увеличивает чёткость и контрастность всех элементов интерфейса. Полезно при слабом зрении.
                </div>
                <div className={`mt-3 inline-block px-3 py-1 rounded-lg text-sm border ${
                  highContrast
                    ? "border-orange-400 text-orange-800 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-300"
                    : "border-gray-200 dark:border-gray-700 text-gray-500"
                }`}>
                  {highContrast ? "✓ Включено" : "Выключено"}
                </div>
              </div>
            </div>
            <div className="relative shrink-0 mt-1">
              <input type="checkbox" className="sr-only" checked={highContrast} onChange={e => setHighContrast(e.target.checked)} />
              <div className={`w-14 h-7 rounded-full transition-colors duration-300 ${highContrast ? "bg-orange-500" : "bg-gray-200 dark:bg-gray-700"}`} />
              <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${highContrast ? "translate-x-7" : ""}`} />
            </div>
          </label>
        </section>

        {/* Dyslexia */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <label className="flex items-start justify-between gap-4 cursor-pointer">
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0 mt-0.5">Аа</span>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white text-lg">Шрифт для дислексии</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm mt-1 leading-relaxed">
                  Использует шрифт <strong>Lexend</strong> — разработан для увеличения скорости чтения и снижения нагрузки при дислексии.
                </div>
                <div className={`mt-3 p-3 rounded-xl border text-sm leading-relaxed ${
                  dyslexia
                    ? "font-[var(--font-lexend)] border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-200"
                    : "border-gray-200 dark:border-gray-700 text-gray-500"
                }`} style={dyslexia ? { fontFamily: "var(--font-lexend)", letterSpacing: "0.05em", lineHeight: 1.8 } : {}}>
                  «Образование — это самое мощное оружие, которое вы можете использовать, чтобы изменить мир.»
                </div>
              </div>
            </div>
            <div className="relative shrink-0 mt-1">
              <input type="checkbox" className="sr-only" checked={dyslexia} onChange={e => setDyslexia(e.target.checked)} />
              <div className={`w-14 h-7 rounded-full transition-colors duration-300 ${dyslexia ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"}`} />
              <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${dyslexia ? "translate-x-7" : ""}`} />
            </div>
          </label>
        </section>

        {/* Voice Assistant */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <label className="flex items-start justify-between gap-4 cursor-pointer">
            <div className="flex items-start gap-3">
              <Mic className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold text-gray-900 dark:text-white text-lg">ИИ Голосовой помощник</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm mt-1 leading-relaxed">
                  Управляйте навигацией по платформе голосом. После включения появится кнопка микрофона в правом нижнем углу.
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {[
                    ["«Главная»", "/ Главная страница"],
                    ["«Курсы»", "/courses"],
                    ["«Кабинет»", "/dashboard"],
                    ["«Карта»", "/roadmap"],
                    ["«Ментор»", "/mentor"],
                    ["«Стоп»", "Остановить"],
                  ].map(([phrase, page]) => (
                    <div key={phrase} className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg px-3 py-2">
                      <span className="text-purple-600 dark:text-purple-300 font-medium text-xs">{phrase}</span>
                      <span className="text-gray-400 text-xs">→ {page}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative shrink-0 mt-1">
              <input type="checkbox" className="sr-only" checked={voiceEnabled} onChange={e => setVoiceEnabled(e.target.checked)} />
              <div className={`w-14 h-7 rounded-full transition-colors duration-300 ${voiceEnabled ? "bg-purple-500" : "bg-gray-200 dark:bg-gray-700"}`} />
              <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${voiceEnabled ? "translate-x-7" : ""}`} />
            </div>
          </label>
        </section>

      </div>
    </div>
  );
}
