import { useState, type FormEvent } from 'react';
import {
  Check,
  Copy,
  CreditCard,
  Minus,
  Phone,
  PhoneCall,
  Plus,
  Printer,
  ShoppingBag,
  Trash2,
  Wallet,
  X,
} from 'lucide-react';
import { COMPANY_INFO, VODAFONE_CASH_NUMBER } from '../data/menuData';
import { CartEntry, OrderRecord, PaymentMethod } from '../types/order';
import { QrCodeCanvas } from './QrCodeCanvas';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  entries: CartEntry[];
  onUpdateQty: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onConfirmOrder: (order: OrderRecord) => void;
  onPrintReceipt: (order: OrderRecord) => void;
}

const DELIVERY_SLOTS = [
  'الإفطار الصباحي (9:30 صباحاً)',
  'الغداء — الوردية الأولى (1:30 ظهراً)',
  'توريد سريع (خلال 30 – 60 دقيقة)',
  'الوردية المسائية (6:30 مساءً)',
];

export function CartDrawer({
  open,
  onClose,
  entries,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onConfirmOrder,
  onPrintReceipt,
}: CartDrawerProps) {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [department, setDepartment] = useState('إنتاج / خط التشغيل');
  const [deliverySlot, setDeliverySlot] = useState(DELIVERY_SLOTS[2]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('vodafone_cash');
  const [vodafoneRef, setVodafoneRef] = useState('');
  const [notes, setNotes] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);
  const [formError, setFormError] = useState('');

  if (!open) return null;

  const subtotal = entries.reduce(
    (sum, entry) => sum + entry.item.price * entry.quantity,
    0
  );

  const vodafoneUssd = `*9*7*${VODAFONE_CASH_NUMBER}*${subtotal}#`;
  const vodafoneTelHref = `tel:*9*7*${VODAFONE_CASH_NUMBER}*${subtotal}%23`;

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2200);
    });
  };

  const buildWhatsappSummary = (order: OrderRecord) => {
    const lines = [
      `طلب كانتين ووجبات — ${COMPANY_INFO.clientName}`,
      `رقم الطلب: ${order.id}`,
      `الاسم: ${order.employeeName} (كود: ${order.employeeCode})`,
      `القسم: ${order.department}`,
      `موعد التوريد: ${order.deliverySlot}`,
      `--- الأصناف ---`,
      ...order.items.map(
        (i) => `• ${i.code} | ${i.name} × ${i.quantity} = ${i.price * i.quantity} ج.م`
      ),
      `الإجمالي: ${order.totalAmount} ج.م`,
      `طريقة الدفع: ${
        order.paymentMethod === 'vodafone_cash'
          ? `فودافون كاش (${VODAFONE_CASH_NUMBER})${
              order.vodafoneRef ? ` — مرجع: ${order.vodafoneRef}` : ''
            }`
          : 'الخصم من الراتب الشهري (HA-BE)'
      }`,
      order.notes ? `ملاحظات: ${order.notes}` : '',
    ].filter(Boolean);
    return lines.join('\n');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (entries.length === 0) return;

    if (!employeeName.trim() || !employeeCode.trim()) {
      setFormError('برجاء كتابة اسم الموظف وكود الموظف في مصنع HA-BE.');
      return;
    }

    setFormError('');
    const newOrder: OrderRecord = {
      id: `HB-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      employeeName: employeeName.trim(),
      employeeCode: employeeCode.trim(),
      department: department.trim() || 'عام',
      deliverySlot,
      notes: notes.trim(),
      paymentMethod,
      vodafoneRef: paymentMethod === 'vodafone_cash' ? vodafoneRef.trim() : undefined,
      items: entries.map((e) => ({
        code: e.item.code,
        name: e.item.name,
        price: e.item.price,
        quantity: e.quantity,
      })),
      totalAmount: subtotal,
      status: paymentMethod === 'vodafone_cash' ? 'paid' : 'recorded',
    };

    onConfirmOrder(newOrder);
    setConfirmedOrder(newOrder);
    onClearCart();
  };

  const handleResetAfterOrder = () => {
    setConfirmedOrder(null);
    setVodafoneRef('');
    setNotes('');
    onClose();
  };

  return (
    <div
      className="no-print fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="سلة الطلبات وإتمام الدفع"
    >
      <div
        className="w-full max-w-lg bg-white h-full flex flex-col shadow-2xl border-r border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-[#F8F8F6]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#D9531E]" />
            <h2 className="text-lg font-bold text-slate-900">
              {confirmedOrder ? 'تم تسجيل الطلب بنجاح' : 'سلة طلبات الكانتين — HA-BE'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق السلة"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {confirmedOrder ? (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">
                    تم تأكيد وتسجيل الطلب #{confirmedOrder.id}
                  </span>
                  <span className="font-mono-code text-xs font-semibold">
                    {confirmedOrder.totalAmount} ج.م
                  </span>
                </div>
                <p className="text-xs text-emerald-800 mt-1.5 leading-relaxed">
                  {confirmedOrder.paymentMethod === 'vodafone_cash'
                    ? `الدفع عبر فودافون كاش (${VODAFONE_CASH_NUMBER}). اضغط زر التحويل الفوري أو اطبع الإيصال أو انسخ الطلب للجروب.`
                    : 'تم تسجيل الطلب في كشف الخصم من الراتب الخاص بموظفي HA-BE لحد يوم القبض.'}
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white">
                <div className="flex justify-between text-xs text-slate-500 border-b border-slate-100 pb-2">
                  <span>الموظف: {confirmedOrder.employeeName}</span>
                  <span className="font-mono-code">كود: {confirmedOrder.employeeCode}</span>
                </div>
                <ul className="space-y-2 text-sm">
                  {confirmedOrder.items.map((item) => (
                    <li
                      key={item.code}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="text-slate-800">
                        <span className="font-mono-code text-xs text-slate-500 ml-1.5">
                          {item.code}
                        </span>
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-bold tabular-nums-ar text-slate-900">
                        {item.price * item.quantity} ج.م
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between font-bold text-base">
                  <span>الإجمالي المستحق</span>
                  <span className="text-[#D9531E] tabular-nums-ar">
                    {confirmedOrder.totalAmount} ج.م
                  </span>
                </div>
              </div>

              {confirmedOrder.paymentMethod === 'vodafone_cash' && (
                <div className="p-4 rounded-xl bg-[#F8F8F6] border border-slate-200 flex flex-col items-center space-y-3">
                  <p className="text-xs font-semibold text-slate-700">
                    امسح الكود أو اضغط تحويل فودافون كاش لـ {confirmedOrder.totalAmount} ج.م
                  </p>
                  <QrCodeCanvas
                    value={`tel:*9*7*${VODAFONE_CASH_NUMBER}*${confirmedOrder.totalAmount}%23`}
                    size={150}
                    title="كود دفع فودافون كاش للطلب"
                    darkColor="#B91C1C"
                    downloadFilename={`vodafone-cash-${confirmedOrder.id}.png`}
                  />
                  <div className="flex flex-wrap items-center justify-center gap-2 w-full">
                    <a
                      href={`tel:*9*7*${VODAFONE_CASH_NUMBER}*${confirmedOrder.totalAmount}%23`}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded-lg transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>تنفيذ التحويل الآن (*9*7*...#)</span>
                    </a>
                    <button
                      type="button"
                      onClick={() =>
                        copyText(
                          `*9*7*${VODAFONE_CASH_NUMBER}*${confirmedOrder.totalAmount}#`,
                          'ussd-done'
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      {copiedKey === 'ussd-done' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {copiedKey === 'ussd-done' ? 'تم نسخ الكود' : 'نسخ كود التحويل'}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    copyText(buildWhatsappSummary(confirmedOrder), 'wa')
                  }
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#0F4C5C] hover:bg-[#0B3945] rounded-lg transition-colors cursor-pointer"
                >
                  {copiedKey === 'wa' ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>
                    {copiedKey === 'wa'
                      ? 'تم نسخ رسالة الجروب'
                      : 'نسخ الطلب لجروب الواتساب'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onPrintReceipt(confirmedOrder)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة الإيصال</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleResetAfterOrder}
                className="w-full py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg cursor-pointer"
              >
                العودة إلى قائمة الطعام
              </button>
            </div>
          ) : entries.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">سلة الطلبات فارغة</h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                اختر وجبات الإفطار أو الغداء أو احتياجات الكانتين لإضافتها وحساب الإجمالي فوراً.
              </p>
            </div>
          ) : (
            <form id="canteen-checkout-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    الأصناف المختارة ({entries.reduce((a, b) => a + b.quantity, 0)})
                  </h3>
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="text-xs text-red-600 hover:text-red-700 font-medium cursor-pointer"
                  >
                    إفراغ السلة
                  </button>
                </div>

                <ul className="divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white">
                  {entries.map(({ item, quantity }) => (
                    <li
                      key={item.id}
                      className="p-3.5 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="font-mono-code">{item.code}</span>
                          <span>·</span>
                          <span className="tabular-nums-ar">{item.price} ج.م للقطعة</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900 truncate mt-0.5">
                          {item.name}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="inline-flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.id, -1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-white rounded cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold tabular-nums-ar">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.id, 1)}
                            className="w-7 h-7 flex items-center justify-center bg-[#D9531E] text-white rounded cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          aria-label={`حذف ${item.name}`}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-200">
                <h3 className="text-sm font-bold text-slate-900">
                  بيانات الموظف والتوريد — مصنع HA-BE
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      اسم الموظف *
                    </label>
                    <input
                      type="text"
                      required
                      value={employeeName}
                      onChange={(e) => setEmployeeName(e.target.value)}
                      placeholder="مثال: أحمد محمود"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0F4C5C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      كود الموظف (HR ID) *
                    </label>
                    <input
                      type="text"
                      required
                      value={employeeCode}
                      onChange={(e) => setEmployeeCode(e.target.value)}
                      placeholder="مثال: HB-204"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0F4C5C] font-mono-code"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      القسم / الإدارة
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="الإنتاج / الجودة / الإدارة"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0F4C5C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      موعد التوريد (قبل الموعد بـ 30–60 د)
                    </label>
                    <select
                      value={deliverySlot}
                      onChange={(e) => setDeliverySlot(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#0F4C5C]"
                    >
                      {DELIVERY_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    ملاحظات التحضير (اختياري)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="مثال: شطة زيادة، بدون مخلل، تسليم بوابة 2..."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0F4C5C]"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-200">
                <h3 className="text-sm font-bold text-slate-900">طريقة السداد</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('vodafone_cash')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                      paymentMethod === 'vodafone_cash'
                        ? 'border-red-600 bg-red-50 text-red-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>فودافون كاش</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('salary_deduction')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                      paymentMethod === 'salary_deduction'
                        ? 'border-[#0F4C5C] bg-[#0F4C5C]/8 text-[#0F4C5C]'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Wallet className="w-4 h-4 shrink-0" />
                    <span>الدفع مع الراتب</span>
                  </button>
                </div>

                {paymentMethod === 'vodafone_cash' ? (
                  <div className="p-4 rounded-xl bg-[#F8F8F6] border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold text-slate-700">
                          رقم محفظة فودافون كاش المعتمد:
                        </p>
                        <p className="text-lg font-bold font-mono-code text-red-700 mt-0.5">
                          {VODAFONE_CASH_NUMBER}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyText(VODAFONE_CASH_NUMBER, 'num')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
                      >
                        {copiedKey === 'num' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedKey === 'num' ? 'تم النسخ' : 'نسخ الرقم'}</span>
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 border-t border-slate-200">
                      <QrCodeCanvas
                        value={vodafoneTelHref}
                        size={120}
                        title="QR فودافون كاش للدفع الفوري"
                        darkColor="#B91C1C"
                        showDownload={false}
                      />
                      <div className="text-xs text-slate-600 space-y-2 leading-relaxed flex-1">
                        <p className="font-semibold text-slate-900">
                          امسح الكود أو اضغط للتحويل المباشر بالمبلغ:
                        </p>
                        <p
                          dir="ltr"
                          className="font-mono-code bg-white px-2.5 py-1.5 rounded border border-slate-200 text-slate-900 select-all"
                        >
                          {vodafoneUssd}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <a
                            href={vodafoneTelHref}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded-lg transition-colors"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>تحويل فوري ({subtotal} ج.م)</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => copyText(vodafoneUssd, 'ussd-pre')}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
                          >
                            {copiedKey === 'ussd-pre' ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedKey === 'ussd-pre' ? 'نُسخ' : 'نسخ الكود'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        رقم التحويل أو آخر 4 أرقام من رقمك (اختياري)
                      </label>
                      <input
                        type="text"
                        value={vodafoneRef}
                        onChange={(e) => setVodafoneRef(e.target.value)}
                        placeholder="مثال: آخر 4 أرقام 8821"
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[#0F4C5C]/5 border border-[#0F4C5C]/20 text-xs text-slate-700 leading-relaxed space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#0F4C5C]">
                      <CreditCard className="w-4 h-4" />
                      <span>اشتري دلوقتي والدفع مع الراتب وخلاص!</span>
                    </div>
                    <p>
                      يتم تسجيل قيمة الطلب ({subtotal} ج.م) باسمك وكودك الوظيفي في سجل الكانتين الشهري لتسويتها تلقائياً مع الراتب.
                    </p>
                  </div>
                )}
              </div>

              {formError && (
                <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">
                  {formError}
                </p>
              )}
            </form>
          )}
        </div>

        {!confirmedOrder && entries.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-[#F8F8F6] space-y-3">
            <div className="flex items-center justify-between text-base font-bold text-slate-900">
              <span>إجمالي الطلب</span>
              <span className="text-xl text-[#D9531E] tabular-nums-ar">
                {subtotal} ج.م
              </span>
            </div>
            <button
              type="submit"
              form="canteen-checkout-form"
              className="w-full py-3 px-4 text-sm font-bold text-white bg-[#D9531E] hover:bg-[#B9380A] rounded-xl transition-colors cursor-pointer"
            >
              {paymentMethod === 'vodafone_cash'
                ? 'تأكيد الطلب والدفع فودافون كاش'
                : 'تأكيد الطلب والتسجيل مع الراتب'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
