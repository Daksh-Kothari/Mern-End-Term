import React, { useState, useEffect } from 'react';
import api from '../api';
import { X, CalendarDays, Check } from 'lucide-react';

export default function ExamModal({ isOpen, onClose, subjects = [], onSaved }) {
  const [subjectId, setSubjectId] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [importance, setImportance] = useState('HIGH');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (subjects.length > 0 && !subjectId) {
      setSubjectId(subjects[0]._id || subjects[0].id);
    }
  }, [subjects]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Exam name is required.');
      return;
    }
    if (!subjectId) {
      setError('Please select a subject.');
      return;
    }
    if (!date) {
      setError('Exam date is required.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await api.post('/exams', {
        subjectId,
        name: name.trim(),
        date,
        description: description.trim(),
        importance
      });

      if (onSaved) onSaved(res.data.exam);
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
            <CalendarDays className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-lg text-white">Schedule New Exam</h3>
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
            <label className="block text-xs font-semibold text-gray-300 mb-1">Subject *</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full bg-[#090d16] border border-[#1f293d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">Select Subject</option>
              {subjects.map(s => (
                <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Exam Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Operating Systems Final Exam"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#090d16] border border-[#1f293d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Exam Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#090d16] border border-[#1f293d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Importance</label>
              <select
                value={importance}
                onChange={(e) => setImportance(e.target.value)}
                className="w-full bg-[#090d16] border border-[#1f293d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Notes / Coverage Scope</label>
            <textarea
              rows="2"
              placeholder="Units covered, formula sheets, room number..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              <span>{loading ? 'Saving...' : 'Schedule Exam'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
