import type { EventInput } from "@fullcalendar/core";

// Helper: get dates relative to current month
function d(day: number, hour = 9, minute = 0): string {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), day, hour, minute);
  return date.toISOString();
}

export const EVENT_COLORS = {
  order: "#2563eb",
  lot: "#f59e0b",
  qc: "#16a34a",
  meeting: "#7c3aed",
  document: "#dc2626",
} as const;

export type EventType = keyof typeof EVENT_COLORS;

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  order: "Заказ",
  lot: "Лот",
  qc: "Контроль качества",
  meeting: "Встреча",
  document: "Документ",
};

// Type-specific extended props
export interface OrderProps {
  type: "order";
  description: string;
  orderId: string;
  supplier: string;
  technology: string;
  material: string;
  quantity: string;
  status: string;
  priority: "urgent" | "high" | "normal" | "low";
}

export interface LotProps {
  type: "lot";
  description: string;
  lotId: string;
  lotTitle: string;
  technology: string;
  quantity: string;
  currentBids: number;
  budget: string;
  status: "open" | "closing_soon" | "closed";
}

export interface QcProps {
  type: "qc";
  description: string;
  orderId: string;
  inspectionType: string;
  checklist: string[];
  location: string;
}

export interface MeetingProps {
  type: "meeting";
  description: string;
  participants: string[];
  agenda: string[];
  meetingLink?: string;
  callType: "video" | "phone" | "in-person";
}

export interface DocumentProps {
  type: "document";
  description: string;
  documentType: string;
  requiredBy: string;
  relatedOrder?: string;
  status: "pending" | "in_review" | "overdue";
}

export type EventExtendedProps =
  | OrderProps
  | LotProps
  | QcProps
  | MeetingProps
  | DocumentProps;

export const calendarEvents: EventInput[] = [
  {
    id: "1",
    title: "Заказ ORD-2071 — крайний срок поставки",
    start: d(3, 10, 0),
    end: d(3, 11, 0),
    color: EVENT_COLORS.order,
    extendedProps: {
      type: "order",
      description: "Крайний срок поставки корпусов из алюминия методом ЧПУ фрезерования. Необходимо подтвердить получение партии.",
      orderId: "ORD-2071",
      supplier: "ООО ПрецизионМеталл",
      technology: "ЧПУ фрезерование",
      material: "Алюминий 6061-T6",
      quantity: "500 шт.",
      status: "В пути",
      priority: "high",
    } satisfies OrderProps,
  },
  {
    id: "2",
    title: "Лот — листовой металл, окончание приёма заявок",
    start: d(5, 18, 0),
    color: EVENT_COLORS.lot,
    extendedProps: {
      type: "lot",
      description: "Завершение приёма предложений на лот по изготовлению корпусов из листового металла. Необходимо выбрать поставщика.",
      lotId: "LOT-0452",
      lotTitle: "Корпуса из нержавеющей стали — 200 шт.",
      technology: "Листовая штамповка",
      quantity: "200 шт., нержавеющая сталь 304",
      currentBids: 9,
      budget: "₽ 1 450 000",
      status: "closing_soon",
    } satisfies LotProps,
  },
  {
    id: "3",
    title: "Входной контроль — образцы литья под давлением",
    start: d(8, 14, 0),
    end: d(8, 16, 0),
    color: EVENT_COLORS.qc,
    extendedProps: {
      type: "qc",
      description: "Входная инспекция первых образцов из литьевой формы №М-3341. Проверка соответствия ТЗ.",
      orderId: "ORD-2065",
      inspectionType: "Первая контрольная проверка (FAI)",
      checklist: [
        "Размерная точность (±0,05 мм)",
        "Качество поверхности (Ra 0,8)",
        "Отсутствие облоя и дефектов литника",
        "Проверка сертификата на материал",
        "Функциональный тест сборки",
      ],
      location: "Склад входного контроля — корпус А",
    } satisfies QcProps,
  },
  {
    id: "4",
    title: "Обзор работы с Everypart — видеозвонок",
    start: d(10, 11, 0),
    end: d(10, 12, 0),
    color: EVENT_COLORS.meeting,
    extendedProps: {
      type: "meeting",
      description: "Квартальный обзор сотрудничества с менеджером платформы Everypart.",
      participants: [
        "Иванов А.С. (Вы)",
        "Дмитрий Волков (Everypart)",
        "Кузнецова Е.В. (отдел закупок)",
      ],
      agenda: [
        "Обзор эффективности закупок за квартал",
        "Обсуждение новых крупных проектов",
        "Оптимизация логистических маршрутов",
        "Запросы по функциональности платформы",
      ],
      meetingLink: "https://meet.everypart.pro/room/purch-q1",
      callType: "video",
    } satisfies MeetingProps,
  },
  {
    id: "5",
    title: "Договор поставки — срок продления",
    start: d(12),
    color: EVENT_COLORS.document,
    extendedProps: {
      type: "document",
      description: "Необходимо продлить рамочный договор поставки с ООО СтальИнвест. Подготовить дополнительное соглашение.",
      documentType: "Рамочный договор поставки",
      requiredBy: "Юридический отдел",
      relatedOrder: "ORD-2071",
      status: "pending",
    } satisfies DocumentProps,
  },
  {
    id: "6",
    title: "Лот — 3D-печать прототипов, приём заявок",
    start: d(14, 12, 0),
    color: EVENT_COLORS.lot,
    extendedProps: {
      type: "lot",
      description: "Открытие приёма предложений на лот по изготовлению прототипов методом SLS. Оценить поступающие заявки.",
      lotId: "LOT-0461",
      lotTitle: "Прототипы из нейлона SLS — 30 функциональных деталей",
      technology: "3D-печать (SLS)",
      quantity: "30 деталей + постобработка",
      currentBids: 3,
      budget: "₽ 620 000",
      status: "open",
    } satisfies LotProps,
  },
  {
    id: "7",
    title: "Заказ ORD-2080 — приёмка на складе",
    start: d(17, 9, 0),
    color: EVENT_COLORS.order,
    extendedProps: {
      type: "order",
      description: "Ожидается поступление литых алюминиевых кронштейнов на склад. Организовать приёмку и разгрузку.",
      orderId: "ORD-2080",
      supplier: "АО СибЛитМаш",
      technology: "Литьё под давлением",
      material: "Алюминий ADC12",
      quantity: "1 000 шт.",
      status: "Отгружено поставщиком",
      priority: "normal",
    } satisfies OrderProps,
  },
  {
    id: "8",
    title: "Контроль качества — анодированные детали",
    start: d(19, 10, 0),
    end: d(19, 12, 0),
    color: EVENT_COLORS.qc,
    extendedProps: {
      type: "qc",
      description: "Проверка партии анодированных ЧПУ-деталей на однородность цвета и толщину покрытия.",
      orderId: "ORD-2068",
      inspectionType: "Инспекция покрытия поверхности",
      checklist: [
        "Однородность цвета (RAL 7016)",
        "Толщина анодного слоя (15–25 мкм)",
        "Испытание на устойчивость к царапинам",
        "Результат теста в солевом тумане",
      ],
      location: "Лаборатория входного контроля",
    } satisfies QcProps,
  },
  {
    id: "9",
    title: "Совещание по проекту вакуумного литья",
    start: d(21, 15, 0),
    end: d(21, 16, 30),
    color: EVENT_COLORS.meeting,
    extendedProps: {
      type: "meeting",
      description: "Стартовое совещание по проекту вакуумного литья полиуретановых деталей. Согласование требований с поставщиком.",
      participants: [
        "Иванов А.С. (Вы)",
        "Петров А.Н. (ООО ПолимерТех)",
        "Смирнова О.В. (инженерный отдел)",
      ],
      agenda: [
        "Разбор 3D-моделей и требований к деталям",
        "Обсуждение выбора материала (ПУ смолы)",
        "Согласование сроков и этапов поставки",
        "Определение критериев приёмки",
      ],
      meetingLink: "https://meet.everypart.pro/room/vac-kick",
      callType: "video",
    } satisfies MeetingProps,
  },
  {
    id: "10",
    title: "Акт приёмки — загрузка на платформу",
    start: d(23),
    color: EVENT_COLORS.document,
    extendedProps: {
      type: "document",
      description: "Загрузить подписанный акт приёмки и протоколы испытаний материалов на платформу.",
      documentType: "Акт приёмки и протоколы испытаний",
      requiredBy: "Поставщик — ООО ПрецизионМеталл",
      relatedOrder: "ORD-2071",
      status: "overdue",
    } satisfies DocumentProps,
  },
  {
    id: "11",
    title: "Заказ ORD-2090 — срочная поставка редукторных корпусов",
    start: d(26, 17, 0),
    color: EVENT_COLORS.order,
    extendedProps: {
      type: "order",
      description: "Срочная поставка корпусов редукторов. Контроль готовности у поставщика и организация экспресс-доставки.",
      orderId: "ORD-2090",
      supplier: "ООО ВолгаМеханика",
      technology: "ЧПУ точение + фрезерование",
      material: "Сталь 40Х",
      quantity: "150 шт.",
      status: "Производство завершено",
      priority: "urgent",
    } satisfies OrderProps,
  },
  {
    id: "12",
    title: "Вебинар Everypart для закупщиков",
    start: d(28, 10, 0),
    end: d(28, 11, 30),
    color: EVENT_COLORS.meeting,
    extendedProps: {
      type: "meeting",
      description: "Ежемесячный вебинар платформы: обновления функционала и ответы на вопросы закупщиков.",
      participants: [
        "Иванов А.С. (Вы)",
        "Команда Everypart",
        "Все верифицированные закупщики",
      ],
      agenda: [
        "Новые функции управления лотами",
        "Обновление системы рейтинга поставщиков",
        "Интеграция с логистическими партнёрами",
        "Открытая сессия вопросов и ответов",
      ],
      callType: "video",
    } satisfies MeetingProps,
  },
];
