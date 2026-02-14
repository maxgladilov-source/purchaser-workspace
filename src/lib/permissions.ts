export type DemoRole = "admin" | "user";

/**
 * Ключи разрешений.
 *
 * Соглашение по именованию:
 *   view*   — раздел/страница видна
 *   edit*   — поля редактируемы
 *   create* — можно создавать сущности
 *   delete* — можно удалять сущности
 *   manage* — полный CRUD (объединяет edit + create + delete)
 */
export type Permission =
  /* Обзор (dashboard) */
  | "viewDashboard"
  /* Заказы */
  | "viewOrders"
  | "createOrder"
  | "editOrder"
  | "deleteOrder"
  /* Лоты */
  | "viewLots"
  | "createLot"
  /* Предложения */
  | "viewProposals"
  | "acceptProposal"
  /* Календарь */
  | "viewCalendar"
  /* Сообщения */
  | "viewMessages"
  | "sendMessage"
  /* Документы */
  | "viewDocuments"
  | "uploadDocument"
  /* Споры */
  | "viewDisputes"
  | "createDispute"
  /* Аналитика */
  | "viewAnalytics"
  /* Компания */
  | "viewCompany"
  | "editCompany"
  | "manageUsers"
  /* Настройки */
  | "viewSettings"
  | "editSettings";

const adminPermissions: Permission[] = [
  "viewDashboard",
  "viewOrders",
  "createOrder",
  "editOrder",
  "deleteOrder",
  "viewLots",
  "createLot",
  "viewProposals",
  "acceptProposal",
  "viewCalendar",
  "viewMessages",
  "sendMessage",
  "viewDocuments",
  "uploadDocument",
  "viewDisputes",
  "createDispute",
  "viewAnalytics",
  "viewCompany",
  "editCompany",
  "manageUsers",
  "viewSettings",
  "editSettings",
];

const userPermissions: Permission[] = [
  "viewDashboard",
  "viewOrders",
  "createOrder",
  "viewLots",
  "createLot",
  "viewProposals",
  "viewCalendar",
  "viewMessages",
  "sendMessage",
  "viewDocuments",
  "viewDisputes",
  "viewCompany",
  "viewSettings",
];

const permissionsByRole: Record<DemoRole, ReadonlySet<Permission>> = {
  admin: new Set(adminPermissions),
  user: new Set(userPermissions),
};

export function can(role: DemoRole, permission: Permission): boolean {
  return permissionsByRole[role].has(permission);
}
