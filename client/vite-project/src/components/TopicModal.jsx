import React, { useState, useEffect } from 'react';
import api from '../api';
import { X, FileCode, Check } from 'lucide-react';

export default function TopicModal({ isOpen, onClose, topic = null, subjects = [], defaultSubjectId = '', onSaved }) {
  const [subjectId, setSubjectId] = useState(defaultSubjectId);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [importance, setImportance] = useState('MEDIUM');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (topic) {
      setSubjectId(topic.subject?._id || topic.subject || defaultSubjectId);
      setTitle(topic.title || '');
      setDescription(topic.description || '');
      setDifficulty(topic.difficulty || 'MEDIUM');
      setImportance(topic.importance || 'MEDIUM');
    } else {
      setSubjectId(defaultSubjectId || (subjects.length > 0 ? (subjects[0]._id || subjects[0].id) : ''));
      setTitle('');
      setDescription('');
      setDifficulty('MEDIUM');
      setImportance('MEDIUM');
    }
  }, [topic, isOpen, defaultSubjectId, subjects]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Topic title is required.');
      return;
    }
    if (!subjectId) {
      setError('Please select a subject.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let res;
      if (topic) {
        const id = topic._id || topic.id;
        res = await api.patch(`/topics/${id}`, {
          title: title.trim(),
          description: description.trim(),
          difficulty,
          importance
        });
      } else {
        res = await api.post('/topics', {
          subjectId,
          title: title.trim(),
          description: description.trim(),
          difficulty,
          importance
        });
      }

      if (onSaved) onSaved(res.data.topic);
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
            <FileCode className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-lg text-white">{topic ? 'Edit Topic' : 'Add New Topic'}</h3>
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

          {!topic && (
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
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Topic Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Page Replacement Algorithms (LRU, LFU)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#090d16] border border-[#1f293d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Description & Key Takeaways</label>
            <textarea
              rows="2"
              placeholder="Core concepts, key formulas, or problem types..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#090d16] border border-[#1f293d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-[#090d16] border border-[#1f293d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
                <option value="VERY_HARD">Very Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Exam Importance</label>
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
              <span>{loading ? 'Saving...' : 'Save Topic'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
