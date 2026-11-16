import { Candy, CupSoda, Minus, Package, Plus } from 'lucide-react';
import { MenuItem } from '../data/menuData';

interface CanteenMarketListProps {
  items: MenuItem[];
  cartQuantities: Record<string, number>;
  onAdd: (item: MenuItem) => void;
  onUpdateQty: (itemId: string, delta: number) => void;
}

const GROUPS = [
  {
    key: 'المشروبات الغازية والعصائر',
    title: 'المشروبات الغازية والعصائر',
    Icon: CupSoda,
    accentClass: 'text-[#0F4C5C] bg-[#0F4C5C]/10',
  },
  {
    key: 'الشيبسي والمقرمشات',
    title: 'الشيبسي والمقرمشات',
    Icon: Package,
    accentClass: 'text-amber-700 bg-amber-500/12',
  },
  {
    key: 'الشوكولاتة والبسكويت والكيك',
    title: 'الشوكولاتة والبسكويت والكيك',
    Icon: Candy,
    accentClass: 'text-[#D9531E] bg-[#D9531E]/10',
  },
];

export function CanteenMarketList({
  items,
  cartQuantities,
  onAdd,
  onUpdateQty,
}: CanteenMarketListProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
      {GROUPS.map(({ key, title, Icon, accentClass }) => {
        const groupItems = items.filter((item) => item.subCategory === key);
        if (groupItems.length === 0) return null;

        return (
          <div
            key={key}
            className="print-break-inside-avoid bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs"
          >
            <div className="px-4 py-3.5 bg-[#F4F3EF] border-b border-slate-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${accentClass}`}
                >
                  <Icon className="w-4 h-4" />
                </span>
                <h4 className="text-sm font-bold text-slate-900 truncate">{title}</h4>
              </div>
              <span className="text-[11px] font-medium text-slate-500 tabular-nums-ar whitespace-nowrap shrink-0">
                {groupItems.length} صنف
              </span>
            </div>

            <ul className="divide-y divide-slate-100">
              {groupItems.map((item) => {
                const qty = cartQuantities[item.id] || 0;
                return (
                  <li
                    key={item.id}
                    className={`px-4 py-2.5 flex items-center justify-between gap-3 transition-colors ${
                      qty > 0 ? 'bg-orange-50/40' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-semibold text-slate-900 leading-snug block truncate">
                          {item.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-sm font-bold text-slate-900 tabular-nums-ar whitespace-nowrap">
                        {item.price}{' '}
                        <span className="text-[11px] font-medium text-slate-500">
                          ج.م
                        </span>
                      </span>

                      <div className="no-print">
                        {qty === 0 ? (
                          <button
                            type="button"
                            onClick={() => onAdd(item)}
                            aria-label={`اختيار ${item.name}`}
                            className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:border-[#D9531E] hover:bg-[#D9531E] hover:text-white transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <div className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-md p-0.5">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.id, -1)}
                              aria-label={`إنقاص كمية ${item.name}`}
                              className="w-6 h-6 flex items-center justify-center rounded text-slate-700 hover:bg-white cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-5 text-center text-xs font-bold tabular-nums-ar">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.id, 1)}
                              aria-label={`زيادة كمية ${item.name}`}
                              className="w-6 h-6 flex items-center justify-center rounded bg-[#D9531E] text-white cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
