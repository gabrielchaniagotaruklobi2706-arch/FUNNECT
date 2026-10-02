import React, { useState } from 'react';
import { BuilderComponentCategory, BuilderItemDef } from '../../types/builder';
import { BUILDER_ITEM_CATALOG } from '../../data/builderData';
import { Search, Plus, Sparkles, Layers, Box, Cpu, RotateCw, Wrench } from 'lucide-react';

interface ComponentLibraryProps {
  onAddComponent: (itemDef: BuilderItemDef) => void;
  selectedComponentType?: string | null;
  onDuplicateSelected?: () => void;
  hasSelectedComponent?: boolean;
}

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  onAddComponent,
  selectedComponentType,
  onDuplicateSelected,
  hasSelectedComponent = false
}) => {
  const [activeCategory, setActiveCategory] = useState<BuilderComponentCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: BuilderComponentCategory | 'ALL'; label: string; icon: React.ReactNode }[] = [
    { id: 'ALL', label: 'All Parts', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'STRUCTURE', label: 'Structure', icon: <Box className="w-3.5 h-3.5" /> },
    { id: 'CONNECTORS', label: 'Connectors', icon: <Wrench className="w-3.5 h-3.5" /> },
    { id: 'ELECTRONICS', label: 'Electronics', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'MOVEMENT', label: 'Motors & Wheels', icon: <RotateCw className="w-3.5 h-3.5" /> },
    { id: 'SPECIAL', label: 'Special Kits', icon: <Sparkles className="w-3.5 h-3.5" /> },
  ];

  const filteredItems = BUILDER_ITEM_CATALOG.filter(item => {
    const matchesCategory = activeCategory === 'ALL' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full bg-white border-t border-slate-200">
      {/* Search & Category Filter Bar */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {hasSelectedComponent && onDuplicateSelected && (
            <button
              onClick={onDuplicateSelected}
              className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Duplicate the selected 3D component in your build"
            >
              <span>📋 Duplicate Selection</span>
            </button>
          )}

          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search sticks, motors, ports..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Parts Horizontal Quick-Access Carousel / Grid */}
      <div className="p-3 overflow-x-auto flex gap-3 scrollbar-thin scrollbar-thumb-slate-200">
        {filteredItems.map(item => {
          const isSelected = selectedComponentType === item.type;
          return (
            <div
              key={item.type}
              onClick={() => onAddComponent(item)}
              className={`min-w-[190px] max-w-[210px] p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group hover:-translate-y-0.5 select-none ${
                isSelected
                  ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-100'
                  : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                  {item.badgeEmoji}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-slate-900 truncate leading-tight">
                    {item.name}
                  </div>
                  <span
                    className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-black uppercase mt-1 ${
                      item.category === 'STRUCTURE'
                        ? 'bg-amber-100 text-amber-800'
                        : item.category === 'CONNECTORS'
                        ? 'bg-blue-100 text-blue-800'
                        : item.category === 'ELECTRONICS'
                        ? 'bg-purple-100 text-purple-800'
                        : item.category === 'MOVEMENT'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.category}
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">
                  {item.compatibleWith[0] || 'FUNNECT Part'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddComponent(item);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 text-[11px] font-extrabold flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="w-full py-8 text-center text-xs text-slate-400">
            No components match "{searchQuery}" in this category.
          </div>
        )}
      </div>
    </div>
  );
};
