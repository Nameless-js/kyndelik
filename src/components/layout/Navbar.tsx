"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, BookOpen, Compass, Settings,
  User, Moon, Sun, Globe, Calendar, Map, LogOut, Menu, X, Sparkles
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
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.resolve().then(() => {
      setMounted(true);
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  useEffect(() => {
    Promise.resolve().then(() => {
      setMobileOpen(false);
    });
  }, [pathname]);

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
    { href: "/opportunities",                         label: t("opportunities"), icon: Sparkles },
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
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? theme === "dark"
              ? "bg-[#050505]/75 backdrop-blur-xl border-b border-[rgba(0,191,255,0.15)] shadow-[0_4px_30px_rgba(0,191,255,0.05)]"
              : "bg-white/70 backdrop-blur-xl border-b border-[rgba(0,136,204,0.12)] shadow-[0_4px_30px_rgba(0,80,160,0.06)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="relative w-9 h-9">
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br shadow-lg transition-shadow duration-300 ${
                    theme === "dark"
                      ? "from-[#00BFFF] to-[#59DFFF] shadow-[#00BFFF]/20 group-hover:shadow-[#00BFFF]/50"
                      : "from-[#0088cc] to-[#00a3e0] shadow-[#0088cc]/20 group-hover:shadow-[#0088cc]/40"
                  }`} />
                  <div className="absolute inset-0 rounded-xl flex items-center justify-center text-white font-black text-lg">
                    M
                  </div>
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className={`font-bold text-base tracking-tight leading-none ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Mentoria
                  </span>
                  <span className={`text-[10px] font-semibold leading-none tracking-widest uppercase ${theme === "dark" ? "text-[#59DFFF]" : "text-[#0088cc]"}`}>
                    Hub
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap border ${
                      isActive
                        ? theme === "dark"
                          ? "text-[#00BFFF] bg-[rgba(0,191,255,0.08)] border-[rgba(0,191,255,0.25)] shadow-[0_0_15px_rgba(0,191,255,0.1)]"
                          : "text-[#0077b6] bg-[rgba(0,136,204,0.08)] border-[rgba(0,136,204,0.2)] shadow-[0_0_12px_rgba(0,136,204,0.06)]"
                        : theme === "dark"
                          ? "text-gray-400 hover:text-white hover:bg-white/5 border-transparent"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/60 border-transparent"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {link.label}
                    {isActive && (
                      <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${theme === "dark" ? "bg-[#00BFFF] shadow-[0_0_8px_#00BFFF]" : "bg-[#0088cc] shadow-[0_0_6px_rgba(0,136,204,0.4)]"}`} />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Language Switcher */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangOpen((o) => !o)}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-sm font-medium transition-all ${theme === "dark" ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/60"}`}
                >
                  <Globe className="w-4 h-4" />
                  <span className="uppercase hidden sm:inline text-xs font-bold">{language}</span>
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full mt-2 z-50">
                    <div className={`w-32 backdrop-blur-xl rounded-2xl shadow-2xl border py-1.5 overflow-hidden ${theme === "dark" ? "bg-[#0a1020]/95 border-[rgba(0,191,255,0.15)]" : "bg-white/95 border-[rgba(0,136,204,0.12)]"}`}>
                      {(["ru", "en", "kz"] as const).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => { setLangOpen(false); setLanguage(lang); }}
                          className={`flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                            language === lang
                              ? theme === "dark" ? "text-[#00BFFF] bg-[rgba(0,191,255,0.08)]" : "text-[#0077b6] bg-[rgba(0,136,204,0.08)]"
                              : theme === "dark" ? "text-gray-300 hover:bg-white/5" : "text-gray-600 hover:bg-gray-100/60"
                          }`}
                        >
                          <span className="text-base">{lang === "ru" ? "🇷🇺" : lang === "en" ? "🇬🇧" : "🇰🇿"}</span>
                          <span className="uppercase text-xs font-bold">{lang}</span>
                          {language === lang && <span className={`ml-auto w-1.5 h-1.5 rounded-full ${theme === "dark" ? "bg-[#00BFFF] shadow-[0_0_8px_#00BFFF]" : "bg-[#0088cc] shadow-[0_0_6px_rgba(0,136,204,0.4)]"}`} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 border ${
                    theme === "dark"
                      ? "bg-[rgba(0,191,255,0.08)] border-[rgba(0,191,255,0.2)] text-[#00BFFF] hover:bg-[rgba(0,191,255,0.14)] hover:border-[rgba(0,191,255,0.35)]"
                      : "bg-[rgba(0,136,204,0.06)] border-[rgba(0,136,204,0.18)] text-[#0077b6] hover:bg-[rgba(0,136,204,0.12)] hover:border-[rgba(0,136,204,0.3)]"
                  }`}
                  title={theme === "dark" ? "Переключить на Light Tech" : "Переключить на Dark Tech"}
                >
                  {theme === "dark" ? (
                    <>
                      <Moon className="w-3.5 h-3.5" />
                      <span>Dark</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-3.5 h-3.5" />
                      <span>Light</span>
                    </>
                  )}
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                    theme === "dark" ? "bg-[#59DFFF]" : "bg-[#0088cc]"
                  }`} />
                </button>
              )}

              {/* Logout (desktop) */}
              {user && (
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="hidden lg:flex p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  title="Выйти из аккаунта"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}

              {/* Hamburger (mobile/tablet) */}
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className={`lg:hidden p-2 rounded-xl transition-all ${theme === "dark" ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/60"}`}
                aria-label="Меню"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className={`fixed inset-0 z-40 backdrop-blur-sm lg:hidden ${theme === "dark" ? "bg-black/60" : "bg-black/20"}`}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-16 left-0 right-0 z-40 lg:hidden transition-all duration-300 ease-out ${
          mobileOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div className={`mx-4 mt-2 backdrop-blur-2xl rounded-2xl border shadow-2xl overflow-hidden ${theme === "dark" ? "bg-[#0a1020]/95 border-[rgba(0,191,255,0.15)]" : "bg-white/95 border-[rgba(0,136,204,0.12)]"}`}>
          <div className="max-h-[calc(100svh-6rem)] overflow-y-auto">
            <div className="p-3 space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? theme === "dark" ? "bg-[rgba(0,191,255,0.08)] text-[#00BFFF] border-l-2 border-[#00BFFF]" : "bg-[rgba(0,136,204,0.08)] text-[#0077b6] border-l-2 border-[#0088cc]"
                        : theme === "dark" ? "text-gray-300 hover:bg-white/5" : "text-gray-600 hover:bg-gray-100/60"
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile theme toggle */}
            <div className="p-3 pt-0 sm:hidden">
              <button
                onClick={() => { toggleTheme(); }}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                  theme === "dark"
                    ? "bg-[rgba(0,191,255,0.08)] border-[rgba(0,191,255,0.2)] text-[#00BFFF]"
                    : "bg-[rgba(0,136,204,0.06)] border-[rgba(0,136,204,0.18)] text-[#0077b6]"
                }`}
              >
                <div className="flex items-center gap-3">
                  {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  <span>Тема: {theme === "dark" ? "Светлая" : "Тёмная"}</span>
                </div>
                <span className={`w-2 h-2 rounded-full ${theme === "dark" ? "bg-[#59DFFF]" : "bg-[#0088cc]"}`} />
              </button>
            </div>

            {user && (
              <div className="p-3 pt-0">
                <div className="divider my-2" />
                <button
                  onClick={() => { supabase.auth.signOut(); setMobileOpen(false); }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  Выйти из аккаунта
                </button>
              </div>
            )}

            <div className="h-safe-area-bottom" />
          </div>
        </div>
      </div>
    </>
  );
}

