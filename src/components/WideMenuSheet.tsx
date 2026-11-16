import { CupSoda, Minus, Plus } from 'lucide-react';
import { CATEGORIES, MenuItem } from '../data/menuData';

interface WideMenuSheetProps {
  items: MenuItem[];
  cartQuantities: Record<string, number>;
  onAdd: (item: MenuItem) => void;
  onUpdateQty: (itemId: string, delta: number) => void;
}

export function WideMenuSheet({
  items,
  cartQuantities,
  onAdd,
  onUpdateQty,
}: WideMenuSheetProps) {
  const categoryOrder = CATEGORIES.filter((c) => c.id !== 'all');

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {categoryOrder.map((cat) => {
          const catItems = items.filter((i) => i.category === cat.id);
          if (catItems.length === 0) return null;

          return (
            <section
              key={cat.id}
              className="print-break-inside-avoid bg-white border border-slate-200 rounded-xl overflow-hidden"
            >
              <div className="px-5 py-3.5 bg-[#F1F0EC] border-b border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">{cat.subtitle}</p>
                </div>
                {cat.priceTag && (
                  <span className="text-sm font-bold text-[#0F4C5C] tabular-nums-ar whitespace-nowrap shrink-0">
                    {cat.priceTag}
                  </span>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs text-slate-500 bg-slate-50/70">
                      <th className="py-2.5 px-4 font-medium w-20">الكود</th>
                      <th className="py-2.5 px-3 font-medium">الصنف والمكونات</th>
                      <th className="py-2.5 px-3 font-medium w-24 text-left">السعر</th>
                      <th className="no-print py-2.5 px-4 font-medium w-28 text-center">
                        الطلب
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {catItems.map((item) => {
                      const qty = cartQuantities[item.id] || 0;
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4 align-top font-mono-code text-xs text-slate-600 whitespace-nowrap">
                            {item.code}
                          </td>
                          <td className="py-3 px-3 align-top">
                            <div className="flex items-start gap-3">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  referrerPolicy="no-referrer"
                                  className="w-10 h-8 rounded-md object-cover shrink-0 bg-slate-100 border border-slate-200"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-md shrink-0 bg-[#F1F0EC] border border-slate-200 flex items-center justify-center text-[#0F4C5C]">
                                  <CupSoda className="w-4 h-4" />
                                </div>
                              )}
                              <div>
                                <div className="font-semibold text-slate-900">
                                  {item.name}
                                </div>
                                <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                  {item.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 align-top text-left font-bold text-slate-900 tabular-nums-ar whitespace-nowrap">
                            {item.price} ج.م
                          </td>
                          <td className="no-print py-3 px-4 align-top text-center">
                            {qty === 0 ? (
                              <button
                                type="button"
                                onClick={() => onAdd(item)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-[#D9531E] hover:bg-[#B9380A] rounded-md transition-colors whitespace-nowrap cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                <span>أضف</span>
                              </button>
                            ) : (
                              <div className="inline-flex items-center gap-1 bg-slate-100 rounded-md p-0.5 border border-slate-200">
                                <button
                                  type="button"
                                  onClick={() => onUpdateQty(item.id, -1)}
                                  className="w-6 h-6 flex items-center justify-center text-slate-700 hover:bg-white rounded cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-5 text-xs font-bold tabular-nums-ar">
                                  {qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => onUpdateQty(item.id, 1)}
                                  className="w-6 h-6 flex items-center justify-center bg-[#D9531E] text-white rounded cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
