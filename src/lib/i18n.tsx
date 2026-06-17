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

// Map our language codes to Google Translate language codes
const langToGoogleCode: Record<Language, string> = {
  ru: "ru",
  en: "en",
  kz: "kk",
};

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : "";
}

function getActiveLanguage(): Language {
  // Check googtrans cookie to see if translation is active
  const googtrans = getCookie("googtrans");
  if (googtrans) {
    const parts = googtrans.split("/");
    const targetLang = parts[parts.length - 1];
    if (targetLang === "en") return "en";
    if (targetLang === "kk") return "kz";
  }
  return "ru";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ru");

  useEffect(() => {
    // Read active language from googtrans cookie or localStorage
    const saved = localStorage.getItem("mentoria_lang") as Language;
    const fromCookie = getActiveLanguage();
    const active = fromCookie !== "ru" ? fromCookie : (saved && ["ru", "en", "kz"].includes(saved) ? saved : "ru");
    setLanguageState(active);
  }, []);

  const setLanguage = (lang: Language) => {
    localStorage.setItem("mentoria_lang", lang);

    if (lang === "ru") {
      // Remove translation: set cookie to empty/invalid and reload
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname + ";";
      window.location.reload();
    } else {
      const googleCode = langToGoogleCode[lang];
      // Set the googtrans cookie that Google Translate reads
      document.cookie = `googtrans=/ru/${googleCode}; path=/;`;
      document.cookie = `googtrans=/ru/${googleCode}; path=/; domain=${window.location.hostname};`;
      window.location.reload();
    }
  };

  const t = (key: string) => {
    return translations[language][key] || key;
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
