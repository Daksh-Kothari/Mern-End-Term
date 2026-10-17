import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { 
  GraduationCap, 
  Bell, 
  CheckCheck, 
  LogOut, 
  User as UserIcon, 
  Play, 
  Flame, 
  BookOpen, 
  Clock 
} from 'lucide-react';

export default function Navbar({ onOpenTimer, activeTab, setActiveTab }) {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications || []);
      setUnreadCount((res.data.notifications || []).filter(n => !n.isRead).length);
    } catch (err) {
      console.warn('Could not fetch notifications:', err.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Mark all read error:', err.message);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/90 backdrop-blur-md border-b border-[#1f293d] px-4 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tight text-white">StudyFlow</span>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full">v2.0 SM-2</span>
          </div>
          <p className="text-xs text-gray-400 hidden sm:block">Smart Academic & Spaced Repetition Engine</p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Quick Study Timer Button */}
        <button
          onClick={onOpenTimer}
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium px-3.5 py-2 rounded-lg text-sm shadow-md shadow-indigo-600/20 transition-all duration-200 transform hover:scale-[1.02] active:scale-95"
        >
          <Play className="w-4 h-4 fill-current" />
          <span className="hidden sm:inline">Start Study Session</span>
          <span className="sm:hidden">Study</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="p-2.5 rounded-lg bg-[#111726] border border-[#1f293d] hover:border-indigo-500/40 text-gray-300 hover:text-white relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#111726] border border-[#1f293d] rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="px-4 py-3 bg-[#0d121e] border-b border-[#1f293d] flex items-center justify-between">
                <span className="font-semibold text-sm text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-indigo-400" /> Notifications & Reminders
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#1f293d]">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-400 text-xs">
                    No active notifications. You are all caught up!
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n._id || n.id}
                      className={`p-3.5 hover:bg-[#182032] transition-colors ${!n.isRead ? 'bg-indigo-950/20' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm text-white">{n.title}</span>
                        <span className="text-[10px] text-gray-500">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Info & Logout */}
        <div className="flex items-center space-x-3 border-l border-[#1f293d] pl-3">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-semibold text-white">{user?.name || 'Student'}</span>
            <span className="text-[11px] text-indigo-400">{user?.email}</span>
          </div>

          <button
            onClick={logout}
            className="p-2.5 rounded-lg bg-[#111726] border border-[#1f293d] hover:border-rose-500/40 text-gray-400 hover:text-rose-400 transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
