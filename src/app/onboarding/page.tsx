"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { useTranslation } from "@/lib/i18n";
import { ArrowRight, Check, User, Mail, Lock, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Typewriter } from "@/components/ui/typewriter";
import { motion } from "framer-motion";

const GRADES = ["7", "8", "9", "10", "11", "12"];
const INTERESTS = [
  { id: "business",     label: "🏢 Бизнес" },
  { id: "stem",         label: "⚗️ STEM" },
  { id: "social",       label: "🌍 Соц. влияние" },
  { id: "finance",      label: "💰 Финансы" },
  { id: "programming",  label: "💻 Программирование" },
  { id: "science",      label: "🔬 Наука" },
];

export default function Onboarding() {
  const router = useRouter();
  const { setProfile, user, profile } = useAppStore();
  const { t, language } = useTranslation();

  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [goals, setGoals] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (profile) { router.push("/dashboard"); return; }
    if (user && step === 0) {
      Promise.resolve().then(() => {
        setStep(1);
      });
    }
  }, [user, profile, step, router]);

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

  const handleSignUp = async () => {
    setAuthLoading(true);
    setAuthError("");
    setSuccessMsg("");
    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) setAuthError(extractError(signInError));
        else setStep(1);
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
          const errMsg = extractError(error).toLowerCase();
          if (errMsg.includes('already registered') || errMsg.includes('too many requests') || errMsg.includes('rate limit')) {
            const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
            if (signInError) setAuthError(extractError(error));
            else setStep(1);
          } else if (errMsg.includes('fetcherror') || errMsg.includes('failed to fetch')) {
            setStep(1);
          } else {
            setAuthError(extractError(error));
          }
        } else {
          if (data.user && !data.session) {
            setSuccessMsg("Регистрация успешна! Подтвердите почту и нажмите 'Войти'.");
            setIsLogin(true);
          } else {
            setStep(1);
          }
        }
      }
    } catch (err: any) {
      const errMsg = extractError(err).toLowerCase();
      if (errMsg.includes('fetcherror') || errMsg.includes('failed to fetch')) setStep(1);
      else setAuthError(extractError(err));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else handleFinish();
  };

  const handleFinish = async () => {
    await setProfile({ name, grade, interests: selectedInterests, goals });
    router.push("/dashboard");
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const stepTitles = ["", "Давай познакомимся!", "Что тебе интересно?", "Какие у тебя цели?"];
  const stepSubtitles = ["", "Расскажи нам о себе", "Выбери свои направления", "Поставь амбициозные цели"];

  // Language-aware Typewriter texts
  const typewriterTexts = [
    t("onboarding_tw_1"),
    t("onboarding_tw_2"),
    t("onboarding_tw_3"),
  ];
  const copula = t("onboarding_copula");

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center py-12 px-4 relative transition-colors duration-300">
      {/* ── Background Mesh ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full opacity-[0.07] animate-blob"
          style={{ background: "radial-gradient(circle, rgba(0,191,255,0.4) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full opacity-[0.06] animate-blob"
          style={{ background: "radial-gradient(circle, rgba(89,223,255,0.3) 0%, transparent 70%)", animationDelay: "3s" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,191,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,191,255,0.4) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Header tagline */}
      <div className="mb-8 text-center max-w-xl relative z-10">
        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00BFFF] to-[#59DFFF] shadow-md shadow-[#00BFFF]/20 flex items-center justify-center text-background font-black text-sm">M</div>
          <span className="font-bold text-foreground">Mentoria Hub</span>
        </div>
        {/* Title line */}
        <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-0 leading-tight">
          <span className="gradient-text">Mentoria Hub</span>
          {" "}
          <span className="text-gray-400 font-medium">{copula}</span>
        </h1>
        {/* Animated words — same visual size, rendered below as continuation */}
        <div className="text-2xl sm:text-3xl font-black min-h-[3.5rem] sm:min-h-[4.5rem] mt-0.5 w-full overflow-visible whitespace-normal">
          <Typewriter
            key={language}
            text={typewriterTexts}
            speed={55}
            waitTime={2200}
            deleteSpeed={28}
            cursorChar={"_"}
            className="text-[#00BFFF]"
          />
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="card-glass p-8 border border-border bg-card shadow-2xl"
        >
          {/* Step header */}
          <div className="mb-7">
            {step === 0 ? (
              <div>
                <h2 className="text-2xl font-black text-foreground mb-1.5">
                  {isLogin ? "Добро пожаловать!" : "Начни бесплатно"}
                </h2>
                <p className="text-sm text-gray-400">
                  {isLogin ? "Войди в свой аккаунт" : "Создай аккаунт, чтобы продолжить"}
                </p>
              </div>
            ) : (
              <div>
                <div className="flex gap-2.5 mb-5">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        step > i
                          ? "bg-gradient-to-r from-[#00BFFF] to-[#59DFFF] shadow-[0_0_8px_rgba(0,191,255,0.3)]"
                          : step === i
                          ? "bg-gradient-to-r from-[#00BFFF] to-[#59DFFF] opacity-100"
                          : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00BFFF] to-[#59DFFF] flex items-center justify-center text-background text-xs font-black shadow-[0_0_10px_rgba(0,191,255,0.2)] animate-pulse">
                    {step}
                  </div>
                  <h2 className="text-xl font-black text-foreground">
                    {stepTitles[step]}
                  </h2>
                </div>
                <p className="text-sm text-gray-400 pl-9">{stepSubtitles[step]}</p>
              </div>
            )}
          </div>

          {/* Step 0: Auth */}
          {step === 0 && (
            <div className="space-y-5">
              {authError && (
                <div className="p-3.5 bg-red-950/20 border border-red-800/40 text-red-400 rounded-xl text-sm flex items-start gap-2 shadow-[0_0_15px_rgba(239,68,68,0.05)]">
                  <span>⚠️</span>
                  <span>{authError}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3.5 bg-green-950/20 border border-green-800/40 text-green-400 rounded-xl text-sm flex items-start gap-2">
                  <span>✅</span>
                  <span>{successMsg}</span>
                </div>
              )}

              {[
                { label: "Email", icon: Mail, type: "email", value: email, onChange: setEmail, placeholder: "student@example.com" },
                { label: "Пароль", icon: Lock, type: "password", value: password, onChange: setPassword, placeholder: "••••••••" },
              ].map(({ label, icon: Icon, type, value, onChange, placeholder }) => (
                <div key={label}>
                  <label className="text-sm font-semibold text-foreground/85 mb-1.5 block">{label}</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#00BFFF] transition-colors">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <input
                      type={type}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      className={`input-premium w-full pl-10 pr-4 py-3.5 text-sm placeholder:text-gray-500 ${type === "password" ? "tracking-widest placeholder:tracking-normal" : ""}`}
                      placeholder={placeholder}
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={handleSignUp}
                disabled={authLoading || !email || !password}
                className="btn-primary w-full flex items-center justify-center gap-2 py-4 rounded-xl text-base font-bold disabled:opacity-50 mt-2"
              >
                {authLoading ? (
                  <><span className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" /> Загрузка...</>
                ) : (
                  <>{isLogin ? "Войти" : "Создать аккаунт"} <ArrowRight className="w-5 h-5" /></>
                )}
              </button>

              <button
                onClick={() => { setIsLogin(!isLogin); setAuthError(""); setSuccessMsg(""); }}
                className="w-full text-center text-sm text-[#00BFFF] hover:underline font-semibold"
              >
                {isLogin ? "Нет аккаунта? Зарегистрируйся" : "Уже есть аккаунт? Войти"}
              </button>
            </div>
          )}

          {/* Step 1: Name & Grade */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-foreground/80 mb-2 block flex items-center gap-2">
                  <User className="w-4 h-4 text-[#00BFFF]" /> Как тебя зовут?
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-premium w-full px-4 py-3.5 text-sm placeholder:text-gray-500"
                  placeholder="Твоё имя"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground/80 mb-2.5 block">
                  В каком ты классе?
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {GRADES.map(g => (
                    <button
                      key={g}
                      onClick={() => setGrade(g)}
                      className={`py-3.5 rounded-xl border text-sm font-bold transition-all duration-300 ${
                        grade === g
                          ? "bg-gradient-to-br from-[#00BFFF] to-[#59DFFF] text-background border-transparent shadow-md shadow-[#00BFFF]/20"
                          : "bg-card hover:bg-background text-foreground border-border hover:border-[#00BFFF]/45"
                      }`}
                    >
                      {g} кл.
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Interests */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                Выбери направления — мы подберём лучшие возможности
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {INTERESTS.map(interest => {
                  const isSelected = selectedInterests.includes(interest.id);
                  return (
                    <button
                      key={interest.id}
                      onClick={() => toggleInterest(interest.id)}
                      className={`relative flex items-center justify-between p-3.5 rounded-xl border text-sm font-semibold transition-all duration-300 ${
                        isSelected
                          ? "bg-gradient-to-br from-[#00BFFF] to-[#59DFFF] text-background border-transparent shadow-md shadow-[#00BFFF]/20"
                          : "bg-card hover:bg-background border-border hover:border-[#00BFFF]/45 text-foreground"
                      }`}
                    >
                      <span>{interest.label}</span>
                      {isSelected && (
                        <div className="w-5 h-5 bg-background/20 rounded-full flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-background" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Goals */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-[#00BFFF]/5 border border-[rgba(0,191,255,0.2)] rounded-xl p-4 flex items-start gap-3 shadow-[0_0_15px_rgba(0,191,255,0.05)]">
                <Sparkles className="w-5 h-5 text-[#00BFFF] shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Твои цели помогут AI-ассистенту создать персональный план развития!
                </p>
              </div>
              <label className="text-sm font-semibold text-foreground/80 mb-1 block">
                Чего ты хочешь достичь с Mentoria?
              </label>
              <textarea
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                rows={4}
                className="input-premium w-full px-4 py-3.5 text-sm placeholder:text-gray-500 resize-none"
                placeholder="Например: хочу поступить в топ-университет, выиграть олимпиаду или создать свой стартап..."
              />
            </div>
          )}

          {/* Next button for steps 1–3 */}
          {step > 0 && (
            <div className="mt-7">
              <button
                onClick={handleNext}
                disabled={
                  (step === 1 && (!name || !grade)) ||
                  (step === 2 && selectedInterests.length === 0)
                }
                className="btn-primary w-full flex items-center justify-center gap-2 py-4 rounded-xl text-base font-bold disabled:opacity-40"
              >
                {step === 3 ? t("finish_btn") : t("continue_btn")}
                <ArrowRight className="w-5 h-5 text-background group-hover:text-white" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
