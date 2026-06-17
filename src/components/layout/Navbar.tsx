"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, BookOpen, Compass, Settings,
  User, Moon, Sun, Globe, Calendar, Map, LogOut, Menu, X
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useTranslation } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

export function Navbar() {
  const pathname = usePathname();
  const { profile, user } = useAppStore();
  const { t, language, setLanguage } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Close language dropdown when clicking outside
  useEffect(() => {
    if (!langOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [langOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const links = [
    { href: "/",                                      label: t("home"),          icon: Compass },
    { href: "/opportunities",                         label: t("opportunities"), icon: Compass },
    { href: "/courses",                               label: t("courses"),       icon: BookOpen },
    { href: "/calendar",                              label: t("calendar"),      icon: Calendar },
    { href: "/roadmap",                               label: t("roadmap"),       icon: Map },
    { href: profile ? "/dashboard" : "/onboarding",  label: t("dashboard"),     icon: LayoutDashboard },
  ];

  if (profile?.role === "admin") {
    links.push({ href: "/admin", label: t("admin"), icon: Settings });
    links.push({ href: "/mentor", label: t("mentor"), icon: User });
  } else if (profile?.role === "mentor") {
    links.push({ href: "/mentor", label: t("mentor"), icon: User });
  }

  return (
    <>
      <nav className="fixed top-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  M
                </div>
                <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white hidden sm:block">
                  Mentoria Hub
                </span>
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center space-x-5 overflow-x-auto">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Switcher */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangOpen((o) => !o)}
                  className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium py-2"
                >
                  <Globe className="w-5 h-5" />
                  <span className="uppercase hidden sm:inline">{language}</span>
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full pt-1 z-50">
                    <div className="w-28 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2">
                      {(["ru", "en", "kz"] as const).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => { setLangOpen(false); setLanguage(lang); }}
                          className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 uppercase font-medium transition-colors ${
                            language === lang
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {language === lang && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />}
                          {lang === "ru" ? "🇷🇺 RU" : lang === "en" ? "🇬🇧 EN" : "🇰🇿 KZ"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
                >
                  {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              )}

              {/* Logout (desktop) */}
              {user && (
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="hidden lg:block text-red-500 hover:text-red-600 transition-colors"
                  title="Выйти из аккаунта"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              )}

              {/* Hamburger (mobile/tablet) */}
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="lg:hidden p-2 -mr-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Меню"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-16 left-0 right-0 z-40 lg:hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-xl transition-all duration-300 ease-in-out ${
          mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-h-[calc(100svh-4rem)] overflow-y-auto">
          <div className="px-4 py-4 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Bottom actions */}
          {user && (
            <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Аккаунт
                </span>
              </div>
              <button
                onClick={() => { supabase.auth.signOut(); setMobileOpen(false); }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Выйти из аккаунта
              </button>
            </div>
          )}

          <div className="h-safe-area-bottom" />
        </div>
      </div>
    </>
  );
}
