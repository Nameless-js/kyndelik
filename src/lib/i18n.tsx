"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ru" | "en" | "kz";

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  ru: {
    // Navigation
    home: "Главная",
    opportunities: "Возможности",
    courses: "Курсы",
    dashboard: "Кабинет",
    admin: "Админ",
    mentor: "Ментор",
    roadmap: "Карта развития",
    calendar: "Календарь",
    search_placeholder: "Поиск...",
    all: "Все",
    competitions: "Конкурсы",
    programs: "Программы",
    scholarships: "Стипендии",
    // Onboarding tagline
    onboarding_copula: "это",
    onboarding_tw_1: "твой путь к новым знаниям",
    onboarding_tw_2: "лучшая платформа для роста",
    onboarding_tw_3: "сообщество крутых менторов",
    // Home hero
    hero_rotating_1: "К вершинам",
    hero_rotating_2: "К успеху",
    hero_rotating_3: "К мечте",
    hero_rotating_4: "К росту",
    hero_subtitle: "Mentoria Hub — твой путь",
    hero_second_line: "начинается здесь",
    hero_badge: "Платформа №1 для амбициозных школьников",
    hero_description:
      "Mentoria Hub — единая платформа, где амбициозные школьники находят лучшие возможности и проходят курсы для достижения своих целей.",
    btn_find_opportunities: "Найти возможности",
    btn_start_learning: "Начать обучение",
    stat_opportunities: "Возможностей",
    stat_courses: "Курсов",
    stat_students: "Учеников",
    // Common UI
    loading: "Загрузка...",
    error: "Ошибка",
    save: "Сохранить",
    cancel: "Отмена",
    continue_btn: "Продолжить",
    finish_btn: "Перейти в кабинет",
    // Login / Register tagline
    login_tw_1: "твой путь к знаниям",
    login_tw_2: "сообщество менторов",
    login_tw_3: "пространство для роста",
    register_tw_1: "твой путь к новым знаниям",
    register_tw_2: "лучшая платформа для роста",
    register_tw_3: "пространство для твоих идей",
  },

  en: {
    // Navigation
    home: "Home",
    opportunities: "Opportunities",
    courses: "Courses",
    dashboard: "Dashboard",
    admin: "Admin",
    mentor: "Mentor",
    roadmap: "Roadmap",
    calendar: "Calendar",
    search_placeholder: "Search...",
    all: "All",
    competitions: "Competitions",
    programs: "Programs",
    scholarships: "Scholarships",
    // Onboarding tagline
    onboarding_copula: "is",
    onboarding_tw_1: "your path to new knowledge",
    onboarding_tw_2: "the best platform for growth",
    onboarding_tw_3: "a community of great mentors",
    // Home hero
    hero_rotating_1: "To the top",
    hero_rotating_2: "To success",
    hero_rotating_3: "To your dream",
    hero_rotating_4: "To growth",
    hero_subtitle: "Mentoria Hub — your path",
    hero_second_line: "starts here",
    hero_badge: "Platform #1 for ambitious students",
    hero_description:
      "Mentoria Hub — the all-in-one platform where ambitious students find the best opportunities and take courses to achieve their goals.",
    btn_find_opportunities: "Find Opportunities",
    btn_start_learning: "Start Learning",
    stat_opportunities: "Opportunities",
    stat_courses: "Courses",
    stat_students: "Students",
    // Common UI
    loading: "Loading...",
    error: "Error",
    save: "Save",
    cancel: "Cancel",
    continue_btn: "Continue",
    finish_btn: "Go to Dashboard",
    // Login / Register tagline
    login_tw_1: "your path to knowledge",
    login_tw_2: "a community of mentors",
    login_tw_3: "space for growth",
    register_tw_1: "your path to new knowledge",
    register_tw_2: "the best platform for growth",
    register_tw_3: "space for your ideas",
  },

  kz: {
    // Navigation
    home: "Басты бет",
    opportunities: "Мүмкіндіктер",
    courses: "Курстар",
    dashboard: "Жеке кабинет",
    admin: "Әкімші",
    mentor: "Тәлімгер",
    roadmap: "Даму картасы",
    calendar: "Күнтізбе",
    search_placeholder: "Іздеу...",
    all: "Барлығы",
    competitions: "Байқаулар",
    programs: "Бағдарламалар",
    scholarships: "Стипендиялар",
    // Onboarding tagline
    onboarding_copula: "бұл",
    onboarding_tw_1: "жаңа білімге апаратын жол",
    onboarding_tw_2: "өсу үшін ең жақсы платформа",
    onboarding_tw_3: "керемет тәлімгерлер қауымдастығы",
    // Home hero
    hero_rotating_1: "Шыңдарға",
    hero_rotating_2: "Жетістікке",
    hero_rotating_3: "Арманға",
    hero_rotating_4: "Өсуге",
    hero_subtitle: "Mentoria Hub — сенің жолың",
    hero_second_line: "осында басталады",
    hero_badge: "Талапты оқушылар үшін №1 платформа",
    hero_description:
      "Mentoria Hub — талапты оқушылар ең жақсы мүмкіндіктерді табатын және мақсаттарына жету үшін курстар өтетін бірыңғай платформа.",
    btn_find_opportunities: "Мүмкіндіктер табу",
    btn_start_learning: "Оқуды бастау",
    stat_opportunities: "Мүмкіндік",
    stat_courses: "Курс",
    stat_students: "Оқушы",
    // Common UI
    loading: "Жүктелуде...",
    error: "Қате",
    save: "Сақтау",
    cancel: "Болдырмау",
    continue_btn: "Жалғастыру",
    finish_btn: "Кабинетке өту",
    // Login / Register tagline
    login_tw_1: "білімге апаратын жолың",
    login_tw_2: "тәлімгерлер қауымдастығы",
    login_tw_3: "өсуге арналған кеңістік",
    register_tw_1: "жаңа білімге апаратын жолың",
    register_tw_2: "өсу үшін ең жақсы платформа",
    register_tw_3: "идеяларыңа арналған кеңістік",
  },
};

// ─── Runtime ──────────────────────────────────────────────────────────────────

const VALID_LANGS: Language[] = ["ru", "en", "kz"];
const STORAGE_KEY = "mentoria_lang";

/** Read the saved language from localStorage (safe for SSR). */
function getSavedLanguage(): Language {
  if (typeof window === "undefined") return "ru";
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && VALID_LANGS.includes(saved as Language)) {
      return saved as Language;
    }
  } catch {
    // localStorage blocked (e.g. private mode)
  }
  return "ru";
}

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Start with "ru" to match SSR, hydrate from localStorage after mount
  const [language, setLanguageState] = useState<Language>("ru");

  useEffect(() => {
    setLanguageState(getSavedLanguage());
  }, []);

  const setLanguage = (lang: Language) => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
    // Instant re-render — no page reload needed
    setLanguageState(lang);
  };

  const t = (key: string, fallback?: string): string => {
    const isValid = (v: unknown): v is string =>
      typeof v === "string" && v.trim() !== "" && v !== "-";

    const val = translations[language]?.[key];
    if (isValid(val)) return val;

    if (fallback !== undefined && isValid(fallback)) return fallback;

    // Fall back to Russian if key is missing in current language
    const ruVal = translations["ru"]?.[key];
    if (isValid(ruVal)) return ruVal;

    // Last resort: return the key itself
    return key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
}
