"use client";

import { useMemo } from "react";
import { PageContainer } from "@ant-design/pro-components";
import { Card, Typography, Tag, Statistic, Badge, Progress } from "antd";
import {
  ShoppingCartOutlined,
  ToolOutlined,
  DollarOutlined,
  BulbOutlined,
  WarningOutlined,
  MessageOutlined,
  FileProtectOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FireOutlined,
  AlertOutlined,
  AuditOutlined,
  SafetyCertificateOutlined,
  FileExclamationOutlined,
  InboxOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { MOCK_LOTS, LOT_STATUS_CONFIG } from "@/lib/lots-mock-data";
import type { BuyerLot } from "@/lib/lots-mock-data";
import { MOCK_ORDERS, ORDER_STATUS_CONFIG } from "@/lib/orders-mock-data";
import type { BuyerOrder } from "@/lib/orders-mock-data";
import { MOCK_CONVERSATIONS } from "@/lib/messages-mock-data";
import { mockDocuments } from "@/lib/documents-mock-data";
import { mockDisputes } from "@/lib/disputes-mock-data";

const { Title, Text } = Typography;

function formatPrice(n: number): string {
  return n.toLocaleString("ru-RU") + " \u20BD";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ru-RU");
}

function daysUntil(dateStr: string): number {
  const now = new Date();
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function DashboardPage() {
  // ───── KPI computations ─────
  const activeLots = useMemo(
    () =>
      MOCK_LOTS.filter(
        (l) =>
          l.status !== "draft" &&
          l.status !== "cancelled" &&
          l.status !== "no_bids"
      ),
    []
  );

  const ordersInProduction = useMemo(
    () => MOCK_ORDERS.filter((o) => o.status === "in_production"),
    []
  );

  const monthlySpend = useMemo(() => {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - 1);
    return MOCK_ORDERS.filter(
      (o) =>
        new Date(o.createdAt) >= cutoff &&
        o.status !== "cancelled"
    ).reduce((sum, o) => sum + o.totalPrice, 0);
  }, []);

  const lotsWithPendingBids = useMemo(
    () =>
      MOCK_LOTS.filter((l) =>
        l.bids.some((b) => b.status === "pending")
      ),
    []
  );

  const activeDisputes = useMemo(
    () =>
      mockDisputes.filter(
        (d) =>
          d.status !== "resolved" && d.status !== "closed"
      ),
    []
  );

  const unreadMessages = useMemo(
    () => MOCK_CONVERSATIONS.reduce((sum, c) => sum + c.unreadCount, 0),
    []
  );

  const docsAttention = useMemo(
    () =>
      mockDocuments.filter(
        (d) =>
          d.status === "pending" ||
          d.status === "expiring" ||
          d.status === "expired"
      ),
    []
  );

  const completedOrders = useMemo(
    () => MOCK_ORDERS.filter((o) => o.status === "accepted"),
    []
  );

  // ───── "Требуется действие" items ─────
  const actionItems = useMemo(() => {
    const items: {
      key: string;
      icon: React.ReactNode;
      color: string;
      text: string;
    }[] = [];

    // Urgent/overdue orders
    MOCK_ORDERS.forEach((o) => {
      if (o.status === "cancelled" || o.status === "accepted") return;
      const days = daysUntil(o.deadline);
      if (days < 0) {
        items.push({
          key: `order-overdue-${o.id}`,
          icon: <FireOutlined />,
          color: "#f5222d",
          text: `Заказ ${o.id} "${o.title}" — просрочен на ${Math.abs(days)} дн.`,
        });
      } else if (days <= 3 && o.priority === "urgent") {
        items.push({
          key: `order-urgent-${o.id}`,
          icon: <ExclamationCircleOutlined />,
          color: "#fa541c",
          text: `Срочный заказ ${o.id} "${o.title}" — дедлайн через ${days} дн.`,
        });
      }
    });

    // Lots closing without bids
    MOCK_LOTS.forEach((l) => {
      if (
        (l.status === "published" || l.status === "collecting_bids") &&
        l.bids.length === 0
      ) {
        const days = daysUntil(l.deadline);
        if (days <= 14) {
          items.push({
            key: `lot-nobids-${l.id}`,
            icon: <InboxOutlined />,
            color: "#fa8c16",
            text: `Лот ${l.id} "${l.title}" — закрытие через ${days} дн., нет предложений`,
          });
        }
      }
    });

    // Active disputes
    activeDisputes.forEach((d) => {
      if (d.priority === "critical" || d.priority === "high") {
        items.push({
          key: `dispute-${d.id}`,
          icon: <AlertOutlined />,
          color: "#f5222d",
          text: `Спор ${d.id} "${d.title}" — ${d.status === "escalated" ? "эскалирован" : "требует внимания"}`,
        });
      }
    });

    // Expiring documents
    mockDocuments.forEach((doc) => {
      if (doc.status === "expiring") {
        const days = doc.expiresAt ? daysUntil(doc.expiresAt) : 0;
        items.push({
          key: `doc-expiring-${doc.id}`,
          icon: <FileExclamationOutlined />,
          color: "#fa8c16",
          text: `Документ "${doc.title}" — истекает через ${days} дн.`,
        });
      } else if (doc.status === "expired") {
        items.push({
          key: `doc-expired-${doc.id}`,
          icon: <FileExclamationOutlined />,
          color: "#f5222d",
          text: `Документ "${doc.title}" — просрочен`,
        });
      }
    });

    return items;
  }, [activeDisputes]);

  // ───── Воронка заказов ─────
  const orderFunnel = useMemo(() => {
    const groups: {
      label: string;
      statuses: string[];
      color: string;
    }[] = [
      {
        label: "Ожидает подтверждения",
        statuses: ["pending_confirmation"],
        color: "#fa8c16",
      },
      {
        label: "Подтверждён",
        statuses: ["confirmed"],
        color: "#1677ff",
      },
      {
        label: "В производстве",
        statuses: ["in_production"],
        color: "#722ed1",
      },
      {
        label: "Контроль качества",
        statuses: ["qc_check"],
        color: "#13c2c2",
      },
      {
        label: "Готов / Отправлен",
        statuses: ["ready_to_ship", "shipped"],
        color: "#2f54eb",
      },
      {
        label: "Доставлен",
        statuses: ["delivered"],
        color: "#52c41a",
      },
      {
        label: "Принят",
        statuses: ["accepted"],
        color: "#389e0d",
      },
      {
        label: "Спор",
        statuses: ["disputed"],
        color: "#f5222d",
      },
    ];

    const totalActive = MOCK_ORDERS.filter(
      (o) => o.status !== "cancelled"
    ).length;

    return groups.map((g) => {
      const count = MOCK_ORDERS.filter((o) =>
        g.statuses.includes(o.status)
      ).length;
      return { ...g, count, percent: totalActive > 0 ? Math.round((count / totalActive) * 100) : 0 };
    });
  }, []);

  // ───── Non-draft lots ─────
  const displayLots = useMemo(
    () =>
      MOCK_LOTS.filter((l) => l.status !== "draft").sort(
        (a, b) =>
          new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      ),
    []
  );

  // ───── Ближайшие дедлайны ─────
  const deadlines = useMemo(() => {
    const items: {
      key: string;
      type: "order" | "lot";
      title: string;
      id: string;
      deadline: string;
      status: string;
    }[] = [];

    MOCK_ORDERS.forEach((o) => {
      if (o.status !== "cancelled" && o.status !== "accepted") {
        items.push({
          key: `ord-${o.id}`,
          type: "order",
          title: o.title,
          id: o.id,
          deadline: o.deadline,
          status: o.status,
        });
      }
    });

    MOCK_LOTS.forEach((l) => {
      if (
        l.status !== "draft" &&
        l.status !== "cancelled" &&
        l.status !== "awarded"
      ) {
        items.push({
          key: `lot-${l.id}`,
          type: "lot",
          title: l.title,
          id: l.id,
          deadline: l.deadline,
          status: l.status,
        });
      }
    });

    items.sort(
      (a, b) =>
        new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    );

    return items.slice(0, 8);
  }, []);

  // ───── Здоровье документов ─────
  const docHealth = useMemo(() => {
    const total = mockDocuments.length;
    const valid = mockDocuments.filter((d) => d.status === "valid").length;
    const expiring = mockDocuments.filter((d) => d.status === "expiring").length;
    const expired = mockDocuments.filter((d) => d.status === "expired").length;
    const pending = mockDocuments.filter(
      (d) => d.status === "pending" || d.status === "in_review"
    ).length;
    return { total, valid, expiring, expired, pending };
  }, []);

  // ───── Render ─────
  return (
    <PageContainer
      title="Панель управления"
      subTitle="Обзор закупочной деятельности"
    >
      {/* ── 1. KPI Cards ── */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Card
          size="small"
          style={{ flex: "1 1 200px", minWidth: 200 }}
          hoverable
        >
          <Statistic
            title="Активные лоты"
            value={activeLots.length}
            prefix={<ShoppingCartOutlined />}
            valueStyle={{ color: "#1677ff" }}
          />
        </Card>
        <Card
          size="small"
          style={{ flex: "1 1 200px", minWidth: 200 }}
          hoverable
        >
          <Statistic
            title="Заказы в производстве"
            value={ordersInProduction.length}
            prefix={<ToolOutlined />}
            valueStyle={{ color: "#722ed1" }}
          />
        </Card>
        <Card
          size="small"
          style={{ flex: "1 1 200px", minWidth: 200 }}
          hoverable
        >
          <Statistic
            title="Расходы за месяц"
            value={formatPrice(monthlySpend)}
            prefix={<DollarOutlined />}
            valueStyle={{ color: "#389e0d", fontSize: 22 }}
          />
        </Card>
        <Card
          size="small"
          style={{ flex: "1 1 200px", minWidth: 200 }}
          hoverable
        >
          <Statistic
            title="Новые предложения"
            value={lotsWithPendingBids.length}
            prefix={<BulbOutlined />}
            valueStyle={{ color: "#fa8c16" }}
          />
        </Card>
        <Card
          size="small"
          style={{ flex: "1 1 200px", minWidth: 200 }}
          hoverable
        >
          <Statistic
            title="Открытые споры"
            value={activeDisputes.length}
            prefix={<WarningOutlined />}
            valueStyle={{ color: "#f5222d" }}
          />
        </Card>
        <Card
          size="small"
          style={{ flex: "1 1 200px", minWidth: 200 }}
          hoverable
        >
          <Statistic
            title="Непрочитанные сообщения"
            value={unreadMessages}
            prefix={<MessageOutlined />}
            valueStyle={{ color: "#1677ff" }}
          />
        </Card>
        <Card
          size="small"
          style={{ flex: "1 1 200px", minWidth: 200 }}
          hoverable
        >
          <Statistic
            title="Документы — внимание"
            value={docsAttention.length}
            prefix={<FileProtectOutlined />}
            valueStyle={{ color: "#fa8c16" }}
          />
        </Card>
        <Card
          size="small"
          style={{ flex: "1 1 200px", minWidth: 200 }}
          hoverable
        >
          <Statistic
            title="Завершённые заказы"
            value={completedOrders.length}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: "#52c41a" }}
          />
        </Card>
      </div>

      {/* ── 2. Требуется действие ── */}
      {actionItems.length > 0 && (
        <Card
          title={
            <span>
              <WarningOutlined style={{ color: "#fa8c16", marginRight: 8 }} />
              Требуется действие
            </span>
          }
          style={{ marginBottom: 24 }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {actionItems.map((item) => (
              <div
                key={item.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 16px",
                  borderLeft: `4px solid ${item.color}`,
                  backgroundColor:
                    item.color === "#f5222d"
                      ? "rgba(245,34,45,0.04)"
                      : "rgba(250,140,22,0.04)",
                  borderRadius: "0 6px 6px 0",
                }}
              >
                <span style={{ color: item.color, fontSize: 18 }}>
                  {item.icon}
                </span>
                <Text style={{ flex: 1 }}>{item.text}</Text>
                <ArrowRightOutlined
                  style={{ color: "#bfbfbf", fontSize: 12 }}
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── 3. Воронка заказов ── */}
      <Card
        title="Воронка заказов"
        style={{ marginBottom: 24 }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {orderFunnel.map((stage) => (
            <div
              key={stage.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Text
                style={{
                  width: 180,
                  flexShrink: 0,
                  textAlign: "right",
                  fontSize: 13,
                }}
              >
                {stage.label}
              </Text>
              <div style={{ flex: 1 }}>
                <Progress
                  percent={stage.percent}
                  strokeColor={stage.color}
                  format={() => (
                    <span style={{ fontWeight: 600 }}>{stage.count}</span>
                  )}
                  size="small"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          marginBottom: 24,
        }}
      >
        {/* ── 4. Активные лоты ── */}
        <Card title="Активные лоты">
          <div
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            {displayLots.map((lot) => {
              const statusCfg = LOT_STATUS_CONFIG[lot.status];
              const days = daysUntil(lot.deadline);
              return (
                <div
                  key={lot.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    border: "1px solid #f0f0f0",
                    borderRadius: 8,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 4,
                      }}
                    >
                      <Text strong style={{ fontSize: 12, color: "#8c8c8c" }}>
                        {lot.id}
                      </Text>
                      <Tag color={statusCfg.color}>{statusCfg.label}</Tag>
                    </div>
                    <Text
                      ellipsis
                      style={{ display: "block", fontSize: 13 }}
                    >
                      {lot.title}
                    </Text>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 2,
                      marginLeft: 12,
                      flexShrink: 0,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: days < 0 ? "#f5222d" : days <= 7 ? "#fa8c16" : "#8c8c8c",
                      }}
                    >
                      <ClockCircleOutlined style={{ marginRight: 4 }} />
                      {formatDate(lot.deadline)}
                    </Text>
                    <Badge
                      count={lot.bids.length}
                      showZero
                      style={{
                        backgroundColor:
                          lot.bids.length > 0 ? "#1677ff" : "#d9d9d9",
                      }}
                      overflowCount={99}
                      title="Предложений"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* ── 5. Ближайшие дедлайны ── */}
        <Card title="Ближайшие дедлайны">
          <div
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            {deadlines.map((dl) => {
              const days = daysUntil(dl.deadline);
              const overdue = days < 0;
              const soon = days >= 0 && days <= 5;
              const statusLabel =
                dl.type === "order"
                  ? ORDER_STATUS_CONFIG[dl.status as keyof typeof ORDER_STATUS_CONFIG]?.label ?? dl.status
                  : LOT_STATUS_CONFIG[dl.status as keyof typeof LOT_STATUS_CONFIG]?.label ?? dl.status;
              const statusColor =
                dl.type === "order"
                  ? ORDER_STATUS_CONFIG[dl.status as keyof typeof ORDER_STATUS_CONFIG]?.color ?? "default"
                  : LOT_STATUS_CONFIG[dl.status as keyof typeof LOT_STATUS_CONFIG]?.color ?? "default";

              return (
                <div
                  key={dl.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    border: "1px solid #f0f0f0",
                    borderRadius: 8,
                    borderLeft: overdue
                      ? "4px solid #f5222d"
                      : soon
                        ? "4px solid #fa8c16"
                        : "4px solid #d9d9d9",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 2,
                      }}
                    >
                      <Tag
                        color={
                          dl.type === "order" ? "geekblue" : "purple"
                        }
                        style={{ fontSize: 11 }}
                      >
                        {dl.type === "order" ? "Заказ" : "Лот"}
                      </Tag>
                      <Text
                        strong
                        style={{ fontSize: 12, color: "#8c8c8c" }}
                      >
                        {dl.id}
                      </Text>
                      <Tag color={statusColor} style={{ fontSize: 11 }}>
                        {statusLabel}
                      </Tag>
                    </div>
                    <Text
                      ellipsis
                      style={{ display: "block", fontSize: 13 }}
                    >
                      {dl.title}
                    </Text>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: "right" }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: overdue
                          ? "#f5222d"
                          : soon
                            ? "#fa8c16"
                            : "#595959",
                      }}
                    >
                      {overdue
                        ? `Просрочен ${Math.abs(days)} дн.`
                        : days === 0
                          ? "Сегодня"
                          : `${days} дн.`}
                    </Text>
                    <br />
                    <Text
                      style={{ fontSize: 12, color: "#8c8c8c" }}
                    >
                      {formatDate(dl.deadline)}
                    </Text>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          marginBottom: 24,
        }}
      >
        {/* ── 6. Споры и сообщения ── */}
        <Card title="Споры и сообщения">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            {/* Споры */}
            <Card
              size="small"
              type="inner"
              title={
                <span>
                  <AuditOutlined style={{ marginRight: 6 }} />
                  Споры
                </span>
              }
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Text type="secondary">Активных</Text>
                  <Text strong style={{ color: "#f5222d" }}>
                    {activeDisputes.length}
                  </Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Text type="secondary">Критических</Text>
                  <Text strong style={{ color: "#f5222d" }}>
                    {
                      activeDisputes.filter(
                        (d) => d.priority === "critical"
                      ).length
                    }
                  </Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Text type="secondary">На сумму</Text>
                  <Text strong>
                    {formatPrice(
                      activeDisputes.reduce(
                        (s, d) => s + d.amountInDispute,
                        0
                      )
                    )}
                  </Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Text type="secondary">Решённых</Text>
                  <Text strong style={{ color: "#52c41a" }}>
                    {
                      mockDisputes.filter(
                        (d) =>
                          d.status === "resolved" || d.status === "closed"
                      ).length
                    }
                  </Text>
                </div>
              </div>
            </Card>

            {/* Сообщения */}
            <Card
              size="small"
              type="inner"
              title={
                <span>
                  <MessageOutlined style={{ marginRight: 6 }} />
                  Сообщения
                </span>
              }
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Text type="secondary">Диалогов</Text>
                  <Text strong>{MOCK_CONVERSATIONS.length}</Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Text type="secondary">Непрочитанных</Text>
                  <Text
                    strong
                    style={{
                      color: unreadMessages > 0 ? "#1677ff" : undefined,
                    }}
                  >
                    {unreadMessages}
                  </Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Text type="secondary">Активных</Text>
                  <Text strong>
                    {
                      MOCK_CONVERSATIONS.filter(
                        (c) => c.status === "active"
                      ).length
                    }
                  </Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Text type="secondary">С ответом ожидается</Text>
                  <Text strong style={{ color: "#fa8c16" }}>
                    {
                      MOCK_CONVERSATIONS.filter(
                        (c) => c.unreadCount > 0
                      ).length
                    }
                  </Text>
                </div>
              </div>
            </Card>
          </div>
        </Card>

        {/* ── 7. Здоровье документов ── */}
        <Card
          title={
            <span>
              <SafetyCertificateOutlined style={{ marginRight: 8 }} />
              Здоровье документов
            </span>
          }
        >
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                height: 28,
                borderRadius: 6,
                overflow: "hidden",
                marginBottom: 12,
              }}
            >
              {docHealth.valid > 0 && (
                <div
                  style={{
                    width: `${(docHealth.valid / docHealth.total) * 100}%`,
                    backgroundColor: "#52c41a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {docHealth.valid}
                </div>
              )}
              {docHealth.expiring > 0 && (
                <div
                  style={{
                    width: `${(docHealth.expiring / docHealth.total) * 100}%`,
                    backgroundColor: "#fa8c16",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {docHealth.expiring}
                </div>
              )}
              {docHealth.expired > 0 && (
                <div
                  style={{
                    width: `${(docHealth.expired / docHealth.total) * 100}%`,
                    backgroundColor: "#f5222d",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {docHealth.expired}
                </div>
              )}
              {docHealth.pending > 0 && (
                <div
                  style={{
                    width: `${(docHealth.pending / docHealth.total) * 100}%`,
                    backgroundColor: "#1677ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {docHealth.pending}
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    backgroundColor: "#52c41a",
                    display: "inline-block",
                  }}
                />
                <Text style={{ fontSize: 13 }}>
                  Действительных: {docHealth.valid}
                </Text>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    backgroundColor: "#fa8c16",
                    display: "inline-block",
                  }}
                />
                <Text style={{ fontSize: 13 }}>
                  Истекающих: {docHealth.expiring}
                </Text>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    backgroundColor: "#f5222d",
                    display: "inline-block",
                  }}
                />
                <Text style={{ fontSize: 13 }}>
                  Просроченных: {docHealth.expired}
                </Text>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    backgroundColor: "#1677ff",
                    display: "inline-block",
                  }}
                />
                <Text style={{ fontSize: 13 }}>
                  Ожидают / На проверке: {docHealth.pending}
                </Text>
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {mockDocuments
              .filter(
                (d) =>
                  d.status === "expiring" ||
                  d.status === "expired" ||
                  d.status === "pending"
              )
              .map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 10px",
                    borderRadius: 6,
                    backgroundColor:
                      doc.status === "expired"
                        ? "rgba(245,34,45,0.04)"
                        : doc.status === "expiring"
                          ? "rgba(250,140,22,0.04)"
                          : "rgba(22,119,255,0.04)",
                  }}
                >
                  <Text ellipsis style={{ flex: 1, fontSize: 13 }}>
                    {doc.title}
                  </Text>
                  <Tag
                    color={
                      doc.status === "expired"
                        ? "red"
                        : doc.status === "expiring"
                          ? "orange"
                          : "blue"
                    }
                    style={{ marginLeft: 8, flexShrink: 0 }}
                  >
                    {doc.status === "expired"
                      ? "Просрочен"
                      : doc.status === "expiring"
                        ? `Истекает ${doc.expiresAt ? formatDate(doc.expiresAt) : ""}`
                        : "Ожидает"}
                  </Tag>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
