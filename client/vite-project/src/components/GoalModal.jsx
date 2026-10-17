import React, { useState } from 'react';
import api from '../api';
import { X, Target, Check } from 'lucide-react';

export default function GoalModal({ isOpen, onClose, onSaved }) {
  const [title, setTitle] = useState('');
  const [goalType, setGoalType] = useState('DAILY_STUDY_TIME');
  const [targetValue, setTargetValue] = useState(60);
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Goal title is required.');
      return;
    }
    if (!targetValue || Number(targetValue) <= 0) {
      setError('Target value must be greater than zero.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await api.post('/goals', {
        title: title.trim(),
        goalType,
        targetValue: Number(targetValue),
        endDate: endDate || null
      });

      if (onSaved) onSaved(res.data.goal);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111726] border border-[#1f293d] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl space-y-0">
        <div className="px-6 py-4 bg-[#0d121e] border-b border-[#1f293d] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-lg text-white">Set New Study Goal</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#1f293d]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Goal Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Study 90 Minutes Daily"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#090d16] border border-[#1f293d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Goal Metric Type</label>
              <select
                value={goalType}
                onChange={(e) => setGoalType(e.target.value)}
                className="w-full bg-[#090d16] border border-[#1f293d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="DAILY_STUDY_TIME">Daily Time (Mins)</option>
                <option value="WEEKLY_STUDY_TIME">Weekly Time (Mins)</option>
                <option value="TOPICS_COMPLETED">Topics Mastered</option>
                <option value="REVISIONS_COMPLETED">Revisions Done</option>
                <option value="SUBJECT_PROGRESS">Average Mastery %</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Target Value *</label>
              <input
                type="number"
                min="1"
                required
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                className="w-full bg-[#090d16] border border-[#1f293d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Deadline Date (Optional)</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-[#090d16] border border-[#1f293d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 py-2 rounded-lg shadow-md disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Set Goal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
