"use client";

// ─── Web Speech API types ────────────────────────────────────────────────────
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}
interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((e: Event) => void) | null;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
}
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccessibility } from "@/lib/accessibility";
import { useTheme } from "@/lib/theme";
import { Mic, X, HelpCircle } from "lucide-react";

const NAV_COMMANDS = [
  { phrases: ["перейди на главную", "главная", "home", "басты бет"], path: "/", label: "Главная" },
  { phrases: ["перейди на возможности", "возможности", "opportunities"], path: "/opportunities", label: "Возможности" },
  { phrases: ["перейди на курсы", "курсы", "courses", "курстар"], path: "/courses", label: "Курсы" },
  { phrases: ["перейди в календарь", "календарь", "calendar", "күнтізбе"], path: "/calendar", label: "Календарь" },
  { phrases: ["перейди на карту", "карта", "roadmap", "карта развития"], path: "/roadmap", label: "Карта развития" },
  { phrases: ["перейди в кабинет", "кабинет", "dashboard"], path: "/dashboard", label: "Кабинет" },
  { phrases: ["перейди к ментору", "ментор", "mentor"], path: "/mentor", label: "Ментор" },
];

const STOP_WORDS = ["стоп", "stop", "тоқта", "хватит"];

export function VoiceAssistant() {
  const {
    voiceEnabled, setVoiceEnabled,
    setHighContrast, setDyslexia, setFontSize
  } = useAccessibility();
  const { setTheme } = useTheme();
  
  const router = useRouter();
  const recRef = useRef<SpeechRecognitionInstance | null>(null);

  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((text: string, ok = true) => {
    setToast({ text, ok });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const stop = useCallback(() => {
    recRef.current?.stop();
    setListening(false);
    setTranscript("");
  }, []);

  const start = useCallback(() => {
    const Ctor = typeof window !== "undefined"
      ? (window.SpeechRecognition || window.webkitSpeechRecognition)
      : null;
    if (!Ctor) {
      showToast("Браузер не поддерживает голосовое управление", false);
      return;
    }
    const rec = new Ctor();
    rec.lang = "ru-RU";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onstart = () => setListening(true);
    rec.onend = () => { setListening(false); setTranscript(""); };
    rec.onerror = () => setListening(false);
    rec.onresult = (e: SpeechRecognitionEvent) => {
      let interim = "", final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        e.results[i].isFinal ? (final += t) : (interim += t);
      }
      const text = (final || interim).toLowerCase().trim();
      setTranscript(interim || final);

      // --- Stop command ---
      if (STOP_WORDS.some(w => text.includes(w))) {
        stop();
        showToast("Голосовое управление остановлено", true);
        return;
      }

      if (final) {
        // --- Navigation ---
        const navCmd = NAV_COMMANDS.find(c => c.phrases.some(p => text.includes(p)));
        if (navCmd) {
          showToast(`Перехожу: ${navCmd.label}`);
          router.push(navCmd.path);
          setTranscript("");
          return;
        }

        // --- Settings (Включи/Выключи) ---
        const isOn = text.includes("включи") || text.includes("сделай");
        const isOff = text.includes("выключи") || text.includes("убери");

        if (isOn || isOff) {
          const value = isOn;
          
          if (text.includes("контраст")) {
            setHighContrast(value);
            showToast(`Высокий контраст ${value ? "включен" : "выключен"}`);
            setTranscript("");
            return;
          }
          if (text.includes("дислекси") || text.includes("лексенд")) {
            setDyslexia(value);
            showToast(`Шрифт для дислексии ${value ? "включен" : "выключен"}`);
            setTranscript("");
            return;
          }
          if (text.includes("темную тем") || text.includes("тёмную тем") || text.includes("ночн")) {
            setTheme("dark");
            showToast("Тёмная тема включена");
            setTranscript("");
            return;
          }
          if (text.includes("светлую тем") || text.includes("дневн")) {
            setTheme("light");
            showToast("Светлая тема включена");
            setTranscript("");
            return;
          }
          if (text.includes("мелкий шрифт")) {
            setFontSize("sm");
            showToast("Мелкий шрифт включен");
            setTranscript("");
            return;
          }
          if (text.includes("средний шрифт")) {
            setFontSize("md");
            showToast("Средний шрифт включен");
            setTranscript("");
            return;
          }
          if (text.includes("крупный шрифт")) {
            setFontSize("lg");
            showToast("Крупный шрифт включен");
            setTranscript("");
            return;
          }
        }
      }
    };
    recRef.current = rec;
    rec.start();
  }, [router, showToast, stop, setHighContrast, setDyslexia, setFontSize, setTheme]);

  // Stop when user disables voice via UI
  useEffect(() => {
    if (!voiceEnabled && listening) stop();
  }, [voiceEnabled, listening, stop]);

  useEffect(() => () => {
    recRef.current?.stop();
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  if (!voiceEnabled) return null;

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-2xl text-white text-sm font-semibold shadow-2xl transition-all ${toast.ok ? "bg-indigo-600" : "bg-red-500"}`}>
          {toast.text}
        </div>
      )}

      {/* Live transcript */}
      {listening && transcript && (
        <div className="fixed bottom-28 right-6 z-[150] max-w-xs bg-gray-900/95 border border-indigo-500/40 rounded-2xl px-4 py-3 shadow-2xl backdrop-blur">
          <p className="text-xs text-indigo-400 font-medium mb-1">Слышу...</p>
          <p className="text-white text-sm italic">"{transcript}"</p>
        </div>
      )}

      {/* Help panel */}
      {showHelp && (
        <div className="fixed bottom-28 right-20 z-[150] w-72 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-semibold text-sm">Голосовые команды</span>
            <button onClick={() => setShowHelp(false)} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3 overflow-y-auto max-h-60">
            <div>
              <p className="text-indigo-400 text-xs font-bold mb-1">Навигация</p>
              {NAV_COMMANDS.map(c => (
                <div key={c.path} className="flex items-start gap-2">
                  <span className="text-gray-300 text-xs">«{c.phrases[0]}» — {c.label}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-indigo-400 text-xs font-bold mb-1">Настройки</p>
              <div className="text-gray-300 text-xs leading-tight">
                <p>«включи / выключи контраст»</p>
                <p>«включи / выключи дислексию»</p>
                <p>«включи темную / светлую тему»</p>
                <p>«включи мелкий / крупный шрифт»</p>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-700 mt-2">
              <span className="text-gray-500 text-xs">«стоп» — остановить</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating controls */}
      <div className="fixed bottom-6 right-6 z-[150] flex items-center gap-2">
        <button
          onClick={() => setShowHelp(v => !v)}
          className="w-10 h-10 rounded-full bg-gray-800 border border-gray-600 text-gray-300 hover:text-white hover:border-indigo-400 transition-all flex items-center justify-center"
          title="Список команд"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        <button
          onClick={listening ? stop : start}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
            listening
              ? "bg-indigo-600 hover:bg-indigo-700 voice-listening"
              : "bg-gray-900 hover:bg-indigo-600 border-2 border-indigo-500/50 hover:border-indigo-500"
          }`}
          title={listening ? "Остановить" : "Голосовое управление"}
        >
          {listening ? (
            <div className="flex items-end gap-0.5 h-5">
              <div className="w-1 bg-white rounded-full soundbar-1" />
              <div className="w-1 bg-white rounded-full soundbar-2" />
              <div className="w-1 bg-white rounded-full soundbar-3" />
              <div className="w-1 bg-white rounded-full soundbar-4" />
            </div>
          ) : (
            <Mic className="w-6 h-6 text-indigo-400" />
          )}
        </button>
      </div>
    </>
  );
}
