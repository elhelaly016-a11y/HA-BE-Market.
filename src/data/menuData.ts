export type CategoryId =
  | 'all'
  | 'lamma'
  | 'breakfast'
  | 'lunch'
  | 'pastries'
  | 'koshary-pizza'
  | 'sandwiches'
  | 'canteen';

export interface MenuItem {
  id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  category: Exclude<CategoryId, 'all'>;
  subCategory?: string;
  image?: string;
  featuredNote?: string;
}

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  subtitle: string;
  priceTag?: string;
}

export const VODAFONE_CASH_NUMBER = '01041482940';

export const PUBLIC_SHARED_APP_URL =
  'https://ais-pre-ad7a2tvclogeye4qraugf5-475485808001.europe-west2.run.app';

export const COMPANY_INFO = {
  providerArabic: 'الشركة الوطنية للخدمات اللوجستية | كاترينج مصر',
  providerEnglish: 'ELWATANYA LOGISTICS · Catering Egypt',
  clientName: 'الشركة الألمانية HA-BE',
  clientCode: 'HA-BE',
  sector: 'قطاع الشركات والمصانع — التشغيل اليومي المعتاد',
  vodafoneCash: VODAFONE_CASH_NUMBER,
  heroImage: '/src/assets/images/hero_catering_spread_1794851384984.jpg',
  flyerGeneralPromo:
    '/assets/aistudio/WhatsApp_Image_2026-11-16_at_9.22.47_AM_5a5217ed.jpeg',
  flyerLammaOffers: '/assets/aistudio/image_722a8349.png',
};

export const PROMO_HIGHLIGHTS = [
  {
    id: 'weekly-menu',
    title: 'منيو متجدد ومتنوع كل أسبوع',
    body: 'أصناف جديدة تعجبكم باستمرار، بالإضافة إلى توفر جميع أغراض واحتياجات الكانتين بالكامل طوال اليوم.',
    kicker: 'جديد في جديد',
  },
  {
    id: 'salary-payment',
    title: 'اشتري دلوقتي والدفع مع الراتب',
    body: 'كل طلبات موظفي HA-BE مسجلة ومحسوبة تلقائياً في سجل الكانتين حتى موعد قبض الراتب الشهري.',
    kicker: 'تسهيلات السداد',
  },
  {
    id: 'preorder-window',
    title: 'مواعيد الطلب المسبق للتسليم الساخن',
    body: 'لضمان وصول الوجبة طازجة وساخنة في موعدها، يرجى الطلب قبل موعد التوريد بـ 30 إلى 60 دقيقة كحد أقصى.',
    kicker: 'ضمان الجودة',
  },
  {
    id: 'order-channels',
    title: 'الطلب عبر الجروب أو القائمة الرقمية',
    body: 'أكمل طلبك هنا وانسخ رسالة الطلب مباشرة لجروب الواتساب الرسمي، أو ادفع فوراً عبر فودافون كاش 01041482940.',
    kicker: 'طريقة الطلب',
  },
];

export const SUPPLY_TERMS = [
  {
    title: 'مواعيد الطلب المسبق',
    detail:
      'لضمان وصول الوجبات طازجة وبأعلى معايير الجودة، يُرجى إرسال الطلب قبل موعد التوريد بمدة لا تقل عن 30 دقيقة ولا تزيد عن ساعة قبل التسليم (يُستثنى من ذلك الأصناف الجاهزة ضمن التشغيل اليومي المعتاد بالكانتين).',
  },
  {
    title: 'تحديث أسعار الكافتيريا والمشروبات',
    detail:
      'أسعار المشروبات الغازية والعصائر ومنتجات الكافتيريا قابلة للتعديل طبقاً لأسعار الشركات الموردة والأسعار السائدة بالسوق وقت التوريد.',
  },
  {
    title: 'طرق السداد المعتمدة لموظفي HA-BE',
    detail:
      'متاح الدفع الفوري عبر محفظة فودافون كاش على رقم 01041482940 (أو مسح رمز QR)، كما يتاح التسجيل الآجل والخصم مع الراتب الشهري لموظفي المصنع الألماني.',
  },
];

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'all',
    label: 'جميع الأصناف',
    subtitle: 'القائمة الكاملة لخدمات الطعام والكافتيريا',
  },
  {
    id: 'lamma',
    label: 'فطار اللمة HA-BE',
    subtitle: 'عروض خاصة للعاملين بالمصنع الألماني',
    priceTag: '75 ج.م',
  },
  {
    id: 'breakfast',
    label: 'إفطار الشركات',
    subtitle: 'وجبات إفطار يومية متكاملة بالخبز الفاخر',
    priceTag: '49 ج.م',
  },
  {
    id: 'lunch',
    label: 'الغداء الاقتصادي',
    subtitle: 'وجبات غداء ساخنة في علب ميكروويف معتمدة',
    priceTag: '88 ج.م',
  },
  {
    id: 'pastries',
    label: 'المعجنات الطازجة',
    subtitle: 'باتيه كبير محشي، كرواسون، ورول باتيه طازج يومياً',
    priceTag: '37 ج.م',
  },
  {
    id: 'koshary-pizza',
    label: 'كشري العين والبيتزا',
    subtitle: 'كشري العين بالأحجام و2 سلايز بيتزا طازجة',
    priceTag: '40 – 58 ج.م',
  },
  {
    id: 'sandwiches',
    label: 'السندوتشات والوجبات السريعة',
    subtitle: 'سندوتش واحد لكل صنف — عيش بلدي وشامي بالسمسم وفينو',
    priceTag: '12 – 75 ج.م',
  },
  {
    id: 'canteen',
    label: 'الكافتيريا والمشروبات',
    subtitle: 'كل صنف منفرد بسعره — مشروبات غازية وعصائر ومقرمشات وشوكولاتة',
    priceTag: '5 – 70 ج.م',
  },
];

const IMG = {
  // Breakfast
  foulSpread: '/src/assets/images/breakfast_foul_spread_1794851384703.jpg',
  moussakaFoul: '/src/assets/images/breakfast_moussaka_foul_1794851385109.jpg',
  lentilLamma: '/src/assets/images/breakfast_lentil_lamma_1794851384945.jpg',

  // Real Black Microwave Container Meals (clean single-dish microwave trays)
  mwRoastChicken: '/assets/aistudio/FB_IMG_1646377567416_8877c5cd.jpg',
  mwDawoodBasha: '/assets/aistudio/FB_IMG_1627571898960_0991aca4.jpg',
  mwKoftaGrill: '/assets/aistudio/FB_IMG_1642308300593_ddcadf06.jpg',
  mwShishOnly: '/src/assets/images/lunch_mw_shish_only_1794857354861.jpg',
  mwQuarterChickenOnly:
    '/src/assets/images/lunch_mw_quarter_chicken_only_1794857354269.jpg',

  // Pastries (each item with its exact internal filling)
  pateRoumiVeg: '/src/assets/images/pastry_pate_roumi_veg_1794856731711.jpg',
  pateCheeseOlive: '/src/assets/images/pastry_pate_cheese_olive_1794856733486.jpg',
  croissantSingle: '/src/assets/images/pastry_croissant_single_1794856733035.jpg',
  pateLongRoll: '/src/assets/images/pastry_single_long_pate_1794852571247.jpg',

  // Koshary Al-Ain (clean bowl without side paper bags) & Original Pizza
  kosharyAlAin: '/src/assets/images/koshary_alain_clean_bowl_1794857353871.jpg',
  pizzaOriginal: '/src/assets/images/pizza_slices_assorted_1794851387290.jpg',

  // Single Sandwiches (1 sandwich per item, exact bread)
  oneFoulBaladi: '/src/assets/images/snd_one_foul_baladi_1794856732810.jpg',
  oneTaameyaBaladi: '/src/assets/images/snd_one_taameya_baladi_1794856734761.jpg',
  oneWhiteCheese: '/src/assets/images/snd_one_white_cheese_1794856735406.jpg',
  oneCheeseKhalta: '/src/assets/images/snd_one_cheese_khalta_1794856735794.jpg',
  oneKiriFino: '/src/assets/images/snd_one_kiri_fino_1794856736209.jpg',
  oneLuncheonFino: '/src/assets/images/snd_one_luncheon_fino_1794856735915.jpg',
  oneRoumiFino: '/src/assets/images/snd_one_roumi_fino_1794856736062.jpg',
  oneHalawaEshtaFino:
    '/src/assets/images/snd_one_halawa_eshta_fino_1794856738027.jpg',
  onePotatoMashedShami:
    '/src/assets/images/snd_one_potato_mashed_shami_1794856738023.jpg',
  onePotatoFriesShami:
    '/src/assets/images/snd_one_potato_fries_shami_1794856738485.jpg',
  onePotatoShrimpShami:
    '/src/assets/images/snd_one_potato_shrimp_shami_1794856738914.jpg',
  oneBabaGhanoushShami:
    '/src/assets/images/snd_one_baba_ghanoush_shami_1794856739271.jpg',
  oneTunaShami: '/src/assets/images/snd_tuna_shami_bread_1794852567886.jpg',
  oneBurgerFries: '/src/assets/images/snd_burger_single_fries_1794852566743.jpg',
  oneClubWide: '/src/assets/images/snd_club_wide_roumi_1794852566295.jpg',
  oneCheeseMix: '/src/assets/images/snd_cheese_mix_single_1794852567945.jpg',
  oneKoftaBaladi: '/src/assets/images/snd_kofta_baladi_single_1794852564782.jpg',
  oneShishFino: '/src/assets/images/snd_one_shish_fino_1794856739840.jpg',
  onePaneFino: '/src/assets/images/snd_pane_fino_single_1794852565939.jpg',
};

export const MENU_ITEMS: MenuItem[] = [
  // 1. عروض فطار اللمة — HA-BE
  {
    id: 'LMA-01',
    code: 'LMA-01',
    name: 'عرض فطار اللمة — لمة الفول',
    description:
      'طبق فول بالصلصة + 3 طعمية محشية كبيرة + علبة بطاطس مهروسة + باذنجان مخلل + 9 أرغفة عيش',
    price: 75,
    category: 'lamma',
    subCategory: 'عروض المصنع الألماني HA-BE',
    image: IMG.foulSpread,
    featuredNote: 'عرض اللمة HA-BE',
  },
  {
    id: 'LMA-02',
    code: 'LMA-02',
    name: 'عرض فطار اللمة — لمة المسقعة',
    description:
      'طاجن مسقعة + علبة فول بالطحينة والليمون + 3 طعمية + باذنجان مخلل + 9 أرغفة عيش + 3 أظرف مربى',
    price: 75,
    category: 'lamma',
    subCategory: 'عروض المصنع الألماني HA-BE',
    image: IMG.moussakaFoul,
    featuredNote: 'عرض اللمة HA-BE',
  },
  {
    id: 'LMA-03',
    code: 'LMA-03',
    name: 'عرض فطار اللمة — لمة العدس',
    description:
      'علبة عدس كبيرة بالشعرية + بصل صغير + طبق فول + 3 حلاوة بار + باذنجان مخلل + 9 أرغفة عيش',
    price: 75,
    category: 'lamma',
    subCategory: 'عروض المصنع الألماني HA-BE',
    image: IMG.lentilLamma,
    featuredNote: 'عرض اللمة HA-BE',
  },

  // 2. وجبات الإفطار للشركات
  {
    id: 'CBK-01',
    code: 'CBK-01',
    name: 'وجبة إفطار فول وجبنة وبيضة',
    description:
      'فول بالزيت والطحينة + جبنة بالخلطة + 1 بيضة مسلوقة + طرشي + 3 أرغفة خبز فاخر كبير',
    price: 49,
    category: 'breakfast',
    subCategory: 'وجبات الإفطار للشركات',
    image: IMG.foulSpread,
  },
  {
    id: 'CBK-02',
    code: 'CBK-02',
    name: 'وجبة إفطار فول ولبنة بالزعتر',
    description:
      'فول بالزيت والطحينة + علبة لبنة بالزعتر والبقدونس + بورشن مربى + مخلل + 3 أرغفة خبز فاخر كبير',
    price: 49,
    category: 'breakfast',
    subCategory: 'وجبات الإفطار للشركات',
    image: IMG.foulSpread,
  },
  {
    id: 'CBK-03',
    code: 'CBK-03',
    name: 'وجبة إفطار فول وطاجن مسقعة',
    description:
      'فول بالزيت والليمون + طاجن مسقعة + مخلل + 3 أرغفة خبز فاخر كبير',
    price: 49,
    category: 'breakfast',
    subCategory: 'وجبات الإفطار للشركات',
    image: IMG.moussakaFoul,
  },
  {
    id: 'CBK-04',
    code: 'CBK-04',
    name: 'وجبة إفطار فول بالزبدة وبطاطس بوريه',
    description:
      'فول برائحة الزبدة البلدي + طاجن بطاطس بوريه + مخلل + 3 أرغفة خبز فاخر كبير',
    price: 49,
    category: 'breakfast',
    subCategory: 'وجبات الإفطار للشركات',
    image: IMG.moussakaFoul,
  },
  {
    id: 'CBK-05',
    code: 'CBK-05',
    name: 'وجبة إفطار فول وجبنة فيتا ودومتي',
    description:
      'فول بالزيت والطحينة + جبنة فيتا + علبة جبنة دومتي بلس 80 جم + 1 بيضة مسلوقة + مخلل + 3 أرغفة خبز فاخر كبير',
    price: 49,
    category: 'breakfast',
    subCategory: 'وجبات الإفطار للشركات',
    image: IMG.foulSpread,
  },

  // 3. وجبات الغداء الاقتصادية (بدون كباب الحلة، مع صور علب الميكروويف الصحيحة)
  {
    id: 'FCT-01',
    code: 'FCT-01',
    name: 'وجبة فراخ روستو (ربع فرخة) + أرز وتورلي',
    description:
      'ربع فراخ روستو + أرز أبيض بالشعرية مفلفل + تورلي بالصلصة + خبز + مخلل + سلطة بدون طماطم',
    price: 88,
    category: 'lunch',
    subCategory: 'وجبات الغداء الاقتصادية',
    image: IMG.mwRoastChicken,
  },
  {
    id: 'FCT-02',
    code: 'FCT-02',
    name: 'وجبة داوود باشا بالصوص',
    description:
      'داوود باشا بالصوص + أرز بالشعرية + خضار بطاطس مع صوص الداود باشا + شرائح خيار + خبز + مخلل',
    price: 88,
    category: 'lunch',
    subCategory: 'وجبات الغداء الاقتصادية',
    image: IMG.mwDawoodBasha,
  },
  {
    id: 'FCT-04',
    code: 'FCT-04',
    name: 'وجبة 120 جم كفتة مشوية',
    description:
      '120 جم كفتة مشوية + أرز بسمتي أصفر + بطاطس بوم فريت + شرائح خيار + طحينة + خبز + مخلل',
    price: 88,
    category: 'lunch',
    subCategory: 'وجبات الغداء الاقتصادية',
    image: IMG.mwKoftaGrill,
  },
  {
    id: 'FCT-05',
    code: 'FCT-05',
    name: 'وجبة 120 جم شيش على الفحم',
    description:
      '120 جم شيش على الفحم + أرز بسمتي أصفر + بطاطس بوم فريت + شرائح خيار + طحينة + خبز + مخلل',
    price: 88,
    category: 'lunch',
    subCategory: 'وجبات الغداء الاقتصادية',
    image: IMG.mwShishOnly,
  },
  {
    id: 'FCT-06',
    code: 'FCT-06',
    name: 'وجبة ربع فراخ مشوية (صدر أو ورك)',
    description:
      'ربع فراخ مشوية (صدر أو ورك) + أرز بسمتي أصفر + بطاطس بوم فريت + شرائح خيار + طحينة + خبز + مخلل',
    price: 88,
    category: 'lunch',
    subCategory: 'وجبات الغداء الاقتصادية',
    image: IMG.mwQuarterChickenOnly,
  },

  // 4. المعجنات الطازجة (تبقى بالصور حسب الطلب)
  {
    id: 'PST-01',
    code: 'PST-01',
    name: 'باتيه كبير جبنة رومي بالخضار',
    description:
      'قطعة باتيه كبيرة مورقة مخبوزة طازجة محشية من الداخل بالجبنة الرومي والخضار والفلفل الألوان',
    price: 37,
    category: 'pastries',
    subCategory: 'باتيه جبنة رومي بالخضار',
    image: IMG.pateRoumiVeg,
  },
  {
    id: 'PST-02',
    code: 'PST-02',
    name: 'باتيه كبير جبنة وزيتون',
    description:
      'قطعة باتيه كبيرة مورقة محشية من الداخل بالجبنة البيضاء وشرائح الزيتون الأسود',
    price: 37,
    category: 'pastries',
    subCategory: 'باتيه جبنة وزيتون',
    image: IMG.pateCheeseOlive,
  },
  {
    id: 'PST-03',
    code: 'PST-03',
    name: 'كرواسون كبير سادة أو رومي',
    description:
      'كرواسون ذهبي كبير مقرمش بالزبدة (متاح سادة أو محشي جبنة رومي)',
    price: 37,
    category: 'pastries',
    subCategory: 'كرواسون سادة أو رومي',
    image: IMG.croissantSingle,
  },
  {
    id: 'PST-04',
    code: 'PST-04',
    name: 'رول باتيه بالجبنة والخضار',
    description:
      'رول باتيه طويل مفرد محشي من الداخل بالجبنة المتبلة والزيتون والخضار الطازج',
    price: 37,
    category: 'pastries',
    subCategory: 'رول باتيه بالجبنة والخضار',
    image: IMG.pateLongRoll,
  },

  // 5. كشري العين المصري والبيتزا (صغيرة 40 / وسط 48 / كبيرة عائلي 58)
  {
    id: 'K-01',
    code: 'K-01',
    name: 'كشري العين — علبة صغيرة',
    description:
      'علبة كشري العين (حجم صغير) بالصلصة والدقة والبصل المحمر والملحقات كاملة',
    price: 40,
    category: 'koshary-pizza',
    subCategory: 'كشري العين',
    image: IMG.kosharyAlAin,
  },
  {
    id: 'K-02',
    code: 'K-02',
    name: 'كشري العين — علبة وسط',
    description:
      'علبة كشري العين (حجم وسط) بالصلصة والدقة والشطة والبصل المحمر والملحقات',
    price: 48,
    category: 'koshary-pizza',
    subCategory: 'كشري العين',
    image: IMG.kosharyAlAin,
  },
  {
    id: 'K-03',
    code: 'K-03',
    name: 'كشري العين — علبة كبيرة (عائلي)',
    description:
      'علبة كشري العين (حجم كبير / عائلي) بالصلصة والدقة والبصل المحمر وكافة الملحقات',
    price: 58,
    category: 'koshary-pizza',
    subCategory: 'كشري العين',
    image: IMG.kosharyAlAin,
  },
  {
    id: 'SL-01',
    code: 'SL-01',
    name: '2 قطعة بيتزا (سلايز) مارجريتا',
    description:
      '2 قطعة بيتزا (سلايز) طازجة بصوص الطماطم الإيطالي والجبنة الموتزاريلا',
    price: 58,
    category: 'koshary-pizza',
    subCategory: 'البيتزا الطازجة',
    image: IMG.pizzaOriginal,
  },
  {
    id: 'SL-02',
    code: 'SL-02',
    name: '2 قطعة بيتزا (سلايز) لحمة مفرومة',
    description:
      '2 قطعة بيتزا (سلايز) باللحمة المفرومة المتبلة والفلفل الألوان والموتزاريلا',
    price: 58,
    category: 'koshary-pizza',
    subCategory: 'البيتزا الطازجة',
    image: IMG.pizzaOriginal,
  },
  {
    id: 'SL-03',
    code: 'SL-03',
    name: '2 قطعة بيتزا (سلايز) فراخ',
    description:
      '2 قطعة بيتزا (سلايز) بقطع الدجاج المشوي والصوص والموتزاريلا الذائبة',
    price: 58,
    category: 'koshary-pizza',
    subCategory: 'البيتزا الطازجة',
    image: IMG.pizzaOriginal,
  },

  // 6. السندوتشات والوجبات السريعة
  {
    id: 'SND-01',
    code: 'SND-01',
    name: 'سندوتش فول',
    description: 'سندوتش واحد فول مدمس بالزيت والطحينة في عيش بلدي مصري طازج',
    price: 12,
    category: 'sandwiches',
    subCategory: 'سندوتش بلدي',
    image: IMG.oneFoulBaladi,
  },
  {
    id: 'SND-02',
    code: 'SND-02',
    name: 'سندوتش طعمية',
    description:
      'سندوتش واحد طعمية مصرية مقرمشة ساخنة بالسلطة والطحينة في عيش بلدي',
    price: 12,
    category: 'sandwiches',
    subCategory: 'سندوتش بلدي',
    image: IMG.oneTaameyaBaladi,
  },
  {
    id: 'SND-03',
    code: 'SND-03',
    name: 'سندوتش جبنة',
    description: 'سندوتش واحد جبنة بيضاء طازجة في عيش شامي فاتح بالسمسم',
    price: 15,
    category: 'sandwiches',
    subCategory: 'سندوتش شامي',
    image: IMG.oneWhiteCheese,
  },
  {
    id: 'SND-04',
    code: 'SND-04',
    name: 'سندوتش جبنة بالخلطة',
    description:
      'سندوتش واحد جبنة متبلة بالطماطم والفلفل في عيش شامي فاتح بالسمسم',
    price: 15,
    category: 'sandwiches',
    subCategory: 'سندوتش شامي',
    image: IMG.oneCheeseKhalta,
  },
  {
    id: 'SND-05',
    code: 'SND-05',
    name: 'سندوتش جبنة كيري (فينو)',
    description: 'سندوتش واحد جبنة كيري كريمية في رغيف فينو طازج',
    price: 15,
    category: 'sandwiches',
    subCategory: 'سندوتش فينو',
    image: IMG.oneKiriFino,
  },
  {
    id: 'SND-06',
    code: 'SND-06',
    name: 'سندوتش لانشون حلواني أو اللحيمي (فينو)',
    description: 'سندوتش واحد لانشون حلواني أو اللحيمي في رغيف فينو طازج',
    price: 15,
    category: 'sandwiches',
    subCategory: 'سندوتش فينو',
    image: IMG.oneLuncheonFino,
  },
  {
    id: 'SND-07',
    code: 'SND-07',
    name: 'سندوتش جبنة رومي (فينو)',
    description: 'سندوتش واحد جبنة رومي معتقة في رغيف فينو طازج',
    price: 15,
    category: 'sandwiches',
    subCategory: 'سندوتش فينو',
    image: IMG.oneRoumiFino,
  },
  {
    id: 'SND-08',
    code: 'SND-08',
    name: 'سندوتش حلاوة بالقشطة (فينو)',
    description: 'سندوتش واحد حلاوة طحينية بالقشطة الطبيعية في رغيف فينو طازج',
    price: 15,
    category: 'sandwiches',
    subCategory: 'سندوتش فينو',
    image: IMG.oneHalawaEshtaFino,
  },
  {
    id: 'SND-09',
    code: 'SND-09',
    name: 'سندوتش بطاطس مهروسة / شامي',
    description:
      'سندوتش واحد بطاطس مهروسة متبلة بالتوابل والكمون في عيش شامي فاتح بالسمسم',
    price: 15,
    category: 'sandwiches',
    subCategory: 'سندوتش شامي',
    image: IMG.onePotatoMashedShami,
  },
  {
    id: 'SND-10',
    code: 'SND-10',
    name: 'سندوتش بطاطس صوابع',
    description:
      'سندوتش واحد بطاطس بوم فريت مقرمشة في عيش شامي فاتح مدور بالسمسم',
    price: 15,
    category: 'sandwiches',
    subCategory: 'سندوتش شامي',
    image: IMG.onePotatoFriesShami,
  },
  {
    id: 'SND-11',
    code: 'SND-11',
    name: 'سندوتش بطاطس جمبري',
    description:
      'سندوتش واحد بطاطس بتتبيلة الجمبري في عيش شامي فاتح مدور بالسمسم',
    price: 15,
    category: 'sandwiches',
    subCategory: 'سندوتش شامي',
    image: IMG.onePotatoShrimpShami,
  },
  {
    id: 'SND-12',
    code: 'SND-12',
    name: 'سندوتش بابا غنوج',
    description:
      'سندوتش واحد بابا غنوج بالطحينة والليمون في عيش شامي فاتح بالسمسم',
    price: 15,
    category: 'sandwiches',
    subCategory: 'سندوتش شامي',
    image: IMG.oneBabaGhanoushShami,
  },
  {
    id: 'SND-13',
    code: 'SND-13',
    name: 'سندوتش تونة بالمايونيز والفلفل (سبايسي)',
    description:
      'سندوتش واحد تونة بالمايونيز والفلفل الحار في عيش شامي فاتح بالسمسم',
    price: 70,
    category: 'sandwiches',
    subCategory: 'سندوتش شامي مميز',
    image: IMG.oneTunaShami,
  },
  {
    id: 'COM-01',
    code: 'COM-01',
    name: 'سندوتش برجر + بطاطس بوم فريت + مخلل',
    description:
      'سندوتش برجر واحد (بدون مشروب) مع بوم فريت وظرف كاتشب أو مخلل',
    price: 45,
    category: 'sandwiches',
    subCategory: 'سندوتش بالبطاطس',
    image: IMG.oneBurgerFries,
  },
  {
    id: 'COM-02',
    code: 'COM-02',
    name: 'كلوب ساندوتش',
    description:
      'كلوب ساندوتش عريض مقسّم بشرائح الجبنة الرومي والتركي والخس الطازج',
    price: 75,
    category: 'sandwiches',
    subCategory: 'سندوتش مميز',
    image: IMG.oneClubWide,
  },
  {
    id: 'COM-03',
    code: 'COM-03',
    name: 'تشيز ميكس ساندوتش',
    description: 'سندوتش واحد فقط محشي بخليط الأجبان الذائبة الساخنة',
    price: 45,
    category: 'sandwiches',
    subCategory: 'سندوتش مميز',
    image: IMG.oneCheeseMix,
  },
  {
    id: 'COM-04',
    code: 'COM-04',
    name: 'سندوتش كفتة مشوية + بطاطس بوم فريت + مخلل',
    description:
      'سندوتش واحد كفتة مشوية في رغيف بلدي مع علبة طحينة وعلبة مخلل وبوم فريت',
    price: 55,
    category: 'sandwiches',
    subCategory: 'سندوتش مشويات',
    image: IMG.oneKoftaBaladi,
  },
  {
    id: 'COM-05',
    code: 'COM-05',
    name: 'سندوتش شيش مشوي + بطاطس بوم فريت + مخلل',
    description:
      'سندوتش واحد شيش مشوي في رغيف فينو أو بلدي مع علبة طحينة وعلبة مخلل وبوم فريت',
    price: 55,
    category: 'sandwiches',
    subCategory: 'سندوتش مشويات',
    image: IMG.oneShishFino,
  },
  {
    id: 'COM-06',
    code: 'COM-06',
    name: 'سندوتش دجاج بانيه + بطاطس بوم فريت + مخلل',
    description:
      'سندوتش دجاج بانيه واحد في رغيف فينو طويل (وليس كايزر) مع ظرف بونفريت وكاتشب أو مخلل',
    price: 65,
    category: 'sandwiches',
    subCategory: 'سندوتش بالبطاطس',
    image: IMG.onePaneFino,
  },

  // 7. قائمة الكافتيريا (كل صنف منفرد لوحده بالاسم والأيقونة والسعر فقط)
  // 7أ. المشروبات الغازية والعصائر
  {
    id: 'DRK-01',
    code: 'DRK-01',
    name: 'بيبسي ستار',
    description: 'مشروب غازي مثلج',
    price: 15,
    category: 'canteen',
    subCategory: 'المشروبات الغازية والعصائر',
  },
  {
    id: 'DRK-02',
    code: 'DRK-02',
    name: 'ميرندا',
    description: 'مشروب غازي مثلج',
    price: 15,
    category: 'canteen',
    subCategory: 'المشروبات الغازية والعصائر',
  },
  {
    id: 'DRK-03',
    code: 'DRK-03',
    name: 'سفن أب',
    description: 'مشروب غازي مثلج',
    price: 15,
    category: 'canteen',
    subCategory: 'المشروبات الغازية والعصائر',
  },
  {
    id: 'DRK-04',
    code: 'DRK-04',
    name: 'ماونتن ديو',
    description: 'مشروب غازي مثلج',
    price: 15,
    category: 'canteen',
    subCategory: 'المشروبات الغازية والعصائر',
  },
  {
    id: 'DRK-05',
    code: 'DRK-05',
    name: 'بيبسي الهضبة',
    description: 'مشروب غازي بارد',
    price: 10,
    category: 'canteen',
    subCategory: 'المشروبات الغازية والعصائر',
  },
  {
    id: 'DRK-06',
    code: 'DRK-06',
    name: 'شويبس',
    description: 'كانز شويبس بارد',
    price: 17,
    category: 'canteen',
    subCategory: 'المشروبات الغازية والعصائر',
  },
  {
    id: 'DRK-07',
    code: 'DRK-07',
    name: 'فيروز',
    description: 'مشروب شعير بالنكهات',
    price: 20,
    category: 'canteen',
    subCategory: 'المشروبات الغازية والعصائر',
  },
  {
    id: 'DRK-08',
    code: 'DRK-08',
    name: 'بريل',
    description: 'مشروب شعير بارد',
    price: 20,
    category: 'canteen',
    subCategory: 'المشروبات الغازية والعصائر',
  },
  {
    id: 'DRK-09',
    code: 'DRK-09',
    name: 'ريد بول',
    description: 'مشروب طاقة بارد',
    price: 70,
    category: 'canteen',
    subCategory: 'المشروبات الغازية والعصائر',
  },
  {
    id: 'DRK-10',
    code: 'DRK-10',
    name: 'عصير جهينة تفاح',
    description: 'عصير فواكه بارد',
    price: 10,
    category: 'canteen',
    subCategory: 'المشروبات الغازية والعصائر',
  },
  {
    id: 'DRK-11',
    code: 'DRK-11',
    name: 'عصير جهينة مانجو',
    description: 'عصير فواكه بارد',
    price: 10,
    category: 'canteen',
    subCategory: 'المشروبات الغازية والعصائر',
  },
  {
    id: 'DRK-12',
    code: 'DRK-12',
    name: 'عصير جهينة برتقال',
    description: 'عصير فواكه بارد',
    price: 10,
    category: 'canteen',
    subCategory: 'المشروبات الغازية والعصائر',
  },
  {
    id: 'DRK-13',
    code: 'DRK-13',
    name: 'عصير جهينة كوكتيل',
    description: 'عصير فواكه بارد',
    price: 10,
    category: 'canteen',
    subCategory: 'المشروبات الغازية والعصائر',
  },

  // 7ب. الشيبسي والمقرمشات
  {
    id: 'CHP-01',
    code: 'CHP-01',
    name: 'شيبسي ملح',
    description: 'رقائق بطاطس مقرمشة',
    price: 10,
    category: 'canteen',
    subCategory: 'الشيبسي والمقرمشات',
  },
  {
    id: 'CHP-02',
    code: 'CHP-02',
    name: 'شيبسي جبنة',
    description: 'رقائق بطاطس مقرمشة',
    price: 10,
    category: 'canteen',
    subCategory: 'الشيبسي والمقرمشات',
  },
  {
    id: 'CHP-03',
    code: 'CHP-03',
    name: 'دوريتوس ناتشو',
    description: 'رقائق تورتيلا مقرمشة',
    price: 15,
    category: 'canteen',
    subCategory: 'الشيبسي والمقرمشات',
  },
  {
    id: 'CHP-04',
    code: 'CHP-04',
    name: 'دوريتوس حار',
    description: 'رقائق تورتيلا حارة',
    price: 15,
    category: 'canteen',
    subCategory: 'الشيبسي والمقرمشات',
  },
  {
    id: 'CHP-05',
    code: 'CHP-05',
    name: 'دوريتوس سويت تشيلي',
    description: 'رقائق تورتيلا مقرمشة',
    price: 15,
    category: 'canteen',
    subCategory: 'الشيبسي والمقرمشات',
  },
  {
    id: 'CHP-06',
    code: 'CHP-06',
    name: 'تايجر شيبس ملح',
    description: 'رقائق بطاطس مقرمشة',
    price: 10,
    category: 'canteen',
    subCategory: 'الشيبسي والمقرمشات',
  },
  {
    id: 'CHP-07',
    code: 'CHP-07',
    name: 'تايجر شيبس جبنة',
    description: 'رقائق بطاطس مقرمشة',
    price: 10,
    category: 'canteen',
    subCategory: 'الشيبسي والمقرمشات',
  },
  {
    id: 'CHP-08',
    code: 'CHP-08',
    name: 'شيتوس',
    description: 'مقرمشات بالجبنة',
    price: 15,
    category: 'canteen',
    subCategory: 'الشيبسي والمقرمشات',
  },

  // 7ج. الشوكولاتة والبسكويت والكيك
  {
    id: 'SW-01',
    code: 'SW-01',
    name: 'جالكسي',
    description: 'شوكولاتة بالحليب',
    price: 15,
    category: 'canteen',
    subCategory: 'الشوكولاتة والبسكويت والكيك',
  },
  {
    id: 'SW-02',
    code: 'SW-02',
    name: 'كادبوري',
    description: 'شوكولاتة ديري ميلك',
    price: 15,
    category: 'canteen',
    subCategory: 'الشوكولاتة والبسكويت والكيك',
  },
  {
    id: 'SW-03',
    code: 'SW-03',
    name: 'كادبوري ديلايت',
    description: 'شوكولاتة محشوة',
    price: 15,
    category: 'canteen',
    subCategory: 'الشوكولاتة والبسكويت والكيك',
  },
  {
    id: 'SW-04',
    code: 'SW-04',
    name: 'هالي',
    description: 'بسكويت بالشوكولاتة',
    price: 10,
    category: 'canteen',
    subCategory: 'الشوكولاتة والبسكويت والكيك',
  },
  {
    id: 'SW-05',
    code: 'SW-05',
    name: 'دايجستف شوكولاتة',
    description: 'بسكويت قمح مغطى بالشوكولاتة',
    price: 10,
    category: 'canteen',
    subCategory: 'الشوكولاتة والبسكويت والكيك',
  },
  {
    id: 'SW-06',
    code: 'SW-06',
    name: 'بسكوت كادبوري',
    description: 'بسكويت مغطى بشوكولاتة كادبوري',
    price: 10,
    category: 'canteen',
    subCategory: 'الشوكولاتة والبسكويت والكيك',
  },
  {
    id: 'SW-07',
    code: 'SW-07',
    name: 'أوريو',
    description: 'بسكويت كاكاو محشي كريمة',
    price: 10,
    category: 'canteen',
    subCategory: 'الشوكولاتة والبسكويت والكيك',
  },
  {
    id: 'SW-08',
    code: 'SW-08',
    name: 'هوهوز',
    description: 'كيك رول محشي كريمة',
    price: 10,
    category: 'canteen',
    subCategory: 'الشوكولاتة والبسكويت والكيك',
  },
  {
    id: 'SW-09',
    code: 'SW-09',
    name: 'بيمبو',
    description: 'بسكويت مغطى بالشوكولاتة',
    price: 10,
    category: 'canteen',
    subCategory: 'الشوكولاتة والبسكويت والكيك',
  },
  {
    id: 'SW-10',
    code: 'SW-10',
    name: 'جيمبو شوكو ميكس',
    description: 'بسكويت شوكو ميكس',
    price: 10,
    category: 'canteen',
    subCategory: 'الشوكولاتة والبسكويت والكيك',
  },
  {
    id: 'SW-11',
    code: 'SW-11',
    name: 'لمبادا ويفر',
    description: 'ويفر مقرمش بالشوكولاتة',
    price: 10,
    category: 'canteen',
    subCategory: 'الشوكولاتة والبسكويت والكيك',
  },
  {
    id: 'SW-12',
    code: 'SW-12',
    name: 'زمزمية بسكويت',
    description: 'بسكويت مقرمش',
    price: 10,
    category: 'canteen',
    subCategory: 'الشوكولاتة والبسكويت والكيك',
  },
  {
    id: 'SW-13',
    code: 'SW-13',
    name: 'دريو',
    description: 'سناك بسكويت وكيك',
    price: 10,
    category: 'canteen',
    subCategory: 'الشوكولاتة والبسكويت والكيك',
  },
  {
    id: 'SW-14',
    code: 'SW-14',
    name: 'دريو كيك',
    description: 'كيك مغلف',
    price: 10,
    category: 'canteen',
    subCategory: 'الشوكولاتة والبسكويت والكيك',
  },
  {
    id: 'SW-15',
    code: 'SW-15',
    name: 'توبو براوني',
    description: 'كيك براوني بالشوكولاتة',
    price: 10,
    category: 'canteen',
    subCategory: 'الشوكولاتة والبسكويت والكيك',
  },
  {
    id: 'SW-16',
    code: 'SW-16',
    name: 'فلوتس 2 صابع',
    description: 'ويفر بالشوكولاتة',
    price: 15,
    category: 'canteen',
    subCategory: 'الشوكولاتة والبسكويت والكيك',
  },
  {
    id: 'SW-17',
    code: 'SW-17',
    name: 'مورو',
    description: 'شوكولاتة بالكراميل',
    price: 12,
    category: 'canteen',
    subCategory: 'الشوكولاتة والبسكويت والكيك',
  },
  {
    id: 'SW-18',
    code: 'SW-18',
    name: 'ماندولين',
    description: 'ويفر بالكراميل والشوكولاتة',
    price: 10,
    category: 'canteen',
    subCategory: 'الشوكولاتة والبسكويت والكيك',
  },
  {
    id: 'SW-19',
    code: 'SW-19',
    name: 'ماندولين ويفر',
    description: 'ويفر خفيف',
    price: 5,
    category: 'canteen',
    subCategory: 'الشوكولاتة والبسكويت والكيك',
  },
];
