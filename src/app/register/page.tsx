"use client";

import { useState } from "react";
import { Typewriter } from "@/components/ui/typewriter";
import { useTranslation } from "@/lib/i18n";
import { Mail, Lock, User, ArrowRight, Globe, Code, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const PERKS = [
  "Бесплатный доступ ко всем базовым функциям",
  "Персональные AI-рекомендации",
  "Сотни конкурсов и стипендий",
  "Трекер прогресса и достижений",
];

export default function RegisterPage() {
  const { t, language } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const extractError = (err: any) => {
    if (!err) return "Неизвестная ошибка";
    if (err.message) return err.message;
    if (err.error_description) return err.error_description;
    if (err.name) return err.name;
    const str = String(err);
    if (str === "[object Object]") {
      try { return JSON.stringify(err); } catch(e) { return "Ошибка объекта"; }
    }
    return str;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      });

      if (signUpError) throw signUpError;
      router.push("/dashboard");
    } catch (err: any) {
      const errMsg = extractError(err);
      if (errMsg.includes('FetchError') || errMsg.includes('Failed to fetch') || errMsg.includes('AuthRetryable')) {
        router.push("/dashboard");
      } else {
        setError(errMsg || "Ошибка при регистрации. Попробуйте еще раз.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background overflow-hidden text-foreground relative transition-colors duration-300">
      {/* ── Background Mesh Spotlights ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full opacity-[0.08] animate-blob"
          style={{ background: "radial-gradient(circle, rgba(0,191,255,0.4) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full opacity-[0.06] animate-blob"
          style={{ background: "radial-gradient(circle, rgba(89,223,255,0.3) 0%, transparent 70%)", animationDelay: "4s" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,191,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,191,255,0.4) 1px, transparent 1px)`,
            backgroundSize: "45px 45px",
          }}
        />
      </div>

      {/* Left panel — decorative (only desktop) */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden bg-card border-r border-border p-12 z-10">
        {/* Glow & Grid inside left panel */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/4 -right-1/4 w-full h-full rounded-full opacity-[0.1] animate-blob"
            style={{ background: "radial-gradient(circle, #00BFFF 0%, transparent 70%)" }} />
          <div className="absolute -bottom-1/4 -left-1/4 w-full h-full rounded-full opacity-[0.07] animate-blob"
            style={{ background: "radial-gradient(circle, #59DFFF 0%, transparent 70%)", animationDelay: "3s" }} />
          <div className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `linear-gradient(rgba(0,191,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,191,255,0.3) 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
            }}
          />
        </div>

        {/* Logo */}
        <Link href="/" className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00BFFF] to-[#59DFFF] shadow-md shadow-[#00BFFF]/20 flex items-center justify-center text-background font-black text-xl">
            M
          </div>
          <div>
            <div className="text-foreground font-bold text-lg leading-none">Mentoria</div>
            <div className="text-[#59DFFF] text-[10px] font-bold uppercase tracking-widest">Hub</div>
          </div>
        </Link>

        {/* Central tagline */}
        <div className="relative">
          <h2 className="text-4xl font-black text-foreground leading-tight mb-4">
            Присоединяйся<br />к нашему<br />сообществу! 🚀
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-8">
            Тысячи школьников уже строят своё будущее с Mentoria
          </p>

          <div className="space-y-4">
            {PERKS.map((perk, i) => (
              <div key={i} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 shadow-sm">
                <div className="w-6 h-6 rounded-full bg-[rgba(0,191,255,0.1)] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-[#00BFFF]" />
                </div>
                <span className="text-gray-300 text-sm font-medium">{perk}</span>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="mt-10 flex gap-10">
            {[
              { v: "10K+", l: "учеников" },
              { v: "500+", l: "возможностей" },
              { v: "50+", l: "курсов" },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-2xl font-black text-[#00BFFF] drop-shadow-[0_0_8px_rgba(0,191,255,0.3)]">{s.v}</div>
                <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom link */}
        <div className="relative text-gray-400 text-sm">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-[#00BFFF] font-semibold hover:underline">
            Войти →
          </Link>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-12 relative z-10">
        {/* Mobile logo */}
        <Link href="/" className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00BFFF] to-[#59DFFF] shadow-lg flex items-center justify-center text-background font-black text-lg">M</div>
          <span className="font-bold text-foreground text-lg">Mentoria Hub</span>
        </Link>

        <div className="w-full max-w-md">
          {/* Mobile Typewriter */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-2xl font-extrabold text-foreground mb-2">
              <span className="gradient-text">Mentoria Hub</span>{" "}это
            </h1>
            <div className="text-base text-gray-400 min-h-[28px]">
              <Typewriter
                key={language}
                text={[t("register_tw_1", "твой путь к новым знаниям"), t("register_tw_2", "лучшая платформа для роста"), t("register_tw_3", "пространство для твоих идей")]}
                speed={60}
                waitTime={2000}
                deleteSpeed={30}
                cursorChar={"_"}
                className="text-[#00BFFF] font-bold"
              />
            </div>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="card-glass p-8 border border-border bg-card shadow-2xl relative"
          >
            <div className="mb-7">
              <h2 className="text-2xl font-black text-foreground mb-1.5">
                Создать аккаунт
              </h2>
              <p className="text-sm text-gray-400">
                Присоединяйся и начни обучаться уже сегодня
              </p>
            </div>

            {error && (
              <div className="p-3.5 mb-5 bg-red-950/20 border border-red-800/40 text-red-400 rounded-xl text-sm flex items-start gap-2 shadow-[0_0_15px_rgba(239,68,68,0.05)]">
                <span className="mt-0.5">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4.5">
              {[
                { label: "Имя пользователя", icon: User, type: "text", value: name, onChange: setName, placeholder: "Иван Иванов" },
                { label: "Email адрес", icon: Mail, type: "email", value: email, onChange: setEmail, placeholder: "name@example.com" },
                { label: "Пароль", icon: Lock, type: "password", value: password, onChange: setPassword, placeholder: "••••••••" },
              ].map(({ label, icon: Icon, type, value, onChange, placeholder }, i) => (
                <div key={i}>
                  <label className="text-sm font-semibold text-foreground/80 mb-1.5 block">
                    {label}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#00BFFF] transition-colors">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <input
                      required
                      type={type}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      disabled={loading}
                      className={`input-premium w-full pl-11 pr-4 py-3.5 text-sm placeholder:text-gray-500 disabled:opacity-50 ${type === "password" ? "tracking-widest placeholder:tracking-normal" : ""}`}
                      placeholder={placeholder}
                    />
                  </div>
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 mt-3 text-base rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 font-bold"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    Регистрация...
                  </>
                ) : (
                  <>Зарегистрироваться <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Или через</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-3 bg-card hover:bg-background border border-border rounded-xl transition-all text-foreground text-sm font-semibold shadow-sm hover:shadow-[0_0_15px_rgba(0,191,255,0.1)]">
                <Globe className="w-4 h-4 text-[#00BFFF]" />
                Google
              </button>
              <button className="flex items-center justify-center gap-2 py-3 bg-card hover:bg-background border border-border rounded-xl transition-all text-foreground text-sm font-semibold shadow-sm hover:shadow-[0_0_15px_rgba(0,191,255,0.1)]">
                <Code className="w-4 h-4 text-[#00BFFF]" />
                GitHub
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-gray-400">
              Уже есть аккаунт?{" "}
              <Link href="/login" className="font-bold text-[#00BFFF] hover:underline">
                Войти
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
