// orders-mock-data.ts — Моковые данные заказов закупщика

export type OrderStatus =
  | "pending_confirmation"
  | "confirmed"
  | "in_production"
  | "qc_check"
  | "ready_to_ship"
  | "shipped"
  | "delivered"
  | "accepted"
  | "disputed"
  | "cancelled";

export type OrderType = "lot_award" | "direct_order";
export type OrderPriority = "urgent" | "high" | "normal" | "low";

export interface BuyerOrder {
  id: string;
  title: string;
  type: OrderType;
  status: OrderStatus;
  priority: OrderPriority;
  supplierName: string;
  supplierRating: number;
  technology: string;
  material?: string;
  quantity: number;
  unit: string;
  totalPrice: number;
  currency: string;
  toleranceGrade?: string;
  lotId?: string;
  createdAt: string;
  deadline: string;
  description: string;
  modelUrl?: string;
  progressPercent: number;
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  pending_confirmation: { label: "Ожидает подтверждения", color: "orange" },
  confirmed: { label: "Подтверждён", color: "blue" },
  in_production: { label: "В производстве", color: "processing" },
  qc_check: { label: "Контроль качества", color: "purple" },
  ready_to_ship: { label: "Готов к отправке", color: "cyan" },
  shipped: { label: "Отправлен", color: "geekblue" },
  delivered: { label: "Доставлен", color: "lime" },
  accepted: { label: "Принят", color: "green" },
  disputed: { label: "Спор", color: "red" },
  cancelled: { label: "Отменён", color: "default" },
};

export const ORDER_TYPE_CONFIG: Record<OrderType, { label: string }> = {
  lot_award: { label: "По результатам лота" },
  direct_order: { label: "Прямой заказ" },
};

export const ORDER_PRIORITY_CONFIG: Record<OrderPriority, { label: string; color: string }> = {
  urgent: { label: "Срочный", color: "red" },
  high: { label: "Высокий", color: "orange" },
  normal: { label: "Обычный", color: "blue" },
  low: { label: "Низкий", color: "default" },
};

export const MOCK_ORDERS: BuyerOrder[] = [
  // 1. In production — awarded from lot
  {
    id: "ORД-001",
    title: "Корпуса IoT-датчиков (3D печать SLS)",
    type: "lot_award",
    status: "in_production",
    priority: "high",
    supplierName: "ООО Аддитив-Про",
    supplierRating: 4.7,
    technology: "3D печать (SLS)",
    material: "PA12 (полиамид)",
    quantity: 30,
    unit: "шт",
    totalPrice: 72000,
    currency: "₽",
    toleranceGrade: "IT12",
    lotId: "LOT-003",
    createdAt: "2026-01-15T10:00:00Z",
    deadline: "2026-02-20",
    description: "Печать прототипов корпуса IoT-датчика. 10 вариантов по 3 экземпляра. Материал PA12, технология SLS. Постобработка включена в стоимость.",
    modelUrl: "/models/iot-sensor-housing.stl",
    progressPercent: 65,
  },

  // 2. Shipped — from lot
  {
    id: "ОРД-002",
    title: "Детали каркаса торгового оборудования (лазерная резка)",
    type: "lot_award",
    status: "shipped",
    priority: "normal",
    supplierName: "ООО ЛистПром",
    supplierRating: 4.3,
    technology: "Лазерная резка",
    material: "S235JR (конструкционная сталь)",
    quantity: 1,
    unit: "комплект",
    totalPrice: 128000,
    currency: "₽",
    toleranceGrade: "IT10",
    lotId: "LOT-007",
    createdAt: "2026-02-01T08:00:00Z",
    deadline: "2026-02-28",
    description: "Лазерная резка 45 наименований деталей каркаса. Толщина 3 мм и 5 мм. Зачистка заусенцев выполнена. Отправлено транспортной компанией «Деловые Линии».",
    modelUrl: "/models/trade-equipment-frame.dxf",
    progressPercent: 90,
  },

  // 3. QC check — direct order
  {
    id: "ОРД-003",
    title: "Шестерни привода конвейера (токарная + фрезерование)",
    type: "direct_order",
    status: "qc_check",
    priority: "high",
    supplierName: "ООО ТочМех",
    supplierRating: 4.8,
    technology: "Токарная обработка + CNC фрезерование",
    material: "Сталь 40ХН",
    quantity: 12,
    unit: "шт",
    totalPrice: 156000,
    currency: "₽",
    toleranceGrade: "IT6",
    createdAt: "2026-01-20T09:00:00Z",
    deadline: "2026-02-25",
    description: "Изготовление цилиндрических шестерён модуль 3, z=28. Термообработка HRC 45-50. Контроль профиля зуба на зубомере.",
    progressPercent: 80,
  },

  // 4. Delivered — waiting for acceptance
  {
    id: "ОРД-004",
    title: "Фланцы трубопроводные DN100 PN16",
    type: "direct_order",
    status: "delivered",
    priority: "normal",
    supplierName: "ООО Сталь-Мастер",
    supplierRating: 4.9,
    technology: "Токарная обработка",
    material: "Сталь 09Г2С",
    quantity: 24,
    unit: "шт",
    totalPrice: 96000,
    currency: "₽",
    toleranceGrade: "IT8",
    createdAt: "2026-01-10T08:00:00Z",
    deadline: "2026-02-15",
    description: "Фланцы по ГОСТ 12820-80. Токарная обработка, сверление крепёжных отверстий. Доставлены на склад, ожидают входной контроль.",
    progressPercent: 100,
  },

  // 5. Accepted
  {
    id: "ОРД-005",
    title: "Кронштейны крепления датчиков (листовой металл)",
    type: "lot_award",
    status: "accepted",
    priority: "low",
    supplierName: "ООО ЛистПром",
    supplierRating: 4.3,
    technology: "Листовой металл",
    material: "Сталь 08пс, оцинковка",
    quantity: 200,
    unit: "шт",
    totalPrice: 64000,
    currency: "₽",
    toleranceGrade: "IT11",
    lotId: "LOT-015",
    createdAt: "2025-12-15T10:00:00Z",
    deadline: "2026-01-20",
    description: "Вырубка, гибка и оцинковка кронштейнов для крепления датчиков на конвейерной линии. Заказ выполнен в срок, качество соответствует.",
    progressPercent: 100,
  },

  // 6. Disputed
  {
    id: "ОРД-006",
    title: "Корпус насоса (CNC фрезерование)",
    type: "direct_order",
    status: "disputed",
    priority: "urgent",
    supplierName: "ООО МеталлРесурс",
    supplierRating: 4.2,
    technology: "CNC фрезерование",
    material: "Чугун СЧ20",
    quantity: 5,
    unit: "шт",
    totalPrice: 215000,
    currency: "₽",
    toleranceGrade: "IT7",
    createdAt: "2026-01-08T09:00:00Z",
    deadline: "2026-02-10",
    description: "Фрезерование корпусов центробежного насоса. Обнаружены отклонения по шероховатости внутренних поверхностей. Открыт спор с поставщиком, ожидается экспертиза.",
    progressPercent: 100,
  },

  // 7. Pending confirmation
  {
    id: "ОРД-007",
    title: "Втулки подшипниковых узлов (токарная обработка)",
    type: "direct_order",
    status: "pending_confirmation",
    priority: "normal",
    supplierName: "ООО ВалМаш",
    supplierRating: 4.6,
    technology: "Токарная обработка",
    material: "Бронза БрАЖ9-4",
    quantity: 50,
    unit: "шт",
    totalPrice: 135000,
    currency: "₽",
    toleranceGrade: "IT7",
    createdAt: "2026-02-12T11:00:00Z",
    deadline: "2026-03-15",
    description: "Токарная обработка бронзовых втулок для подшипников скольжения. Диаметр 60 мм, длина 80 мм. Ожидаем подтверждение от поставщика.",
    progressPercent: 0,
  },

  // 8. Confirmed — ready to start
  {
    id: "ОРД-008",
    title: "Пресс-форма для заглушек (литьё под давлением)",
    type: "lot_award",
    status: "confirmed",
    priority: "high",
    supplierName: "ООО ЛитьёПроф",
    supplierRating: 4.7,
    technology: "Литьё под давлением",
    material: "Полипропилен ПП",
    quantity: 1,
    unit: "комплект",
    totalPrice: 420000,
    currency: "₽",
    toleranceGrade: "IT9",
    lotId: "LOT-020",
    createdAt: "2026-02-08T10:00:00Z",
    deadline: "2026-04-01",
    description: "Изготовление однокавитетной пресс-формы для литья заглушек из полипропилена. Ресурс формы — не менее 100 000 циклов. Поставщик подтвердил заказ, запуск производства 17.02.",
    progressPercent: 5,
  },

  // 9. Cancelled
  {
    id: "ОРД-009",
    title: "Панели обшивки шкафа управления (листовой металл)",
    type: "direct_order",
    status: "cancelled",
    priority: "low",
    supplierName: "ООО Сталь-Мастер",
    supplierRating: 4.9,
    technology: "Листовой металл",
    material: "Сталь 08пс с порошковой окраской",
    quantity: 8,
    unit: "шт",
    totalPrice: 48000,
    currency: "₽",
    toleranceGrade: "IT10",
    createdAt: "2026-01-25T14:00:00Z",
    deadline: "2026-02-20",
    description: "Заказ отменён по инициативе закупщика в связи с изменением конструкции шкафа. Поставщик уведомлён до начала производства.",
    progressPercent: 0,
  },

  // 10. Ready to ship
  {
    id: "ОРД-010",
    title: "Прижимные планки для станка (CNC фрезерование)",
    type: "direct_order",
    status: "ready_to_ship",
    priority: "normal",
    supplierName: "ООО ПромТехСнаб",
    supplierRating: 4.5,
    technology: "CNC фрезерование",
    material: "Сталь 45",
    quantity: 16,
    unit: "шт",
    totalPrice: 74000,
    currency: "₽",
    toleranceGrade: "IT8",
    createdAt: "2026-01-30T09:00:00Z",
    deadline: "2026-02-22",
    description: "Фрезерование прижимных планок для фиксации заготовок на станке. Закалка рабочих поверхностей HRC 50-55. Детали готовы, ожидают забор курьером.",
    progressPercent: 95,
  },
];

export default MOCK_ORDERS;
