"use client"

import Link from "next/link";
import { ArrowRight, Search, BookOpen, Target } from "lucide-react";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { TextRotate } from "@/components/ui/text-rotate";
import Floating, { FloatingElement } from "@/components/ui/parallax-floating";
import { LayoutGroup, motion } from "framer-motion";

function FeatureCard({ icon: Icon, title, description, bgClass, textClass }: any) {
  return (
    <div className="w-64 p-6 rounded-2xl bg-white shadow-2xl border border-gray-100 flex flex-col pointer-events-none hover:scale-105 transition-transform duration-200">
      <div className={`w-14 h-14 ${bgClass} rounded-xl flex items-center justify-center ${textClass} mb-6`}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Section */}
      <section className="w-full h-[100svh] overflow-hidden flex flex-col items-center justify-center relative bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50/50" />
        
        {/* Floating Cards Background */}
        <Floating sensitivity={-0.5} className="h-full z-0 hidden md:block">
          <FloatingElement depth={0.5} className="top-[15%] left-[2%] md:top-[20%] md:left-[5%] rotate-[-6deg]">
            <FeatureCard 
              icon={Search} 
              title="Находи лучшее" 
              description="Сотни конкурсов, стипендий и программ, отфильтрованных по твоим интересам и возрасту. Не упусти свой шанс."
              bgClass="bg-blue-100" textClass="text-blue-600"
            />
          </FloatingElement>

          <FloatingElement depth={1} className="top-[60%] left-[8%] md:top-[70%] md:left-[11%] rotate-[12deg]">
            <FeatureCard 
              icon={BookOpen} 
              title="Учись в своем темпе" 
              description="Асинхронные курсы от экспертов Mentoria. Изучай материалы, смотри видео и выполняй задания, когда тебе удобно."
              bgClass="bg-indigo-100" textClass="text-indigo-600"
            />
          </FloatingElement>

          <FloatingElement depth={2} className="top-[10%] left-[80%] md:top-[15%] md:left-[75%] rotate-[8deg]">
            <FeatureCard 
              icon={Target} 
              title="Достигай целей" 
              description="Создай профиль, получай персональные рекомендации и отслеживай свой прогресс в едином личном кабинете."
              bgClass="bg-purple-100" textClass="text-purple-600"
            />
          </FloatingElement>
          
          <FloatingElement depth={1.5} className="top-[70%] left-[80%] md:top-[70%] md:left-[80%] rotate-[-15deg]">
             <FeatureCard 
              icon={Search} 
              title="Развивайся" 
              description="Находи новые стажировки и получай бесценный опыт работы в реальных компаниях."
              bgClass="bg-green-100" textClass="text-green-600"
            />
          </FloatingElement>
        </Floating>

        <div className="flex flex-col justify-center items-center w-[90%] max-w-4xl z-10 pointer-events-auto">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center w-full justify-center items-center flex-col flex whitespace-pre-wrap leading-tight font-extrabold tracking-tight space-y-2 md:space-y-4 text-gray-900"
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut", delay: 0.3 }}
          >
            <div className="flex flex-wrap justify-center items-center text-center">
              <span>Твой путь к </span>
              <LayoutGroup>
                <motion.span layout className="flex whitespace-pre mx-0 md:mx-3">
                  <TextRotate
                    texts={[
                      "успешному будущему",
                      "новым вершинам",
                      "лучшим стажировкам",
                      "твоей мечте",
                      "грандиозным целям"
                    ]}
                    mainClassName="overflow-hidden text-blue-600 py-0 pb-2 md:pb-4 rounded-xl"
                    staggerDuration={0.03}
                    staggerFrom="last"
                    rotationInterval={3000}
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  />
                </motion.span>
              </LayoutGroup>
            </div>
            <span>начинается здесь</span>
          </motion.h1>
          
          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-center text-gray-600 pt-6 sm:pt-8 md:pt-10 max-w-3xl leading-relaxed"
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut", delay: 0.5 }}
          >
            Mentoria Hub — это единая платформа, где амбициозные школьники находят лучшие возможности и проходят асинхронные курсы для достижения своих целей.
          </motion.p>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 items-center mt-10 sm:mt-12 w-full">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
                delay: 0.7,
              }}
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", damping: 30, stiffness: 400 },
              }}
            >
              <Link 
                href="/opportunities" 
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                Найти возможности
                <Search className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
            
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
                delay: 0.8,
              }}
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", damping: 30, stiffness: 400 },
              }}
            >
              <Link 
                href="/courses" 
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-blue-700 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all"
              >
                Начать обучение
                <BookOpen className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mobile Features Section (visible only on small screens since cards are hidden in hero) */}
      <section className="py-16 bg-white md:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8">
            <FeatureCard 
              icon={Search} 
              title="Находи лучшее" 
              description="Сотни конкурсов, стипендий и программ, отфильтрованных по твоим интересам и возрасту. Не упусти свой шанс."
              bgClass="bg-blue-100" textClass="text-blue-600"
            />
            <FeatureCard 
              icon={BookOpen} 
              title="Учись в своем темпе" 
              description="Асинхронные курсы от экспертов Mentoria. Изучай материалы, смотри видео и выполняй задания, когда тебе удобно."
              bgClass="bg-indigo-100" textClass="text-indigo-600"
            />
            <FeatureCard 
              icon={Target} 
              title="Достигай целей" 
              description="Создай профиль, получай персональные рекомендации и отслеживай свой прогресс в едином личном кабинете."
              bgClass="bg-purple-100" textClass="text-purple-600"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Готов начать свой путь?</h2>
          <p className="text-gray-400 mb-8 text-lg">Присоединяйся к тысячам школьников, которые уже строят свое будущее с Mentoria.</p>
          <Link 
            href="/onboarding" 
            className="inline-flex items-center px-8 py-4 text-lg font-bold text-gray-900 bg-white rounded-xl hover:bg-gray-100 transition-colors"
          >
            Присоединиться к Mentoria
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
