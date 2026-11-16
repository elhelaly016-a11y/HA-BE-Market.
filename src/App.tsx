import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  Copy,
  ExternalLink,
  FileText,
  LayoutGrid,
  Phone,
  PhoneCall,
  Printer,
  QrCode,
  RotateCcw,
  Search,
  ShoppingBag,
  Table2,
  Trash2,
} from 'lucide-react';
import {
  CATEGORIES,
  CategoryId,
  COMPANY_INFO,
  MENU_ITEMS,
  MenuItem,
  PROMO_HIGHLIGHTS,
  PUBLIC_SHARED_APP_URL,
  SUPPLY_TERMS,
  VODAFONE_CASH_NUMBER,
} from './data/menuData';
import { CartEntry, OrderRecord } from './types/order';
import { MenuCard } from './components/MenuCard';
import { WideMenuSheet } from './components/WideMenuSheet';
import { CanteenMarketList } from './components/CanteenMarketList';
import { QrCodeCanvas } from './components/QrCodeCanvas';
import { CartDrawer } from './components/CartDrawer';
import { FlyerModal } from './components/FlyerModal';

const ORDERS_STORAGE_KEY = 'habe_canteen_orders_v1';
const CART_STORAGE_KEY = 'habe_canteen_cart_v1';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'sheet'>('grid');
  const [cartOpen, setCartOpen] = useState(false);
  const [receiptToPrint, setReceiptToPrint] = useState<OrderRecord | null>(null);
  const [flyerPreview, setFlyerPreview] = useState<{
    src: string;
    title: string;
  } | null>(null);

  const [cartEntries, setCartEntries] = useState<CartEntry[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { id: string; quantity: number }[];
        return parsed
          .map((entry) => {
            const item = MENU_ITEMS.find((m) => m.id === entry.id);
            return item ? { item, quantity: entry.quantity } : null;
          })
          .filter((x): x is CartEntry => x !== null);
      }
    } catch {
      // ignore storage errors
    }
    return [];
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as OrderRecord[];
      }
    } catch {
      // ignore storage errors
    }
    return [];
  });

  const [ledgerFilter, setLedgerFilter] = useState<
    'all' | 'salary_deduction' | 'vodafone_cash'
  >('all');
  const [quickCashAmount, setQuickCashAmount] = useState<number>(88);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(
          cartEntries.map((e) => ({ id: e.item.id, quantity: e.quantity }))
        )
      );
    } catch {
      // ignore storage errors
    }
  }, [cartEntries]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // ignore storage errors
    }
  }, [orders]);

  const cartTotalCount = useMemo(
    () => cartEntries.reduce((sum, e) => sum + e.quantity, 0),
    [cartEntries]
  );

  const cartSubtotal = useMemo(
    () => cartEntries.reduce((sum, e) => sum + e.item.price * e.quantity, 0),
    [cartEntries]
  );

  useEffect(() => {
    if (cartSubtotal > 0) {
      setQuickCashAmount(cartSubtotal);
    }
  }, [cartSubtotal]);

  const cartQuantities = useMemo(() => {
    const map: Record<string, number> = {};
    for (const entry of cartEntries) {
      map[entry.item.id] = entry.quantity;
    }
    return map;
  }, [cartEntries]);

  const handleAddToCart = (item: MenuItem) => {
    setCartEntries((prev) => {
      const existing = prev.find((e) => e.item.id === item.id);
      if (existing) {
        return prev.map((e) =>
          e.item.id === item.id ? { ...e, quantity: e.quantity + 1 } : e
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleUpdateQty = (itemId: string, delta: number) => {
    setCartEntries((prev) =>
      prev
        .map((e) =>
          e.item.id === itemId ? { ...e, quantity: e.quantity + delta } : e
        )
        .filter((e) => e.quantity > 0)
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartEntries((prev) => prev.filter((e) => e.item.id !== itemId));
  };

  const handleClearCart = () => setCartEntries([]);

  const handleConfirmOrder = (newOrder: OrderRecord) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleToggleOrderPaid = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: o.status === 'paid' ? 'recorded' : 'paid' }
          : o
      )
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return MENU_ITEMS.filter((item) => {
      const matchesCat =
        activeCategory === 'all' || item.category === activeCategory;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.subCategory && item.subCategory.toLowerCase().includes(q))
      );
    });
  }, [activeCategory, searchQuery]);

  const filteredOrders = useMemo(() => {
    if (ledgerFilter === 'all') return orders;
    return orders.filter((o) => o.paymentMethod === ledgerFilter);
  }, [orders, ledgerFilter]);

  const salaryDueTotal = useMemo(
    () =>
      orders
        .filter((o) => o.paymentMethod === 'salary_deduction' && o.status === 'recorded')
        .reduce((sum, o) => sum + o.totalAmount, 0),
    [orders]
  );

  const cashPaidTotal = useMemo(
    () =>
      orders
        .filter((o) => o.paymentMethod === 'vodafone_cash' || o.status === 'paid')
        .reduce((sum, o) => sum + o.totalAmount, 0),
    [orders]
  );

  const defaultMenuQrUrl = useMemo(() => {
    if (typeof window === 'undefined') return PUBLIC_SHARED_APP_URL;
    const { hostname, origin, pathname } = window.location;
    if (hostname.startsWith('ais-dev-')) {
      return origin.replace('ais-dev-', 'ais-pre-') + pathname;
    }
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return PUBLIC_SHARED_APP_URL;
    }
    return `${origin}${pathname}`;
  }, []);

  const [menuQrUrl, setMenuQrUrl] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('habe_menu_qr_url_v1');
      if (saved && saved.trim().startsWith('http')) return saved.trim();
    } catch {
      // ignore
    }
    return defaultMenuQrUrl;
  });

  useEffect(() => {
    try {
      if (menuQrUrl.trim()) {
        localStorage.setItem('habe_menu_qr_url_v1', menuQrUrl.trim());
      }
    } catch {
      // ignore
    }
  }, [menuQrUrl]);

  const copyValue = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  useEffect(() => {
    const handleAfterPrint = () => {
      document.body.removeAttribute('data-print-mode');
    };
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  const handlePrintMenu = () => {
    document.body.removeAttribute('data-print-mode');
    window.print();
  };

  const handlePrintReceipt = (order: OrderRecord) => {
    setReceiptToPrint(order);
    document.body.setAttribute('data-print-mode', 'receipt');
    window.setTimeout(() => {
      window.print();
      window.setTimeout(() => {
        document.body.removeAttribute('data-print-mode');
      }, 600);
    }, 120);
  };

  const copyOrderWhatsapp = (order: OrderRecord) => {
    const text = [
      `طلب كانتين ووجبات — ${COMPANY_INFO.clientName}`,
      `رقم الطلب: ${order.id}`,
      `الموظف: ${order.employeeName} (${order.employeeCode})`,
      ...order.items.map(
        (i) => `• ${i.code} ${i.name} × ${i.quantity} = ${i.price * i.quantity} ج.م`
      ),
      `الإجمالي: ${order.totalAmount} ج.م | ${
        order.paymentMethod === 'vodafone_cash'
          ? `فودافون كاش ${VODAFONE_CASH_NUMBER}`
          : 'الخصم من الراتب'
      }`,
    ].join('\n');
    copyValue(text, order.id);
  };

  const categorySectionsToRender = useMemo(() => {
    const cats = CATEGORIES.filter((c) => c.id !== 'all');
    if (activeCategory !== 'all') {
      return cats.filter((c) => c.id === activeCategory);
    }
    return cats;
  }, [activeCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F6] text-slate-900">
      {/* Top Bar Contract: 3 Zones, Single Row */}
      <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200/90">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-14 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#top"
            className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 font-display"
          >
            كاترينج مصر · HA-BE
          </a>

          {/* Zone 2: 4 Single-line Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a
              href="#lamma-offers"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              فطار اللمة
            </a>
            <a
              href="#menu-catalog"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              قائمة الطعام
            </a>
            <a
              href="#canteen-ops"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              الدفع و QR
            </a>
            <a
              href="#order-ledger"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              سجل الطلبات
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#D9531E] hover:bg-[#B9380A] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>سلة الطلبات</span>
              <span className="tabular-nums-ar">({cartTotalCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Wide Menu Print Area Wrapper (hidden when printing a receipt) */}
      <div className="menu-print-area flex-1 flex flex-col">
      {/* Print-Only Wide Header */}
      <div className="hidden print-only border-b-2 border-slate-900 pb-4 mb-6">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold text-slate-600">
              {COMPANY_INFO.providerArabic} · {COMPANY_INFO.providerEnglish}
            </p>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              قائمة الأسعار الرسمية المحدثة — كانتين ووجبات موظفي {COMPANY_INFO.clientName}
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              منيو متجدد أسبوعياً · اشتري دلوقتي والدفع مع الراتب · الطلب المسبق قبل الموعد بـ 30–60 دقيقة · فودافون كاش: {VODAFONE_CASH_NUMBER}
            </p>
          </div>
          <div className="flex items-center gap-6 shrink-0">
            <div className="text-center">
              <QrCodeCanvas
                value={menuQrUrl.trim() || defaultMenuQrUrl}
                size={84}
                title="QR المنيو الرقمي"
                showDownload={false}
              />
              <span className="text-[11px] font-bold block mt-1">امسح للمنيو والطلب</span>
            </div>
            <div className="text-center">
              <QrCodeCanvas
                value={`tel:*9*7*${VODAFONE_CASH_NUMBER}*0#`}
                size={84}
                title="QR فودافون كاش"
                darkColor="#B91C1C"
                showDownload={false}
              />
              <span className="text-[11px] font-bold text-red-700 block mt-1">
                فودافون كاش {VODAFONE_CASH_NUMBER}
              </span>
            </div>
          </div>
        </div>
      </div>

      <main id="top" className="flex-1">
        {/* SECTION 1: Wide Storefront Hero + 4-Column Operational Policy Strip */}
        <section className="no-print border-b border-slate-200 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              <div className="lg:col-span-7 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                    <span className="text-[#0F4C5C] font-bold">
                      {COMPANY_INFO.providerArabic}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{COMPANY_INFO.sector}</span>
                    <span aria-hidden="true">·</span>
                    <span>{COMPANY_INFO.clientName}</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-slate-900 leading-[1.2]">
                    المنيو الرسمي ونظام تشغيل كانتين ووجبات الشركة الألمانية HA-BE
                  </h1>

                  <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
                    منيو متجدد ومتنوع كل أسبوع مع توفر كافة أغراض واحتياجات الكانتين بالكامل. اطلب وجبتك الساخنة أو مستلزمات الكانتين وادفع فوراً عبر فودافون كاش{' '}
                    <span className="font-mono-code font-semibold text-slate-900">
                      {VODAFONE_CASH_NUMBER}
                    </span>{' '}
                    أو سجّل طلبك للخصم مع الراتب.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="#menu-catalog"
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-[#D9531E] hover:bg-[#B9380A] rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    استعراض المنيو والطلب
                  </a>

                  <button
                    type="button"
                    onClick={handlePrintMenu}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-800 bg-[#F1F0EC] hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>طباعة المنيو العريض</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFlyerPreview({
                        src: COMPANY_INFO.flyerGeneralPromo,
                        title: 'المنشور الإعلاني الرسمي — كاترينج مصر',
                      })
                    }
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#0F4C5C] hover:bg-[#0F4C5C]/8 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>عرض البروشور الإعلاني</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 min-h-[260px]">
                <img
                  src={COMPANY_INFO.heroImage}
                  alt="بوفيه ووجبات الشركة الوطنية للخدمات اللوجستية كاترينج مصر"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent flex items-end p-5">
                  <div className="text-white space-y-1">
                    <p className="text-xs font-medium text-amber-200">
                      {COMPANY_INFO.providerEnglish}
                    </p>
                    <p className="text-sm font-bold">
                      جودة كاترينج مصر أصيل — وجبات ساخنة طازجة ومستلزمات كانتين متكاملة لموظفي HA-BE
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Full-Width 4-Column Operational Policy Strip */}
            <div className="mt-8 pt-7 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PROMO_HIGHLIGHTS.map((item, idx) => (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono-code font-semibold text-[#D9531E]">
                      0{idx + 1}.
                    </span>
                    <span>{item.kicker}</span>
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">{item.title}</h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: Wide Menu Catalog + HA-BE Lamma Offers */}
        <section
          id="menu-catalog"
          className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-8"
        >
          {/* Section Header + Search & View Controls */}
          <div className="no-print flex flex-col xl:flex-row xl:items-end justify-between gap-5 border-b border-slate-200 pb-6">
            <div>
              <p className="text-xs font-semibold text-[#0F4C5C]">
                القائمة الرسمية المحدثة — {MENU_ITEMS.length} صنفاً معتمداً
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                قائمة الطعام والكافتيريا الشاملة
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالاسم أو الكود (CBK-01, كفتة...)"
                  className="w-full pr-9 pl-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0F4C5C]"
                />
              </div>

              <div className="flex items-center gap-1 p-1 bg-[#EAE8E1] rounded-lg shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>عرض الصور</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('sheet')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    viewMode === 'sheet'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Table2 className="w-3.5 h-3.5" />
                  <span>الجدول العريض</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Category Filter Tabs */}
          <div className="no-print flex items-center gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  <span>{cat.label}</span>
                  {cat.priceTag && (
                    <span
                      className={`mr-2 text-[11px] tabular-nums-ar ${
                        isActive ? 'text-amber-300' : 'text-slate-500'
                      }`}
                    >
                      {cat.priceTag}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Catalog Content */}
          {filteredItems.length === 0 ? (
            <div className="py-16 text-center bg-white border border-slate-200 rounded-xl space-y-3">
              <p className="text-base font-bold text-slate-900">
                لا توجد أصناف مطابقة لبحثك &ldquo;{searchQuery}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#D9531E] rounded-lg cursor-pointer"
              >
                عرض جميع الأصناف
              </button>
            </div>
          ) : viewMode === 'sheet' ? (
            <WideMenuSheet
              items={filteredItems}
              cartQuantities={cartQuantities}
              onAdd={handleAddToCart}
              onUpdateQty={handleUpdateQty}
            />
          ) : (
            <div className="space-y-10">
              {categorySectionsToRender.map((cat, idx) => {
                const sectionItems = filteredItems.filter(
                  (i) => i.category === cat.id
                );
                if (sectionItems.length === 0) return null;

                const isLamma = cat.id === 'lamma';

                return (
                  <section
                    key={cat.id}
                    id={isLamma ? 'lamma-offers' : undefined}
                    className="space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="font-mono-code font-bold text-[#0F4C5C]">
                            0{idx + 1}.
                          </span>
                          <span>{cat.subtitle}</span>
                          {cat.priceTag && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-semibold text-[#D9531E] tabular-nums-ar">
                                {cat.priceTag}
                              </span>
                            </>
                          )}
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums-ar">
                            {sectionItems.length} صنف
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mt-1">
                          {cat.label}
                        </h3>
                      </div>

                      {isLamma && (
                        <button
                          type="button"
                          onClick={() =>
                            setFlyerPreview({
                              src: COMPANY_INFO.flyerLammaOffers,
                              title: 'عروض فطار اللمة 75 جنيه — HA-BE',
                            })
                          }
                          className="no-print self-start sm:self-auto text-xs font-semibold text-[#D9531E] hover:underline whitespace-nowrap cursor-pointer"
                        >
                          عرض بوستر عروض اللمة الأصلي
                        </button>
                      )}
                    </div>

                    {cat.id === 'canteen' ? (
                      <CanteenMarketList
                        items={sectionItems}
                        cartQuantities={cartQuantities}
                        onAdd={handleAddToCart}
                        onUpdateQty={handleUpdateQty}
                      />
                    ) : (
                      <div
                        className={`grid gap-4 ${
                          isLamma
                            ? 'grid-cols-1 lg:grid-cols-3'
                            : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                        }`}
                      >
                        {sectionItems.map((item) => (
                          <MenuCard
                            key={item.id}
                            item={item}
                            quantity={cartQuantities[item.id] || 0}
                            onAdd={handleAddToCart}
                            onUpdateQty={handleUpdateQty}
                          />
                        ))}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          )}
        </section>

        {/* SECTION 3: Dual QR Hub, Vodafone Cash 01041482940 & Supply Terms */}
        <section
          id="canteen-ops"
          className="no-print border-t border-slate-200 bg-white py-12"
        >
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-[#0F4C5C]">
                  بوابة التشغيل السريع — المصنع الألماني HA-BE
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                  رموز الاستجابة السريعة (QR) والدفع فودافون كاش
                </h2>
              </div>
              <p className="text-sm text-slate-600 max-w-md">
                امسح رمز المنيو للفتح المباشر على الهاتف، أو امسح رمز فودافون كاش للتحويل الفوري لرقم الكانتين المعتمد.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              {/* Card 1: Digital Menu QR */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#F8F8F6] border border-slate-200 flex flex-col sm:flex-row items-center gap-6 justify-between">
                <div className="space-y-3 flex-1 w-full">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <QrCode className="w-4 h-4 text-[#0F4C5C]" />
                    <span>QR المنيو الرقمي المحدث</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    كود فتح المنيو لموظفي HA-BE
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    اطبع هذا الكود وثبته على طاولات الكانتين أو لوحة إعلانات المصنع ليتمكن الموظفون من تصفح الصور والأسعار وإرسال طلباتهم مباشرة.
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      رابط المنيو المدمج داخل الـ QR:
                    </label>
                    <input
                      type="url"
                      dir="ltr"
                      value={menuQrUrl}
                      onChange={(e) => setMenuQrUrl(e.target.value)}
                      placeholder={defaultMenuQrUrl}
                      className="w-full px-3 py-1.5 text-xs font-mono-code bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#0F4C5C] text-left"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => copyValue(menuQrUrl, 'menu-url')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      {copiedId === 'menu-url' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {copiedId === 'menu-url' ? 'تم نسخ الرابط' : 'نسخ الرابط'}
                      </span>
                    </button>

                    <a
                      href={menuQrUrl || defaultMenuQrUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#0F4C5C] hover:bg-[#0B3945] rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>فتح الرابط</span>
                    </a>

                    {menuQrUrl !== defaultMenuQrUrl && (
                      <button
                        type="button"
                        onClick={() => setMenuQrUrl(defaultMenuQrUrl)}
                        className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>الافتراضي</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="shrink-0">
                  <QrCodeCanvas
                    value={menuQrUrl.trim() || defaultMenuQrUrl}
                    size={164}
                    title="QR قائمة الطعام الرسمية HA-BE"
                    caption="امسح الكود لفتح المنيو على موبايلك"
                    downloadFilename="habe-catering-menu-qr.png"
                  />
                </div>
              </div>

              {/* Card 2: Vodafone Cash 01041482940 QR */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#F8F8F6] border border-slate-200 flex flex-col sm:flex-row items-center gap-6 justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 text-xs text-red-700 font-semibold">
                    <Phone className="w-4 h-4" />
                    <span>الدفع الإلكتروني — فودافون كاش</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    محفظة الدفع: <span className="font-mono-code">{VODAFONE_CASH_NUMBER}</span>
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    حدد المبلغ المطلوب لتوليد كود تحويل فوري أو انسخ الرقم لتحويل قيمة الوجبات ومشتريات الكانتين بسهولة.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <label className="text-xs font-semibold text-slate-700">
                      المبلغ (ج.م):
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={10000}
                      value={quickCashAmount}
                      onChange={(e) =>
                        setQuickCashAmount(Math.max(1, Number(e.target.value) || 0))
                      }
                      className="w-24 px-2.5 py-1.5 text-sm font-bold font-mono-code bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-red-600"
                    />
                    <a
                      href={`tel:*9*7*${VODAFONE_CASH_NUMBER}*${quickCashAmount}%23`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded-lg transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>تنفيذ التحويل الآن ({quickCashAmount} ج.م)</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => copyValue(VODAFONE_CASH_NUMBER, 'vf-main')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      {copiedId === 'vf-main' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {copiedId === 'vf-main' ? 'تم نسخ الرقم' : 'نسخ 01041482940'}
                      </span>
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p
                      dir="ltr"
                      className="text-xs font-mono-code bg-white px-2.5 py-1 rounded border border-slate-200 text-slate-700 select-all"
                    >
                      *9*7*{VODAFONE_CASH_NUMBER}*{quickCashAmount}#
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        copyValue(
                          `*9*7*${VODAFONE_CASH_NUMBER}*${quickCashAmount}#`,
                          'vf-ussd'
                        )
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded cursor-pointer"
                    >
                      {copiedId === 'vf-ussd' ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedId === 'vf-ussd' ? 'تم نسخ الكود' : 'نسخ كود USSD'}</span>
                    </button>
                  </div>
                </div>

                <div className="shrink-0">
                  <QrCodeCanvas
                    value={`tel:*9*7*${VODAFONE_CASH_NUMBER}*${quickCashAmount}%23`}
                    size={164}
                    title={`QR دفع فودافون كاش ${VODAFONE_CASH_NUMBER}`}
                    caption={`تحويل ${quickCashAmount} ج.م إلى ${VODAFONE_CASH_NUMBER}`}
                    darkColor="#B91C1C"
                    downloadFilename="vodafone-cash-01041482940-qr.png"
                  />
                </div>
              </div>
            </div>

            {/* Supply Terms & Official Flyers Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-slate-200">
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-lg font-bold text-slate-900">
                  شروط التشغيل والتوريد الرسمية
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {SUPPLY_TERMS.map((term) => (
                    <div
                      key={term.title}
                      className="p-4 rounded-xl bg-[#F8F8F6] border border-slate-200/80"
                    >
                      <h4 className="text-sm font-bold text-slate-900">
                        {term.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {term.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <h3 className="text-lg font-bold text-slate-900">
                  المنشورات الإعلانية الرسمية (اضغط للمعاينة)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setFlyerPreview({
                        src: COMPANY_INFO.flyerGeneralPromo,
                        title: 'منشور التوريد والدفع مع الراتب — كاترينج مصر',
                      })
                    }
                    className="group text-right bg-[#F8F8F6] border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-colors cursor-pointer"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                      <img
                        src={COMPANY_INFO.flyerGeneralPromo}
                        alt="منشور التوريد الأسبوعي والدفع مع الراتب"
                        className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-bold text-slate-900">
                        توريد الكانتين والدفع مع الراتب
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        الوطنية اللوجستية · كاترينج مصر
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFlyerPreview({
                        src: COMPANY_INFO.flyerLammaOffers,
                        title: 'عروض فطار اللمة 75 جنيه — HA-BE',
                      })
                    }
                    className="group text-right bg-[#F8F8F6] border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-colors cursor-pointer"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                      <img
                        src={COMPANY_INFO.flyerLammaOffers}
                        alt="عروض فطار اللمة 75 جنيه للعاملين بالمصنع الألماني HA-BE"
                        className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-bold text-slate-900">
                        عروض فطار اللمة — 75 ج.م
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        عروض خاصة للمصنع الألماني HA-BE
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Persistent Canteen Order Ledger */}
        <section
          id="order-ledger"
          className="no-print max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12 space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[#0F4C5C]">
                كل طلباتك مسجلة ومحسوبة لحد قبضتك
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                سجل طلبات الكانتين وحساب الراتب — HA-BE
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm bg-white border border-slate-200 rounded-xl px-5 py-3">
              <div>
                <span className="text-xs text-slate-500 block">آجل للخصم من الراتب</span>
                <span className="font-bold text-[#0F4C5C] tabular-nums-ar">
                  {salaryDueTotal} ج.م
                </span>
              </div>
              <div className="h-7 w-px bg-slate-200" />
              <div>
                <span className="text-xs text-slate-500 block">مسدد / فودافون كاش</span>
                <span className="font-bold text-emerald-700 tabular-nums-ar">
                  {cashPaidTotal} ج.م
                </span>
              </div>
              <div className="h-7 w-px bg-slate-200" />
              <div>
                <span className="text-xs text-slate-500 block">إجمالي الطلبات</span>
                <span className="font-bold text-slate-900 tabular-nums-ar">
                  {orders.length}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#EAE8E1] rounded-lg w-fit">
            {[
              { id: 'all', label: 'جميع الطلبات' },
              { id: 'salary_deduction', label: 'الخصم من الراتب' },
              { id: 'vodafone_cash', label: 'فودافون كاش' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setLedgerFilter(
                    tab.id as 'all' | 'salary_deduction' | 'vodafone_cash'
                  )
                }
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  ledgerFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-2">
              <p className="text-sm font-bold text-slate-900">
                لا توجد طلبات مسجلة في هذا القسم حتى الآن
              </p>
              <p className="text-xs text-slate-500">
                أضف وجبات أو مشروبات إلى السلة وأكمل الطلب ليظهر تلقائياً في سجل محاسبة الكانتين.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#F8F8F6] border-b border-slate-200 text-xs text-slate-600">
                      <th className="py-3 px-4 font-semibold">رقم الطلب</th>
                      <th className="py-3 px-4 font-semibold">الموظف والكود</th>
                      <th className="py-3 px-4 font-semibold">تفاصيل الأصناف</th>
                      <th className="py-3 px-4 font-semibold">طريقة السداد</th>
                      <th className="py-3 px-4 font-semibold">الإجمالي</th>
                      <th className="py-3 px-4 font-semibold">الحالة</th>
                      <th className="py-3 px-4 font-semibold text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/70">
                        <td className="py-3.5 px-4 font-mono-code text-xs font-semibold text-slate-900 whitespace-nowrap">
                          {order.id}
                          <div className="text-[11px] font-sans text-slate-400 font-normal mt-0.5">
                            {new Date(order.createdAt).toLocaleTimeString('ar-EG', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900">
                            {order.employeeName}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            <span className="font-mono-code">{order.employeeCode}</span>
                            {' · '}
                            <span>{order.department}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-700 max-w-xs">
                          {order.items
                            .map((i) => `${i.name} (×${i.quantity})`)
                            .join('، ')}
                          {order.notes && (
                            <div className="text-slate-500 mt-0.5">
                              ملاحظة: {order.notes}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-xs whitespace-nowrap">
                          {order.paymentMethod === 'vodafone_cash' ? (
                            <span className="font-semibold text-red-700">
                              فودافون كاش
                              {order.vodafoneRef ? ` (${order.vodafoneRef})` : ''}
                            </span>
                          ) : (
                            <span className="font-semibold text-[#0F4C5C]">
                              الخصم من الراتب
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-bold tabular-nums-ar text-slate-900 whitespace-nowrap">
                          {order.totalAmount} ج.م
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleToggleOrderPaid(order.id)}
                            className={`text-xs font-semibold cursor-pointer ${
                              order.status === 'paid'
                                ? 'text-emerald-700'
                                : 'text-amber-700'
                            }`}
                          >
                            {order.status === 'paid'
                              ? 'تم السداد'
                              : 'مسجل على الراتب'}
                          </button>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handlePrintReceipt(order)}
                              title="طباعة الإيصال"
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-slate-800 hover:bg-slate-900 rounded cursor-pointer whitespace-nowrap"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>طباعة</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => copyOrderWhatsapp(order)}
                              title="نسخ الطلب للجروب"
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded cursor-pointer whitespace-nowrap"
                            >
                              {copiedId === order.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                              <span>{copiedId === order.id ? 'نُسخ' : 'نسخ'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteOrder(order.id)}
                              aria-label="حذف الطلب"
                              className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Clean Footer */}
      <footer className="no-print border-t border-slate-200 bg-white py-6">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            {COMPANY_INFO.providerArabic} · تشغيل كانتين وتوريد وجبات {COMPANY_INFO.clientName}
          </p>
          <p className="font-mono-code">
            فودافون كاش المعتمد: {VODAFONE_CASH_NUMBER}
          </p>
        </div>
      </footer>
      </div>

      {/* Dedicated Isolated Printable Receipt (shown ONLY during receipt print mode) */}
      <section
        id="printable-receipt"
        className="hidden max-w-md mx-auto p-6 bg-white text-slate-900 border border-slate-300 rounded-xl"
      >
        {receiptToPrint && (
          <div className="space-y-4">
            <div className="text-center border-b border-slate-300 pb-3 space-y-1">
              <p className="text-xs font-semibold text-slate-600">
                {COMPANY_INFO.providerArabic} · {COMPANY_INFO.providerEnglish}
              </p>
              <h2 className="text-lg font-bold text-slate-900">
                إيصال طلب كانتين ووجبات — {COMPANY_INFO.clientName}
              </h2>
              <p className="text-xs font-mono-code text-slate-700">
                رقم الإيصال: {receiptToPrint.id} ·{' '}
                {new Date(receiptToPrint.createdAt).toLocaleString('ar-EG', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs border-b border-slate-200 pb-3">
              <div>
                <span className="text-slate-500">الموظف: </span>
                <span className="font-bold">{receiptToPrint.employeeName}</span>
              </div>
              <div>
                <span className="text-slate-500">الكود: </span>
                <span className="font-mono-code font-bold">{receiptToPrint.employeeCode}</span>
              </div>
              <div>
                <span className="text-slate-500">القسم: </span>
                <span className="font-semibold">{receiptToPrint.department}</span>
              </div>
              <div>
                <span className="text-slate-500">موعد التوريد: </span>
                <span className="font-semibold">{receiptToPrint.deliverySlot}</span>
              </div>
            </div>

            <table className="w-full text-right text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-300 text-slate-600">
                  <th className="py-1.5 font-semibold">الصنف</th>
                  <th className="py-1.5 font-semibold text-center">الكمية</th>
                  <th className="py-1.5 font-semibold text-left">الإجمالي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {receiptToPrint.items.map((item) => (
                  <tr key={item.code}>
                    <td className="py-1.5 font-medium">
                      <span className="font-mono-code text-[10px] text-slate-500 ml-1">
                        {item.code}
                      </span>
                      {item.name}
                    </td>
                    <td className="py-1.5 text-center tabular-nums-ar">{item.quantity}</td>
                    <td className="py-1.5 text-left font-bold tabular-nums-ar">
                      {item.price * item.quantity} ج.م
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t-2 border-slate-900 pt-2.5 flex items-center justify-between text-base font-bold">
              <span>الإجمالي المستحق</span>
              <span className="tabular-nums-ar">{receiptToPrint.totalAmount} ج.م</span>
            </div>

            <div className="text-xs border-t border-slate-200 pt-2.5 space-y-1">
              <p>
                <span className="text-slate-500">طريقة السداد: </span>
                <span className="font-bold">
                  {receiptToPrint.paymentMethod === 'vodafone_cash'
                    ? `فودافون كاش (${VODAFONE_CASH_NUMBER})${
                        receiptToPrint.vodafoneRef
                          ? ` — مرجع: ${receiptToPrint.vodafoneRef}`
                          : ''
                      }`
                    : 'الخصم من الراتب الشهري (HA-BE)'}
                </span>
              </p>
              {receiptToPrint.notes && (
                <p>
                  <span className="text-slate-500">ملاحظات: </span>
                  <span>{receiptToPrint.notes}</span>
                </p>
              )}
            </div>

            {receiptToPrint.paymentMethod === 'vodafone_cash' && (
              <div className="pt-2 flex flex-col items-center border-t border-slate-200">
                <QrCodeCanvas
                  value={`tel:*9*7*${VODAFONE_CASH_NUMBER}*${receiptToPrint.totalAmount}%23`}
                  size={104}
                  title="QR سداد فودافون كاش"
                  darkColor="#B91C1C"
                  showDownload={false}
                />
                <span className="text-[11px] font-mono-code text-slate-600 mt-1">
                  *9*7*{VODAFONE_CASH_NUMBER}*{receiptToPrint.totalAmount}#
                </span>
              </div>
            )}

            <p className="text-[11px] text-center text-slate-500 pt-2 border-t border-slate-200">
              بالهناء والشفاء — كاترينج مصر · الشركة الوطنية للخدمات اللوجستية
            </p>
          </div>
        )}
      </section>

      {/* Mobile/Desktop Floating Cart Bar (compact <= 52px, only when cart > 0) */}
      {cartTotalCount > 0 && !cartOpen && (
        <div className="no-print fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 z-30 flex justify-center">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="w-full sm:w-auto flex items-center justify-between gap-6 px-5 py-3 bg-slate-900 text-white rounded-xl shadow-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 text-sm font-bold">
              <ShoppingBag className="w-4 h-4 text-[#D9531E]" />
              <span>إتمام الطلب ({cartTotalCount} صنف)</span>
            </div>
            <span className="text-sm font-bold text-amber-300 tabular-nums-ar">
              {cartSubtotal} ج.م
            </span>
          </button>
        </div>
      )}

      {/* Drawers & Modals */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        entries={cartEntries}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onConfirmOrder={handleConfirmOrder}
        onPrintReceipt={handlePrintReceipt}
      />

      <FlyerModal
        open={flyerPreview !== null}
        imageSrc={flyerPreview?.src || ''}
        title={flyerPreview?.title || ''}
        onClose={() => setFlyerPreview(null)}
      />
    </div>
  );
}
