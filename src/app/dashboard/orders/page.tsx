"use client";

import { useState, useMemo, useEffect } from "react";
import { PageContainer } from "@ant-design/pro-components";
import {
  Card,
  Tag,
  Typography,
  Empty,
  Descriptions,
  Input,
  Select,
  Statistic,
  Progress,
  Steps,
  theme,
} from "antd";
import {
  SearchOutlined,
  ClockCircleOutlined,
  ShoppingCartOutlined,
  PlayCircleOutlined,
  CheckSquareOutlined,
  ToolOutlined,
  DollarOutlined,
  StarFilled,
  CalendarOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import {
  MOCK_ORDERS,
  ORDER_STATUS_CONFIG,
  ORDER_PRIORITY_CONFIG,
  type BuyerOrder,
  type OrderStatus,
} from "@/lib/orders-mock-data";
import ModelPreview from "@/components/ModelViewer/ModelPreview";
import "./orders.css";

const { Text, Title, Paragraph } = Typography;

// --- Helpers ---

function formatPrice(n: number): string {
  return n.toLocaleString("ru-RU") + " \u20BD";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU");
}

function getDaysLeft(deadline: string): { text: string; days: number; urgent: boolean } {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dl = new Date(deadline);
  dl.setHours(0, 0, 0, 0);
  const diff = dl.getTime() - now.getTime();
  const days = Math.round(diff / (1000 * 60 * 60 * 24));

  if (days < 0) {
    return { text: `${Math.abs(days)}д просрочено`, days, urgent: true };
  }
  if (days === 0) {
    return { text: "Сегодня", days, urgent: true };
  }
  return { text: `${days}д осталось`, days, urgent: days <= 3 };
}

// --- Status timeline for order ---

const STATUS_TIMELINE: OrderStatus[] = [
  "pending_confirmation",
  "confirmed",
  "in_production",
  "qc_check",
  "ready_to_ship",
  "shipped",
  "delivered",
  "accepted",
];

function getStepStatus(
  orderStatus: OrderStatus,
  stepStatus: OrderStatus
): "finish" | "process" | "wait" | "error" {
  if (orderStatus === "cancelled") return "wait";
  if (orderStatus === "disputed") {
    const orderIdx = STATUS_TIMELINE.indexOf("delivered");
    const stepIdx = STATUS_TIMELINE.indexOf(stepStatus);
    if (stepIdx < orderIdx) return "finish";
    if (stepIdx === orderIdx) return "error";
    return "wait";
  }
  const orderIdx = STATUS_TIMELINE.indexOf(orderStatus);
  const stepIdx = STATUS_TIMELINE.indexOf(stepStatus);
  if (stepIdx < orderIdx) return "finish";
  if (stepIdx === orderIdx) return "process";
  return "wait";
}

// --- Order Card ---

function OrderCard({
  order,
  selected,
  onClick,
}: {
  order: BuyerOrder;
  selected: boolean;
  onClick: () => void;
}) {
  const statusCfg = ORDER_STATUS_CONFIG[order.status];
  const priorityCfg = ORDER_PRIORITY_CONFIG[order.priority];
  const deadline = getDaysLeft(order.deadline);

  return (
    <Card
      size="small"
      className={`order-card${selected ? " order-card-selected" : ""}`}
      onClick={onClick}
      styles={{ body: { padding: "12px 16px" } }}
    >
      <div style={{ display: "flex", gap: 12 }}>
        {/* Left: main info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 6,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <Text type="secondary" style={{ fontSize: 11 }}>
                {order.id}
              </Text>
              <div>
                <Text strong style={{ fontSize: 14 }}>
                  {order.title}
                </Text>
              </div>
            </div>
            <Tag
              color={statusCfg.color}
              style={{ marginLeft: 8, flexShrink: 0 }}
            >
              {statusCfg.label}
            </Tag>
          </div>

          <div
            style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}
          >
            <Tag color={priorityCfg.color} style={{ margin: 0 }}>
              {priorityCfg.label}
            </Tag>
            <Tag style={{ margin: 0 }}>{order.technology}</Tag>
            {order.toleranceGrade && (
              <Tag color="purple" style={{ margin: 0 }}>
                {order.toleranceGrade}
              </Tag>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 12,
            }}
          >
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {order.supplierName}
              </Text>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {formatDate(order.deadline)}
              </Text>
              <Tag
                color={deadline.urgent ? "red" : "blue"}
                style={{ margin: 0, fontSize: 11 }}
              >
                <ClockCircleOutlined style={{ marginRight: 3 }} />
                {deadline.text}
              </Tag>
            </div>
          </div>
        </div>

        {/* Right: price badge */}
        <div
          className="order-card-badge"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            minWidth: 64,
            padding: "8px 10px",
            borderRadius: 8,
          }}
        >
          <span
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#f59e0b",
              lineHeight: 1,
            }}
          >
            {formatPrice(order.totalPrice)}
          </span>
          <span style={{ fontSize: 13, color: "#1677ff", marginTop: 4 }}>
            {order.quantity.toLocaleString("ru-RU")} {order.unit}
          </span>
        </div>
      </div>
    </Card>
  );
}

// --- Detail Panel ---

function OrderDetailPanel({ order }: { order: BuyerOrder }) {
  const { token } = theme.useToken();
  const statusCfg = ORDER_STATUS_CONFIG[order.status];
  const priorityCfg = ORDER_PRIORITY_CONFIG[order.priority];
  const deadline = getDaysLeft(order.deadline);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
          <Tag color={statusCfg.color}>{statusCfg.label}</Tag>
          <Tag color={priorityCfg.color}>{priorityCfg.label}</Tag>
          <Tag>{order.technology}</Tag>
          {order.toleranceGrade && <Tag color="purple">{order.toleranceGrade}</Tag>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {order.id}
          </Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            &middot;
          </Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            Создан {formatDate(order.createdAt)}
          </Text>
        </div>
        <Title level={5} style={{ margin: 0 }}>
          {order.title}
        </Title>
      </div>

      {/* Description */}
      <div
        style={{
          padding: "12px 0",
          borderTop: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
          Описание
        </Text>
        <Paragraph style={{ margin: 0, fontSize: 13 }}>{order.description}</Paragraph>
      </div>

      {/* Technical Specifications */}
      <div
        style={{
          padding: "12px 0",
          borderTop: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Text strong style={{ fontSize: 13, display: "block", marginBottom: 8 }}>
          Технические характеристики
        </Text>
        <Descriptions column={2} size="small" colon={false}>
          <Descriptions.Item label="Технология">
            <Tag>{order.technology}</Tag>
          </Descriptions.Item>
          {order.material && (
            <Descriptions.Item label="Материал">{order.material}</Descriptions.Item>
          )}
          <Descriptions.Item label="Количество">
            {order.quantity.toLocaleString("ru-RU")} {order.unit}
          </Descriptions.Item>
          {order.toleranceGrade && (
            <Descriptions.Item label="Допуск">
              <Tag color="purple">{order.toleranceGrade}</Tag>
            </Descriptions.Item>
          )}
        </Descriptions>
      </div>

      {/* Supplier info */}
      <div
        style={{
          padding: "12px 0",
          borderTop: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Text strong style={{ fontSize: 13, display: "block", marginBottom: 8 }}>
          Поставщик
        </Text>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Text style={{ fontSize: 14, fontWeight: 500 }}>{order.supplierName}</Text>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <StarFilled
                key={i}
                style={{
                  fontSize: 14,
                  color: i < Math.round(order.supplierRating) ? "#faad14" : "#d9d9d9",
                }}
              />
            ))}
            <Text type="secondary" style={{ fontSize: 12, marginLeft: 4 }}>
              {order.supplierRating.toFixed(1)}
            </Text>
          </span>
        </div>
      </div>

      {/* Production progress */}
      <div
        style={{
          padding: "12px 0",
          borderTop: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Text strong style={{ fontSize: 13, display: "block", marginBottom: 8 }}>
          Прогресс производства
        </Text>
        <Progress
          percent={order.progressPercent}
          status={
            order.status === "cancelled"
              ? "exception"
              : order.progressPercent === 100
                ? "success"
                : "active"
          }
          strokeColor={
            order.progressPercent === 100
              ? "#52c41a"
              : {
                  "0%": "#1677ff",
                  "100%": "#52c41a",
                }
          }
          format={(percent) => `${percent}%`}
        />
      </div>

      {/* Status timeline */}
      <div
        style={{
          padding: "12px 0",
          borderTop: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Text strong style={{ fontSize: 13, display: "block", marginBottom: 8 }}>
          Хронология статусов
        </Text>
        {order.status === "cancelled" ? (
          <Tag color="default" style={{ fontSize: 13 }}>
            Заказ отменён
          </Tag>
        ) : (
          <Steps
            direction="vertical"
            size="small"
            current={STATUS_TIMELINE.indexOf(order.status)}
            items={STATUS_TIMELINE.map((step) => ({
              title: ORDER_STATUS_CONFIG[step].label,
              status: getStepStatus(order.status, step),
            }))}
          />
        )}
      </div>

      {/* Related lot */}
      {order.lotId && (
        <div
          style={{
            padding: "12px 0",
            borderTop: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <LinkOutlined style={{ marginRight: 6, color: "#1677ff" }} />
          <Text style={{ fontSize: 13 }}>
            Связанный лот: <Text strong>{order.lotId}</Text>
          </Text>
        </div>
      )}

      {/* Deadline */}
      <div
        style={{
          padding: "12px 0",
          borderTop: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Text strong style={{ fontSize: 13, display: "block", marginBottom: 8 }}>
          Сроки
        </Text>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CalendarOutlined style={{ color: "#1677ff", fontSize: 13 }} />
            <Text type="secondary" style={{ fontSize: 12, width: 80 }}>
              Создан
            </Text>
            <Text style={{ fontSize: 13 }}>{formatDate(order.createdAt)}</Text>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ClockCircleOutlined
              style={{
                color: deadline.urgent ? "#ff4d4f" : "#fa8c16",
                fontSize: 13,
              }}
            />
            <Text type="secondary" style={{ fontSize: 12, width: 80 }}>
              Дедлайн
            </Text>
            <Text style={{ fontSize: 13 }}>{formatDate(order.deadline)}</Text>
            <Tag color={deadline.urgent ? "red" : "blue"} style={{ margin: 0 }}>
              {deadline.text}
            </Tag>
          </div>
        </div>
      </div>

      {/* Price */}
      <div
        style={{
          padding: "12px 0",
          borderTop: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Text strong style={{ fontSize: 13, display: "block", marginBottom: 8 }}>
          Стоимость
        </Text>
        <Text strong style={{ fontSize: 20, color: "#f59e0b" }}>
          {formatPrice(order.totalPrice)}
        </Text>
      </div>

      {/* 3D Model Preview */}
      {order.modelUrl && <ModelPreview modelUrl={order.modelUrl} />}
    </div>
  );
}

// --- Empty State ---

function EmptyState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        minHeight: 400,
        gap: 24,
      }}
    >
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <Text type="secondary">Выберите заказ для просмотра деталей</Text>
        }
      />
    </div>
  );
}

// --- Main Page ---

export default function OrdersPage() {
  const [orders] = useState<BuyerOrder[]>(MOCK_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [techFilter, setTechFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [dark, setDark] = useState(false);

  // Dark mode detection via MutationObserver
  useEffect(() => {
    const root = document.documentElement;
    setDark(root.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setDark(root.classList.contains("dark"));
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Unique technologies for filter
  const technologies = useMemo(() => {
    const techs = new Set(orders.map((o) => o.technology));
    return Array.from(techs).sort();
  }, [orders]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (statusFilter !== "all" && order.status !== statusFilter) return false;
      if (techFilter !== "all" && order.technology !== techFilter) return false;
      if (priorityFilter !== "all" && order.priority !== priorityFilter) return false;
      if (
        searchText &&
        !order.title.toLowerCase().includes(searchText.toLowerCase()) &&
        !order.id.toLowerCase().includes(searchText.toLowerCase())
      )
        return false;
      return true;
    });
  }, [orders, statusFilter, techFilter, priorityFilter, searchText]);

  // Stats
  const stats = useMemo(() => {
    const total = orders.length;
    const active = orders.filter(
      (o) =>
        o.status !== "accepted" &&
        o.status !== "cancelled" &&
        o.status !== "delivered"
    ).length;
    const inProduction = orders.filter(
      (o) => o.status === "in_production"
    ).length;
    const completed = orders.filter(
      (o) => o.status === "accepted"
    ).length;
    const totalValue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

    return { total, active, inProduction, completed, totalValue };
  }, [orders]);

  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === selectedOrderId) ?? null,
    [orders, selectedOrderId]
  );

  // Filter options
  const statusOptions = [
    { value: "all", label: "Все статусы" },
    ...Object.entries(ORDER_STATUS_CONFIG).map(([key, cfg]) => ({
      value: key,
      label: cfg.label,
    })),
  ];

  const techOptions = [
    { value: "all", label: "Все технологии" },
    ...technologies.map((t) => ({ value: t, label: t })),
  ];

  const priorityOptions = [
    { value: "all", label: "Все приоритеты" },
    ...Object.entries(ORDER_PRIORITY_CONFIG).map(([key, cfg]) => ({
      value: key,
      label: cfg.label,
    })),
  ];

  return (
    <PageContainer title={false}>
      {/* Two-column layout */}
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "stretch",
          height: "calc(100vh - 140px)",
        }}
      >
        {/* Left column — Order list */}
        <div
          style={{
            flex: "0 0 45%",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Filters */}
          <Card
            size="small"
            style={{ marginBottom: 12, borderRadius: 8 }}
            styles={{ body: { padding: "12px 16px" } }}
          >
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 8,
              }}
            >
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                options={statusOptions}
                style={{ minWidth: 170 }}
                size="small"
              />
              <Select
                value={techFilter}
                onChange={setTechFilter}
                options={techOptions}
                style={{ minWidth: 160 }}
                size="small"
              />
              <Select
                value={priorityFilter}
                onChange={setPriorityFilter}
                options={priorityOptions}
                style={{ minWidth: 140 }}
                size="small"
              />
            </div>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Поиск заказов..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              size="small"
            />
          </Card>

          {/* Order list */}
          <div
            className="order-list"
            style={{
              flex: 1,
              overflowY: "auto",
              paddingRight: 4,
            }}
          >
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  selected={selectedOrderId === order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                />
              ))
            ) : (
              <Card style={{ borderRadius: 8 }}>
                <Empty description="Нет заказов, соответствующих фильтрам" />
              </Card>
            )}
          </div>
        </div>

        {/* Right column — Stats + Detail panel */}
        <div
          style={{
            flex: "1 1 55%",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Stats bar */}
          <Card
            size="small"
            style={{ marginBottom: 12, borderRadius: 8 }}
            styles={{ body: { padding: "8px 16px" } }}
          >
            <div
              style={{
                display: "flex",
                gap: 24,
                flexWrap: "wrap",
                justifyContent: "flex-end",
              }}
            >
              <Statistic
                title={<Text style={{ fontSize: 11 }}>Всего заказов</Text>}
                value={stats.total}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ fontSize: 18 }}
              />
              <Statistic
                title={<Text style={{ fontSize: 11 }}>Активные</Text>}
                value={stats.active}
                prefix={<PlayCircleOutlined />}
                valueStyle={{ fontSize: 18, color: "#1677ff" }}
              />
              <Statistic
                title={<Text style={{ fontSize: 11 }}>В производстве</Text>}
                value={stats.inProduction}
                prefix={<ToolOutlined />}
                valueStyle={{ fontSize: 18, color: "#fa8c16" }}
              />
              <Statistic
                title={<Text style={{ fontSize: 11 }}>Завершённые</Text>}
                value={stats.completed}
                prefix={<CheckSquareOutlined />}
                valueStyle={{ fontSize: 18, color: "#52c41a" }}
              />
              <Statistic
                title={<Text style={{ fontSize: 11 }}>Общая стоимость</Text>}
                value={stats.totalValue}
                prefix={<DollarOutlined />}
                formatter={(val) =>
                  Number(val).toLocaleString("ru-RU") + " \u20BD"
                }
                valueStyle={{ fontSize: 18, color: "#f59e0b" }}
              />
            </div>
          </Card>

          {/* Detail panel */}
          <Card
            style={{ borderRadius: 8, flex: 1, overflow: "auto" }}
            styles={{ body: { padding: 20 } }}
          >
            {selectedOrder ? (
              <OrderDetailPanel order={selectedOrder} />
            ) : (
              <EmptyState />
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
