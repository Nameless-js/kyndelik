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
  },
  en: {
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
  },
  kz: {
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
  }
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ru");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("mentoria_lang") as Language;
    if (saved && ["ru", "en", "kz"].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("mentoria_lang", lang);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  // Prevent hydration mismatch by rendering default ru or null first, but for SEO it's better to just use current state
  // since it's an MVP, we'll just render it
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
