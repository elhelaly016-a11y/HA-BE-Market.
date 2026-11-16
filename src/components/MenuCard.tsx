import { useState } from 'react';
import { Minus, Plus, Utensils } from 'lucide-react';
import { MenuItem } from '../data/menuData';

interface MenuCardProps {
  item: MenuItem;
  quantity: number;
  onAdd: (item: MenuItem) => void;
  onUpdateQty: (itemId: string, delta: number) => void;
}

export function MenuCard({ item, quantity, onAdd, onUpdateQty }: MenuCardProps) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <article className="print-break-inside-avoid group flex flex-col justify-between bg-white border border-slate-200/90 rounded-xl p-3.5 transition-all duration-150 hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start gap-3.5">
        {/* Compact Meal Icon Thumbnail */}
        <div className="relative w-20 h-20 sm:w-[88px] sm:h-[88px] shrink-0 rounded-lg bg-[#F1F0EC] border border-slate-200/80 overflow-hidden">
          {!imgFailed && item.image ? (
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
              <Utensils className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Meal Details */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="font-mono-code font-semibold text-[#0F4C5C] shrink-0">
              {item.code}
            </span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{item.subCategory || item.category}</span>
          </div>

          <h3 className="text-[15px] font-bold text-slate-900 leading-snug">
            {item.name}
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>
      </div>

      {/* Price & Order Action Footer */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-1">
          <span className="text-base font-bold text-slate-900 tabular-nums-ar">
            {item.price}
          </span>
          <span className="text-[11px] font-medium text-slate-500">ج.م</span>
        </div>

        <div className="no-print shrink-0">
          {quantity === 0 ? (
            <button
              type="button"
              onClick={() => onAdd(item)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#D9531E] hover:bg-[#B9380A] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9531E]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>أضف للطلب</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => onUpdateQty(item.id, -1)}
                aria-label={`إنقاص كمية ${item.name}`}
                className="w-7 h-7 flex items-center justify-center rounded-md text-slate-700 hover:bg-white transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center text-xs font-bold text-slate-900 tabular-nums-ar">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => onUpdateQty(item.id, 1)}
                aria-label={`زيادة كمية ${item.name}`}
                className="w-7 h-7 flex items-center justify-center rounded-md text-white bg-[#D9531E] hover:bg-[#B9380A] transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
