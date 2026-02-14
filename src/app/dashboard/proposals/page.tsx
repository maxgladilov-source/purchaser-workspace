"use client";

import { useState, useMemo, useEffect } from "react";
import { PageContainer } from "@ant-design/pro-components";
import {
  Card,
  Tag,
  Typography,
  Select,
  Table,
  Statistic,
  Button,
  message,
  theme,
} from "antd";
import {
  StarFilled,
  CheckCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  RocketOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import {
  MOCK_PROPOSALS,
  PROPOSAL_STATUS_CONFIG,
  type Proposal,
} from "@/lib/proposals-mock-data";

const { Text } = Typography;

// --- Helpers ---

function formatPrice(n: number): string {
  return n.toLocaleString("ru-RU") + " \u20BD";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU");
}

// --- Main Page ---

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>(MOCK_PROPOSALS);
  const [lotFilter, setLotFilter] = useState<string>("all");
  const [dark, setDark] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { token } = theme.useToken();

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

  // Unique lots for filter
  const lotOptions = useMemo(() => {
    const lotsMap = new Map<string, string>();
    proposals.forEach((p) => {
      if (!lotsMap.has(p.lotId)) {
        lotsMap.set(p.lotId, p.lotTitle);
      }
    });
    return [
      { value: "all", label: "Все лоты" },
      ...Array.from(lotsMap.entries()).map(([id, title]) => ({
        value: id,
        label: `${id} - ${title}`,
      })),
    ];
  }, [proposals]);

  // Filtered proposals
  const filteredProposals = useMemo(() => {
    if (lotFilter === "all") return proposals;
    return proposals.filter((p) => p.lotId === lotFilter);
  }, [proposals, lotFilter]);

  // Stats
  const stats = useMemo(() => {
    const total = filteredProposals.length;
    const prices = filteredProposals.map((p) => p.price);
    const deliveries = filteredProposals.map((p) => p.deliveryDays);
    const avgPrice =
      total > 0
        ? Math.round(prices.reduce((a, b) => a + b, 0) / total)
        : 0;
    const avgDelivery =
      total > 0
        ? Math.round(deliveries.reduce((a, b) => a + b, 0) / total)
        : 0;
    const bestPrice = total > 0 ? Math.min(...prices) : 0;
    const fastestDelivery = total > 0 ? Math.min(...deliveries) : 0;

    return { total, avgPrice, avgDelivery, bestPrice, fastestDelivery };
  }, [filteredProposals]);

  // Best values for highlighting
  const bestPrice = useMemo(() => {
    if (filteredProposals.length === 0) return 0;
    return Math.min(...filteredProposals.map((p) => p.price));
  }, [filteredProposals]);

  const fastestDelivery = useMemo(() => {
    if (filteredProposals.length === 0) return 0;
    return Math.min(...filteredProposals.map((p) => p.deliveryDays));
  }, [filteredProposals]);

  // Actions
  const handleAccept = (proposalId: string) => {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId ? { ...p, status: "accepted" as const } : p
      )
    );
    messageApi.success("Предложение принято");
  };

  const handleReject = (proposalId: string) => {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId ? { ...p, status: "rejected" as const } : p
      )
    );
    messageApi.info("Предложение отклонено");
  };

  const handleRequestClarification = (proposalId: string) => {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId
          ? { ...p, status: "clarification_requested" as const }
          : p
      )
    );
    messageApi.info("Запрос на уточнение отправлен");
  };

  // Table columns
  const columns = [
    {
      title: "Поставщик",
      key: "supplier",
      width: 220,
      render: (_: unknown, record: Proposal) => (
        <div>
          <Text strong style={{ fontSize: 13, display: "block" }}>
            {record.supplier.name}
          </Text>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginTop: 2,
            }}
          >
            <StarFilled style={{ color: "#faad14", fontSize: 12 }} />
            <Text style={{ fontSize: 12 }}>
              {record.supplier.rating.toFixed(1)}
            </Text>
            <Text type="secondary" style={{ fontSize: 11, marginLeft: 4 }}>
              ({record.supplier.completedOrders} заказов)
            </Text>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginTop: 2,
            }}
          >
            <EnvironmentOutlined
              style={{ fontSize: 11, color: "#8c8c8c" }}
            />
            <Text type="secondary" style={{ fontSize: 11 }}>
              {record.supplier.location}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Цена",
      dataIndex: "price",
      key: "price",
      width: 140,
      sorter: (a: Proposal, b: Proposal) => a.price - b.price,
      render: (price: number) => (
        <Text
          strong
          style={{
            fontSize: 14,
            color: price === bestPrice ? "#52c41a" : undefined,
          }}
        >
          {formatPrice(price)}
        </Text>
      ),
    },
    {
      title: "Срок доставки",
      dataIndex: "deliveryDays",
      key: "deliveryDays",
      width: 120,
      sorter: (a: Proposal, b: Proposal) =>
        a.deliveryDays - b.deliveryDays,
      render: (days: number) => (
        <Text
          style={{
            fontSize: 13,
            color: days === fastestDelivery ? "#52c41a" : undefined,
            fontWeight: days === fastestDelivery ? 600 : 400,
          }}
        >
          {days} дней
        </Text>
      ),
    },
    {
      title: "Тех. оценка",
      dataIndex: "technicalScore",
      key: "technicalScore",
      width: 110,
      sorter: (a: Proposal, b: Proposal) =>
        a.technicalScore - b.technicalScore,
      render: (score: number) => {
        const color =
          score >= 90 ? "#52c41a" : score >= 75 ? "#1677ff" : "#fa8c16";
        return (
          <Text style={{ fontSize: 13, color, fontWeight: 600 }}>
            {score} / 100
          </Text>
        );
      },
    },
    {
      title: "Ценовая оценка",
      dataIndex: "priceScore",
      key: "priceScore",
      width: 120,
      sorter: (a: Proposal, b: Proposal) =>
        a.priceScore - b.priceScore,
      render: (score: number) => {
        const color =
          score >= 90 ? "#52c41a" : score >= 75 ? "#1677ff" : "#fa8c16";
        return (
          <Text style={{ fontSize: 13, color, fontWeight: 600 }}>
            {score} / 100
          </Text>
        );
      },
    },
    {
      title: "Дата подачи",
      dataIndex: "submittedAt",
      key: "submittedAt",
      width: 110,
      sorter: (a: Proposal, b: Proposal) =>
        new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime(),
      render: (date: string) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {formatDate(date)}
        </Text>
      ),
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      width: 150,
      filters: Object.entries(PROPOSAL_STATUS_CONFIG).map(([key, cfg]) => ({
        text: cfg.label,
        value: key,
      })),
      onFilter: (value: unknown, record: Proposal) =>
        record.status === (value as string),
      render: (status: Proposal["status"]) => {
        const cfg = PROPOSAL_STATUS_CONFIG[status];
        return <Tag color={cfg.color}>{cfg.label}</Tag>;
      },
    },
    {
      title: "Действия",
      key: "actions",
      width: 280,
      render: (_: unknown, record: Proposal) => {
        if (record.status !== "pending") return null;
        return (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <Button
              type="primary"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => handleAccept(record.id)}
            >
              Принять
            </Button>
            <Button
              danger
              size="small"
              icon={<CloseCircleOutlined />}
              onClick={() => handleReject(record.id)}
            >
              Отклонить
            </Button>
            <Button
              size="small"
              icon={<QuestionCircleOutlined />}
              onClick={() => handleRequestClarification(record.id)}
            >
              Уточнение
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <PageContainer title={false}>
      {contextHolder}

      {/* Lot filter */}
      <Card
        size="small"
        style={{ marginBottom: 12, borderRadius: 8 }}
        styles={{ body: { padding: "12px 16px" } }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Text strong style={{ fontSize: 13, flexShrink: 0 }}>
            Фильтр по лоту:
          </Text>
          <Select
            value={lotFilter}
            onChange={setLotFilter}
            options={lotOptions}
            style={{ minWidth: 360 }}
            size="small"
            showSearch
            optionFilterProp="label"
            placeholder="Выберите лот..."
          />
        </div>
      </Card>

      {/* Stats row */}
      <Card
        size="small"
        style={{ marginBottom: 12, borderRadius: 8 }}
        styles={{ body: { padding: "8px 16px" } }}
      >
        <div
          style={{
            display: "flex",
            gap: 32,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Statistic
            title={<Text style={{ fontSize: 11 }}>Всего предложений</Text>}
            value={stats.total}
            prefix={<ShoppingCartOutlined />}
            valueStyle={{ fontSize: 18 }}
          />
          <Statistic
            title={<Text style={{ fontSize: 11 }}>Средняя цена</Text>}
            value={stats.avgPrice}
            prefix={<DollarOutlined />}
            formatter={(val) => formatPrice(Number(val))}
            valueStyle={{ fontSize: 18 }}
          />
          <Statistic
            title={<Text style={{ fontSize: 11 }}>Средний срок</Text>}
            value={stats.avgDelivery}
            suffix="дней"
            prefix={<ClockCircleOutlined />}
            valueStyle={{ fontSize: 18 }}
          />
          <Statistic
            title={<Text style={{ fontSize: 11 }}>Лучшая цена</Text>}
            value={stats.bestPrice}
            prefix={<ThunderboltOutlined />}
            formatter={(val) => formatPrice(Number(val))}
            valueStyle={{ fontSize: 18, color: "#52c41a" }}
          />
          <Statistic
            title={<Text style={{ fontSize: 11 }}>Кратчайший срок</Text>}
            value={stats.fastestDelivery}
            suffix="дней"
            prefix={<RocketOutlined />}
            valueStyle={{ fontSize: 18, color: "#52c41a" }}
          />
        </div>
      </Card>

      {/* Proposals table */}
      <Card
        style={{ borderRadius: 8 }}
        styles={{ body: { padding: 0 } }}
      >
        <Table
          dataSource={filteredProposals}
          columns={columns}
          rowKey="id"
          size="middle"
          pagination={{ pageSize: 20, hideOnSinglePage: true }}
          scroll={{ x: 1200 }}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ padding: "8px 16px" }}>
                <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
                  Комментарий поставщика:
                </Text>
                <Text style={{ fontSize: 13 }}>{record.comment}</Text>
                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <Tag>Лот: {record.lotId}</Tag>
                  <Tag>{record.lotTitle}</Tag>
                  {record.supplier.certifications.map((cert) => (
                    <Tag key={cert} color="blue">
                      {cert}
                    </Tag>
                  ))}
                </div>
                <div style={{ marginTop: 6 }}>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    Специализация: {record.supplier.specialization}
                  </Text>
                  <Text
                    type="secondary"
                    style={{ fontSize: 11, display: "block" }}
                  >
                    Время отклика: {record.supplier.responseTime}
                  </Text>
                </div>
              </div>
            ),
            rowExpandable: () => true,
          }}
        />
      </Card>
    </PageContainer>
  );
}
