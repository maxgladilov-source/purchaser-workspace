"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { PageContainer } from "@ant-design/pro-components";
import {
  Card,
  Tag,
  Typography,
  Empty,
  Input,
  Select,
  Statistic,
  Badge,
  Divider,
} from "antd";
import {
  SearchOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  LinkOutlined,
  CalendarOutlined,
  PaperClipOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  FireOutlined,
  AuditOutlined,
  MessageOutlined,
  SendOutlined,
} from "@ant-design/icons";
import {
  mockDisputes,
  DISPUTE_STATUS_CONFIG,
  DISPUTE_TYPE_CONFIG,
  DISPUTE_PRIORITY_CONFIG,
  type Dispute,
  type DisputeStatus,
  type DisputeType,
  type DisputePriority,
  type DisputeMessage,
} from "@/lib/disputes-mock-data";
import "./disputes.css";

const { Text, Title, Paragraph } = Typography;

// --- Helpers ---

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" })} ${d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}`;
}

function timeAgo(iso: string): string {
  const now = new Date();
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffH < 1) return "Только что";
  if (diffH < 24) return `${diffH} ч. назад`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "1 день назад";
  if (diffD < 5) return `${diffD} дня назад`;
  return `${diffD} дней назад`;
}

function getDaysUntil(iso: string): { text: string; days: number; urgent: boolean } {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dl = new Date(iso);
  dl.setHours(0, 0, 0, 0);
  const diff = dl.getTime() - now.getTime();
  const days = Math.round(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return { text: `просрочено ${Math.abs(days)} дн.`, days, urgent: true };
  if (days === 0) return { text: "Сегодня", days, urgent: true };
  if (days === 1) return { text: "1 день", days, urgent: true };
  if (days < 5) return { text: `${days} дня`, days, urgent: days <= 3 };
  return { text: `${days} дн.`, days, urgent: days <= 3 };
}

// --- Type icon mapping ---

const DISPUTE_TYPE_ICON: Record<DisputeType, React.ReactNode> = {
  quality: <ExclamationCircleOutlined />,
  delivery: <ClockCircleOutlined />,
  spec_mismatch: <FileTextOutlined />,
  quantity: <AuditOutlined />,
  documentation: <SafetyCertificateOutlined />,
};

// --- Dispute Card ---

function DisputeCard({
  dispute,
  selected,
  onClick,
}: {
  dispute: Dispute;
  selected: boolean;
  onClick: () => void;
}) {
  const statusCfg = DISPUTE_STATUS_CONFIG[dispute.status];
  const priorityCfg = DISPUTE_PRIORITY_CONFIG[dispute.priority];
  const typeCfg = DISPUTE_TYPE_CONFIG[dispute.type];
  const deadline = getDaysUntil(dispute.resolutionDeadline);
  const isActive = dispute.status !== "resolved" && dispute.status !== "closed";

  return (
    <Card
      size="small"
      className={`dispute-card${selected ? " dispute-card-selected" : ""}`}
      onClick={onClick}
      styles={{ body: { padding: "12px 16px" } }}
    >
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Top row: ID + status */}
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
                {dispute.id} &middot; {dispute.orderId}
              </Text>
              <div>
                <Text strong style={{ fontSize: 14, lineHeight: 1.3 }}>
                  {dispute.title}
                </Text>
              </div>
            </div>
            <Tag color={statusCfg.color} style={{ marginLeft: 8, flexShrink: 0 }}>
              {statusCfg.label}
            </Tag>
          </div>

          {/* Tags row */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
            <Tag color={priorityCfg.color} style={{ margin: 0 }}>
              {priorityCfg.label}
            </Tag>
            <Tag
              icon={DISPUTE_TYPE_ICON[dispute.type]}
              style={{ margin: 0, color: typeCfg.color, borderColor: typeCfg.color }}
            >
              {typeCfg.label}
            </Tag>
          </div>

          {/* Bottom row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 12,
            }}
          >
            <Text type="secondary" style={{ fontSize: 12 }}>
              {dispute.filedBy}
            </Text>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span>
                <MessageOutlined style={{ marginRight: 4, fontSize: 11 }} />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {dispute.messages.length}
                </Text>
              </span>
              <span>
                <PaperClipOutlined style={{ marginRight: 4, fontSize: 11 }} />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {dispute.evidenceCount}
                </Text>
              </span>
              {isActive && (
                <span>
                  <ClockCircleOutlined
                    style={{
                      marginRight: 4,
                      fontSize: 11,
                      color: deadline.urgent ? "#ff4d4f" : undefined,
                    }}
                  />
                  <Text
                    type={deadline.urgent ? "danger" : "secondary"}
                    style={{ fontSize: 12 }}
                  >
                    {deadline.text}
                  </Text>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: amount badge */}
        {dispute.amountInDispute > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              minWidth: 64,
              padding: "8px 10px",
              borderRadius: 8,
              background: "rgba(245, 34, 45, 0.06)",
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 700, color: "#f5222d", lineHeight: 1 }}>
              {dispute.amountInDispute.toLocaleString("ru-RU")} {dispute.currency}
            </span>
            <span style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>
              в споре
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}

// --- Message Bubble ---

function MessageBubble({ msg }: { msg: DisputeMessage }) {
  const isUser = msg.role === "buyer";
  const isSystem = msg.role === "system";
  const isOperator = msg.role === "operator";

  if (isSystem) {
    return (
      <div style={{ textAlign: "center", margin: "12px 0" }}>
        <Text
          type="secondary"
          style={{
            fontSize: 12,
            fontStyle: "italic",
            border: "1px dashed var(--ant-color-border, #d9d9d9)",
            padding: "4px 12px",
            borderRadius: 12,
          }}
        >
          {msg.text}
        </Text>
        <div>
          <Text type="secondary" style={{ fontSize: 10 }}>
            {formatDateTime(msg.timestamp)}
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 12,
      }}
    >
      <div
        style={{
          maxWidth: "75%",
          padding: "8px 12px",
          borderRadius: 12,
          background: isUser
            ? "var(--ant-color-primary, #1677ff)"
            : "transparent",
          color: isUser ? "#fff" : "inherit",
          border: isUser ? "none" : "1px solid var(--ant-color-border, #d9d9d9)",
        }}
      >
        <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
          <Text
            strong
            style={{
              fontSize: 12,
              color: isUser ? "rgba(255,255,255,0.85)" : undefined,
            }}
          >
            {msg.author}
          </Text>
          {isOperator && (
            <Tag color="blue" style={{ margin: 0, fontSize: 10, lineHeight: "16px", padding: "0 4px" }}>
              Медиатор
            </Tag>
          )}
        </div>
        <div
          style={{
            fontSize: 13,
            lineHeight: 1.5,
            color: isUser ? "#fff" : undefined,
          }}
        >
          {msg.text}
        </div>
        <div style={{ textAlign: "right", marginTop: 4 }}>
          <Text
            style={{
              fontSize: 10,
              color: isUser ? "rgba(255,255,255,0.6)" : undefined,
              opacity: isUser ? 1 : 0.5,
            }}
          >
            {formatDateTime(msg.timestamp)}
          </Text>
        </div>
      </div>
    </div>
  );
}

// --- Detail Panel ---

function DisputeDetailPanel({ dispute }: { dispute: Dispute }) {
  const statusCfg = DISPUTE_STATUS_CONFIG[dispute.status];
  const priorityCfg = DISPUTE_PRIORITY_CONFIG[dispute.priority];
  const typeCfg = DISPUTE_TYPE_CONFIG[dispute.type];
  const deadline = getDaysUntil(dispute.resolutionDeadline);
  const isActive = dispute.status !== "resolved" && dispute.status !== "closed";
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dispute.id]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
          <Tag color={statusCfg.color}>{statusCfg.label}</Tag>
          <Tag color={priorityCfg.color}>{priorityCfg.label}</Tag>
          <Tag
            icon={DISPUTE_TYPE_ICON[dispute.type]}
            style={{ color: typeCfg.color, borderColor: typeCfg.color }}
          >
            {typeCfg.label}
          </Tag>
        </div>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {dispute.id}
        </Text>
        <Title level={5} style={{ margin: 0 }}>
          {dispute.title}
        </Title>
      </div>

      {/* Dispute Info */}
      <div
        style={{
          padding: "12px 0",
          borderTop: "1px solid var(--ant-color-border, #f0f0f0)",
        }}
      >
        <Text strong style={{ fontSize: 13, display: "block", marginBottom: 8 }}>
          Детали спора
        </Text>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px", fontSize: 13 }}>
          <div>
            <Text type="secondary">Связанный заказ</Text>
            <div>
              <LinkOutlined style={{ marginRight: 4, color: "#1677ff" }} />
              <Text strong>{dispute.orderId}</Text>
              <Text type="secondary"> — {dispute.orderTitle}</Text>
            </div>
          </div>
          <div>
            <Text type="secondary">Подано</Text>
            <div>
              <UserOutlined style={{ marginRight: 4 }} />
              {dispute.filedBy}
            </div>
          </div>
          <div>
            <Text type="secondary">Подана</Text>
            <div>{formatDate(dispute.filedAt)}</div>
          </div>
          <div>
            <Text type="secondary">Последнее обновление</Text>
            <div>{timeAgo(dispute.updatedAt)}</div>
          </div>
          <div>
            <Text type="secondary">Сумма спора</Text>
            <div style={{ fontWeight: 600, color: dispute.amountInDispute > 0 ? "#f5222d" : undefined }}>
              {dispute.amountInDispute > 0
                ? `${dispute.amountInDispute.toLocaleString("ru-RU")} ${dispute.currency}`
                : "\u2014"}
            </div>
          </div>
          <div>
            <Text type="secondary">Медиатор</Text>
            <div>
              <SafetyCertificateOutlined style={{ marginRight: 4, color: "#1677ff" }} />
              {dispute.assignedMediator}
            </div>
          </div>
          <div>
            <Text type="secondary">Доказательства</Text>
            <div>
              <PaperClipOutlined style={{ marginRight: 4 }} />
              {dispute.evidenceCount} файл.
            </div>
          </div>
          <div>
            <Text type="secondary">Крайний срок</Text>
            <div>
              <CalendarOutlined style={{ marginRight: 4 }} />
              {formatDate(dispute.resolutionDeadline)}
              {isActive && (
                <Tag
                  color={deadline.urgent ? "red" : "blue"}
                  style={{ marginLeft: 6 }}
                >
                  {deadline.text}
                </Tag>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div
        style={{
          padding: "12px 0",
          borderTop: "1px solid var(--ant-color-border, #f0f0f0)",
        }}
      >
        <Text strong style={{ fontSize: 13, display: "block", marginBottom: 8 }}>
          Описание
        </Text>
        <Paragraph style={{ margin: 0, fontSize: 13 }}>
          {dispute.description}
        </Paragraph>
      </div>

      {/* Resolution (if resolved) */}
      {dispute.resolution && (
        <div
          style={{
            padding: "12px 0",
            borderTop: "1px solid var(--ant-color-border, #f0f0f0)",
          }}
        >
          <Text strong style={{ fontSize: 13, display: "block", marginBottom: 8 }}>
            <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 6 }} />
            Решение
          </Text>
          <div
            style={{
              padding: "10px 14px",
              background: "rgba(82, 196, 26, 0.06)",
              borderRadius: 8,
              border: "1px solid rgba(82, 196, 26, 0.2)",
              fontSize: 13,
            }}
          >
            {dispute.resolution}
          </div>
        </div>
      )}

      {/* Message Thread */}
      <div
        style={{
          padding: "12px 0",
          borderTop: "1px solid var(--ant-color-border, #f0f0f0)",
        }}
      >
        <Text strong style={{ fontSize: 13, display: "block", marginBottom: 8 }}>
          <MessageOutlined style={{ marginRight: 6 }} />
          Обсуждение ({dispute.messages.length} сообщ.)
        </Text>
        <div
          className="dispute-messages"
          style={{
            maxHeight: 360,
            overflowY: "auto",
            padding: "8px 4px",
          }}
        >
          {dispute.messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply input (for active disputes) */}
        {isActive && (
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <Input.TextArea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Введите ответ..."
              autoSize={{ minRows: 1, maxRows: 3 }}
              style={{ flex: 1 }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  setReplyText("");
                }
              }}
            />
            <button
              onClick={() => setReplyText("")}
              disabled={!replyText.trim()}
              style={{
                background: replyText.trim() ? "#1677ff" : "#d9d9d9",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "0 16px",
                cursor: replyText.trim() ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 14,
              }}
            >
              <SendOutlined />
            </button>
          </div>
        )}
      </div>
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
          <Text type="secondary">Выберите спор для просмотра деталей</Text>
        }
      />
      <div style={{ textAlign: "center", maxWidth: 360 }}>
        <Divider style={{ margin: "0 0 16px" }} />
        <Text type="secondary" style={{ fontSize: 12 }}>
          <WarningOutlined style={{ color: "#faad14", marginRight: 6 }} />
          <strong>Качество</strong> — дефекты, неверный материал, проблемы с покрытием
        </Text>
        <br />
        <Text type="secondary" style={{ fontSize: 12 }}>
          <ClockCircleOutlined style={{ color: "#fa8c16", marginRight: 6 }} />
          <strong>Задержка доставки</strong> — просроченная отгрузка, нарушение сроков
        </Text>
        <br />
        <Text type="secondary" style={{ fontSize: 12 }}>
          <FileTextOutlined style={{ color: "#722ed1", marginRight: 6 }} />
          <strong>Несоответствие ТЗ</strong> — детали не соответствуют чертежам
        </Text>
        <br />
        <Text type="secondary" style={{ fontSize: 12 }}>
          <AuditOutlined style={{ color: "#1677ff", marginRight: 6 }} />
          <strong>Количество</strong> — неверное количество в поставке
        </Text>
        <br />
        <Text type="secondary" style={{ fontSize: 12 }}>
          <SafetyCertificateOutlined style={{ color: "#13c2c2", marginRight: 6 }} />
          <strong>Документация</strong> — отсутствуют сертификаты или отчёты
        </Text>
      </div>
    </div>
  );
}

// --- Main Page ---

export default function DisputesPage() {
  const [disputes] = useState<Dispute[]>(mockDisputes);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  // Filter disputes
  const filteredDisputes = useMemo(() => {
    return disputes.filter((d) => {
      if (statusFilter !== "all" && d.status !== statusFilter) return false;
      if (typeFilter !== "all" && d.type !== typeFilter) return false;
      if (priorityFilter !== "all" && d.priority !== priorityFilter) return false;
      if (
        searchText &&
        !d.title.toLowerCase().includes(searchText.toLowerCase()) &&
        !d.id.toLowerCase().includes(searchText.toLowerCase()) &&
        !d.orderId.toLowerCase().includes(searchText.toLowerCase())
      )
        return false;
      return true;
    });
  }, [disputes, statusFilter, typeFilter, priorityFilter, searchText]);

  // Stats
  const stats = useMemo(() => {
    const total = disputes.length;
    const active = disputes.filter(
      (d) => d.status !== "resolved" && d.status !== "closed"
    ).length;
    const critical = disputes.filter(
      (d) =>
        (d.priority === "critical" || d.status === "escalated") &&
        d.status !== "resolved" &&
        d.status !== "closed"
    ).length;
    const resolved = disputes.filter((d) => d.status === "resolved").length;
    const totalAmount = disputes
      .filter((d) => d.status !== "resolved" && d.status !== "closed")
      .reduce((sum, d) => sum + d.amountInDispute, 0);
    const awaitingResponse = disputes.filter(
      (d) => d.status === "awaiting_evidence" || d.status === "open"
    ).length;
    return { total, active, critical, resolved, totalAmount, awaitingResponse };
  }, [disputes]);

  const selectedDispute = useMemo(
    () => disputes.find((d) => d.id === selectedId) ?? null,
    [disputes, selectedId]
  );

  // Filter options
  const statusOptions = [
    { value: "all", label: "Все статусы" },
    ...Object.entries(DISPUTE_STATUS_CONFIG).map(([key, cfg]) => ({
      value: key,
      label: cfg.label,
    })),
  ];

  const typeOptions = [
    { value: "all", label: "Все типы" },
    ...Object.entries(DISPUTE_TYPE_CONFIG).map(([key, cfg]) => ({
      value: key,
      label: cfg.label,
    })),
  ];

  const priorityOptions = [
    { value: "all", label: "Все приоритеты" },
    ...Object.entries(DISPUTE_PRIORITY_CONFIG).map(([key, cfg]) => ({
      value: key,
      label: cfg.label,
    })),
  ];

  return (
    <PageContainer title={false}>
      <div style={{ display: "flex", gap: 16, alignItems: "stretch", height: "calc(100vh - 140px)" }}>
        {/* Left column — Dispute list */}
        <div style={{ flex: "0 0 45%", minWidth: 0, display: "flex", flexDirection: "column" }}>
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
                style={{ minWidth: 140 }}
                size="small"
              />
              <Select
                value={typeFilter}
                onChange={setTypeFilter}
                options={typeOptions}
                style={{ minWidth: 150 }}
                size="small"
              />
              <Select
                value={priorityFilter}
                onChange={setPriorityFilter}
                options={priorityOptions}
                style={{ minWidth: 130 }}
                size="small"
              />
            </div>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Поиск споров..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              size="small"
            />
          </Card>

          {/* Dispute list */}
          <div
            className="dispute-list"
            style={{
              flex: 1,
              overflowY: "auto",
              paddingRight: 4,
            }}
          >
            {filteredDisputes.length > 0 ? (
              filteredDisputes.map((dispute) => (
                <DisputeCard
                  key={dispute.id}
                  dispute={dispute}
                  selected={selectedId === dispute.id}
                  onClick={() => setSelectedId(dispute.id)}
                />
              ))
            ) : (
              <Card style={{ borderRadius: 8 }}>
                <Empty description="Нет споров, соответствующих фильтрам" />
              </Card>
            )}
          </div>
        </div>

        {/* Right column — Stats + Detail */}
        <div style={{ flex: "1 1 55%", minWidth: 0, display: "flex", flexDirection: "column" }}>
          <Card
            size="small"
            style={{ marginBottom: 12, borderRadius: 8 }}
            styles={{ body: { padding: "8px 16px" } }}
          >
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <Statistic
                title={<Text style={{ fontSize: 11 }}>Всего споров</Text>}
                value={stats.total}
                prefix={<AuditOutlined />}
                valueStyle={{ fontSize: 18 }}
              />
              <Statistic
                title={<Text style={{ fontSize: 11 }}>Активные</Text>}
                value={stats.active}
                prefix={<ExclamationCircleOutlined />}
                valueStyle={{ fontSize: 18, color: "#fa8c16" }}
              />
              <Statistic
                title={<Text style={{ fontSize: 11 }}>Критические / Эскалация</Text>}
                value={stats.critical}
                prefix={<FireOutlined />}
                valueStyle={{ fontSize: 18, color: "#f5222d" }}
              />
              <Statistic
                title={<Text style={{ fontSize: 11 }}>Требуют ответа</Text>}
                value={stats.awaitingResponse}
                prefix={<WarningOutlined />}
                valueStyle={{ fontSize: 18, color: "#faad14" }}
              />
              <Statistic
                title={<Text style={{ fontSize: 11 }}>Решённые</Text>}
                value={stats.resolved}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ fontSize: 18, color: "#52c41a" }}
              />
              <Statistic
                title={<Text style={{ fontSize: 11 }}>Активная сумма (₽)</Text>}
                value={stats.totalAmount}
                prefix={<span style={{ fontSize: 14 }}>₽</span>}
                formatter={(val) => Number(val).toLocaleString("ru-RU")}
                valueStyle={{ fontSize: 18, color: "#f5222d" }}
              />
            </div>
          </Card>

          <Card
            style={{ borderRadius: 8, flex: 1, overflow: "auto" }}
            styles={{ body: { padding: 20 } }}
          >
            {selectedDispute ? (
              <DisputeDetailPanel dispute={selectedDispute} />
            ) : (
              <EmptyState />
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
