"use client"

import Link from "next/link";
import { ArrowRight, Search, BookOpen, Target, Zap, Users, Star, Trophy } from "lucide-react";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { TextRotate } from "@/components/ui/text-rotate";
import Floating, { FloatingElement } from "@/components/ui/parallax-floating";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { LayoutGroup, motion } from "framer-motion";
import { useTheme } from "@/lib/theme";
import { useTranslation } from "@/lib/i18n";

function FeatureCard({ icon: Icon, title, description, theme }: any) {
  const isDark = theme === "dark";
  return (
    <div className={`relative w-64 p-6 rounded-2xl backdrop-blur-xl border flex flex-col pointer-events-none group overflow-hidden shadow-lg transition-all duration-500 ${
      isDark
        ? "bg-[#0a1020]/75 border-[rgba(0,191,255,0.15)] hover:shadow-[0_0_30px_rgba(0,191,255,0.25)]"
        : "bg-white/70 border-[rgba(0,136,204,0.12)] hover:shadow-[0_0_24px_rgba(0,136,204,0.15)]"
    }`}>
      {/* subtle glowing overlay */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
        isDark ? "bg-gradient-to-br from-[rgba(0,191,255,0.06)] to-transparent" : "bg-gradient-to-br from-[rgba(0,136,204,0.04)] to-transparent"
      }`} />
      <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${
        isDark
          ? "from-[#00BFFF] to-[#59DFFF] shadow-[0_0_15px_rgba(0,191,255,0.25)]"
          : "from-[#0088cc] to-[#00a3e0] shadow-[0_0_12px_rgba(0,136,204,0.2)]"
      }`}>
        <Icon className="w-6 h-6 text-white font-black" />
      </div>
      <h3 className={`relative text-base font-bold mb-2 transition-colors duration-300 ${
        isDark ? "text-white group-hover:text-[#59DFFF]" : "text-gray-900 group-hover:text-[#0077b6]"
      }`}>{title}</h3>
      <p className={`relative leading-relaxed text-[13px] transition-colors duration-300 ${
        isDark ? "text-gray-400 group-hover:text-gray-200" : "text-gray-500 group-hover:text-gray-700"
      }`}>
        {description}
      </p>
    </div>
  );
}

function StatCard({ value, label, theme }: any) {
  const isDark = theme === "dark";
  return (
    <div className="flex flex-col items-center gap-1 group">
      <div className={`text-3xl sm:text-4xl font-extrabold transition-transform duration-300 group-hover:scale-105 ${
        isDark ? "text-[#00BFFF] drop-shadow-[0_0_15px_rgba(0,191,255,0.4)]" : "text-[#0077b6] drop-shadow-[0_0_10px_rgba(0,136,204,0.2)]"
      }`}>
        {value}
      </div>
      <div className={`text-xs font-semibold uppercase tracking-wider text-center ${
        isDark ? "text-gray-400" : "text-gray-500"
      }`}>{label}</div>
    </div>
  );
}

export default function Home() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { t, language } = useTranslation();

  // Hero rotating words — respects active language
  const rotatingWords = [
    t("hero_rotating_1"),
    t("hero_rotating_2"),
    t("hero_rotating_3"),
    t("hero_rotating_4"),
  ];

  return (
    <div className={`min-h-screen overflow-hidden relative ${isDark ? "bg-[#050505] text-white" : "bg-[#f0f4f8] text-gray-900"}`}>
      {/* ── Background Mesh ─────────────────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Dynamic Neon Spotlights */}
        <div
          className="absolute -top-[10%] -left-[10%] w-[55%] h-[55%] rounded-full animate-blob"
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(0,191,255,0.4) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(0,136,204,0.12) 0%, transparent 70%)",
            opacity: isDark ? 0.15 : 0.4,
          }}
        />
        <div
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full animate-blob"
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(89,223,255,0.3) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(0,163,224,0.1) 0%, transparent 70%)",
            animationDelay: "5s",
            opacity: isDark ? 0.12 : 0.35,
          }}
        />
        <div
          className="absolute top-[25%] right-[10%] w-[35%] h-[35%] rounded-full animate-blob"
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(0,191,255,0.3) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(0,136,204,0.08) 0%, transparent 70%)",
            animationDelay: "3s",
            opacity: isDark ? 0.08 : 0.3,
          }}
        />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: isDark
              ? `linear-gradient(rgba(0,191,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,191,255,0.4) 1px, transparent 1px)`
              : `linear-gradient(rgba(0,136,204,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(0,136,204,0.12) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
            opacity: isDark ? 0.06 : 0.25,
          }}
        />
        {/* BackgroundPaths animated SVG layer */}
        <BackgroundPaths className="absolute inset-0 opacity-40" />
      </div>

      {/* ── Hero Section ───────────────────────────────────────────────── */}
      <section className="w-full min-h-[100svh] overflow-hidden flex flex-col items-center justify-center relative pt-10">
        {/* Floating Cards (Only Desktop) */}
        <Floating sensitivity={-0.4} className="h-full w-full absolute inset-0 z-0 hidden md:block pointer-events-none">
          <FloatingElement depth={0.4} className="top-[22%] left-[4%] rotate-[-6deg]">
            <FeatureCard
              icon={Search}
              title="Находи лучшее"
              description="Сотни конкурсов, стипендий и программ, отфильтрованных по твоим интересам."
              theme={theme}
            />
          </FloatingElement>

          <FloatingElement depth={0.9} className="top-[65%] left-[8%] rotate-[8deg]">
            <FeatureCard
              icon={BookOpen}
              title="Учись в своём темпе"
              description="Асинхронные курсы от экспертов Mentoria. Видео, задания, всё в одном месте."
              theme={theme}
            />
          </FloatingElement>

          <FloatingElement depth={1.8} className="top-[12%] left-[78%] rotate-[6deg]">
            <FeatureCard
              icon={Target}
              title="Достигай целей"
              description="Персональные рекомендации и прогресс в едином личном кабинете."
              theme={theme}
            />
          </FloatingElement>

          <FloatingElement depth={1.2} className="top-[62%] left-[78%] rotate-[-10deg]">
            <FeatureCard
              icon={Zap}
              title="Развивайся быстрее"
              description="Стажировки и реальный опыт в ведущих компаниях мира."
              theme={theme}
            />
          </FloatingElement>
        </Floating>

        {/* Hero content wrapper */}
        <div className="relative flex flex-col justify-center items-center w-[90%] max-w-4xl md:max-w-[56%] z-20 text-center px-4">
          {/* Neon Star Badge */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold mb-8 uppercase tracking-wider border ${
              isDark
                ? "bg-[rgba(0,191,255,0.06)] border-[rgba(0,191,255,0.25)] text-[#59DFFF] shadow-[0_0_15px_rgba(0,191,255,0.15)]"
                : "bg-[rgba(0,136,204,0.06)] border-[rgba(0,136,204,0.18)] text-[#0077b6] shadow-[0_0_10px_rgba(0,136,204,0.06)]"
            }`}
          >
            <Star className={`w-3.5 h-3.5 fill-current ${isDark ? "text-[#00BFFF]" : "text-[#0088cc]"}`} />
            {t("hero_badge")}
          </motion.div>

          {/* Title with vertical rotate */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center w-full justify-center items-center flex-col flex leading-[1.15] font-black tracking-tight space-y-4 relative z-20"
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          >
            <div className="flex flex-wrap justify-center items-center gap-x-4 px-2">
              <span>{t("hero_subtitle")}</span>
              <LayoutGroup>
                <motion.span layout className="inline-flex justify-center flex-wrap max-w-full">
                  <TextRotate
                    key={language}
                    texts={rotatingWords}
                    mainClassName={`bg-gradient-to-r bg-clip-text text-transparent py-0 pb-1 rounded-xl flex-wrap text-center ${
                      isDark
                        ? "from-[#00BFFF] to-[#59DFFF] text-shadow-[0_0_12px_rgba(0,191,255,0.4)]"
                        : "from-[#0077b6] to-[#00a3e0]"
                    }`}
                    staggerDuration={0.03}
                    staggerFrom="last"
                    rotationInterval={2800}
                    transition={{ type: "spring", damping: 28, stiffness: 380 }}
                  />
                </motion.span>
              </LayoutGroup>
            </div>
            <span className={`font-extrabold ${isDark ? "text-gray-400" : "text-gray-500"}`}>{t("hero_second_line")}</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className={`text-base sm:text-lg md:text-xl pt-6 max-w-2xl leading-relaxed ${isDark ? "text-gray-400" : "text-gray-500"}`}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.35 }}
          >
            {t("hero_description")}
          </motion.p>

          {/* CTA Buttons with Neon Ripple */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4 mt-10 w-full max-w-md"
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
          >
            <Link
              href="/opportunities"
              className="btn-primary inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-xl"
            >
              {t("btn_find_opportunities")}
              <Search className="ml-2 w-5 h-5 text-[#050505] group-hover:text-white transition-colors" />
            </Link>
            <Link
              href="/courses"
              className="btn-secondary inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl"
            >
              {t("btn_start_learning")}
              <BookOpen className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className={`mt-16 flex items-center justify-center gap-8 sm:gap-14 backdrop-blur-md px-8 py-5 rounded-2xl border ${
              isDark
                ? "bg-[#0a1020]/40 border-[rgba(0,191,255,0.08)] shadow-[0_0_20px_rgba(0,191,255,0.02)]"
                : "bg-white/50 border-[rgba(0,136,204,0.1)] shadow-[0_4px_20px_rgba(0,80,160,0.04)]"
            }`}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.65 }}
          >
            <StatCard value="500+" label={t("stat_opportunities")} theme={theme} />
            <div className={`w-px h-10 ${isDark ? "bg-[rgba(0,191,255,0.15)]" : "bg-[rgba(0,136,204,0.12)]"}`} />
            <StatCard value="50+" label={t("stat_courses")} theme={theme} />
            <div className={`w-px h-10 ${isDark ? "bg-[rgba(0,191,255,0.15)]" : "bg-[rgba(0,136,204,0.12)]"}`} />
            <StatCard value="10K+" label={t("stat_students")} theme={theme} />
          </motion.div>
        </div>

        {/* Scroll indicator with animated cursor dot */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ delay: 1.2 }}
        >
          <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-[#00BFFF]/60" : "text-[#0088cc]/50"}`}>Листай вниз</span>
          <div className={`w-5 h-8 border-2 rounded-full flex items-start justify-center pt-1.5 ${
            isDark ? "border-[rgba(0,191,255,0.3)] shadow-[0_0_10px_rgba(0,191,255,0.05)]" : "border-[rgba(0,136,204,0.25)]"
          }`}>
            <motion.div
              className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-[#00BFFF] shadow-[0_0_8px_#00BFFF]" : "bg-[#0088cc] shadow-[0_0_6px_rgba(0,136,204,0.4)]"}`}
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </section>

      {/* ── Mobile Feature Cards ─────────────────────────────────────── */}
      <section className="py-16 md:hidden relative z-10 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: Search, title: "Находи лучшее", desc: "Сотни конкурсов, стипендий и программ по твоим интересам." },
              { icon: BookOpen, title: "Учись в своём темпе", desc: "Асинхронные курсы от экспертов Mentoria." },
              { icon: Target, title: "Достигай целей", desc: "Персональные рекомендации и отслеживание прогресса." },
            ].map((item, i) => (
              <div key={i} className="card-premium p-6 flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00BFFF] to-[#59DFFF] rounded-xl flex items-center justify-center shadow-[0_0_12px_rgba(0,191,255,0.2)] shrink-0">
                  <item.icon className="w-6 h-6 text-background font-black" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Strip ───────────────────────────────────────────── */}
      <section className="relative py-24 z-10 bg-background/80 border-t border-border">
        {/* Glow behind section title */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[150px] bg-blue-500/5 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(0,191,255,0.06)] border border-border text-[#59DFFF] text-xs font-bold uppercase tracking-widest mb-5 shadow-[0_0_10px_rgba(0,191,255,0.05)]">
              Возможности платформы
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
              Всё что нужно для <span className="gradient-text">роста</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
              Мы создали экосистему, где каждый школьник может найти свой путь к успеху
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Search,
                title: "Умный поиск",
                desc: "Фильтрация по интересам, возрасту и формату участия",
              },
              {
                icon: BookOpen,
                title: "Курсы от экспертов",
                desc: "Видеоуроки, задания и сертификаты по завершении",
              },
              {
                icon: Trophy,
                title: "Лидерборд",
                desc: "Соревнуйся с тысячами учеников по всей стране",
              },
              {
                icon: Zap,
                title: "AI-Ассистент",
                desc: "Персональные рекомендации на основе твоего профиля",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="card-premium p-6 bg-card border border-border group relative"
              >
                {/* Tech Grid Lines in Card BG */}
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] group-hover:opacity-[0.06] transition-opacity" />
                
                <div className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-[0_0_12px_rgba(0,191,255,0.15)] bg-gradient-to-br from-[#00BFFF] to-[#59DFFF] group-hover:scale-110 transition-transform duration-300">
                  <f.icon className="w-6 h-6 text-background font-black" />
                </div>
                <h3 className="font-bold text-foreground mb-2 group-hover:text-[#59DFFF] transition-colors">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────────────────────────── */}
      <section className="relative py-28 overflow-hidden z-10 border-t border-border bg-background">
        {/* Spotlight Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-[var(--surface-2)] to-background z-0" />
        
        {/* Floating gradient lights */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 rounded-full opacity-[0.07] animate-blob"
            style={{ background: "radial-gradient(circle, #00BFFF 0%, transparent 70%)" }} />
          <div className="absolute -bottom-1/4 -right-1/4 w-3/4 h-3/4 rounded-full opacity-[0.05] animate-blob"
            style={{ background: "radial-gradient(circle, #59DFFF 0%, transparent 70%)", animationDelay: "4s" }} />
          {/* Tech Grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(rgba(0,191,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,191,255,0.4) 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(0,191,255,0.06)] border border-border text-[#59DFFF] text-xs font-bold uppercase tracking-widest mb-8 shadow-[0_0_10px_rgba(0,191,255,0.05)]">
            <Star className="w-3.5 h-3.5 fill-current text-[#00BFFF]" />
            Присоединяйся сегодня
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-6 leading-[1.2]">
            Готов начать<br /><span className="gradient-text">свой путь?</span>
          </h2>
          <p className="text-gray-400 mb-10 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Присоединяйся к тысячам школьников, которые уже строят своё будущее с Mentoria.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/onboarding"
              className="btn-primary inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-xl w-full sm:w-auto text-center"
            >
              Начать бесплатно
              <ArrowRight className="ml-2 w-5 h-5 text-[#050505]" />
            </Link>
            <Link
              href="/login"
              className="btn-secondary inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl w-full sm:w-auto text-center"
            >
              Войти в аккаунт
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
