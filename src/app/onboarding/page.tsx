"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { ArrowRight, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Typewriter } from "@/components/ui/typewriter";

const GRADES = ["7", "8", "9", "10", "11", "12"];
const INTERESTS = [
  { id: "business", label: "Бизнес" },
  { id: "stem", label: "STEM" },
  { id: "social", label: "Социальное влияние" },
  { id: "finance", label: "Финансы" },
  { id: "programming", label: "Программирование" },
  { id: "science", label: "Наука" },
];

export default function Onboarding() {
  const router = useRouter();
  const { setProfile, user, profile } = useAppStore();
  
  // Step 0: Registration, 1: Name/Grade, 2: Interests, 3: Goals
  const [step, setStep] = useState(0); 
  
  // Auth state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Profile state
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [goals, setGoals] = useState("");

  // Skip auth step if already logged in
  useEffect(() => {
    // If the user is fully logged in and already has a profile, go straight to the dashboard
    if (profile) {
      router.push("/dashboard");
      return;
    }

    if (user && step === 0) {
      setStep(1);
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

  const [isLogin, setIsLogin] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSignUp = async () => {
    setAuthLoading(true);
    setAuthError("");
    setSuccessMsg("");
    try {
      if (isLogin) {
        // Explicit Login
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) setAuthError(extractError(signInError));
        else setStep(1);
      } else {
        // Signup
        const { data, error } = await supabase.auth.signUp({ email, password });
        
        if (error) {
          const errMsg = extractError(error).toLowerCase();
          
          if (errMsg.includes('already registered') || errMsg.includes('too many requests') || errMsg.includes('rate limit')) {
             const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
             if (signInError) {
               setAuthError(extractError(error)); // Show original signup error if signin also fails
             } else {
               setStep(1);
             }
          } else if (errMsg.includes('fetcherror') || errMsg.includes('failed to fetch')) {
             setStep(1); // Bypass for demo
          } else {
             setAuthError(extractError(error));
          }
        } else {
          // If signup is successful but there's no session, it means email confirmation is required
          if (data.user && !data.session) {
            setSuccessMsg("Регистрация успешна! Пожалуйста, проверьте вашу почту и перейдите по ссылке для подтверждения, затем нажмите 'Войти'.");
            setIsLogin(true); // Switch to login mode for when they return
          } else {
            setStep(1);
          }
        }
      }
    } catch (err: any) {
      const errMsg = extractError(err).toLowerCase();
      if (errMsg.includes('fetcherror') || errMsg.includes('failed to fetch')) {
         setStep(1);
      } else {
         setAuthError(extractError(err));
      }
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Заголовок с печатным текстом */}
      <div className="mb-8 text-center z-10 w-full max-w-2xl mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
            Mentoria Hub
          </span>{" "}
          <span className="text-gray-800">это</span>
        </h1>
        <div className="text-xl sm:text-2xl font-medium text-gray-600 min-h-[40px]">
          <Typewriter
            text={[
              "твой путь к новым знаниям",
              "лучшая платформа для роста",
              "сообщество крутых менторов",
              "удобный интерактивный формат",
              "пространство для твоих идей",
            ]}
            speed={60}
            waitTime={2000}
            deleteSpeed={30}
            cursorChar={"_"}
            className="text-blue-600 font-bold"
          />
        </div>
      </div>

      <div className="max-w-md w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {step === 0 && "Регистрация"}
                {step === 1 && "Давай познакомимся!"}
                {step === 2 && "Что тебе интересно?"}
                {step === 3 && "Какие у тебя цели?"}
              </h2>
              {step > 0 && (
                <div className="flex gap-2 mt-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`h-2 flex-1 rounded-full ${step >= i ? "bg-blue-600" : "bg-gray-200"}`} />
                  ))}
                </div>
              )}
            </div>

            {step === 0 && (
              <div className="space-y-6">
                {authError && <div className="p-3 bg-red-100 text-red-700 rounded-xl text-sm">{authError}</div>}
                {successMsg && <div className="p-3 bg-green-100 text-green-700 rounded-xl text-sm">{successMsg}</div>}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder-gray-400"
                    placeholder="student@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Пароль</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder-gray-400"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  onClick={handleSignUp}
                  disabled={authLoading || !email || !password}
                  className="w-full flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {authLoading ? "Загрузка..." : (isLogin ? "Войти" : "Создать аккаунт")}
                  {!authLoading && <ArrowRight className="ml-2 w-5 h-5" />}
                </button>
                <div className="text-center mt-4">
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {isLogin ? "Нет аккаунта? Зарегистрируйтесь" : "Уже есть аккаунт? Войти"}
                  </button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Как тебя зовут?</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 placeholder-gray-400"
                    placeholder="Твое имя"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">В каком ты классе?</label>
                  <div className="grid grid-cols-3 gap-3">
                    {GRADES.map(g => (
                      <button
                        key={g}
                        onClick={() => setGrade(g)}
                        className={`py-2 rounded-xl border text-sm font-medium transition-all ${
                          grade === g ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                        }`}
                      >
                        {g} класс
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <p className="text-gray-600 text-sm mb-4">Выбери направления, чтобы мы могли подобрать лучшие возможности.</p>
                <div className="grid grid-cols-2 gap-3">
                  {INTERESTS.map(interest => {
                    const isSelected = selectedInterests.includes(interest.id);
                    return (
                      <button
                        key={interest.id}
                        onClick={() => toggleInterest(interest.id)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                          isSelected ? "bg-blue-50 border-blue-600 text-blue-700" : "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
                        }`}
                      >
                        <span className="text-sm font-medium">{interest.label}</span>
                        {isSelected && <Check className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Чего ты хочешь достичь с Mentoria?</label>
                <textarea
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-gray-900 placeholder-gray-400"
                  placeholder="Например: хочу поступить в плющевую лигу, выиграть олимпиаду по математике или создать свой стартап..."
                />
              </div>
            )}

            {step > 0 && (
              <div className="mt-8">
                <button
                  onClick={handleNext}
                  disabled={(step === 1 && (!name || !grade)) || (step === 2 && selectedInterests.length === 0)}
                  className="w-full flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {step === 3 ? "Перейти в кабинет" : "Продолжить"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
