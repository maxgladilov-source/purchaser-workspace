// proposals-mock-data.ts — Моковые данные предложений поставщиков для закупщика

export interface SupplierProfile {
  name: string;
  rating: number;
  completedOrders: number;
  specialization: string;
  location: string;
  responseTime: string;
  certifications: string[];
}

export interface Proposal {
  id: string;
  lotId: string;
  lotTitle: string;
  supplier: SupplierProfile;
  price: number;
  currency: string;
  deliveryDays: number;
  submittedAt: string;
  status: "pending" | "accepted" | "rejected" | "clarification_requested";
  comment: string;
  technicalScore: number;
  priceScore: number;
}

export const PROPOSAL_STATUS_CONFIG: Record<
  Proposal["status"],
  { label: string; color: string }
> = {
  pending: { label: "На рассмотрении", color: "orange" },
  accepted: { label: "Принято", color: "green" },
  rejected: { label: "Отклонено", color: "red" },
  clarification_requested: { label: "Запрошено уточнение", color: "blue" },
};

// ---- Профили поставщиков ----

const SUPPLIERS: Record<string, SupplierProfile> = {
  tochmeh: {
    name: "ООО ТочМех",
    rating: 4.8,
    completedOrders: 234,
    specialization: "CNC-обработка, токарные и фрезерные работы",
    location: "Екатеринбург",
    responseTime: "< 2 часов",
    certifications: ["ISO 9001:2015", "ГОСТ РВ 0015-002"],
  },
  promtehsnab: {
    name: "ООО ПромТехСнаб",
    rating: 4.5,
    completedOrders: 187,
    specialization: "Механообработка, листовой металл",
    location: "Челябинск",
    responseTime: "< 4 часов",
    certifications: ["ISO 9001:2015"],
  },
  stalmaster: {
    name: "ООО Сталь-Мастер",
    rating: 4.9,
    completedOrders: 312,
    specialization: "Листовой металл, нержавеющая сталь, сварка",
    location: "Москва",
    responseTime: "< 1 часа",
    certifications: ["ISO 9001:2015", "ISO 3834-2", "НАКС"],
  },
  litieprof: {
    name: "ООО ЛитьёПроф",
    rating: 4.7,
    completedOrders: 156,
    specialization: "Литьё под давлением, пресс-формы",
    location: "Нижний Новгород",
    responseTime: "< 3 часов",
    certifications: ["ISO 9001:2015", "ISO 14001"],
  },
  additivpro: {
    name: "ООО Аддитив-Про",
    rating: 4.7,
    completedOrders: 98,
    specialization: "3D-печать: SLS, SLA, FDM",
    location: "Санкт-Петербург",
    responseTime: "< 2 часов",
    certifications: ["ISO 9001:2015"],
  },
  metallresurs: {
    name: "ООО МеталлРесурс",
    rating: 4.2,
    completedOrders: 145,
    specialization: "CNC-обработка, заготовительное производство",
    location: "Тула",
    responseTime: "< 6 часов",
    certifications: ["ISO 9001:2015"],
  },
  listprom: {
    name: "ООО ЛистПром",
    rating: 4.3,
    completedOrders: 203,
    specialization: "Лазерная резка, гибка, листовой металл",
    location: "Рязань",
    responseTime: "< 3 часов",
    certifications: ["ISO 9001:2015", "ISO 14001"],
  },
  valmash: {
    name: "ООО ВалМаш",
    rating: 4.6,
    completedOrders: 178,
    specialization: "Валы, оси, токарная обработка",
    location: "Пермь",
    responseTime: "< 4 часов",
    certifications: ["ISO 9001:2015", "ГОСТ РВ 0015-002"],
  },
  inzhproekt: {
    name: "ООО ИнжПроект",
    rating: 4.6,
    completedOrders: 64,
    specialization: "CAD-проектирование, конструкторская документация",
    location: "Москва",
    responseTime: "< 2 часов",
    certifications: ["СРО проектирование"],
  },
  kbmeh: {
    name: "ООО КБ Механика",
    rating: 4.9,
    completedOrders: 89,
    specialization: "КЭ-анализ, расчёты на прочность, CAD/CAE",
    location: "Новосибирск",
    responseTime: "< 1 часа",
    certifications: ["ISO 9001:2015", "СРО проектирование"],
  },
};

// ---- Предложения поставщиков ----

export const MOCK_PROPOSALS: Proposal[] = [
  // ==== LOT-001: CNC фрезерование корпуса редуктора (3 предложения) ====
  {
    id: "PROP-001",
    lotId: "LOT-001",
    lotTitle: "CNC фрезерование корпуса редуктора",
    supplier: SUPPLIERS.tochmeh,
    price: 312000,
    currency: "₽",
    deliveryDays: 18,
    submittedAt: "2026-01-25T14:20:00Z",
    status: "pending",
    comment: "Готовы приступить немедленно. Станок DMG MORI DMU 50, пятиосевая обработка. Есть опыт с аналогичными корпусами — выполнили 15 заказов за последний год. Контроль на координатно-измерительной машине Zeiss.",
    technicalScore: 92,
    priceScore: 78,
  },
  {
    id: "PROP-002",
    lotId: "LOT-001",
    lotTitle: "CNC фрезерование корпуса редуктора",
    supplier: SUPPLIERS.promtehsnab,
    price: 295000,
    currency: "₽",
    deliveryDays: 22,
    submittedAt: "2026-01-26T11:00:00Z",
    status: "pending",
    comment: "Цена включает полный контроль на КИМ с протоколом. Материал Д16Т закупаем у сертифицированного поставщика с сертификатом на плавку. Срок может быть сокращён до 18 дней при предоплате 50%.",
    technicalScore: 85,
    priceScore: 88,
  },
  {
    id: "PROP-003",
    lotId: "LOT-001",
    lotTitle: "CNC фрезерование корпуса редуктора",
    supplier: SUPPLIERS.metallresurs,
    price: 280000,
    currency: "₽",
    deliveryDays: 25,
    submittedAt: "2026-01-27T16:45:00Z",
    status: "clarification_requested",
    comment: "Материал Д16Т в наличии на складе (плита 80 мм). Можем обеспечить серийное производство в дальнейшем по сниженной цене. Просим уточнить допуски на отверстия под подшипники.",
    technicalScore: 75,
    priceScore: 92,
  },

  // ==== LOT-002: Листовой металл — кожухи (3 предложения) ====
  {
    id: "PROP-004",
    lotId: "LOT-002",
    lotTitle: "Кожухи для вентиляционной системы (листовой металл)",
    supplier: SUPPLIERS.stalmaster,
    price: 445000,
    currency: "₽",
    deliveryDays: 14,
    submittedAt: "2026-01-20T10:30:00Z",
    status: "pending",
    comment: "Специализируемся на изделиях из нержавеющей стали более 12 лет. Сварка TIG с аргоном, сварщики с аттестацией НАКС. Гарантируем герметичность — каждый кожух проверяется давлением 0.5 атм. Полировка до Ra 0.8.",
    technicalScore: 96,
    priceScore: 72,
  },
  {
    id: "PROP-005",
    lotId: "LOT-002",
    lotTitle: "Кожухи для вентиляционной системы (листовой металл)",
    supplier: SUPPLIERS.listprom,
    price: 420000,
    currency: "₽",
    deliveryDays: 18,
    submittedAt: "2026-01-21T13:15:00Z",
    status: "pending",
    comment: "Лазерный раскрой на Trumpf TruLaser 3030, гибка на Amada HFE 100-3. Точность реза ±0.1 мм. Сварка полуавтомат в среде аргона. Можем изготовить пробный образец за 3 дня для утверждения.",
    technicalScore: 88,
    priceScore: 82,
  },
  {
    id: "PROP-006",
    lotId: "LOT-002",
    lotTitle: "Кожухи для вентиляционной системы (листовой металл)",
    supplier: SUPPLIERS.promtehsnab,
    price: 460000,
    currency: "₽",
    deliveryDays: 12,
    submittedAt: "2026-01-22T09:00:00Z",
    status: "pending",
    comment: "Кратчайшие сроки в регионе. Полный цикл: лазерная резка, гибка, сварка TIG, полировка в зеркало. Упаковка в индивидуальную тару для предотвращения царапин при транспортировке.",
    technicalScore: 84,
    priceScore: 68,
  },

  // ==== LOT-005: Токарная обработка валов (2 предложения) ====
  {
    id: "PROP-007",
    lotId: "LOT-005",
    lotTitle: "Токарная обработка валов электродвигателей",
    supplier: SUPPLIERS.tochmeh,
    price: 198000,
    currency: "₽",
    deliveryDays: 15,
    submittedAt: "2026-02-08T11:00:00Z",
    status: "pending",
    comment: "Токарный центр Mazak QT-250MY с приводным инструментом. Шлифовка посадочных мест на круглошлифовальном станке Studer. Контроль биения — не более 0.005 мм. Термообработка в собственной печи.",
    technicalScore: 94,
    priceScore: 76,
  },
  {
    id: "PROP-008",
    lotId: "LOT-005",
    lotTitle: "Токарная обработка валов электродвигателей",
    supplier: SUPPLIERS.valmash,
    price: 185000,
    currency: "₽",
    deliveryDays: 20,
    submittedAt: "2026-02-09T14:30:00Z",
    status: "pending",
    comment: "Наша специализация — валы и оси любой сложности. Сталь 40Х в наличии на складе (пруток D55 мм). Термообработка (улучшение HB 240-280) включена в стоимость. Готовы предоставить образец через 5 дней.",
    technicalScore: 90,
    priceScore: 84,
  },

  // ==== LOT-009: CAD-проектирование конвейера (3 предложения) ====
  {
    id: "PROP-009",
    lotId: "LOT-009",
    lotTitle: "CAD-проектирование сварной рамы конвейера",
    supplier: SUPPLIERS.inzhproekt,
    price: 105000,
    currency: "₽",
    deliveryDays: 21,
    submittedAt: "2026-02-07T10:00:00Z",
    status: "pending",
    comment: "Работаем в SolidWorks 2024 и Компас-3D v22. Опыт проектирования конвейерного оборудования — 8 лет, более 30 проектов. Чертежи по ЕСКД, спецификации по ГОСТ 2.106. Возможна авторская поддержка при изготовлении.",
    technicalScore: 86,
    priceScore: 88,
  },
  {
    id: "PROP-010",
    lotId: "LOT-009",
    lotTitle: "CAD-проектирование сварной рамы конвейера",
    supplier: SUPPLIERS.kbmeh,
    price: 115000,
    currency: "₽",
    deliveryDays: 14,
    submittedAt: "2026-02-08T09:30:00Z",
    status: "pending",
    comment: "В стоимость включён КЭ-расчёт рамы на статическую и динамическую нагрузки. Используем ANSYS Mechanical для верификации. Оптимизация массы конструкции — сэкономим на металле до 20%. NX + ANSYS.",
    technicalScore: 95,
    priceScore: 80,
  },
  {
    id: "PROP-011",
    lotId: "LOT-009",
    lotTitle: "CAD-проектирование сварной рамы конвейера",
    supplier: SUPPLIERS.tochmeh,
    price: 98000,
    currency: "₽",
    deliveryDays: 25,
    submittedAt: "2026-02-10T16:00:00Z",
    status: "clarification_requested",
    comment: "Конструкторский отдел из 4 инженеров. Проектируем в SolidWorks. Просим уточнить: тип ленты, производительность конвейера и условия эксплуатации (температура, агрессивная среда?).",
    technicalScore: 72,
    priceScore: 92,
  },

  // ==== LOT-010: КЭ-анализ кронштейна подвески (4 предложения) ====
  {
    id: "PROP-012",
    lotId: "LOT-010",
    lotTitle: "КЭ-анализ кронштейна подвески",
    supplier: SUPPLIERS.kbmeh,
    price: 88000,
    currency: "₽",
    deliveryDays: 10,
    submittedAt: "2026-02-01T12:00:00Z",
    status: "pending",
    comment: "ANSYS Mechanical 2024 R2, нелинейный статический + усталостный анализ (nCode DesignLife). Опыт в автомобильной отрасли: работали с ВАЗ и КАМАЗ. Топологическая оптимизация в Altair Inspire.",
    technicalScore: 98,
    priceScore: 82,
  },
  {
    id: "PROP-013",
    lotId: "LOT-010",
    lotTitle: "КЭ-анализ кронштейна подвески",
    supplier: {
      name: "ООО СимТех",
      rating: 4.4,
      completedOrders: 52,
      specialization: "CAE-расчёты, оптимизация конструкций",
      location: "Казань",
      responseTime: "< 3 часов",
      certifications: ["ISO 9001:2015"],
    },
    price: 78000,
    currency: "₽",
    deliveryDays: 14,
    submittedAt: "2026-02-02T15:00:00Z",
    status: "pending",
    comment: "Abaqus 2024 + HyperMesh для подготовки сетки. Оптимизация топологии в Altair OptiStruct. Отчёт на 40+ страниц с визуализацией полей напряжений и рекомендациями по конструктивным изменениям.",
    technicalScore: 90,
    priceScore: 90,
  },
  {
    id: "PROP-014",
    lotId: "LOT-010",
    lotTitle: "КЭ-анализ кронштейна подвески",
    supplier: SUPPLIERS.inzhproekt,
    price: 72000,
    currency: "₽",
    deliveryDays: 18,
    submittedAt: "2026-02-03T11:30:00Z",
    status: "rejected",
    comment: "SolidWorks Simulation Premium. Линейный статический анализ + анализ усталости. Базовый пакет по привлекательной цене.",
    technicalScore: 65,
    priceScore: 95,
  },
  {
    id: "PROP-015",
    lotId: "LOT-010",
    lotTitle: "КЭ-анализ кронштейна подвески",
    supplier: {
      name: "ООО РасчётПро",
      rating: 4.1,
      completedOrders: 28,
      specialization: "Прочностные расчёты, сертификационные испытания",
      location: "Самара",
      responseTime: "< 8 часов",
      certifications: [],
    },
    price: 68000,
    currency: "₽",
    deliveryDays: 21,
    submittedAt: "2026-02-04T09:00:00Z",
    status: "rejected",
    comment: "Расчёт в COMSOL Multiphysics. Включаем верификацию результатов аналитическими методами. Можем также провести натурные испытания на нашем стенде.",
    technicalScore: 60,
    priceScore: 96,
  },

  // ==== LOT-004: Литьё под давлением — ещё нет предложений, но одно раннее ====
  {
    id: "PROP-016",
    lotId: "LOT-004",
    lotTitle: "Литьё под давлением — крышки распределительных коробок",
    supplier: SUPPLIERS.litieprof,
    price: 880000,
    currency: "₽",
    deliveryDays: 45,
    submittedAt: "2026-02-13T10:00:00Z",
    status: "pending",
    comment: "Изготовление двухкавитетной пресс-формы из стали P20 + литьё тиража 5000 шт. Текстура VDI 27 — наносим методом электроэрозии. Форма остаётся у заказчика. Гарантия — 200 000 циклов.",
    technicalScore: 93,
    priceScore: 74,
  },
  {
    id: "PROP-017",
    lotId: "LOT-004",
    lotTitle: "Литьё под давлением — крышки распределительных коробок",
    supplier: {
      name: "ООО ПолимерТех",
      rating: 4.5,
      completedOrders: 112,
      specialization: "Литьё пластмасс, экструзия, пресс-формы",
      location: "Воронеж",
      responseTime: "< 4 часов",
      certifications: ["ISO 9001:2015", "ISO 14001"],
    },
    price: 820000,
    currency: "₽",
    deliveryDays: 50,
    submittedAt: "2026-02-14T08:30:00Z",
    status: "pending",
    comment: "Предлагаем однокавитетную форму для снижения стоимости. Литьё на ТПА Engel Victory 200. ABS Chimei Polylac PA-747 — отличные механические свойства. Пробная партия 50 шт. бесплатно.",
    technicalScore: 87,
    priceScore: 80,
  },
];

export { SUPPLIERS };

export default MOCK_PROPOSALS;
