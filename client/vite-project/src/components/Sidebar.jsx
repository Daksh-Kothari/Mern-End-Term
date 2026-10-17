import React from 'react';
import { 
  LayoutDashboard, 
  Repeat, 
  BookOpen, 
  CalendarDays, 
  Target, 
  BarChart3, 
  Calendar, 
  FileText,
  AlertTriangle,
  Flame
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, dueCount = 0 }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'revision', label: 'Revision Queue', icon: Repeat, badge: dueCount > 0 ? dueCount : null },
    { id: 'subjects', label: 'Subjects & Topics', icon: BookOpen },
    { id: 'exams', label: 'Exams & Deadlines', icon: CalendarDays },
    { id: 'goals', label: 'Study Goals', icon: Target },
    { id: 'analytics', label: 'Analytics & Weak Topics', icon: BarChart3 },
    { id: 'calendar', label: 'Academic Calendar', icon: Calendar },
    { id: 'notes', label: 'Study Notes', icon: FileText }
  ];

  return (
    <aside className="w-full md:w-64 bg-[#090d16] border-r border-[#1f293d] p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
          Workspace Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 font-semibold shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-[#111726]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Spaced Repetition Engine Badge */}
      <div className="mt-8 p-3.5 rounded-xl bg-gradient-to-br from-[#111726] to-[#182032] border border-[#1f293d] space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-300">
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          <span>SM-2 Memory Engine</span>
        </div>
        <p className="text-[11px] text-gray-400 leading-relaxed">
          Uses deterministic spaced repetition algorithms to optimize retention based on recall performance.
        </p>
      </div>
    </aside>
  );
}
