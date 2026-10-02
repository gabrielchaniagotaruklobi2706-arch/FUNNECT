import React from 'react';
import { BuildTemplate } from '../../types/builder';
import { BUILD_TEMPLATES } from '../../data/builderData';
import { X, Sparkles, Clock, Check, Plus } from 'lucide-react';

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: BuildTemplate) => void;
  onStartBlank: () => void;
}

export const TemplatePickerModal: React.FC<TemplatePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  onStartBlank
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl shadow-xs">
              🚀
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Choose a 3D Build Project</h2>
              <p className="text-xs text-slate-500">Start from an educational template or design from scratch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template Cards Grid */}
        <div className="p-6 max-h-[420px] overflow-y-auto space-y-3">
          {/* Start Blank Option */}
          <div
            onClick={() => {
              onStartBlank();
              onClose();
            }}
            className="p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/40 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 text-xl group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                  Start with Blank Canvas
                </div>
                <div className="text-[11px] text-slate-500">
                  Build custom mechanisms completely freely from raw craft sticks & connectors.
                </div>
              </div>
            </div>
            <span className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 font-extrabold text-xs group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
              Clean Slate
            </span>
          </div>

          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 pt-2">
            Curriculum STEM Templates
          </div>

          {BUILD_TEMPLATES.map(template => (
            <div
              key={template.id}
              onClick={() => {
                onSelectTemplate(template);
                onClose();
              }}
              className="p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md bg-white transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shrink-0">
                  {template.badgeEmoji}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      {template.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-blue-50 text-blue-700">
                      {template.difficulty}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    {template.subtitle}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>~{template.estimatedMinutes} mins</span>
                    </span>
                    <span>·</span>
                    <span>{template.components.length} components</span>
                    <span>·</span>
                    <span>{template.connections.length} port wires</span>
                  </div>
                </div>
              </div>

              <button
                className="px-4 py-2 rounded-xl bg-slate-100 group-hover:bg-blue-600 text-slate-700 group-hover:text-white font-black text-xs transition-all self-end sm:self-center shrink-0"
              >
                Load Template
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
