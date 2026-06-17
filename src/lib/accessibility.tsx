"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type FontSize = "sm" | "md" | "lg";

export interface AccessibilitySettings {
  fontSize: FontSize;
  highContrast: boolean;
  dyslexia: boolean;
  voiceEnabled: boolean;
}

interface AccessibilityContextType extends AccessibilitySettings {
  setFontSize: (size: FontSize) => void;
  setHighContrast: (value: boolean) => void;
  setDyslexia: (value: boolean) => void;
  setVoiceEnabled: (value: boolean) => void;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: "md",
  highContrast: false,
  dyslexia: false,
  voiceEnabled: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const STORAGE_KEY = "mentoria_a11y";

function applyToDOM(settings: AccessibilitySettings) {
  const html = document.documentElement;
  html.classList.remove("a11y-font-sm", "a11y-font-md", "a11y-font-lg");
  html.classList.add(`a11y-font-${settings.fontSize}`);
  html.classList.toggle("a11y-high-contrast", settings.highContrast);
  html.classList.toggle("a11y-dyslexia", settings.dyslexia);
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? (JSON.parse(saved) as AccessibilitySettings) : defaultSettings;
      setSettings(parsed);
      applyToDOM(parsed);
    } catch {
      applyToDOM(defaultSettings);
    }
  }, []);

  const update = (partial: Partial<AccessibilitySettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      applyToDOM(next);
      return next;
    });
  };

  return (
    <AccessibilityContext.Provider
      value={{
        ...settings,
        setFontSize: (fontSize) => update({ fontSize }),
        setHighContrast: (highContrast) => update({ highContrast }),
        setDyslexia: (dyslexia) => update({ dyslexia }),
        setVoiceEnabled: (voiceEnabled) => update({ voiceEnabled }),
      }}
    >
      {mounted ? children : <>{children}</>}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be used within AccessibilityProvider");
  return ctx;
}
