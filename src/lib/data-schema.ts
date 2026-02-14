/**
 * Централизованная схема данных проекта «ЗакажиДеталь — Покупатель».
 *
 * Все интерфейсы описывают структуры, которые сейчас заполняются моковыми
 * данными, а в будущем будут храниться в Supabase.
 *
 * Соглашения:
 *  - Поля, которые могут быть пустыми, помечены `| null` (БД) или `?` (опционально).
 *  - ID — строка (UUID в Supabase).
 *  - Даты — ISO-8601 строки (`"2025-04-15"` или `"2026-02-13 09:15"`).
 *  - Денежные суммы — число; валюта хранится отдельным полем.
 */

/* ================================================================== */
/*  Компания                                                           */
/* ================================================================== */

/** Уполномоченный контакт компании (директор, администратор и т.д.) */
export interface CompanyContact {
  /** ФИО */
  name: string;
  /** Должность */
  title: string;
  /** Телефон */
  phone: string;
  /** Email */
  email: string;
  /** Telegram-аккаунт */
  telegram: string;
}

/** Статус сертификата */
export type CertificationStatus = "pending_review" | "active" | "expiring" | "expired";

/** Сертификат компании */
export interface Certification {
  /** Название сертификата (ISO 9001:2015 и т.д.) */
  name: string;
  /** Кем выдан */
  issuer: string;
  /** Дата выдачи (ISO-8601) */
  issued: string;
  /** Дата истечения (ISO-8601) */
  expires: string;
  /** Проверен ли оператором платформы. false = «На проверке» */
  verified: boolean;
}

/**
 * Вычисляет статус сертификата.
 * - verified === false → "pending_review"
 * - иначе вычисляется по дате истечения
 * @param cert — сертификат
 * @param warningDays — за сколько дней считать «истекающим» (по умолчанию 90)
 */
export function getCertificationStatus(
  cert: Pick<Certification, "expires" | "verified">,
  warningDays = 90,
): CertificationStatus {
  if (!cert.verified) return "pending_review";
  const now = new Date();
  const exp = new Date(cert.expires);
  if (exp <= now) return "expired";
  const diff = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (diff <= warningDays) return "expiring";
  return "active";
}

/** Профиль компании-покупателя */
export interface Company {
  /** Внутренний ID (CMP-XXXXX) */
  id: string;
  /** Краткое название (ООО "...") */
  name: string;
  /** Полное юридическое наименование */
  legalName: string;
  /** Описание деятельности */
  description: string;
  /** ИНН */
  inn: string;
  /** ОГРН */
  ogrn: string;
  /** Отрасль */
  industry: string;
  /** Год основания */
  founded: string;
  /** Количество сотрудников (диапазон) */
  employees: string;
  /** Юридический адрес */
  address: string;
  /** Телефон компании */
  phone: string;
  /** Email компании */
  email: string;
  /** Сайт */
  website: string;
  /** Уполномоченный представитель (генеральный директор) */
  representative: CompanyContact;
  /** Системный администратор */
  admin: CompanyContact;
  /** Уровень верификации: 0=Новый, 1=На проверке, 2=Верифицированный, 3=Надёжный покупатель */
  verificationLevel: 0 | 1 | 2 | 3;
  /** Дата регистрации на платформе */
  registeredAt: string;
  /** Сертификаты компании */
  certifications: Certification[];
}

/** Роль пользователя внутри компании */
export type CompanyUserRole = "purchaser" | "engineer" | "project_manager";

/** Пользователь компании */
export interface CompanyUser {
  /** UUID */
  id: string;
  /** ФИО */
  name: string;
  /** Email (уникальный) */
  email: string;
  /** Telegram */
  telegram: string;
  /** Роль в системе */
  role: CompanyUserRole;
  /** Активен ли аккаунт */
  active: boolean;
  /** Дата/время последнего входа */
  lastLogin: string | null;
  /** Дата создания аккаунта */
  createdAt: string;
}

/* ================================================================== */
/*  Лоты                                                               */
/* ================================================================== */

/** Статус лота */
export type LotStatus =
  | "draft"
  | "published"
  | "collecting_bids"
  | "evaluation"
  | "awarded"
  | "cancelled"
  | "no_bids";

/** Категория лота */
export type LotCategory = "material" | "digital";

/** Сложность лота */
export type LotComplexity = "single" | "complex";

/** Правило присуждения победителя */
export type AwardRule =
  | "best_price"
  | "instant_buy"
  | "price_delivery_ratio"
  | "fastest_delivery";

/** Предложение поставщика на лот */
export interface SupplierBid {
  /** UUID */
  id: string;
  /** Название компании-поставщика */
  supplierName: string;
  /** Рейтинг поставщика (0–5) */
  supplierRating: number;
  /** Предложенная цена */
  price: number;
  /** Срок поставки (дней) */
  deliveryDays: number;
  /** Дата подачи */
  submittedAt: string;
  /** Статус предложения */
  status: "pending" | "accepted" | "rejected";
  /** Комментарий поставщика */
  comment?: string;
}

/** Лот покупателя */
export interface BuyerLot {
  /** UUID */
  id: string;
  /** Название лота */
  title: string;
  /** Описание */
  description: string;
  /** Категория */
  category: LotCategory;
  /** Сложность */
  complexity: LotComplexity;
  /** Технология производства */
  technology: string;
  /** Материал */
  material?: string;
  /** Количество */
  quantity: number;
  /** Единица измерения */
  unit: string;
  /** Текущий статус */
  status: LotStatus;
  /** Правило выбора победителя */
  awardRule: AwardRule;
  /** Бюджет */
  budget: number;
  /** Валюта */
  currency: string;
  /** Крайний срок подачи предложений */
  deadline: string;
  /** Дата создания */
  createdAt: string;
  /** Дата публикации */
  publishedAt?: string;
  /** Квалитет допуска (IT6–IT14) */
  toleranceGrade?: string;
  /** URL 3D-модели */
  modelUrl?: string;
  /** Предложения поставщиков */
  bids: SupplierBid[];
}

/* ================================================================== */
/*  Заказы                                                             */
/* ================================================================== */

/** Статус заказа */
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

/** Тип заказа */
export type OrderType = "lot_award" | "direct_order";

/** Приоритет заказа */
export type OrderPriority = "urgent" | "high" | "normal" | "low";

/** Заказ покупателя */
export interface BuyerOrder {
  /** UUID */
  id: string;
  /** Название заказа */
  title: string;
  /** Тип: по результатам лота или прямой */
  type: OrderType;
  /** Текущий статус */
  status: OrderStatus;
  /** Приоритет */
  priority: OrderPriority;
  /** Название компании-поставщика */
  supplierName: string;
  /** Рейтинг поставщика */
  supplierRating: number;
  /** Технология производства */
  technology: string;
  /** Материал */
  material?: string;
  /** Количество */
  quantity: number;
  /** Единица измерения */
  unit: string;
  /** Общая стоимость */
  totalPrice: number;
  /** Валюта */
  currency: string;
  /** Квалитет допуска */
  toleranceGrade?: string;
  /** ID связанного лота */
  lotId?: string;
  /** Дата создания */
  createdAt: string;
  /** Крайний срок */
  deadline: string;
  /** Описание */
  description: string;
  /** URL 3D-модели */
  modelUrl?: string;
  /** Процент выполнения (0–100) */
  progressPercent: number;
}

/* ================================================================== */
/*  Предложения поставщиков                                            */
/* ================================================================== */

/** Статус предложения */
export type ProposalStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "clarification_requested";

/** Профиль поставщика (краткий, в контексте предложения) */
export interface SupplierProfile {
  /** Название компании */
  name: string;
  /** Рейтинг (0–5) */
  rating: number;
  /** Количество завершённых заказов */
  completedOrders: number;
  /** Специализация */
  specialization: string;
  /** Местоположение */
  location: string;
  /** Среднее время ответа */
  responseTime: string;
  /** Сертификации */
  certifications: string[];
}

/** Предложение на лот */
export interface Proposal {
  /** UUID */
  id: string;
  /** ID лота */
  lotId: string;
  /** Название лота */
  lotTitle: string;
  /** Профиль поставщика */
  supplier: SupplierProfile;
  /** Предложенная цена */
  price: number;
  /** Валюта */
  currency: string;
  /** Срок поставки (дней) */
  deliveryDays: number;
  /** Дата подачи */
  submittedAt: string;
  /** Статус */
  status: ProposalStatus;
  /** Комментарий поставщика */
  comment: string;
  /** Техническая оценка (0–100) */
  technicalScore: number;
  /** Ценовая оценка (0–100) */
  priceScore: number;
}

/* ================================================================== */
/*  Споры                                                              */
/* ================================================================== */

/** Статус спора */
export type DisputeStatus =
  | "open"
  | "under_review"
  | "awaiting_evidence"
  | "in_mediation"
  | "resolved"
  | "escalated"
  | "closed";

/** Тип спора */
export type DisputeType =
  | "quality"
  | "delivery"
  | "spec_mismatch"
  | "quantity"
  | "documentation";

/** Приоритет спора */
export type DisputePriority = "critical" | "high" | "medium" | "low";

/** Сообщение в переписке спора */
export interface DisputeMessage {
  /** UUID */
  id: string;
  /** Имя автора */
  author: string;
  /** Роль автора */
  role: "buyer" | "operator" | "supplier" | "system";
  /** Текст сообщения */
  text: string;
  /** Дата/время */
  timestamp: string;
}

/** Спор */
export interface Dispute {
  /** UUID */
  id: string;
  /** ID связанного заказа */
  orderId: string;
  /** Название заказа */
  orderTitle: string;
  /** Заголовок спора */
  title: string;
  /** Описание проблемы */
  description: string;
  /** Тип спора */
  type: DisputeType;
  /** Текущий статус */
  status: DisputeStatus;
  /** Приоритет */
  priority: DisputePriority;
  /** Кем подан */
  filedBy: string;
  /** Дата подачи */
  filedAt: string;
  /** Дата обновления */
  updatedAt: string;
  /** Крайний срок решения */
  resolutionDeadline: string;
  /** Сумма спора */
  amountInDispute: number;
  /** Валюта */
  currency: string;
  /** Количество доказательств */
  evidenceCount: number;
  /** Решение (если есть) */
  resolution?: string;
  /** Назначенный медиатор */
  assignedMediator: string;
  /** История переписки */
  messages: DisputeMessage[];
}

/* ================================================================== */
/*  Документы                                                          */
/* ================================================================== */

/** Статус документа */
export type DocumentStatus =
  | "valid"
  | "expiring"
  | "expired"
  | "pending"
  | "in_review";

/** Категория документа */
export type DocumentCategory =
  | "certificate"
  | "contract"
  | "report"
  | "invoice"
  | "technical";

/** Документ */
export interface CompanyDocument {
  /** UUID */
  id: string;
  /** Название */
  title: string;
  /** Категория */
  category: DocumentCategory;
  /** Текущий статус */
  status: DocumentStatus;
  /** ID связанного заказа */
  relatedOrder?: string;
  /** Дата загрузки */
  uploadedAt: string;
  /** Дата истечения */
  expiresAt?: string;
  /** Размер файла (человекочитаемый) */
  fileSize: string;
  /** Описание */
  description: string;
}

/* ================================================================== */
/*  Сообщения                                                          */
/* ================================================================== */

/** Канал сообщения */
export type MessageChannel = "operator" | "supplier" | "system";

/** Статус диалога */
export type ConversationStatus = "active" | "waiting" | "resolved";

/** Сообщение */
export interface ChatMessage {
  /** UUID */
  id: string;
  /** Имя отправителя */
  from: string;
  /** Роль отправителя */
  fromRole: MessageChannel;
  /** Текст сообщения */
  text: string;
  /** Дата/время */
  timestamp: string;
  /** Прочитано ли */
  read: boolean;
}

/** Диалог */
export interface Conversation {
  /** UUID */
  id: string;
  /** Тема */
  subject: string;
  /** Канал */
  channel: MessageChannel;
  /** Статус диалога */
  status: ConversationStatus;
  /** ID связанного заказа */
  relatedOrder?: string;
  /** Участники */
  participants: string[];
  /** Время последнего сообщения */
  lastMessageAt: string;
  /** Количество непрочитанных */
  unreadCount: number;
  /** Сообщения */
  messages: ChatMessage[];
}

/* ================================================================== */
/*  Календарь                                                          */
/* ================================================================== */

/** Тип события в календаре */
export type CalendarEventType = "order" | "lot" | "qc" | "meeting" | "document";

/** Свойства события «Заказ» */
export interface CalendarOrderProps {
  type: "order";
  description: string;
  orderId: string;
  supplier: string;
  technology: string;
  material: string;
  quantity: string;
  status: string;
  priority: OrderPriority;
}

/** Свойства события «Лот» */
export interface CalendarLotProps {
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

/** Свойства события «Контроль качества» */
export interface CalendarQcProps {
  type: "qc";
  description: string;
  orderId: string;
  inspectionType: string;
  checklist: string[];
  location: string;
}

/** Свойства события «Встреча» */
export interface CalendarMeetingProps {
  type: "meeting";
  description: string;
  participants: string[];
  agenda: string[];
  meetingLink?: string;
  callType: "video" | "phone" | "in-person";
}

/** Свойства события «Документ» */
export interface CalendarDocumentProps {
  type: "document";
  description: string;
  documentType: string;
  requiredBy: string;
  relatedOrder?: string;
  status: "pending" | "in_review" | "overdue";
}

/** Объединённый тип свойств события */
export type CalendarEventProps =
  | CalendarOrderProps
  | CalendarLotProps
  | CalendarQcProps
  | CalendarMeetingProps
  | CalendarDocumentProps;

/* ================================================================== */
/*  Настройки пользователя                                             */
/* ================================================================== */

/** Режим темы */
export type ThemeMode = "light" | "dark";

/** Формат даты */
export type DateFormat = "ДД.ММ.ГГГГ" | "ММ/ДД/ГГГГ" | "ГГГГ-ММ-ДД";

/** Формат чисел */
export type NumberFormat = "1 234,56" | "1,234.56" | "1.234,56";

/** Стартовая страница */
export type DefaultPage = "overview" | "orders" | "lots" | "messages" | "calendar";

/** Валюта отображения */
export type DisplayCurrency = "RUB" | "USD" | "EUR" | "CNY";

/** Настройки пользователя */
export interface UserSettings {
  /** Тема оформления */
  theme: ThemeMode;
  /** Размер шрифта (px) */
  fontSize: number;
  /** Часовой пояс (IANA) */
  timezone: string;
  /** Формат даты */
  dateFormat: DateFormat;
  /** Формат чисел */
  numberFormat: NumberFormat;
  /** Валюта отображения */
  displayCurrency: DisplayCurrency;
  /** Стартовая страница */
  defaultPage: DefaultPage;
  /** Боковая панель свёрнута */
  sidebarCollapsed: boolean;
  /** Уведомления: заказы */
  notifyOrders: boolean;
  /** Уведомления: лоты */
  notifyLots: boolean;
  /** Уведомления: споры */
  notifyDisputes: boolean;
  /** Уведомления: сообщения */
  notifyMessages: boolean;
  /** Уведомления: документы */
  notifyDocuments: boolean;
  /** Уведомления: браузер (push) */
  notifyBrowser: boolean;
  /** Уведомления: звук */
  notifySound: boolean;
}

/* ================================================================== */
/*  Форма создания заказа                                              */
/* ================================================================== */

/** Данные формы «Новый заказ» (все шаги) */
export interface NewOrderFormData {
  /* Шаг 1: Основная информация */
  /** Название заказа */
  title: string;
  /** Категория (material / digital) */
  category: string;
  /** Технология производства */
  technology: string;
  /** Материал */
  material: string;
  /** Количество */
  quantity: number | null;
  /** Единица измерения (шт, кг, м, комплект) */
  unit: string;

  /* Шаг 2: Технические требования */
  /** Квалитет допуска (IT6–IT14) */
  toleranceGrade: string;
  /** Габарит: длина (мм) */
  dimensionLength: number | null;
  /** Габарит: ширина (мм) */
  dimensionWidth: number | null;
  /** Габарит: высота (мм) */
  dimensionHeight: number | null;
  /** Масса (кг) */
  weight: number | null;
  /** Доп. обработки (anodizing, painting, ...) */
  additionalProcesses: string[];

  /* Шаг 3: Коммерческие условия */
  /** Правило выбора победителя */
  awardRule: string;
  /** Бюджет */
  budget: number | null;
  /** Крайний срок подачи предложений */
  biddingDeadline: unknown; // Dayjs на клиенте, ISO string в БД
  /** Срок поставки (дней) */
  deliveryDays: number | null;

  /* Шаг 4: Контроль качества */
  /** Проверки качества (dimensional, material_test, visual, ...) */
  qualityChecks: string[];

  /* Шаг 5: Документация */
  /** Подробное описание / ТЗ */
  description: string;
}
