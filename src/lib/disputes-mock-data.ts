// Данные споров — используются на странице панели управления спорами

export type DisputeStatus =
  | "open"
  | "under_review"
  | "awaiting_evidence"
  | "in_mediation"
  | "resolved"
  | "escalated"
  | "closed";

export type DisputeType =
  | "quality"
  | "delivery"
  | "spec_mismatch"
  | "quantity"
  | "documentation";

export type DisputePriority = "critical" | "high" | "medium" | "low";

export interface DisputeMessage {
  id: string;
  author: string;
  role: "buyer" | "operator" | "supplier" | "system";
  text: string;
  timestamp: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  orderTitle: string;
  title: string;
  description: string;
  type: DisputeType;
  status: DisputeStatus;
  priority: DisputePriority;
  filedBy: string;
  filedAt: string;
  updatedAt: string;
  resolutionDeadline: string;
  amountInDispute: number;
  currency: string;
  evidenceCount: number;
  resolution?: string;
  assignedMediator: string;
  messages: DisputeMessage[];
}

export const DISPUTE_STATUS_CONFIG: Record<
  DisputeStatus,
  { label: string; color: string }
> = {
  open: { label: "Открыт", color: "red" },
  under_review: { label: "На рассмотрении", color: "orange" },
  awaiting_evidence: { label: "Ожидание доказательств", color: "gold" },
  in_mediation: { label: "Медиация", color: "purple" },
  resolved: { label: "Решён", color: "green" },
  escalated: { label: "Эскалация", color: "magenta" },
  closed: { label: "Закрыт", color: "default" },
};

export const DISPUTE_TYPE_CONFIG: Record<
  DisputeType,
  { label: string; color: string }
> = {
  quality: { label: "Качество", color: "#f5222d" },
  delivery: { label: "Задержка доставки", color: "#fa8c16" },
  spec_mismatch: { label: "Несоответствие ТЗ", color: "#722ed1" },
  quantity: { label: "Количество", color: "#1677ff" },
  documentation: { label: "Документация", color: "#13c2c2" },
};

export const DISPUTE_PRIORITY_CONFIG: Record<
  DisputePriority,
  { label: string; color: string }
> = {
  critical: { label: "Критический", color: "red" },
  high: { label: "Высокий", color: "orange" },
  medium: { label: "Средний", color: "blue" },
  low: { label: "Низкий", color: "default" },
};

function pastDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(10, 0, 0, 0);
  return d.toISOString();
}

function futureDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(10, 0, 0, 0);
  return d.toISOString();
}

export const mockDisputes: Dispute[] = [
  {
    id: "DSP-0501",
    orderId: "ORD-2071",
    orderTitle: "ЧПУ алюминиевые корпуса",
    title: "Шероховатость поверхности превышает допуск на 15 деталях",
    description:
      "При входном контроле обнаружено, что 15 из 500 корпусов имеют шероховатость поверхности Ra 1,6 вместо указанных Ra 0,8. Требуется переделка или замена дефектных деталей.",
    type: "quality",
    status: "under_review",
    priority: "high",
    filedBy: "ООО ТехноПром Групп",
    filedAt: pastDate(3),
    updatedAt: pastDate(0),
    resolutionDeadline: futureDate(4),
    amountInDispute: 187500,
    currency: "₽",
    evidenceCount: 4,
    assignedMediator: "Козлов Д.А.",
    messages: [
      {
        id: "m1",
        author: "ООО ТехноПром Групп",
        role: "buyer",
        text: "При входном контроле партии обнаружено 15 деталей с шероховатостью Ra 1,6 — значительно выше допуска Ra 0,8. Прилагаем фотографии и протоколы измерений.",
        timestamp: pastDate(3),
      },
      {
        id: "m2",
        author: "Система",
        role: "system",
        text: "Спор DSP-0501 создан. Назначен медиатор Козлов Д.А.",
        timestamp: pastDate(3),
      },
      {
        id: "m3",
        author: "Козлов Д.А.",
        role: "operator",
        text: "Спасибо за обращение. Данные измерений проверены. Поставщик, предоставьте, пожалуйста, ваши записи ОТК по данной партии.",
        timestamp: pastDate(2),
      },
      {
        id: "m4",
        author: "ООО ПрецизионМеталл",
        role: "supplier",
        text: "Проверили наши записи. Дефектные детали из последнего прогона, где была задержка замены инструмента. Готовы переделать 15 деталей в течение 3 рабочих дней.",
        timestamp: pastDate(1),
      },
      {
        id: "m5",
        author: "Козлов Д.А.",
        role: "operator",
        text: "Поставщик подтвердил проблему и предлагает переделку в течение 3 дней. Закупщик, устраивает ли вас такое решение?",
        timestamp: pastDate(0),
      },
    ],
  },
  {
    id: "DSP-0498",
    orderId: "ORD-2065",
    orderTitle: "Литые стальные шестерни",
    title: "Задержка поставки на 7 дней — производство отстаёт от графика",
    description:
      "Заказ ORD-2065 должен был быть отгружен 7 дней назад, но до сих пор находится в производстве. Необходимо получить обновлённый график и обсудить компенсацию за задержку.",
    type: "delivery",
    status: "in_mediation",
    priority: "critical",
    filedBy: "ООО ТехноПром Групп",
    filedAt: pastDate(7),
    updatedAt: pastDate(0),
    resolutionDeadline: futureDate(2),
    amountInDispute: 540000,
    currency: "₽",
    evidenceCount: 3,
    assignedMediator: "Козлов Д.А.",
    messages: [
      {
        id: "m1",
        author: "ООО ТехноПром Групп",
        role: "buyer",
        text: "Заказ должен был быть отгружен 7 дней назад. Эти детали необходимы для нашей сборочной линии. Требуем немедленного разъяснения статуса.",
        timestamp: pastDate(7),
      },
      {
        id: "m2",
        author: "Система",
        role: "system",
        text: "Спор DSP-0498 создан. Приоритет: Критический. Назначен медиатор Козлов Д.А.",
        timestamp: pastDate(7),
      },
      {
        id: "m3",
        author: "АО УралМеталлург",
        role: "supplier",
        text: "Приносим извинения за задержку. Произошла непредвиденная поломка термической печи. Ремонт завершён, отгрузка возможна через 2 дня.",
        timestamp: pastDate(5),
      },
      {
        id: "m4",
        author: "Козлов Д.А.",
        role: "operator",
        text: "Подтверждаю поломку печи по фотоматериалам. Поставщик предлагает отгрузку через 2 дня. С учётом задержки рекомендую скидку 15% на партию в качестве компенсации. Устраивает ли это обе стороны?",
        timestamp: pastDate(3),
      },
      {
        id: "m5",
        author: "ООО ТехноПром Групп",
        role: "buyer",
        text: "Согласны на срок 2 дня, но требуем экспресс-доставку за счёт поставщика в дополнение к скидке.",
        timestamp: pastDate(1),
      },
      {
        id: "m6",
        author: "АО УралМеталлург",
        role: "supplier",
        text: "Согласны взять расходы на экспресс-доставку на себя. Просим подтвердить итоговые условия для отгрузки.",
        timestamp: pastDate(0),
      },
    ],
  },
  {
    id: "DSP-0495",
    orderId: "ORD-2080",
    orderTitle: "Кронштейны из листового металла",
    title: "Крепёжные отверстия не совпадают с чертежом ред. В",
    description:
      "Расположение крепёжных отверстий на 40 кронштейнах не соответствует чертежу редакции В. Смещение на 2,5 мм не позволяет выполнить сборку. Предположительно поставщик использовал устаревший чертёж.",
    type: "spec_mismatch",
    status: "awaiting_evidence",
    priority: "high",
    filedBy: "ООО ТехноПром Групп",
    filedAt: pastDate(6),
    updatedAt: pastDate(1),
    resolutionDeadline: futureDate(3),
    amountInDispute: 320000,
    currency: "₽",
    evidenceCount: 7,
    assignedMediator: "Семёнова И.В.",
    messages: [
      {
        id: "m1",
        author: "ООО ТехноПром Групп",
        role: "buyer",
        text: "При сборке обнаружено смещение крепёжных отверстий на 2,5 мм от чертежа ред. В. Прилагаем сравнительные фото и протоколы замеров. Похоже, использован устаревший чертёж ред. А.",
        timestamp: pastDate(6),
      },
      {
        id: "m2",
        author: "Система",
        role: "system",
        text: "Спор DSP-0495 создан. Назначен медиатор Семёнова И.В.",
        timestamp: pastDate(6),
      },
      {
        id: "m3",
        author: "Семёнова И.В.",
        role: "operator",
        text: "Замеры подтверждают смещение 2,5 мм, соответствующее отверстиям по ред. А. Поставщик, предоставьте версию чертежа, по которой велось производство, и дату получения последней редакции.",
        timestamp: pastDate(4),
      },
      {
        id: "m4",
        author: "ООО МеталлСервис",
        role: "supplier",
        text: "Проверяем систему управления чертежами. Предоставим производственный файл с отметкой времени в течение 24 часов.",
        timestamp: pastDate(2),
      },
      {
        id: "m5",
        author: "Система",
        role: "system",
        text: "Статус изменён на «Ожидание доказательств». У поставщика 48 часов для предоставления документации.",
        timestamp: pastDate(1),
      },
    ],
  },
  {
    id: "DSP-0490",
    orderId: "ORD-2058",
    orderTitle: "Вакуумное литьё полиуретановых уплотнителей",
    title: "Получено 180 шт. вместо заказанных 200 шт.",
    description:
      "Получено только 180 уплотнителей вместо 200. Упаковочный лист указывает 200 шт., но фактический подсчёт — 180. Требуется доставка оставшихся 20 шт.",
    type: "quantity",
    status: "resolved",
    priority: "medium",
    filedBy: "ООО ТехноПром Групп",
    filedAt: pastDate(14),
    updatedAt: pastDate(5),
    resolutionDeadline: pastDate(4),
    amountInDispute: 45000,
    currency: "₽",
    evidenceCount: 3,
    assignedMediator: "Козлов Д.А.",
    resolution:
      "Поставщик отправил недостающие 20 шт. экспресс-доставкой за свой счёт. Закупщик подтвердил получение и принял решение.",
    messages: [
      {
        id: "m1",
        author: "ООО ТехноПром Групп",
        role: "buyer",
        text: "При приёмке на складе подсчитали только 180 уплотнителей вместо 200. Упаковочный лист указывает 200. Просим проверить и отправить недостающие 20 штук.",
        timestamp: pastDate(14),
      },
      {
        id: "m2",
        author: "Система",
        role: "system",
        text: "Спор DSP-0490 создан. Назначен медиатор Козлов Д.А.",
        timestamp: pastDate(14),
      },
      {
        id: "m3",
        author: "ООО ПолимерТех",
        role: "supplier",
        text: "Перепроверили складские записи. Вы правы — упаковщик допустил ошибку при подсчёте. Отправляем оставшиеся 20 шт. экспресс-доставкой сегодня.",
        timestamp: pastDate(12),
      },
      {
        id: "m4",
        author: "Козлов Д.А.",
        role: "operator",
        text: "Поставщик подтвердил недостачу и отправил 20 оставшихся деталей. Трек-номер передан закупщику.",
        timestamp: pastDate(10),
      },
      {
        id: "m5",
        author: "ООО ТехноПром Групп",
        role: "buyer",
        text: "Получили оставшиеся 20 шт. Всё в порядке. Спасибо за оперативное решение.",
        timestamp: pastDate(5),
      },
      {
        id: "m6",
        author: "Система",
        role: "system",
        text: "Спор решён. Обе стороны подтвердили решение.",
        timestamp: pastDate(5),
      },
    ],
  },
  {
    id: "DSP-0487",
    orderId: "ORD-2045",
    orderTitle: "ЧПУ латунные разъёмы",
    title: "Отсутствует сертификат на латунный сплав ЛС59-1",
    description:
      "Поставщик не приложил сертификат на материал к документации отгрузки. Сертификат необходим для прохождения аудита соответствия.",
    type: "documentation",
    status: "resolved",
    priority: "medium",
    filedBy: "ООО ТехноПром Групп",
    filedAt: pastDate(20),
    updatedAt: pastDate(15),
    resolutionDeadline: pastDate(14),
    amountInDispute: 0,
    currency: "₽",
    evidenceCount: 1,
    assignedMediator: "Семёнова И.В.",
    resolution:
      "Поставщик предоставил оригинал сертификата на материал от завода-изготовителя латуни в течение 2 рабочих дней. Закупщик подтвердил соответствие требованиям аудита.",
    messages: [
      {
        id: "m1",
        author: "ООО ТехноПром Групп",
        role: "buyer",
        text: "Нам необходим сертификат на латунный сплав ЛС59-1, использованный в заказе ORD-2045. Он отсутствует в документации поставки, а у нас аудит на следующей неделе.",
        timestamp: pastDate(20),
      },
      {
        id: "m2",
        author: "Система",
        role: "system",
        text: "Спор DSP-0487 создан. Назначен медиатор Семёнова И.В.",
        timestamp: pastDate(20),
      },
      {
        id: "m3",
        author: "ООО ТочПрибор",
        role: "supplier",
        text: "Приносим извинения за упущение. Запросим сертификат у нашего поставщика материала и предоставим в течение 2 дней.",
        timestamp: pastDate(18),
      },
      {
        id: "m4",
        author: "ООО ТочПрибор",
        role: "supplier",
        text: "Сертификат на материал приложен. Содержит химический состав и механические свойства согласно ГОСТ 15527-2004.",
        timestamp: pastDate(16),
      },
      {
        id: "m5",
        author: "ООО ТехноПром Групп",
        role: "buyer",
        text: "Сертификат получен. Соответствует нашим требованиям. Спасибо.",
        timestamp: pastDate(15),
      },
      {
        id: "m6",
        author: "Система",
        role: "system",
        text: "Спор решён. Документация предоставлена и принята.",
        timestamp: pastDate(15),
      },
    ],
  },
  {
    id: "DSP-0510",
    orderId: "ORD-2090",
    orderTitle: "Корпуса редукторов",
    title: "Несоответствие цвета анодирования между партиями",
    description:
      "Вторая партия анодированных деталей имеет заметно отличающийся оттенок по сравнению с первой. Невозможно использовать детали из обеих партий в одной сборке.",
    type: "quality",
    status: "open",
    priority: "medium",
    filedBy: "ООО ТехноПром Групп",
    filedAt: pastDate(1),
    updatedAt: pastDate(1),
    resolutionDeadline: futureDate(7),
    amountInDispute: 275000,
    currency: "₽",
    evidenceCount: 5,
    assignedMediator: "Козлов Д.А.",
    messages: [
      {
        id: "m1",
        author: "ООО ТехноПром Групп",
        role: "buyer",
        text: "Вторая партия анодированных деталей имеет явно другой оттенок чёрного по сравнению с первой партией. Использовать их вместе в одном изделии невозможно. Прилагаем фотографии при стандартном освещении.",
        timestamp: pastDate(1),
      },
      {
        id: "m2",
        author: "Система",
        role: "system",
        text: "Спор DSP-0510 создан. Назначен медиатор Козлов Д.А.",
        timestamp: pastDate(1),
      },
    ],
  },
  {
    id: "DSP-0480",
    orderId: "ORD-2040",
    orderTitle: "Литые алюминиевые кронштейны",
    title: "Обнаружена пористость в 9% деталей при выборочной проверке",
    description:
      "Рентген-контроль выборки выявил пористость в 9% кронштейнов, что превышает допустимый порог 2%. Необходима 100% проверка всей партии перед приёмкой.",
    type: "quality",
    status: "escalated",
    priority: "critical",
    filedBy: "ООО ТехноПром Групп",
    filedAt: pastDate(8),
    updatedAt: pastDate(0),
    resolutionDeadline: futureDate(1),
    amountInDispute: 890000,
    currency: "₽",
    evidenceCount: 9,
    assignedMediator: "Семёнова И.В.",
    messages: [
      {
        id: "m1",
        author: "ООО ТехноПром Групп",
        role: "buyer",
        text: "Наш входной контроль обнаружил пористость в 9% деталей выборки. По договору допустимый процент брака — не более 2%. Требуем 100% рентген-контроль всей партии до приёмки.",
        timestamp: pastDate(8),
      },
      {
        id: "m2",
        author: "Система",
        role: "system",
        text: "Спор DSP-0480 создан. Приоритет: Критический. Назначен медиатор Семёнова И.В.",
        timestamp: pastDate(8),
      },
      {
        id: "m3",
        author: "Семёнова И.В.",
        role: "operator",
        text: "Это серьёзная проблема качества. Поставщик, прекратите любую отгрузку и проведите 100% рентген-контроль всей партии. Результаты — в течение 48 часов.",
        timestamp: pastDate(7),
      },
      {
        id: "m4",
        author: "АО СибЛитМаш",
        role: "supplier",
        text: "Начали 100% рентген-контроль. Предварительные результаты показывают, что дефектные детали сконцентрированы на литьевой машине №3. Изолируем их и предоставим полный отчёт завтра.",
        timestamp: pastDate(5),
      },
      {
        id: "m5",
        author: "АО СибЛитМаш",
        role: "supplier",
        text: "Полная проверка завершена: 90 из 1000 деталей (9%) имеют пористость выше допуска. Все с машины №3. Можем переделать эти 90 деталей за 5 рабочих дней.",
        timestamp: pastDate(3),
      },
      {
        id: "m6",
        author: "ООО ТехноПром Групп",
        role: "buyer",
        text: "9% брака недопустимо. Требуем отчёт о корневых причинах и гарантии, что подобное не повторится. Рассматриваем снижение стоимости заказа пропорционально дефектным деталям.",
        timestamp: pastDate(2),
      },
      {
        id: "m7",
        author: "Система",
        role: "system",
        text: "Спор эскалирован на уровень руководства в связи с высоким процентом брака и суммой спора.",
        timestamp: pastDate(0),
      },
    ],
  },
];
