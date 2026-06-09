/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckSquare, 
  Square, 
  Trash2, 
  Plus, 
  Search, 
  LogOut, 
  User as UserIcon, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Tag, 
  ListTodo, 
  Sparkles, 
  Clock,
  Briefcase,
  Heart,
  BookOpen,
  DollarSign
} from 'lucide-react';

type TaskPriority = 'low' | 'medium' | 'high';
type TaskCategory = 'work' | 'personal' | 'health' | 'education' | 'finance' | 'other';

interface Task {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: string;
  category: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

const CATEGORY_MAP: Record<TaskCategory, { label: string; bg: string; text: string; icon: any }> = {
  work: { label: 'Робота', bg: 'bg-blue-50', text: 'text-blue-700', icon: Briefcase },
  personal: { label: 'Особисте', bg: 'bg-indigo-50', text: 'text-indigo-700', icon: Heart },
  health: { label: 'Здоров\'я', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: Heart },
  education: { label: 'Навчання', bg: 'bg-amber-50', text: 'text-amber-700', icon: BookOpen },
  finance: { label: 'Фінанси', bg: 'bg-rose-50', text: 'text-rose-700', icon: DollarSign },
  other: { label: 'Інше', bg: 'bg-gray-100', text: 'text-gray-700', icon: Tag },
};

const PRIORITY_MAP: Record<TaskPriority, { label: string; bg: string; text: string; border: string }> = {
  high: { label: 'Високий', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  medium: { label: 'Середній', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  low: { label: 'Низький', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
};

export default function Page() {
  const { data: session, status } = useSession();

  // Auth screen toggle
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');
  
  // Auth Form details
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Interaction & State feedbacks
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [taskFetchLoading, setTaskFetchLoading] = useState(false);

  // App core state
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // New Task form details
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [newCategory, setNewCategory] = useState<TaskCategory>('work');
  const [newDueDate, setNewDueDate] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedCompletion, setSelectedCompletion] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'dueDate' | 'priority'>('createdAt');

  // Load tasks on authentication
  useEffect(() => {
    if (session?.user) {
      fetchUserTasks();
    }
  }, [session]);

  const fetchUserTasks = async () => {
    setTaskFetchLoading(true);
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error('Не вдалося завантажити завдання', err);
    } finally {
      setTaskFetchLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: email.toLowerCase().trim(),
        password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess('Успішний вхід!');
        setEmail('');
        setPassword('');
      }
    } catch {
      setError('Не вдалося з\'єднатися із сервером авторизації.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const regRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      const regData = await regRes.json();

      if (regRes.ok) {
        // Automatically sign in
        const result = await signIn('credentials', {
          redirect: false,
          email: email.toLowerCase().trim(),
          password,
        });

        if (result?.error) {
          setError('Зареєстровано успішно, але сталася помилка автоматичного входу.');
        } else {
          setSuccess('Реєстрація успішна!');
          setName('');
          setEmail('');
          setPassword('');
        }
      } else {
        setError(regData.error || 'Помилка реєстрації.');
      }
    } catch {
      setError('Не вдалося зв\'язатися з сервером.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    signOut({ redirect: false });
    setTasks([]);
    setSuccess(null);
    setError(null);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          priority: newPriority,
          category: newCategory,
          dueDate: newDueDate
        })
      });

      if (res.ok) {
        setNewTitle('');
        setNewDesc('');
        setNewPriority('medium');
        setNewCategory('work');
        setNewDueDate('');
        setShowTaskForm(false);
        fetchUserTasks();
      } else {
        const data = await res.json();
        setError(data.error || 'Не вдалося створити завдання.');
      }
    } catch {
      setError('Помилка підключення.');
    }
  };

  const handleToggleTask = async (task: Task) => {
    try {
      const updatedCompleted = !task.completed;
      // Optimistic state update
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: updatedCompleted } : t));

      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: updatedCompleted })
      });

      if (!res.ok) {
        // Rollback
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: !updatedCompleted } : t));
        const data = await res.json();
        setError(data.error || 'Не вдалося оновити статус.');
      }
    } catch {
      setError('Помилка оновлення завдання.');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        // Optimistic state filter
        setTasks(prev => prev.filter(t => t.id !== taskId));
      } else {
        const data = await res.json();
        setError(data.error || 'Не вдалося видалити завдання.');
      }
    } catch {
      setError('Помилка видалення завдання.');
    }
  };

  // Processing tasks (filter + sort)
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) || 
                          (task.description && task.description.toLowerCase().includes(search.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    
    let matchesCompletion = true;
    if (selectedCompletion === 'pending') matchesCompletion = !task.completed;
    if (selectedCompletion === 'completed') matchesCompletion = task.completed;

    return matchesSearch && matchesCategory && matchesPriority && matchesCompletion;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'createdAt') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (sortBy === 'priority') {
      const priorityWeight: Record<string, number> = { high: 3, medium: 2, low: 1 };
      const weightA = priorityWeight[a.priority] || 0;
      const weightB = priorityWeight[b.priority] || 0;
      return weightB - weightA;
    }
    return 0;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    overdue: tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date(new Date().setHours(0,0,0,0))).length,
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafc]">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-gray-500">Завантаження сесії...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafc] text-gray-900 font-sans flex flex-col antialiased">
      {/* HEADER BAR */}
      <header className="bg-white border-b border-gray-100 py-4 px-6 md:px-8 flex justify-between items-center sticky top-0 z-10 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 text-white p-2 rounded-xl flex items-center justify-center shadow-md">
            <ListTodo className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Taski</h1>
            <p className="text-xs text-gray-500 font-medium">Керування задачами</p>
          </div>
        </div>

        {session?.user && (
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
              <UserIcon className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-semibold text-gray-700">{session.user.name}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-1.5 bg-gray-50 hover:bg-rose-50 text-gray-600 hover:text-rose-600 px-3 py-1.5 rounded-xl border border-gray-100 hover:border-rose-100 transition-all font-medium text-sm"
              title="Вийти з акаунту"
              id="logout-btn"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Вийти</span>
            </button>
          </div>
        )}
      </header>

      {/* FEEDBACK BANNERS */}
      {(error || success) && (
        <div className="max-w-7xl mx-auto w-full px-6 md:px-8 mt-4">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-2xl flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-bold p-1">&times;</button>
            </motion.div>
          )}
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-2xl flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium">{success}</span>
              </div>
              <button onClick={() => setSuccess(null)} className="text-emerald-400 hover:text-emerald-600 font-bold p-1">&times;</button>
            </motion.div>
          )}
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-8 flex flex-col justify-center">
        {!session?.user ? (
          /* AUTHENTICATION WINDOW */
          <div className="w-full max-w-md mx-auto my-auto py-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100/80"
            >
              <div className="text-center mb-8">
                <div className="mx-auto w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                  <ListTodo className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  {authScreen === 'login' ? 'Вхід у систему' : 'Створення акаунту'}
                </h2>
                <p className="text-sm text-gray-500 mt-1.5">
                  {authScreen === 'login' 
                    ? 'Увійдіть за допомогою NextAuth для керування задачами' 
                    : 'Зареєструйтеся безкоштовно та почніть зараз'}
                </p>
              </div>

              <form onSubmit={authScreen === 'login' ? handleLogin : handleRegister} className="space-y-4">
                {authScreen === 'register' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Ім'я</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Адріан Олсен"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:border-indigo-500 focus:bg-white text-sm font-medium transition-all"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Електронна пошта</label>
                  <input 
                    type="email" 
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:border-indigo-500 focus:bg-white text-sm font-medium transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Пароль</label>
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:border-indigo-500 focus:bg-white text-sm font-medium transition-all"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3.5 px-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all text-sm mt-2 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span>{authScreen === 'login' ? 'Увійти' : 'Створити акаунт'}</span>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <button 
                  onClick={() => setAuthScreen(authScreen === 'login' ? 'register' : 'login')}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                  id="toggle-auth-screen-btn"
                >
                  {authScreen === 'login' ? 'Немає акаунту? Реєстрація' : 'Вже маєте акаунт? Увійти'}
                </button>
              </div>
            </motion.div>
          </div>
        ) : (
          /* ACTIVE BOARD DASHBOARD */
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  З поверненням, {session.user.name}! 👋
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Ось стан ваших завдань з PostgreSQL бази даних.
                </p>
              </div>
              <button
                onClick={() => setShowTaskForm(!showTaskForm)}
                className="self-start md:self-auto flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl shadow-md shadow-indigo-150 font-semibold text-sm transition-all cursor-pointer"
                id="toggle-form-btn"
              >
                <Plus className="h-4.5 w-4.5 stroke-[3px]" />
                <span>Нова задача</span>
              </button>
            </div>

            {/* METRICS BLOCKS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center space-x-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <ListTodo className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-xs text-gray-500 font-semibold">Всього задач</div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center space-x-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{stats.completed}</div>
                  <div className="text-xs text-gray-500 font-semibold">Виконано</div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center space-x-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{stats.pending}</div>
                  <div className="text-xs text-gray-500 font-semibold">У процесі</div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center space-x-4">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{stats.overdue}</div>
                  <div className="text-xs text-gray-500 font-semibold">Прострочено</div>
                </div>
              </div>
            </div>

            {/* COLLAPSIBLE ADD TASK BUILDER */}
            <AnimatePresence>
              {showTaskForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <form onSubmit={handleCreateTask} className="bg-white p-6 rounded-3xl border border-indigo-100/50 shadow-md space-y-4">
                    <div className="border-b border-gray-150 pb-3">
                      <h3 className="font-bold text-gray-900 flex items-center space-x-1.5 text-base">
                        <Sparkles className="h-4.5 w-4.5 text-indigo-500 animate-pulse" />
                        <span>Створити нове завдання</span>
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Назва завдання</label>
                        <input
                          type="text"
                          required
                          placeholder="Наприклад: Замовити технічне обслуговування"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:border-indigo-500 focus:bg-white text-sm font-medium transition-all"
                        />
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Опис (необов'язково)</label>
                        <textarea
                          placeholder="Нотатки чи кроки виконання..."
                          rows={2}
                          value={newDesc}
                          onChange={(e) => setNewDesc(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:border-indigo-500 focus:bg-white text-sm font-medium transition-all resize-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase">Категорія</label>
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
                          className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:border-indigo-500 focus:bg-white text-sm font-semibold transition-all text-gray-700 cursor-pointer"
                        >
                          <option value="work">💼 Робота</option>
                          <option value="personal">❤️ Особисте</option>
                          <option value="health">🥗 Здоров'я</option>
                          <option value="education">🎓 Навчання</option>
                          <option value="finance">💳 Фінанси</option>
                          <option value="other">🏷️ Інше</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase">Пріоритет</label>
                        <select
                          value={newPriority}
                          onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                          className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:border-indigo-500 focus:bg-white text-sm font-semibold transition-all text-gray-700 cursor-pointer"
                        >
                          <option value="high">🔴 Високий</option>
                          <option value="medium">🟡 Середній</option>
                          <option value="low">🔵 Низький</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase">Термін виконання</label>
                        <input
                          type="date"
                          value={newDueDate}
                          onChange={(e) => setNewDueDate(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:border-indigo-500 focus:bg-white text-sm font-medium transition-all text-gray-700 cursor-pointer"
                        />
                      </div>

                      <div className="flex items-end justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowTaskForm(false)}
                          className="px-5 py-2.5 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold text-sm transition-all cursor-pointer"
                        >
                          Скасувати
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-150 transition-all cursor-pointer"
                        >
                          Створити
                        </button>
                      </div>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FILTERS PANEL */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Шукати завдання..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:border-indigo-500 focus:bg-white text-sm font-medium transition-all"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-200">
                    <button
                      onClick={() => setSelectedCompletion('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${selectedCompletion === 'all' ? 'bg-white text-indigo-600 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      Всі
                    </button>
                    <button
                      onClick={() => setSelectedCompletion('pending')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${selectedCompletion === 'pending' ? 'bg-white text-indigo-600 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      Активні
                    </button>
                    <button
                      onClick={() => setSelectedCompletion('completed')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${selectedCompletion === 'completed' ? 'bg-white text-indigo-600 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      Виконані
                    </button>
                  </div>

                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 outline-none transition-all cursor-pointer"
                  >
                    <option value="all">📁 Всі Категорії</option>
                    <option value="work">💼 Робота</option>
                    <option value="personal">❤️ Особисте</option>
                    <option value="health">🥗 Здоров'я</option>
                    <option value="education">🎓 Навчання</option>
                    <option value="finance">💳 Фінанси</option>
                    <option value="other">🏷️ Інше</option>
                  </select>

                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 outline-none transition-all cursor-pointer"
                  >
                    <option value="all">🔥 Всі Пріоритети</option>
                    <option value="high">🔴 Високий</option>
                    <option value="medium">🟡 Середній</option>
                    <option value="low">🔵 Низький</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 outline-none transition-all cursor-pointer ml-auto lg:ml-0"
                  >
                    <option value="createdAt">📅 Спочатку нові</option>
                    <option value="dueDate">⏳ Терміном виконання</option>
                    <option value="priority">📈 Пріоритетом</option>
                  </select>
                </div>
              </div>
            </div>

            {/* DYNAMIC TASKS FEED */}
            <div className="space-y-3">
              {taskFetchLoading ? (
                <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center flex flex-col items-center justify-center space-y-3">
                  <div className="h-8 w-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-semibold text-gray-500">Завантаження завдань...</p>
                </div>
              ) : sortedTasks.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center border border-gray-100">
                    <ListTodo className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">Жодних завдань не знайдено</h4>
                    <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
                      Спробуйте послабити фільтри пошуку або додайте нове завдання!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <AnimatePresence mode="popLayout">
                    {sortedTasks.map(task => {
                      const cat = CATEGORY_MAP[task.category as TaskCategory] || CATEGORY_MAP.other;
                      const CatIcon = cat.icon;
                      
                      const prio = PRIORITY_MAP[task.priority as TaskPriority] || PRIORITY_MAP.low;
                      const isOverdue = !task.completed && task.dueDate && new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0));

                      return (
                        <motion.div
                          key={task.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={`bg-white hover:bg-[#fbfbfe] p-4 rounded-2xl border transition-all duration-200 flex items-start gap-4 shadow-3xs hover:shadow-xs w-full ${task.completed ? 'border-gray-100 opacity-65' : 'border-gray-200/60'}`}
                        >
                          <button
                            onClick={() => handleToggleTask(task)}
                            className="mt-1 flex-shrink-0 text-gray-400 hover:text-indigo-600 transition-colors focus:outline-none cursor-pointer"
                          >
                            {task.completed ? (
                              <CheckSquare className="h-5.5 w-5.5 text-indigo-600 fill-indigo-50" />
                            ) : (
                              <Square className="h-5.5 w-5.5 text-gray-300 hover:text-gray-500" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                              {/* Category Badge */}
                              <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${cat.bg} ${cat.text}`}>
                                <CatIcon className="h-3 w-3" />
                                <span>{cat.label}</span>
                              </span>

                              {/* Priority Badge */}
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${prio.bg} ${prio.text} ${prio.border}`}>
                                <span>{prio.label}</span>
                              </span>

                              {/* Due Date Indicator */}
                              {task.dueDate && (
                                <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${isOverdue ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-gray-50 text-gray-500'}`}>
                                  <Calendar className="h-3 w-3" />
                                  <span>{task.dueDate} {isOverdue && '(Прострочено)'}</span>
                                </span>
                              )}
                            </div>

                            <h4 className={`text-base font-bold tracking-tight text-gray-800 break-words ${task.completed ? 'line-through text-gray-400' : ''}`}>
                              {task.title}
                            </h4>

                            {task.description && (
                              <p className={`text-sm text-gray-500 mt-1 break-words line-clamp-3 ${task.completed ? 'text-gray-400' : ''}`}>
                                {task.description}
                              </p>
                            )}
                          </div>

                          <div className="flex-shrink-0 self-center">
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                              title="Видалити завдання"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="py-6 border-t border-gray-150/50 text-center text-xs text-gray-400 font-medium">
        <p>© 2026 Taski Dashboard • Next.js + PostgreSQL + NextAuth.js</p>
      </footer>
    </div>
  );
}
