import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LEARN_LESSONS } from '../../data/funnectData';
import { LearnLesson } from '../../types';
import { 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  ChevronRight, 
  X, 
  Play, 
  HelpCircle,
  Award,
  Layers,
  Cpu,
  Eye,
  Link,
  Code2,
  GitBranch,
  Wrench,
  Bot
} from 'lucide-react';

export const LearnPage: React.FC = () => {
  const { setCurrentView, setSelectedProject, projects } = useApp();
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [activeLessonModal, setActiveLessonModal] = useState<LearnLesson | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const filteredLessons = selectedDifficulty === 'All'
    ? LEARN_LESSONS
    : LEARN_LESSONS.filter(l => l.level === selectedDifficulty);

  const handleOpenLesson = (lesson: LearnLesson) => {
    setActiveLessonModal(lesson);
    setQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const getLessonIcon = (iconName: string) => {
    switch (iconName) {
      case 'Eye': return '📡';
      case 'Cog': return '⚙️';
      case 'Cpu': return '🧠';
      case 'Link': return '🔗';
      case 'Code2': return '🧩';
      case 'GitBranch': return '🔀';
      case 'Wrench': return '🛠️';
      case 'Bot': return '🤖';
      default: return '💡';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-blue-600 mb-1">
              STEM & Robotics Curriculum
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Learn by Building
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Master mechanical linkages, sensor inputs, actuator motors, and computational thinking.
            </p>
          </div>

          {/* Difficulty Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
            {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map(diff => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map(lesson => (
            <div
              key={lesson.id}
              onClick={() => handleOpenLesson(lesson)}
              className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl group-hover:scale-110 transition-transform">
                    {getLessonIcon(lesson.icon)}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      lesson.level === 'Beginner'
                        ? 'bg-emerald-100 text-emerald-800'
                        : lesson.level === 'Intermediate'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {lesson.level}
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base mb-1 group-hover:text-blue-600 transition-colors">
                  {lesson.title}
                </h3>
                <p className="text-xs font-bold text-slate-400 mb-2">{lesson.subtitle}</p>
                <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-3">
                  {lesson.summary}
                </p>

                {/* Key Concepts Chips */}
                <div className="space-y-1 mb-4">
                  {lesson.concepts.slice(0, 2).map((concept, i) => (
                    <div
                      key={i}
                      className="text-[11px] text-slate-600 flex items-start gap-1.5"
                    >
                      <span className="text-blue-500 font-bold">•</span>
                      <span className="line-clamp-1">{concept}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {lesson.durationMinutes} mins
                </span>
                <span className="font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore Lesson <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lesson Details & Interactive Quiz Modal */}
      {activeLessonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{getLessonIcon(activeLessonModal.icon)}</span>
                <div>
                  <span className="text-xs font-extrabold text-blue-600 uppercase">
                    Level: {activeLessonModal.level}
                  </span>
                  <h2 className="text-xl font-black text-slate-900">{activeLessonModal.title}</h2>
                  <p className="text-xs text-slate-400 font-semibold">{activeLessonModal.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveLessonModal(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {activeLessonModal.summary}
            </p>

            {/* Core Concepts */}
            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2">
              <div className="text-xs font-extrabold text-blue-900 uppercase tracking-wider">
                Core Principles Covered:
              </div>
              <div className="space-y-2 text-xs">
                {activeLessonModal.concepts.map((c, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hands-on physical activity */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-extrabold flex items-center gap-1.5 uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Hands-On Build Activity:</span>
              </div>
              <p>{activeLessonModal.handsOnBuild}</p>
            </div>

            {/* Interactive Concept Check Quiz */}
            {activeLessonModal.quizQuestions.length > 0 && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span>Concept Check</span>
                </div>
                <p className="text-xs font-bold text-slate-800">
                  {activeLessonModal.quizQuestions[0].question}
                </p>

                <div className="space-y-2 text-xs">
                  {activeLessonModal.quizQuestions[0].options.map((option, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setQuizAnswer(idx);
                        setQuizSubmitted(true);
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        quizAnswer === idx
                          ? idx === activeLessonModal.quizQuestions[0].correctIndex
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                            : 'bg-red-50 border-red-300 text-red-900 font-bold'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {option}
                    </div>
                  ))}
                </div>

                {quizSubmitted && (
                  <div
                    className={`p-3 rounded-xl text-xs font-bold ${
                      quizAnswer === activeLessonModal.quizQuestions[0].correctIndex
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {quizAnswer === activeLessonModal.quizQuestions[0].correctIndex
                      ? `🎉 Correct! ${activeLessonModal.quizQuestions[0].explanation}`
                      : `Not quite! ${activeLessonModal.quizQuestions[0].explanation}`}
                  </div>
                )}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  setActiveLessonModal(null);
                  setCurrentView('create-project');
                }}
                className="w-full sm:flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>Launch Related Build Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveLessonModal(null)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
