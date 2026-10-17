import React, { useState, useEffect } from 'react';
import api from '../api';
import { X, Play, Pause, RotateCcw, Check, Clock, BookOpen, Brain, ThumbsUp } from 'lucide-react';

export default function StudySessionModal({ isOpen, onClose, topics = [], subjects = [], onSessionComplete }) {
  const [mode, setMode] = useState('timer'); // 'timer' | 'manual'
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [sessionType, setSessionType] = useState('LEARNING');
  const [notes, setNotes] = useState('');
  const [recallRating, setRecallRating] = useState('GOOD');

  // Timer state
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Manual entry state
  const [manualMinutes, setManualMinutes] = useState(30);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  if (!isOpen) return null;

  const filteredTopics = selectedSubject
    ? topics.filter(t => (t.subject?._id || t.subject) === selectedSubject)
    : topics;

  const handleSubjectChange = (subId) => {
    setSelectedSubject(subId);
    setSelectedTopic('');
  };

  const handleSaveSession = async () => {
    if (!selectedTopic) {
      setError('Please select a topic for your study session.');
      return;
    }

    const durationMinutes = mode === 'timer' ? Math.max(1, Math.round(seconds / 60)) : Number(manualMinutes);
    if (!durationMinutes || durationMinutes <= 0) {
      setError('Duration must be at least 1 minute.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - durationMinutes * 60 * 1000);

      const res = await api.post('/study-sessions', {
        subjectId: selectedSubject,
        topicId: selectedTopic,
        startTime,
        endTime,
        durationMinutes,
        sessionType,
        notes,
        recallRating
      });

      if (onSessionComplete) {
        onSessionComplete(res.data);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111726] border border-[#1f293d] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-0">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0d121e] border-b border-[#1f293d] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-lg text-white">Record Study Session</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#1f293d]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Mode Switcher */}
          <div className="flex p-1 rounded-xl bg-[#090d16] border border-[#1f293d]">
            <button
              onClick={() => { setMode('timer'); setIsActive(false); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'timer' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Live Timer
            </button>
            <button
              onClick={() => { setMode('manual'); setIsActive(false); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'manual' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Manual Log
            </button>
          </div>

          {/* Subject & Topic Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full bg-[#090d16] border border-[#1f293d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select Subject</option>
                {subjects.map(s => (
                  <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Topic *</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full bg-[#090d16] border border-[#1f293d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select Topic</option>
                {filteredTopics.map(t => (
                  <option key={t._id || t.id} value={t._id || t.id}>{t.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Session Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Session Focus Type</label>
            <div className="grid grid-cols-4 gap-2">
              {['LEARNING', 'REVISION', 'PRACTICE', 'MOCK_TEST'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSessionType(type)}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all ${
                    sessionType === type
                      ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/50'
                      : 'bg-[#090d16] text-gray-400 border-[#1f293d] hover:border-gray-600'
                  }`}
                >
                  {type.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Specific Controls */}
          {mode === 'timer' ? (
            <div className="p-4 rounded-xl bg-[#090d16] border border-[#1f293d] text-center space-y-3">
              <div className="text-4xl font-mono font-bold tracking-wider text-white">
                {formatTime(seconds)}
              </div>
              <div className="flex justify-center space-x-2">
                {!isActive ? (
                  <button
                    onClick={() => setIsActive(true)}
                    className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Timer</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsActive(false)}
                    className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md"
                  >
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause</span>
                  </button>
                )}
                <button
                  onClick={() => { setIsActive(false); setSeconds(0); }}
                  className="flex items-center space-x-1.5 bg-[#182032] hover:bg-[#1f293d] text-gray-300 text-xs font-medium px-3 py-2 rounded-lg"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Duration (Minutes)</label>
              <input
                type="number"
                min="1"
                max="720"
                value={manualMinutes}
                onChange={(e) => setManualMinutes(e.target.value)}
                className="w-full bg-[#090d16] border border-[#1f293d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {/* Recall Rating (SuperMemo SM-2 Feedback) */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center justify-between">
              <span>Recall Quality Rating</span>
              <span className="text-[10px] text-indigo-400 font-normal">Triggers SM-2 Algorithm</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'FORGOT', label: 'Forgot (0)', color: 'border-rose-500/50 text-rose-400 bg-rose-950/20' },
                { id: 'HARD', label: 'Hard (1)', color: 'border-amber-500/50 text-amber-400 bg-amber-950/20' },
                { id: 'GOOD', label: 'Good (2)', color: 'border-blue-500/50 text-blue-400 bg-blue-950/20' },
                { id: 'EASY', label: 'Easy (3)', color: 'border-emerald-500/50 text-emerald-400 bg-emerald-950/20' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRecallRating(item.id)}
                  className={`py-2 px-1 rounded-lg text-[11px] font-semibold border text-center transition-all ${
                    recallRating === item.id
                      ? `${item.color} shadow-sm ring-1 ring-white/10`
                      : 'bg-[#090d16] text-gray-400 border-[#1f293d] hover:border-gray-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Session Notes (Optional)</label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What formulas, concepts or questions did you work on?"
              className="w-full bg-[#090d16] border border-[#1f293d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#0d121e] border-t border-[#1f293d] flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-400 hover:text-white hover:bg-[#182032]"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveSession}
            disabled={loading}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs px-5 py-2 rounded-lg shadow-md disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{loading ? 'Processing...' : 'Save & Calculate Schedule'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
