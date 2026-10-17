import React, { useState, useEffect } from 'react';
import api from '../api';
import { X, BookOpen, Check } from 'lucide-react';

export default function SubjectModal({ isOpen, onClose, subject = null, onSaved }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#6366F1');
  const [icon, setIcon] = useState('BookOpen');
  const [examDate, setExamDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (subject) {
      setName(subject.name || '');
      setDescription(subject.description || '');
      setColor(subject.color || '#6366F1');
      setIcon(subject.icon || 'BookOpen');
      setExamDate(subject.examDate ? new Date(subject.examDate).toISOString().split('T')[0] : '');
    } else {
      setName('');
      setDescription('');
      setColor('#6366F1');
      setIcon('BookOpen');
      setExamDate('');
    }
  }, [subject, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Subject name is required.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let res;
      if (subject) {
        const id = subject._id || subject.id;
        res = await api.patch(`/subjects/${id}`, {
          name: name.trim(),
          description: description.trim(),
          color,
          icon,
          examDate: examDate || null
        });
      } else {
        res = await api.post('/subjects', {
          name: name.trim(),
          description: description.trim(),
          color,
          icon,
          examDate: examDate || null
        });
      }

      if (onSaved) onSaved(res.data.subject);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const presetColors = ['#6366F1', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111726] border border-[#1f293d] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl space-y-0">
        <div className="px-6 py-4 bg-[#0d121e] border-b border-[#1f293d] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-lg text-white">{subject ? 'Edit Subject' : 'Add New Subject'}</h3>
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
            <label className="block text-xs font-semibold text-gray-300 mb-1">Subject Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Operating Systems"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#090d16] border border-[#1f293d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Description</label>
            <textarea
              rows="2"
              placeholder="Scope, syllabus details or target goals..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#090d16] border border-[#1f293d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Color Tag</label>
            <div className="flex items-center space-x-2">
              {presetColors.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Upcoming Exam Date (Optional)</label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
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
              <span>{loading ? 'Saving...' : 'Save Subject'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
