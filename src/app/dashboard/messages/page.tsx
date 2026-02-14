"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { PageContainer } from "@ant-design/pro-components";
import {
  Card,
  Tag,
  Typography,
  Empty,
  Badge,
  Button,
  Input,
  Select,
  Space,
} from "antd";
import {
  SendOutlined,
  CustomerServiceOutlined,
  RobotOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  MOCK_CONVERSATIONS,
  CHANNEL_CONFIG,
  STATUS_CONFIG,
  type Conversation,
  type Message,
  type MessageChannel,
  type ConversationStatus,
} from "@/lib/messages-mock-data";
import "./messages.css";

const { Text } = Typography;

// --- Helpers ---

function timeAgo(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "только что";
  if (minutes < 60) return `${minutes} мин назад`;
  if (hours < 24) return `${hours} ч назад`;
  if (days === 1) return "вчера";
  return `${days} дн назад`;
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// --- Channel icon mapping ---

const CHANNEL_ICONS: Record<MessageChannel, React.ReactNode> = {
  operator: <CustomerServiceOutlined />,
  supplier: <UserOutlined />,
  system: <RobotOutlined />,
};

// --- Conversation Card ---

function ConversationCard({
  conversation,
  selected,
  onClick,
}: {
  conversation: Conversation;
  selected: boolean;
  onClick: () => void;
}) {
  const channelCfg = CHANNEL_CONFIG[conversation.channel];
  const statusCfg = STATUS_CONFIG[conversation.status];
  const lastMessage =
    conversation.messages[conversation.messages.length - 1];
  const preview = lastMessage
    ? lastMessage.text.length > 60
      ? lastMessage.text.slice(0, 60) + "..."
      : lastMessage.text
    : "";

  return (
    <Card
      size="small"
      hoverable
      onClick={onClick}
      style={{
        marginBottom: 8,
        borderColor: selected ? "#1677ff" : undefined,
        borderWidth: selected ? 2 : 1,
        borderRadius: 8,
        cursor: "pointer",
      }}
      styles={{ body: { padding: "12px 16px" } }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 6,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <Text
            strong
            style={{
              fontSize: 14,
              display: "block",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {conversation.subject}
          </Text>
        </div>
        {conversation.unreadCount > 0 && (
          <Badge
            count={conversation.unreadCount}
            style={{ marginLeft: 8, flexShrink: 0 }}
          />
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          marginBottom: 6,
        }}
      >
        <Tag color={channelCfg.color} style={{ margin: 0 }}>
          {channelCfg.label}
        </Tag>
        <Tag color={statusCfg.color} style={{ margin: 0 }}>
          {statusCfg.label}
        </Tag>
        {conversation.relatedOrder && (
          <Text type="secondary" style={{ fontSize: 11, lineHeight: "22px" }}>
            {conversation.relatedOrder}
          </Text>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          type="secondary"
          style={{
            fontSize: 12,
            flex: 1,
            minWidth: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {preview}
        </Text>
        <Text
          type="secondary"
          style={{ fontSize: 11, marginLeft: 8, flexShrink: 0 }}
        >
          {timeAgo(conversation.lastMessageAt)}
        </Text>
      </div>
    </Card>
  );
}

// --- Chat Bubble ---

function ChatBubble({
  msg,
  isUser,
  dark,
}: {
  msg: Message;
  isUser: boolean;
  dark: boolean;
}) {
  const isSystem = msg.fromRole === "system";

  if (isSystem) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "12px 0",
        }}
      >
        <div
          style={{
            padding: "6px 14px",
            borderRadius: 12,
            background: dark ? "rgba(255,255,255,0.06)" : "#fafafa",
            border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "#f0f0f0"}`,
            maxWidth: "85%",
            textAlign: "center",
          }}
        >
          <Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 2 }}>
            <RobotOutlined style={{ marginRight: 4 }} />
            {msg.from}
          </Text>
          <Text
            type="secondary"
            style={{ fontSize: 13 }}
          >
            {msg.text}
          </Text>
          <div style={{ marginTop: 4 }}>
            <Text type="secondary" style={{ fontSize: 10 }}>
              {formatTimestamp(msg.timestamp)}
            </Text>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        margin: "8px 0",
      }}
    >
      <div
        style={{
          maxWidth: "75%",
          borderRadius: 12,
          padding: "10px 14px",
          background: isUser
            ? "#1677ff"
            : dark
              ? "rgba(255,255,255,0.08)"
              : "#f0f0f0",
        }}
      >
        <div style={{ marginBottom: 4 }}>
          <Text
            strong
            style={{
              fontSize: 12,
              color: isUser ? "rgba(255,255,255,0.85)" : undefined,
            }}
          >
            {msg.from}
          </Text>
          {msg.fromRole === "operator" && (
            <Tag
              color="blue"
              style={{
                margin: "0 0 0 6px",
                fontSize: 10,
                lineHeight: "16px",
                padding: "0 4px",
              }}
            >
              Оператор
            </Tag>
          )}
        </div>
        <div>
          <Text
            style={{
              fontSize: 13,
              color: isUser ? "#ffffff" : undefined,
              whiteSpace: "pre-wrap",
            }}
          >
            {msg.text}
          </Text>
        </div>
        <div style={{ marginTop: 4, textAlign: isUser ? "right" : "left" }}>
          <Text
            style={{
              fontSize: 10,
              color: isUser ? "rgba(255,255,255,0.6)" : "#8c8c8c",
            }}
          >
            {formatTimestamp(msg.timestamp)}
          </Text>
        </div>
      </div>
    </div>
  );
}

// --- Chat Panel ---

function ChatPanel({
  conversation,
  onSend,
  dark,
}: {
  conversation: Conversation;
  onSend: (convId: string, text: string) => void;
  dark: boolean;
}) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const channelCfg = CHANNEL_CONFIG[conversation.channel];
  const statusCfg = STATUS_CONFIG[conversation.status];

  const firstUnreadIndex = conversation.messages.findIndex((m) => !m.read);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages.length, conversation.id]);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onSend(conversation.id, trimmed);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          paddingBottom: 12,
          borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "#f0f0f0"}`,
          marginBottom: 12,
        }}
      >
        <Text strong style={{ fontSize: 16, display: "block", marginBottom: 6 }}>
          {conversation.subject}
        </Text>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
          <Tag color={channelCfg.color}>{channelCfg.label}</Tag>
          <Tag color={statusCfg.color}>{statusCfg.label}</Tag>
          {conversation.relatedOrder && (
            <Tag>{conversation.relatedOrder}</Tag>
          )}
        </div>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {conversation.participants.join(", ")}
        </Text>
      </div>

      {/* Messages area */}
      <div
        className="chat-messages"
        style={{
          flex: 1,
          overflowY: "auto",
          paddingRight: 4,
          minHeight: 0,
        }}
      >
        {conversation.messages.map((msg, idx) => {
          const isUser = msg.from === "Иванов А.С.";
          const showUnreadLine =
            firstUnreadIndex > 0 && idx === firstUnreadIndex;

          return (
            <div key={msg.id}>
              {showUnreadLine && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    margin: "16px 0",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: 1,
                      background: "#ff4d4f",
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 11,
                      color: "#ff4d4f",
                      flexShrink: 0,
                    }}
                  >
                    Новые сообщения
                  </Text>
                  <div
                    style={{
                      flex: 1,
                      height: 1,
                      background: "#ff4d4f",
                    }}
                  />
                </div>
              )}
              <ChatBubble msg={msg} isUser={isUser} dark={dark} />
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        style={{
          paddingTop: 12,
          borderTop: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "#f0f0f0"}`,
          marginTop: 12,
          display: "flex",
          gap: 8,
          alignItems: "flex-end",
        }}
      >
        <Input.TextArea
          rows={2}
          placeholder="Введите сообщение..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ flex: 1, borderRadius: 8 }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          disabled={!inputValue.trim()}
          style={{ borderRadius: 8, height: 54 }}
        />
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
          <Text type="secondary">
            Выберите беседу для просмотра сообщений
          </Text>
        }
      />
      <div>
        <Text
          type="secondary"
          style={{
            fontSize: 12,
            marginBottom: 8,
            display: "block",
            textAlign: "center",
          }}
        >
          Типы каналов
        </Text>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            maxWidth: 400,
          }}
        >
          {(Object.keys(CHANNEL_CONFIG) as MessageChannel[]).map((ch) => (
            <div
              key={ch}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <Tag
                color={CHANNEL_CONFIG[ch].color}
                icon={CHANNEL_ICONS[ch]}
                style={{ margin: 0, minWidth: 110, textAlign: "center" }}
              >
                {CHANNEL_CONFIG[ch].label}
              </Tag>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {ch === "operator" &&
                  "Прямая связь с оператором платформы Everypart"}
                {ch === "supplier" &&
                  "Переписка с поставщиками по заказам и лотам"}
                {ch === "system" &&
                  "Автоматические уведомления и обновления платформы"}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Main Page ---

export default function MessagesPage() {
  const [conversations, setConversations] =
    useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [channelFilter, setChannelFilter] = useState<"all" | MessageChannel>(
    "all"
  );
  const [statusFilter, setStatusFilter] = useState<"all" | ConversationStatus>(
    "all"
  );
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    setDark(root.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setDark(root.classList.contains("dark"));
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      if (channelFilter !== "all" && conv.channel !== channelFilter)
        return false;
      if (statusFilter !== "all" && conv.status !== statusFilter) return false;
      return true;
    });
  }, [conversations, channelFilter, statusFilter]);

  const selectedConversation = useMemo(
    () => conversations.find((c) => c.id === selectedConvId) ?? null,
    [conversations, selectedConvId]
  );

  const handleSend = useCallback(
    (convId: string, text: string) => {
      const newMessage: Message = {
        id: `m-${convId}-${Date.now()}`,
        from: "Иванов А.С.",
        fromRole: "supplier",
        text,
        timestamp: new Date().toISOString(),
        read: true,
      };

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id !== convId) return conv;
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessageAt: newMessage.timestamp,
          };
        })
      );
    },
    []
  );

  const statusOptions: { value: string; label: string }[] = [
    { value: "all", label: "Все статусы" },
    { value: "active", label: "Активные" },
    { value: "waiting", label: "Ожидание" },
    { value: "resolved", label: "Решённые" },
  ];

  return (
    <PageContainer title={false}>
      <div style={{ display: "flex", gap: 16 }}>
        {/* Left column — Conversation list */}
        <div style={{ flex: "0 0 35%", minWidth: 0 }}>
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
                marginBottom: 8,
                flexWrap: "wrap",
              }}
            >
              <Space.Compact>
                <Button
                  size="small"
                  type={channelFilter === "all" ? "primary" : "default"}
                  onClick={() => setChannelFilter("all")}
                >
                  Все
                </Button>
                <Button
                  size="small"
                  icon={<CustomerServiceOutlined />}
                  type={channelFilter === "operator" ? "primary" : "default"}
                  onClick={() => setChannelFilter("operator")}
                >
                  Оператор
                </Button>
                <Button
                  size="small"
                  icon={<UserOutlined />}
                  type={channelFilter === "supplier" ? "primary" : "default"}
                  onClick={() => setChannelFilter("supplier")}
                >
                  Поставщик
                </Button>
                <Button
                  size="small"
                  icon={<RobotOutlined />}
                  type={channelFilter === "system" ? "primary" : "default"}
                  onClick={() => setChannelFilter("system")}
                >
                  Система
                </Button>
              </Space.Compact>
            </div>
            <Select
              value={statusFilter}
              onChange={(v) =>
                setStatusFilter(v as "all" | ConversationStatus)
              }
              options={statusOptions}
              style={{ width: "100%" }}
              size="small"
            />
          </Card>

          {/* Conversation list */}
          <div
            className="conversation-list"
            style={{
              maxHeight: "calc(100vh - 280px)",
              overflowY: "auto",
              paddingRight: 4,
            }}
          >
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => (
                <ConversationCard
                  key={conv.id}
                  conversation={conv}
                  selected={selectedConvId === conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                />
              ))
            ) : (
              <Card style={{ borderRadius: 8 }}>
                <Empty description="Нет бесед по выбранным фильтрам" />
              </Card>
            )}
          </div>
        </div>

        {/* Right column — Chat panel */}
        <div style={{ flex: "1 1 65%", minWidth: 0 }}>
          <Card
            style={{
              height: "calc(100vh - 200px)",
              borderRadius: 8,
            }}
            styles={{ body: { padding: 20, height: "100%" } }}
          >
            {selectedConversation ? (
              <ChatPanel
                conversation={selectedConversation}
                onSend={handleSend}
                dark={dark}
              />
            ) : (
              <EmptyState />
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
