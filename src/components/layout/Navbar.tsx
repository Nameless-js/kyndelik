"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, BookOpen, Compass, Settings,
  User, Moon, Sun, Globe, Calendar, Map, LogOut
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useTranslation } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function Navbar() {
  const pathname = usePathname();
  const { profile, user } = useAppStore();
  const { t, language, setLanguage } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const links = [
    { href: "/",                                      label: t("home"),          icon: Compass },
    { href: "/opportunities",                         label: t("opportunities"), icon: Compass },
    { href: "/courses",                               label: t("courses"),       icon: BookOpen },
    { href: "/calendar",                              label: t("calendar"),      icon: Calendar },
    { href: "/roadmap",                               label: t("roadmap"),       icon: Map },
    { href: profile ? "/dashboard" : "/onboarding",  label: t("dashboard"),     icon: LayoutDashboard },
    { href: "/admin",                                 label: t("admin"),         icon: Settings },
    { href: "/mentor",                                label: t("mentor"),        icon: User },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
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

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium py-2">
                <Globe className="w-5 h-5" />
                <span className="uppercase">{language}</span>
              </button>
              <div className="absolute right-0 top-full pt-1 hidden group-hover:block z-10">
                <div className="w-24 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2">
                  {(["ru", "en", "kz"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 uppercase"
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
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

            {/* Logout Button */}
            {user && (
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-red-500 hover:text-red-600 transition-colors ml-2"
                title="Выйти из аккаунта"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}

            <div className="lg:hidden ml-2 flex items-center">
              <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900">
                <User className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
