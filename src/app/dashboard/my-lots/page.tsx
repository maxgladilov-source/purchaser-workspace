"use client";

import { useState, useMemo, useEffect } from "react";
import { PageContainer } from "@ant-design/pro-components";
import {
  Card,
  Tag,
  Typography,
  Empty,
  Input,
  Select,
  Button,
  Badge,
  message,
  Table,
  theme,
} from "antd";
import {
  SearchOutlined,
  ClockCircleOutlined,
  StarFilled,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  MOCK_LOTS,
  LOT_STATUS_CONFIG,
  AWARD_RULE_CONFIG,
  type BuyerLot,
  type LotStatus,
  type SupplierBid,
} from "@/lib/lots-mock-data";
import "./lots.css";

const { Text, Title, Paragraph } = Typography;

// --- Helpers ---

function formatPrice(n: number): string {
  return n.toLocaleString("ru-RU") + " \u20BD";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU");
}

function getCountdown(deadline: string): { text: string; urgent: boolean } {
  const now = Date.now();
  const dl = new Date(deadline).getTime();
  const diff = dl - now;

  if (diff <= 0) return { text: "Завершён", urgent: false };

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (days > 0) {
    return {
      text: `${days}д ${remainingHours}ч`,
      urgent: days <= 1,
    };
  }
  return { text: `${hours}ч`, urgent: true };
}

// --- Lot Card ---

function LotCard({
  lot,
  selected,
  onClick,
}: {
  lot: BuyerLot;
  selected: boolean;
  onClick: () => void;
}) {
  const statusCfg = LOT_STATUS_CONFIG[lot.status];
  const ruleCfg = AWARD_RULE_CONFIG[lot.awardRule];
  const countdown = getCountdown(lot.deadline);

  return (
    <Card
      size="small"
      className={`lot-card${selected ? " lot-card-selected" : ""}`}
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
                {lot.id}
              </Text>
              <div>
                <Text strong style={{ fontSize: 14 }}>
                  {lot.title}
                </Text>
              </div>
            </div>
            <Tag color={statusCfg.color} style={{ marginLeft: 8, flexShrink: 0 }}>
              {statusCfg.label}
            </Tag>
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
            <Tag style={{ margin: 0 }}>{lot.technology}</Tag>
            <Tag style={{ margin: 0 }}>{ruleCfg.label}</Tag>
            {lot.toleranceGrade && (
              <Tag color="purple" style={{ margin: 0 }}>
                {lot.toleranceGrade}
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
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span>
                <ClockCircleOutlined
                  style={{
                    marginRight: 4,
                    fontSize: 11,
                    color: countdown.urgent ? "#ff4d4f" : undefined,
                  }}
                />
                <Text
                  type={countdown.urgent ? "danger" : "secondary"}
                  style={{ fontSize: 12 }}
                >
                  {countdown.text}
                </Text>
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                <Badge
                  count={lot.bids.length}
                  showZero
                  size="small"
                  style={{
                    backgroundColor:
                      lot.bids.length > 0 ? "#1677ff" : "#d9d9d9",
                  }}
                />
                <Text type="secondary" style={{ fontSize: 11 }}>
                  предл.
                </Text>
              </span>
            </div>
          </div>
        </div>

        {/* Right: budget badge */}
        <div
          className="lot-card-badge"
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
            {formatPrice(lot.budget)}
          </span>
          <span style={{ fontSize: 13, color: "#1677ff", marginTop: 4 }}>
            {lot.quantity.toLocaleString("ru-RU")} {lot.unit}
          </span>
        </div>
      </div>
    </Card>
  );
}

// --- Bid Table ---

function BidTable({
  bids,
  onAccept,
  onReject,
}: {
  bids: SupplierBid[];
  onAccept: (bidId: string) => void;
  onReject: (bidId: string) => void;
}) {
  const bestPrice = useMemo(() => {
    if (bids.length === 0) return 0;
    return Math.min(...bids.map((b) => b.price));
  }, [bids]);

  const columns = [
    {
      title: "Поставщик",
      dataIndex: "supplierName",
      key: "supplierName",
      render: (name: string, record: SupplierBid) => (
        <div>
          <Text strong style={{ fontSize: 13 }}>{name}</Text>
        </div>
      ),
    },
    {
      title: "Рейтинг",
      dataIndex: "supplierRating",
      key: "supplierRating",
      width: 90,
      render: (rating: number) => (
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <StarFilled style={{ color: "#faad14", fontSize: 13 }} />
          <Text style={{ fontSize: 13 }}>{rating.toFixed(1)}</Text>
        </span>
      ),
    },
    {
      title: "Цена",
      dataIndex: "price",
      key: "price",
      width: 130,
      sorter: (a: SupplierBid, b: SupplierBid) => a.price - b.price,
      render: (price: number) => (
        <Text
          strong
          style={{
            fontSize: 13,
            color: price === bestPrice ? "#52c41a" : undefined,
          }}
        >
          {formatPrice(price)}
        </Text>
      ),
    },
    {
      title: "Срок (дней)",
      dataIndex: "deliveryDays",
      key: "deliveryDays",
      width: 100,
      sorter: (a: SupplierBid, b: SupplierBid) => a.deliveryDays - b.deliveryDays,
      render: (days: number) => (
        <Text style={{ fontSize: 13 }}>{days}</Text>
      ),
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: SupplierBid["status"]) => {
        const cfg: Record<
          SupplierBid["status"],
          { label: string; color: string }
        > = {
          pending: { label: "Ожидание", color: "orange" },
          accepted: { label: "Принято", color: "green" },
          rejected: { label: "Отклонено", color: "red" },
        };
        const s = cfg[status];
        return <Tag color={s.color}>{s.label}</Tag>;
      },
    },
    {
      title: "Действия",
      key: "actions",
      width: 180,
      render: (_: unknown, record: SupplierBid) => {
        if (record.status !== "pending") return null;
        return (
          <div style={{ display: "flex", gap: 6 }}>
            <Button
              type="primary"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onAccept(record.id);
              }}
            >
              Принять
            </Button>
            <Button
              danger
              size="small"
              icon={<CloseCircleOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onReject(record.id);
              }}
            >
              Отклонить
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <Table
      dataSource={bids}
      columns={columns}
      rowKey="id"
      size="small"
      pagination={false}
      style={{ marginTop: 16 }}
    />
  );
}

// --- Detail Panel ---

function LotDetailPanel({
  lot,
  onAcceptBid,
  onRejectBid,
}: {
  lot: BuyerLot;
  onAcceptBid: (lotId: string, bidId: string) => void;
  onRejectBid: (lotId: string, bidId: string) => void;
}) {
  const { token } = theme.useToken();
  const statusCfg = LOT_STATUS_CONFIG[lot.status];
  const ruleCfg = AWARD_RULE_CONFIG[lot.awardRule];
  const countdown = getCountdown(lot.deadline);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
          <Tag color={statusCfg.color}>{statusCfg.label}</Tag>
          <Tag>{lot.technology}</Tag>
          <Tag>{ruleCfg.label}</Tag>
          {lot.toleranceGrade && <Tag color="purple">{lot.toleranceGrade}</Tag>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {lot.id}
          </Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            &middot;
          </Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            Создан {formatDate(lot.createdAt)}
          </Text>
        </div>
        <Title level={5} style={{ margin: 0 }}>
          {lot.title}
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
        <Paragraph style={{ margin: 0, fontSize: 13 }}>{lot.description}</Paragraph>
      </div>

      {/* Technical specifications */}
      <div
        style={{
          padding: "12px 0",
          borderTop: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Text strong style={{ fontSize: 13, display: "block", marginBottom: 8 }}>
          Технические характеристики
        </Text>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px 24px",
            fontSize: 13,
          }}
        >
          <div>
            <Text type="secondary" style={{ fontSize: 11 }}>Технология</Text>
            <div><Tag>{lot.technology}</Tag></div>
          </div>
          {lot.material && (
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>Материал</Text>
              <div><Text>{lot.material}</Text></div>
            </div>
          )}
          <div>
            <Text type="secondary" style={{ fontSize: 11 }}>Количество</Text>
            <div>
              <Text>
                {lot.quantity.toLocaleString("ru-RU")} {lot.unit}
              </Text>
            </div>
          </div>
          {lot.toleranceGrade && (
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>Допуск</Text>
              <div><Tag color="purple">{lot.toleranceGrade}</Tag></div>
            </div>
          )}
          <div>
            <Text type="secondary" style={{ fontSize: 11 }}>Бюджет</Text>
            <div>
              <Text strong style={{ color: "#f59e0b" }}>
                {formatPrice(lot.budget)}
              </Text>
            </div>
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: 11 }}>Правило присуждения</Text>
            <div><Tag>{ruleCfg.label}</Tag></div>
          </div>
        </div>
      </div>

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
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div>
            <Text type="secondary" style={{ fontSize: 11 }}>Дедлайн</Text>
            <div>
              <Text style={{ fontSize: 13 }}>{formatDate(lot.deadline)}</Text>
            </div>
          </div>
          <Tag
            color={countdown.urgent ? "red" : "blue"}
            style={{ fontSize: 12, fontWeight: 600 }}
          >
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {countdown.text}
          </Tag>
        </div>
      </div>

      {/* Bids table */}
      <div
        style={{
          padding: "12px 0",
          borderTop: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Text strong style={{ fontSize: 13, display: "block", marginBottom: 4 }}>
          Предложения поставщиков ({lot.bids.length})
        </Text>
        {lot.bids.length > 0 ? (
          <BidTable
            bids={lot.bids}
            onAccept={(bidId) => onAcceptBid(lot.id, bidId)}
            onReject={(bidId) => onRejectBid(lot.id, bidId)}
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text type="secondary">Предложений пока нет</Text>
            }
          />
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
          <Text type="secondary">Выберите лот для просмотра деталей</Text>
        }
      />
    </div>
  );
}

// --- Main Page ---

export default function MyLotsPage() {
  const [lots, setLots] = useState<BuyerLot[]>(MOCK_LOTS);
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [techFilter, setTechFilter] = useState<string>("all");
  const [dark, setDark] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

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
    const techs = new Set(lots.map((l) => l.technology));
    return Array.from(techs).sort();
  }, [lots]);

  // Filter lots
  const filteredLots = useMemo(() => {
    return lots.filter((lot) => {
      if (statusFilter !== "all" && lot.status !== statusFilter) return false;
      if (techFilter !== "all" && lot.technology !== techFilter) return false;
      if (
        searchText &&
        !lot.title.toLowerCase().includes(searchText.toLowerCase()) &&
        !lot.id.toLowerCase().includes(searchText.toLowerCase())
      )
        return false;
      return true;
    });
  }, [lots, statusFilter, techFilter, searchText]);

  const selectedLot = useMemo(
    () => lots.find((l) => l.id === selectedLotId) ?? null,
    [lots, selectedLotId]
  );

  // Bid actions
  const handleAcceptBid = (lotId: string, bidId: string) => {
    setLots((prev) =>
      prev.map((lot) => {
        if (lot.id !== lotId) return lot;
        return {
          ...lot,
          bids: lot.bids.map((bid) => ({
            ...bid,
            status: bid.id === bidId ? ("accepted" as const) : bid.status === "pending" ? ("rejected" as const) : bid.status,
          })),
        };
      })
    );
    messageApi.success("Предложение принято");
  };

  const handleRejectBid = (lotId: string, bidId: string) => {
    setLots((prev) =>
      prev.map((lot) => {
        if (lot.id !== lotId) return lot;
        return {
          ...lot,
          bids: lot.bids.map((bid) =>
            bid.id === bidId ? { ...bid, status: "rejected" as const } : bid
          ),
        };
      })
    );
    messageApi.info("Предложение отклонено");
  };

  // Filter options
  const statusOptions = [
    { value: "all", label: "Все статусы" },
    ...Object.entries(LOT_STATUS_CONFIG).map(([key, cfg]) => ({
      value: key,
      label: cfg.label,
    })),
  ];

  const techOptions = [
    { value: "all", label: "Все технологии" },
    ...technologies.map((t) => ({ value: t, label: t })),
  ];

  return (
    <PageContainer title={false}>
      {contextHolder}
      {/* Two-column layout */}
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "stretch",
          height: "calc(100vh - 140px)",
        }}
      >
        {/* Left column — 45% Lot list */}
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
                style={{ minWidth: 160 }}
                size="small"
              />
              <Select
                value={techFilter}
                onChange={setTechFilter}
                options={techOptions}
                style={{ minWidth: 160 }}
                size="small"
              />
            </div>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Поиск лотов..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              size="small"
            />
          </Card>

          {/* Lot list */}
          <div
            className="lot-list"
            style={{
              flex: 1,
              overflowY: "auto",
              paddingRight: 4,
            }}
          >
            {filteredLots.length > 0 ? (
              filteredLots.map((lot) => (
                <LotCard
                  key={lot.id}
                  lot={lot}
                  selected={selectedLotId === lot.id}
                  onClick={() => setSelectedLotId(lot.id)}
                />
              ))
            ) : (
              <Card style={{ borderRadius: 8 }}>
                <Empty description="Нет лотов, соответствующих фильтрам" />
              </Card>
            )}
          </div>
        </div>

        {/* Right column — 55% Detail panel */}
        <div
          style={{
            flex: "1 1 55%",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Card
            style={{ borderRadius: 8, flex: 1, overflow: "auto" }}
            styles={{ body: { padding: 20 } }}
          >
            {selectedLot ? (
              <LotDetailPanel
                lot={selectedLot}
                onAcceptBid={handleAcceptBid}
                onRejectBid={handleRejectBid}
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
