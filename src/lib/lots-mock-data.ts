// lots-mock-data.ts — Моковые данные лотов закупщика

export type LotStatus = "draft" | "published" | "collecting_bids" | "evaluation" | "awarded" | "cancelled" | "no_bids";
export type LotCategory = "material" | "digital";
export type LotComplexity = "single" | "complex";
export type AwardRule = "best_price" | "instant_buy" | "price_delivery_ratio" | "fastest_delivery";

export interface SupplierBid {
  id: string;
  supplierName: string;
  supplierRating: number;
  price: number;
  deliveryDays: number;
  submittedAt: string;
  status: "pending" | "accepted" | "rejected";
  comment?: string;
}

export interface BuyerLot {
  id: string;
  title: string;
  description: string;
  category: LotCategory;
  complexity: LotComplexity;
  technology: string;
  material?: string;
  quantity: number;
  unit: string;
  status: LotStatus;
  awardRule: AwardRule;
  budget: number;
  currency: string;
  deadline: string;
  createdAt: string;
  publishedAt?: string;
  toleranceGrade?: string;
  modelUrl?: string;
  bids: SupplierBid[];
}

export const LOT_STATUS_CONFIG: Record<LotStatus, { label: string; color: string }> = {
  draft: { label: "Черновик", color: "default" },
  published: { label: "Опубликован", color: "blue" },
  collecting_bids: { label: "Сбор предложений", color: "processing" },
  evaluation: { label: "Оценка", color: "orange" },
  awarded: { label: "Присуждён", color: "green" },
  cancelled: { label: "Отменён", color: "red" },
  no_bids: { label: "Без предложений", color: "default" },
};

export const LOT_CATEGORY_CONFIG: Record<LotCategory, { label: string }> = {
  material: { label: "Материальное производство" },
  digital: { label: "Цифровые услуги" },
};

export const LOT_COMPLEXITY_CONFIG: Record<LotComplexity, { label: string }> = {
  single: { label: "Единичная деталь" },
  complex: { label: "Комплексный заказ" },
};

export const AWARD_RULE_CONFIG: Record<AwardRule, { label: string }> = {
  best_price: { label: "Лучшая цена" },
  instant_buy: { label: "Мгновенная покупка" },
  price_delivery_ratio: { label: "Цена / срок" },
  fastest_delivery: { label: "Быстрая доставка" },
};

export const MOCK_LOTS: BuyerLot[] = [
  // 1. CNC фрезерование — collecting_bids
  {
    id: "LOT-001",
    title: "CNC фрезерование корпуса редуктора",
    description: "Требуется фрезерование корпуса промышленного редуктора из алюминиевого сплава Д16Т. Деталь имеет сложную геометрию с внутренними полостями. Необходима чистовая обработка всех посадочных поверхностей. Чертежи и 3D-модель прилагаются.",
    category: "material",
    complexity: "complex",
    technology: "CNC фрезерование",
    material: "Д16Т (алюминий)",
    quantity: 25,
    unit: "шт",
    status: "collecting_bids",
    awardRule: "price_delivery_ratio",
    budget: 350000,
    currency: "₽",
    deadline: "2026-03-15",
    createdAt: "2026-01-20T09:00:00Z",
    publishedAt: "2026-01-21T10:30:00Z",
    toleranceGrade: "IT7",
    modelUrl: "/models/reductor-housing.step",
    bids: [
      {
        id: "BID-001-1",
        supplierName: "ООО ТочМех",
        supplierRating: 4.8,
        price: 312000,
        deliveryDays: 18,
        submittedAt: "2026-01-25T14:20:00Z",
        status: "pending",
        comment: "Готовы приступить немедленно, есть опыт с подобными корпусами. Станок DMG MORI DMU 50.",
      },
      {
        id: "BID-001-2",
        supplierName: "ООО ПромТехСнаб",
        supplierRating: 4.5,
        price: 295000,
        deliveryDays: 22,
        submittedAt: "2026-01-26T11:00:00Z",
        status: "pending",
        comment: "Цена включает контроль на КИМ. Срок может быть сокращён при предоплате 50%.",
      },
      {
        id: "BID-001-3",
        supplierName: "ООО МеталлРесурс",
        supplierRating: 4.2,
        price: 280000,
        deliveryDays: 25,
        submittedAt: "2026-01-27T16:45:00Z",
        status: "pending",
        comment: "Материал в наличии. Можем обеспечить серийное производство в дальнейшем.",
      },
    ],
  },

  // 2. Листовой металл — evaluation
  {
    id: "LOT-002",
    title: "Листовой металл — кожухи для вентиляционной системы",
    description: "Изготовление защитных кожухов из нержавеющей стали AISI 304 толщиной 1.5 мм. Гибка, сварка, полировка. Партия из 40 единиц. Требуется герметичность швов.",
    category: "material",
    complexity: "complex",
    technology: "Листовой металл",
    material: "AISI 304 (нержавеющая сталь)",
    quantity: 40,
    unit: "шт",
    status: "evaluation",
    awardRule: "best_price",
    budget: 480000,
    currency: "₽",
    deadline: "2026-03-01",
    createdAt: "2026-01-15T08:00:00Z",
    publishedAt: "2026-01-16T09:00:00Z",
    toleranceGrade: "IT10",
    bids: [
      {
        id: "BID-002-1",
        supplierName: "ООО Сталь-Мастер",
        supplierRating: 4.9,
        price: 445000,
        deliveryDays: 14,
        submittedAt: "2026-01-20T10:30:00Z",
        status: "pending",
        comment: "Специализируемся на нержавейке. Гарантия герметичности, проверка давлением.",
      },
      {
        id: "BID-002-2",
        supplierName: "ООО ЛистПром",
        supplierRating: 4.3,
        price: 420000,
        deliveryDays: 18,
        submittedAt: "2026-01-21T13:15:00Z",
        status: "pending",
        comment: "Имеем лазерный раскрой Trumpf, гибочный пресс Amada. Качество гарантируем.",
      },
      {
        id: "BID-002-3",
        supplierName: "ООО ПромТехСнаб",
        supplierRating: 4.5,
        price: 460000,
        deliveryDays: 12,
        submittedAt: "2026-01-22T09:00:00Z",
        status: "pending",
        comment: "Кратчайшие сроки. Полный цикл: резка, гибка, сварка TIG, полировка в зеркало.",
      },
    ],
  },

  // 3. 3D печать — awarded
  {
    id: "LOT-003",
    title: "3D печать прототипов корпуса IoT-датчика",
    description: "Прототипирование корпуса IoT-датчика методом SLS из полиамида PA12. Требуется высокая точность для проверки сборки с электроникой. 10 вариантов по 3 экземпляра каждого.",
    category: "material",
    complexity: "single",
    technology: "3D печать (SLS)",
    material: "PA12 (полиамид)",
    quantity: 30,
    unit: "шт",
    status: "awarded",
    awardRule: "fastest_delivery",
    budget: 85000,
    currency: "₽",
    deadline: "2026-02-20",
    createdAt: "2026-01-10T11:00:00Z",
    publishedAt: "2026-01-10T14:00:00Z",
    toleranceGrade: "IT12",
    modelUrl: "/models/iot-sensor-housing.stl",
    bids: [
      {
        id: "BID-003-1",
        supplierName: "ООО Аддитив-Про",
        supplierRating: 4.7,
        price: 72000,
        deliveryDays: 5,
        submittedAt: "2026-01-12T09:30:00Z",
        status: "accepted",
        comment: "Печатаем на EOS P396. Опыт с подобными корпусами. Постобработка включена.",
      },
      {
        id: "BID-003-2",
        supplierName: "ООО 3Д-Формат",
        supplierRating: 4.4,
        price: 65000,
        deliveryDays: 8,
        submittedAt: "2026-01-13T15:20:00Z",
        status: "rejected",
        comment: "Можем напечатать из PA2200, аналог PA12. Цена ниже за счёт оптовой закупки порошка.",
      },
    ],
  },

  // 4. Литьё под давлением — published
  {
    id: "LOT-004",
    title: "Литьё под давлением — крышки распределительных коробок",
    description: "Изготовление пресс-формы и литьё крышек распределительных коробок из ABS-пластика. Тираж 5000 шт. Требуется матовая текстура поверхности VDI 27. Пресс-форма остаётся у заказчика.",
    category: "material",
    complexity: "complex",
    technology: "Литьё под давлением",
    material: "ABS-пластик",
    quantity: 5000,
    unit: "шт",
    status: "published",
    awardRule: "best_price",
    budget: 950000,
    currency: "₽",
    deadline: "2026-05-01",
    createdAt: "2026-02-01T10:00:00Z",
    publishedAt: "2026-02-02T08:00:00Z",
    toleranceGrade: "IT9",
    modelUrl: "/models/junction-box-cover.step",
    bids: [],
  },

  // 5. Токарная обработка — collecting_bids
  {
    id: "LOT-005",
    title: "Токарная обработка валов электродвигателей",
    description: "Токарная обработка валов для электродвигателей серии АИР из стали 40Х. Длина 320 мм, диаметр 45 мм. Шлифовка посадочных мест под подшипники. Партия 100 шт.",
    category: "material",
    complexity: "single",
    technology: "Токарная обработка",
    material: "Сталь 40Х",
    quantity: 100,
    unit: "шт",
    status: "collecting_bids",
    awardRule: "best_price",
    budget: 220000,
    currency: "₽",
    deadline: "2026-03-20",
    createdAt: "2026-02-05T09:00:00Z",
    publishedAt: "2026-02-06T10:00:00Z",
    toleranceGrade: "IT6",
    bids: [
      {
        id: "BID-005-1",
        supplierName: "ООО ТочМех",
        supplierRating: 4.8,
        price: 198000,
        deliveryDays: 15,
        submittedAt: "2026-02-08T11:00:00Z",
        status: "pending",
        comment: "Токарный центр Mazak QT-250. Шлифовка на круглошлифовальном станке. Контроль биения.",
      },
      {
        id: "BID-005-2",
        supplierName: "ООО ВалМаш",
        supplierRating: 4.6,
        price: 185000,
        deliveryDays: 20,
        submittedAt: "2026-02-09T14:30:00Z",
        status: "pending",
        comment: "Специализация — валы и оси. Сталь 40Х в наличии на складе. Термообработка включена.",
      },
    ],
  },

  // 6. Штамповка — draft
  {
    id: "LOT-006",
    title: "Штамповка крепёжных пластин для стеллажей",
    description: "Вырубка и гибка крепёжных пластин из стали 08пс толщиной 2 мм. Оцинковка после штамповки. Партия 10 000 шт. Штамп изготавливает поставщик.",
    category: "material",
    complexity: "single",
    technology: "Штамповка",
    material: "Сталь 08пс",
    quantity: 10000,
    unit: "шт",
    status: "draft",
    awardRule: "best_price",
    budget: 180000,
    currency: "₽",
    deadline: "2026-04-10",
    createdAt: "2026-02-10T14:00:00Z",
    toleranceGrade: "IT11",
    bids: [],
  },

  // 7. Лазерная резка — awarded
  {
    id: "LOT-007",
    title: "Лазерная резка деталей каркаса торгового оборудования",
    description: "Лазерная резка элементов каркаса из стали S235JR толщиной 3 мм и 5 мм. Около 45 наименований деталей, общая площадь раскроя ~18 м². Требуется зачистка заусенцев.",
    category: "material",
    complexity: "complex",
    technology: "Лазерная резка",
    material: "S235JR (конструкционная сталь)",
    quantity: 1,
    unit: "комплект",
    status: "awarded",
    awardRule: "price_delivery_ratio",
    budget: 150000,
    currency: "₽",
    deadline: "2026-02-28",
    createdAt: "2026-01-25T08:00:00Z",
    publishedAt: "2026-01-25T12:00:00Z",
    toleranceGrade: "IT10",
    modelUrl: "/models/trade-equipment-frame.dxf",
    bids: [
      {
        id: "BID-007-1",
        supplierName: "ООО ЛистПром",
        supplierRating: 4.3,
        price: 128000,
        deliveryDays: 7,
        submittedAt: "2026-01-28T10:00:00Z",
        status: "accepted",
        comment: "Лазер Trumpf 3030, мощность 6 кВт. Раскрой оптимизируем для минимизации отходов.",
      },
      {
        id: "BID-007-2",
        supplierName: "ООО МеталлРесурс",
        supplierRating: 4.2,
        price: 135000,
        deliveryDays: 10,
        submittedAt: "2026-01-29T16:00:00Z",
        status: "rejected",
        comment: "Можем также выполнить гибку и сварку каркаса под ключ, если потребуется.",
      },
    ],
  },

  // 8. Вакуумное литьё — no_bids
  {
    id: "LOT-008",
    title: "Вакуумное литьё корпусов медицинского прибора",
    description: "Вакуумное литьё в силиконовые формы корпусов портативного медицинского прибора. Материал — полиуретан, имитация ABS. Партия 50 шт. Требуется биосовместимая окраска.",
    category: "material",
    complexity: "complex",
    technology: "Вакуумное литьё",
    material: "Полиуретан (имитация ABS)",
    quantity: 50,
    unit: "шт",
    status: "no_bids",
    awardRule: "price_delivery_ratio",
    budget: 275000,
    currency: "₽",
    deadline: "2026-03-15",
    createdAt: "2026-01-18T09:00:00Z",
    publishedAt: "2026-01-19T10:00:00Z",
    toleranceGrade: "IT11",
    modelUrl: "/models/medical-device-case.step",
    bids: [],
  },

  // 9. CAD-проектирование — collecting_bids (digital)
  {
    id: "LOT-009",
    title: "CAD-проектирование сварной рамы конвейера",
    description: "Разработка 3D-модели и рабочих чертежей сварной рамы ленточного конвейера длиной 12 м. Расчёт на прочность, подбор профилей. Выходные форматы: STEP, PDF чертежи по ЕСКД.",
    category: "digital",
    complexity: "complex",
    technology: "CAD-проектирование",
    quantity: 1,
    unit: "проект",
    status: "collecting_bids",
    awardRule: "price_delivery_ratio",
    budget: 120000,
    currency: "₽",
    deadline: "2026-03-10",
    createdAt: "2026-02-03T11:00:00Z",
    publishedAt: "2026-02-04T08:00:00Z",
    bids: [
      {
        id: "BID-009-1",
        supplierName: "ООО ИнжПроект",
        supplierRating: 4.6,
        price: 105000,
        deliveryDays: 21,
        submittedAt: "2026-02-07T10:00:00Z",
        status: "pending",
        comment: "Работаем в SolidWorks и Компас-3D. Опыт проектирования конвейерного оборудования — 8 лет.",
      },
      {
        id: "BID-009-2",
        supplierName: "ООО КБ Механика",
        supplierRating: 4.9,
        price: 115000,
        deliveryDays: 14,
        submittedAt: "2026-02-08T09:30:00Z",
        status: "pending",
        comment: "В стоимость входит КЭ-расчёт рамы. Используем ANSYS для верификации.",
      },
    ],
  },

  // 10. КЭ-анализ — evaluation (digital)
  {
    id: "LOT-010",
    title: "КЭ-анализ кронштейна подвески",
    description: "Прочностной конечно-элементный анализ кронштейна подвески автомобиля. Статический и усталостный расчёт. Оптимизация топологии для снижения массы на 15%. Отчёт с рекомендациями.",
    category: "digital",
    complexity: "single",
    technology: "КЭ-анализ (FEA)",
    quantity: 1,
    unit: "отчёт",
    status: "evaluation",
    awardRule: "best_price",
    budget: 95000,
    currency: "₽",
    deadline: "2026-02-28",
    createdAt: "2026-01-28T10:00:00Z",
    publishedAt: "2026-01-29T08:00:00Z",
    modelUrl: "/models/suspension-bracket.step",
    bids: [
      {
        id: "BID-010-1",
        supplierName: "ООО КБ Механика",
        supplierRating: 4.9,
        price: 88000,
        deliveryDays: 10,
        submittedAt: "2026-02-01T12:00:00Z",
        status: "pending",
        comment: "ANSYS Mechanical, нелинейный анализ. Опыт в автомобильной отрасли.",
      },
      {
        id: "BID-010-2",
        supplierName: "ООО СимТех",
        supplierRating: 4.4,
        price: 78000,
        deliveryDays: 14,
        submittedAt: "2026-02-02T15:00:00Z",
        status: "pending",
        comment: "Abaqus + HyperMesh. Выполним оптимизацию топологии в Altair OptiStruct.",
      },
    ],
  },

  // 11. Сборочный проект — draft
  {
    id: "LOT-011",
    title: "Сборочный проект — испытательный стенд",
    description: "Разработка конструкторской документации на сборку испытательного стенда для тестирования электродвигателей. Включает раму, систему крепления, привод нагрузки. Комплект КД по ЕСКД.",
    category: "digital",
    complexity: "complex",
    technology: "Сборочный проект",
    quantity: 1,
    unit: "комплект КД",
    status: "draft",
    awardRule: "price_delivery_ratio",
    budget: 250000,
    currency: "₽",
    deadline: "2026-04-30",
    createdAt: "2026-02-12T09:00:00Z",
    bids: [],
  },

  // 12. CNC фрезерование — cancelled
  {
    id: "LOT-012",
    title: "CNC фрезерование — пресс-формы для литья",
    description: "Изготовление двух половин пресс-формы для литья пластиковых деталей. Материал — сталь P20. Требуется электроэрозионная обработка мелких элементов. Проект приостановлен заказчиком.",
    category: "material",
    complexity: "complex",
    technology: "CNC фрезерование",
    material: "Сталь P20",
    quantity: 1,
    unit: "комплект",
    status: "cancelled",
    awardRule: "best_price",
    budget: 680000,
    currency: "₽",
    deadline: "2026-04-15",
    createdAt: "2026-01-05T10:00:00Z",
    publishedAt: "2026-01-06T08:00:00Z",
    bids: [
      {
        id: "BID-012-1",
        supplierName: "ООО ЛитьёПроф",
        supplierRating: 4.7,
        price: 620000,
        deliveryDays: 35,
        submittedAt: "2026-01-10T11:00:00Z",
        status: "rejected",
        comment: "Полный цикл: фрезерование, ЭЭО, полировка, испытания. Гарантия 50 000 циклов.",
      },
      {
        id: "BID-012-2",
        supplierName: "ООО ТочМех",
        supplierRating: 4.8,
        price: 650000,
        deliveryDays: 30,
        submittedAt: "2026-01-11T09:00:00Z",
        status: "rejected",
        comment: "Станки Makino, электроэрозия Sodick. Высочайшая точность формообразующих поверхностей.",
      },
    ],
  },
];

export default MOCK_LOTS;
