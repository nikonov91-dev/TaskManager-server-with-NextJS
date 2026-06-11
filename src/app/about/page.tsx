/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Users, 
  Target, 
  ShieldCheck, 
  Heart, 
  Cpu, 
  Database, 
  Sparkles,
  Github
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fafafc] text-gray-900 font-sans flex flex-col antialiased">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-100 py-4 px-6 md:px-8 flex justify-between items-center sticky top-0 z-10 shadow-xs">
        <div className="flex items-center space-x-3">
          <Link href="/" className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 p-2.5 rounded-xl flex items-center justify-center transition-all">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Taski</h1>
            <p className="text-xs text-gray-500 font-medium">Про нас</p>
          </div>
        </div>
        <div>
          <Link 
            href="/" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md shadow-indigo-100"
            id="back-home-header-btn"
          >
            До завдань
          </Link>
        </div>
      </header>

      {/* BODY */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 md:py-16">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-12"
        >
          {/* HERO */}
          <div className="text-center space-y-4">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>Сучасний менеджер задач</span>
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
              Про проект <span className="text-indigo-600">Taski</span>
            </h2>
            <p className="text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Ми віримо, що продуктивність має бути простою, красивою та безпечною. 
              Taski створений для того, щоб ви могли зосередитися на головному, а не на складному управлінні справами.
            </p>
          </div>

          {/* VALUES BENTO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-3">
              <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Наша Місія</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Поєднати сучасний ергономічний інтерфейс із потужними алгоритмами збереження даних для максимальної ефективності.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-3">
              <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Повна Безпека</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Двофакторна сесія NextAuth та хешування паролів за допомогою bcrypt забезпечать конфіденційність кожної задачі.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-3">
              <div className="h-10 w-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                <Heart className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Турбота про дизайн</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Кожна анімація, кольорова гама та шрифтовий баланс опрацьовані для створення приємного візуального досвіду.
              </p>
            </div>
          </div>

          {/* STACK INFO */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Cpu className="h-5 w-5 text-indigo-600" />
              <span>Технологічний стек</span>
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Taski побудований за допомогою найефективніших сучасних інструментів веб-розробки:
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="bg-[#fafafc] p-4 rounded-2xl border border-gray-100 text-center space-y-1">
                <div className="font-extrabold text-indigo-600">Next.js</div>
                <div className="text-xs text-gray-400">Швидкий SSR / CSR</div>
              </div>

              <div className="bg-[#fafafc] p-4 rounded-2xl border border-gray-100 text-center space-y-1">
                <div className="font-extrabold text-[#3178c6]">TypeScript</div>
                <div className="text-xs text-gray-400">Надійна типізація</div>
              </div>

              <div className="bg-[#fafafc] p-4 rounded-2xl border border-gray-100 text-center space-y-1">
                <div className="font-extrabold text-emerald-600">Prisma ORM</div>
                <div className="text-xs text-gray-400">Робота з базою</div>
              </div>

              <div className="bg-[#fafafc] p-4 rounded-2xl border border-gray-100 text-center space-y-1">
                <div className="font-extrabold text-indigo-600">PostgreSQL</div>
                <div className="text-xs text-gray-400">Надійне сховище</div>
              </div>
            </div>
          </div>

          {/* TEAM / FOOTER CARD */}
          <div className="bg-indigo-900 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10">
              <Users className="h-80 w-80" />
            </div>
            <div className="relative z-10 space-y-4 max-w-lg">
              <h3 className="text-xl font-bold">Готовий до локального запуску</h3>
              <p className="text-sm text-indigo-200 leading-relaxed">
                Додаток повністю автономний і адаптований для скачування та локального розгортання на вашому комп'ютері. Відредагуйте файл <code className="bg-indigo-950 px-1.5 py-0.5 rounded text-xs text-amber-300 font-mono">.env</code> і запустіть всього за кілька секунд!
              </p>
              <div className="pt-2">
                <Link 
                  href="/" 
                  className="inline-flex items-center space-x-2 bg-white hover:bg-indigo-50 text-indigo-900 font-bold px-5 py-2.5 rounded-xl transition-all text-sm"
                  id="start-tasks-banner-btn"
                >
                  <span>Спробувати зараз</span>
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* FOOTER */}
      <footer className="py-6 border-t border-gray-150/50 text-center text-xs text-gray-400 font-medium">
        <p>© 2026 Taski Dashboard • Next.js + PostgreSQL + NextAuth.js</p>
      </footer>
    </div>
  );
}
