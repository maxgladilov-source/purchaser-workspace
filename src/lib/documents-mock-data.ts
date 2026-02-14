// Данные документов — закупщик

export type DocumentStatus = "valid" | "expiring" | "expired" | "pending" | "in_review";
export type DocumentCategory = "certificate" | "contract" | "report" | "invoice" | "technical";

export interface Document {
  id: string;
  title: string;
  category: DocumentCategory;
  status: DocumentStatus;
  relatedOrder?: string;
  uploadedAt: string;
  expiresAt?: string;
  fileSize: string;
  description: string;
}

export const DOC_STATUS_CONFIG: Record<DocumentStatus, { label: string; color: string }> = {
  valid: { label: "Действителен", color: "green" },
  expiring: { label: "Истекает", color: "orange" },
  expired: { label: "Просрочен", color: "red" },
  pending: { label: "Ожидает загрузки", color: "blue" },
  in_review: { label: "На проверке", color: "purple" },
};

export const DOC_CATEGORY_CONFIG: Record<DocumentCategory, { label: string; color: string }> = {
  certificate: { label: "Сертификат", color: "green" },
  contract: { label: "Договор", color: "blue" },
  report: { label: "Отчёт", color: "orange" },
  invoice: { label: "Счёт", color: "purple" },
  technical: { label: "Техническая", color: "cyan" },
};

function pastDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function futureDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export const mockDocuments: Document[] = [
  {
    id: "DOC-001",
    title: "Сертификат ISO 9001:2015 — ООО ПрецизионМеталл",
    category: "certificate",
    status: "expiring",
    uploadedAt: pastDate(340),
    expiresAt: futureDate(25),
    fileSize: "2,4 МБ",
    description: "Сертификат системы менеджмента качества поставщика. Требуется ежегодное продление.",
  },
  {
    id: "DOC-002",
    title: "Сертификат ISO 14001 — АО УралМеталлург",
    category: "certificate",
    status: "valid",
    uploadedAt: pastDate(180),
    expiresAt: futureDate(185),
    fileSize: "1,8 МБ",
    description: "Сертификат экологического менеджмента поставщика.",
  },
  {
    id: "DOC-003",
    title: "Свидетельство о регистрации ООО ТехноПром Групп",
    category: "certificate",
    status: "valid",
    uploadedAt: pastDate(90),
    expiresAt: futureDate(275),
    fileSize: "3,1 МБ",
    description: "Свидетельство о государственной регистрации юридического лица.",
  },
  {
    id: "DOC-004",
    title: "Договор поставки №ДП-2025/041 — ООО ПрецизионМеталл",
    category: "contract",
    status: "valid",
    uploadedAt: pastDate(60),
    expiresAt: futureDate(305),
    fileSize: "890 КБ",
    description: "Рамочный договор поставки ЧПУ-деталей из алюминия и стали.",
  },
  {
    id: "DOC-005",
    title: "Соглашение о конфиденциальности (NDA) — АО СибЛитМаш",
    category: "contract",
    status: "valid",
    uploadedAt: pastDate(45),
    expiresAt: futureDate(320),
    fileSize: "420 КБ",
    description: "Соглашение о неразглашении технической информации по проектам литья.",
  },
  {
    id: "DOC-006",
    title: "Акт приёмки — ORD-2071, партия 1",
    category: "report",
    status: "valid",
    relatedOrder: "ORD-2071",
    uploadedAt: pastDate(5),
    fileSize: "5,6 МБ",
    description: "Акт входного контроля с данными координатно-измерительной машины (КИМ) для первой партии.",
  },
  {
    id: "DOC-007",
    title: "Протокол испытаний материала — ORD-2071",
    category: "report",
    status: "pending",
    relatedOrder: "ORD-2071",
    uploadedAt: pastDate(0),
    fileSize: "—",
    description: "Сертификаты на материал и результаты испытаний на растяжение. Ожидает загрузки от поставщика.",
  },
  {
    id: "DOC-008",
    title: "Отчёт ОТК — ORD-2080",
    category: "report",
    status: "in_review",
    relatedOrder: "ORD-2080",
    uploadedAt: pastDate(2),
    fileSize: "4,2 МБ",
    description: "Отчёт инспекции покрытия поверхности. Передан на согласование в инженерный отдел.",
  },
  {
    id: "DOC-009",
    title: "Счёт №СФ-2026-087 — ООО ПрецизионМеталл",
    category: "invoice",
    status: "valid",
    relatedOrder: "ORD-2045",
    uploadedAt: pastDate(10),
    fileSize: "340 КБ",
    description: "Счёт на оплату за партию ЧПУ латунных разъёмов.",
  },
  {
    id: "DOC-010",
    title: "Счёт №СФ-2026-093 — ООО ПолимерТех",
    category: "invoice",
    status: "pending",
    relatedOrder: "ORD-2058",
    uploadedAt: pastDate(0),
    fileSize: "—",
    description: "Счёт за вакуумное литьё полиуретановых уплотнителей. Ожидает формирования.",
  },
  {
    id: "DOC-011",
    title: "Техническое задание — ORD-2090 конструкция пресс-формы",
    category: "technical",
    status: "valid",
    relatedOrder: "ORD-2090",
    uploadedAt: pastDate(15),
    fileSize: "12,7 МБ",
    description: "Техническое задание на проектирование пресс-формы для корпусов редукторов.",
  },
  {
    id: "DOC-012",
    title: "Результаты анализа литьевого потока — ORD-2080",
    category: "technical",
    status: "in_review",
    relatedOrder: "ORD-2080",
    uploadedAt: pastDate(3),
    fileSize: "9,4 МБ",
    description: "Результаты моделирования литьевого потока. Требуется утверждение перед запуском оснастки.",
  },
  {
    id: "DOC-013",
    title: "Отчёт квалификационного аудита поставщика — АО СибЛитМаш",
    category: "report",
    status: "valid",
    uploadedAt: pastDate(120),
    fileSize: "8,3 МБ",
    description: "Отчёт выездного аудита производственных мощностей поставщика, проведённого командой ОТК.",
  },
  {
    id: "DOC-014",
    title: "Декларация соответствия РоХС — ООО ТочПрибор",
    category: "certificate",
    status: "expired",
    uploadedAt: pastDate(400),
    expiresAt: pastDate(35),
    fileSize: "1,2 МБ",
    description: "Декларация соответствия RoHS для заказов электронных компонентов. Требуется обновление.",
  },
];
