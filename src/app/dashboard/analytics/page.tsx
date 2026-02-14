"use client";

import { useMemo } from "react";
import { PageContainer } from "@ant-design/pro-components";
import {
  Card,
  Col,
  Row,
  Statistic,
  Tag,
  Typography,
  Table,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  BarChartOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  PercentageOutlined,
  StarFilled,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

// --- Helpers ---

function formatCurrency(value: number): string {
  return value.toLocaleString("ru-RU");
}

// --- Mock data ---

const MONTHLY_SPENDING = [
  { month: "Сент", value: 1_240_000 },
  { month: "Окт", value: 1_870_000 },
  { month: "Нояб", value: 1_530_000 },
  { month: "Дек", value: 2_150_000 },
  { month: "Янв", value: 1_680_000 },
  { month: "Февр", value: 920_000 },
];

const TECH_ORDERS = [
  { tech: "CNC фрезерование", count: 42, pct: 32 },
  { tech: "Токарная обработка", count: 28, pct: 21 },
  { tech: "Листовой металл", count: 24, pct: 18 },
  { tech: "3D печать", count: 19, pct: 14 },
  { tech: "Литьё", count: 12, pct: 9 },
  { tech: "Прочее", count: 8, pct: 6 },
];

const TECH_COLORS = ["#1677ff", "#52c41a", "#fa8c16", "#722ed1", "#f5222d", "#8c8c8c"];

interface TopSupplier {
  key: string;
  name: string;
  orders: number;
  amount: number;
  rating: number;
  reliability: number;
}

const TOP_SUPPLIERS: TopSupplier[] = [
  { key: "1", name: 'ООО "ПрецизионМеталл"', orders: 18, amount: 3_240_000, rating: 4.8, reliability: 97 },
  { key: "2", name: 'АО "УралМеталлург"', orders: 14, amount: 2_870_000, rating: 4.5, reliability: 93 },
  { key: "3", name: 'ООО "МеталлСервис"', orders: 12, amount: 1_960_000, rating: 4.6, reliability: 95 },
  { key: "4", name: 'ООО "ПолимерТех"', orders: 9, amount: 1_420_000, rating: 4.3, reliability: 91 },
  { key: "5", name: 'АО "СибЛитМаш"', orders: 7, amount: 1_180_000, rating: 4.1, reliability: 88 },
  { key: "6", name: 'ООО "ТочПрибор"', orders: 6, amount: 890_000, rating: 4.4, reliability: 94 },
];

// --- Component ---

export default function AnalyticsPage() {
  const cardStyle = { borderRadius: 8 };

  const maxMonthly = useMemo(
    () => Math.max(...MONTHLY_SPENDING.map((m) => m.value), 1),
    []
  );

  const maxTechCount = useMemo(
    () => Math.max(...TECH_ORDERS.map((t) => t.count), 1),
    []
  );

  const supplierColumns: ColumnsType<TopSupplier> = [
    {
      title: "#",
      key: "idx",
      width: 50,
      render: (_, __, idx) => (
        <Tag style={{ margin: 0 }}>{idx + 1}</Tag>
      ),
    },
    {
      title: "Поставщик",
      dataIndex: "name",
      key: "name",
      render: (val: string) => <Text strong style={{ fontSize: 13 }}>{val}</Text>,
    },
    {
      title: "Заказов",
      dataIndex: "orders",
      key: "orders",
      width: 90,
      align: "center" as const,
      render: (val: number) => <Text style={{ fontSize: 13 }}>{val}</Text>,
    },
    {
      title: "Сумма",
      dataIndex: "amount",
      key: "amount",
      width: 140,
      align: "right" as const,
      render: (val: number) => (
        <Text strong style={{ fontSize: 13 }}>
          {formatCurrency(val)} ₽
        </Text>
      ),
    },
    {
      title: "Рейтинг",
      dataIndex: "rating",
      key: "rating",
      width: 100,
      align: "center" as const,
      render: (val: number) => (
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
          <StarFilled style={{ color: "#faad14", fontSize: 13 }} />
          <Text strong style={{ fontSize: 13, color: val >= 4.5 ? "#52c41a" : val >= 4.0 ? "#faad14" : "#ff4d4f" }}>
            {val.toFixed(1)}
          </Text>
        </span>
      ),
    },
    {
      title: "Надёжность",
      dataIndex: "reliability",
      key: "reliability",
      width: 110,
      align: "center" as const,
      render: (val: number) => (
        <Tag color={val >= 95 ? "green" : val >= 90 ? "blue" : "orange"}>
          {val}%
        </Tag>
      ),
    },
  ];

  return (
    <PageContainer title={false}>
      {/* ========== Row 1: Monthly Spending + Orders by Technology ========== */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="Расходы по месяцам" style={cardStyle}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 220 }}>
              {MONTHLY_SPENDING.map((m) => {
                const barHeight =
                  maxMonthly > 0 ? (m.value / maxMonthly) * 180 : 0;
                return (
                  <div
                    key={m.month}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      height: "100%",
                    }}
                  >
                    <Text style={{ fontSize: 11, marginBottom: 4 }}>
                      {m.value > 0 ? `${formatCurrency(m.value)} ₽` : "\u2014"}
                    </Text>
                    <div
                      style={{
                        width: "100%",
                        maxWidth: 60,
                        height: Math.max(barHeight, m.value > 0 ? 4 : 0),
                        background: "#1677ff",
                        borderRadius: "4px 4px 0 0",
                        transition: "height 0.3s",
                      }}
                    />
                    <Text type="secondary" style={{ fontSize: 12, marginTop: 4 }}>
                      {m.month}
                    </Text>
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="Заказы по технологиям" style={cardStyle}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {TECH_ORDERS.map((item, idx) => {
                const barPct = (item.count / maxTechCount) * 100;
                return (
                  <div
                    key={item.tech}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        width: 140,
                        flexShrink: 0,
                        textAlign: "right",
                      }}
                      ellipsis
                    >
                      {item.tech}
                    </Text>
                    <div
                      style={{
                        flex: 1,
                        height: 22,
                        background: "rgba(0,0,0,0.04)",
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${barPct}%`,
                          minWidth: item.count > 0 ? 24 : 0,
                          height: "100%",
                          background: TECH_COLORS[idx % TECH_COLORS.length],
                          borderRadius: 4,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          paddingRight: 6,
                          transition: "width 0.3s",
                        }}
                      >
                        <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>
                          {item.count}
                        </span>
                      </div>
                    </div>
                    <Text type="secondary" style={{ fontSize: 11, width: 36, textAlign: "right", flexShrink: 0 }}>
                      {item.pct}%
                    </Text>
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>
      </Row>

      {/* ========== Row 2: Lot Performance Stats ========== */}
      <Card
        title="Эффективность лотов"
        style={{ ...cardStyle, marginTop: 16 }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={4}>
            <Statistic
              title="Всего лотов"
              value={45}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ fontSize: 22, color: "#1677ff" }}
            />
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Statistic
              title="Средний срок закрытия"
              value={8.2}
              suffix="дня"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ fontSize: 22, color: "#52c41a" }}
            />
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Statistic
              title="Среднее кол-во предложений"
              value={4.6}
              prefix={<FileTextOutlined />}
              valueStyle={{ fontSize: 22, color: "#fa8c16" }}
            />
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Statistic
              title="Экономия от торгов"
              value={12.4}
              suffix="%"
              prefix={<PercentageOutlined />}
              valueStyle={{ fontSize: 22, color: "#722ed1" }}
            />
          </Col>
          <Col xs={24} sm={12} md={5}>
            <Statistic
              title="Лоты без предложений"
              value={3}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ fontSize: 22, color: "#f5222d" }}
            />
          </Col>
        </Row>
      </Card>

      {/* ========== Row 3: Top Suppliers ========== */}
      <Card
        title="Топ поставщиков"
        style={{ ...cardStyle, marginTop: 16 }}
      >
        <Table
          dataSource={TOP_SUPPLIERS}
          columns={supplierColumns}
          rowKey="key"
          pagination={false}
          size="middle"
          locale={{ emptyText: "Нет данных" }}
        />
      </Card>
    </PageContainer>
  );
}
