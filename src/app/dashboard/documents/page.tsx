"use client";

import { useState, useMemo } from "react";
import { PageContainer } from "@ant-design/pro-components";
import {
  Card,
  Tag,
  Typography,
  Input,
  Select,
  Button,
  Space,
  Statistic,
  Table,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  SearchOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  CloudUploadOutlined,
  EyeOutlined,
  DownloadOutlined,
  UploadOutlined,
  DeleteOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import {
  mockDocuments,
  DOC_STATUS_CONFIG,
  DOC_CATEGORY_CONFIG,
  type Document,
  type DocumentStatus,
  type DocumentCategory,
} from "@/lib/documents-mock-data";

const { Text } = Typography;

// --- Helpers ---

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDaysUntilExpiry(expiresAt: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const expiry = new Date(expiresAt);
  expiry.setHours(0, 0, 0, 0);
  const diff = expiry.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function pluralDays(n: number): string {
  const abs = Math.abs(n);
  const mod10 = abs % 10;
  const mod100 = abs % 100;
  if (mod10 === 1 && mod100 !== 11) return `${abs} день`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${abs} дня`;
  return `${abs} дней`;
}

// --- Main Page ---

export default function DocumentsPage() {
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | DocumentCategory>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  const filteredDocuments = useMemo(() => {
    return mockDocuments.filter((doc) => {
      if (categoryFilter !== "all" && doc.category !== categoryFilter) return false;
      if (statusFilter !== "all" && doc.status !== statusFilter) return false;
      if (
        searchText &&
        !doc.title.toLowerCase().includes(searchText.toLowerCase()) &&
        !doc.id.toLowerCase().includes(searchText.toLowerCase())
      )
        return false;
      return true;
    });
  }, [categoryFilter, statusFilter, searchText]);

  const stats = useMemo(() => {
    const total = mockDocuments.length;
    const valid = mockDocuments.filter((d) => d.status === "valid").length;
    const expiring = mockDocuments.filter((d) => d.status === "expiring").length;
    const expired = mockDocuments.filter((d) => d.status === "expired").length;
    const pending = mockDocuments.filter((d) => d.status === "pending").length;
    const inReview = mockDocuments.filter((d) => d.status === "in_review").length;
    return { total, valid, expiring, expired, pending, inReview };
  }, []);

  const statusOptions: { value: string; label: string }[] = [
    { value: "all", label: "Все статусы" },
    { value: "valid", label: "Действительные" },
    { value: "expiring", label: "Истекающие" },
    { value: "expired", label: "Просроченные" },
    { value: "pending", label: "Ожидают загрузки" },
    { value: "in_review", label: "На проверке" },
  ];

  const columns: ColumnsType<Document> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id: string) => (
        <Text type="secondary" style={{ fontSize: 12 }}>{id}</Text>
      ),
    },
    {
      title: "Название",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      render: (title: string) => <Text strong>{title}</Text>,
    },
    {
      title: "Категория",
      dataIndex: "category",
      key: "category",
      width: 120,
      render: (category: DocumentCategory) => (
        <Tag color={DOC_CATEGORY_CONFIG[category].color}>
          {DOC_CATEGORY_CONFIG[category].label}
        </Tag>
      ),
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status: DocumentStatus) => (
        <Tag color={DOC_STATUS_CONFIG[status].color}>
          {DOC_STATUS_CONFIG[status].label}
        </Tag>
      ),
    },
    {
      title: "Заказ",
      dataIndex: "relatedOrder",
      key: "relatedOrder",
      width: 120,
      render: (order?: string) => (
        <Text type={order ? undefined : "secondary"} style={{ fontSize: 13 }}>
          {order || "\u2014"}
        </Text>
      ),
    },
    {
      title: "Загружен",
      dataIndex: "uploadedAt",
      key: "uploadedAt",
      width: 130,
      sorter: (a: Document, b: Document) =>
        new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime(),
      defaultSortOrder: "descend",
      render: (date: string) => (
        <Text style={{ fontSize: 13 }}>{formatDate(date)}</Text>
      ),
    },
    {
      title: "Истекает",
      key: "expiresAt",
      width: 130,
      render: (_: unknown, record: Document) => {
        if (!record.expiresAt) {
          return <Text type="secondary">{"\u2014"}</Text>;
        }
        const days = getDaysUntilExpiry(record.expiresAt);
        const isExpired = days < 0;
        return (
          <Text style={{ fontSize: 13, color: isExpired ? "#ff4d4f" : undefined }}>
            {formatDate(record.expiresAt)}
          </Text>
        );
      },
    },
    {
      title: "Размер",
      dataIndex: "fileSize",
      key: "fileSize",
      width: 90,
      render: (size: string) => (
        <Text type="secondary" style={{ fontSize: 13 }}>{size}</Text>
      ),
    },
  ];

  const expandedRowRender = (record: Document) => {
    const hasExpiry = !!record.expiresAt;
    const days = hasExpiry ? getDaysUntilExpiry(record.expiresAt!) : null;
    const isExpired = days !== null && days < 0;

    return (
      <div style={{ padding: "8px 0" }}>
        <div style={{ marginBottom: 12 }}>
          <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
            Описание
          </Text>
          <Text style={{ fontSize: 13 }}>{record.description}</Text>
        </div>

        {hasExpiry && days !== null && (
          <div style={{ marginBottom: 12 }}>
            <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
              Срок действия
            </Text>
            {isExpired ? (
              <Text style={{ fontSize: 13, color: "#ff4d4f" }}>
                Истёк {pluralDays(days)} назад
              </Text>
            ) : (
              <Text style={{ fontSize: 13, color: days <= 30 ? "#fa8c16" : "#52c41a" }}>
                До истечения: {pluralDays(days)}
              </Text>
            )}
          </div>
        )}

        <Space size={8}>
          <Button
            size="small"
            icon={<DownloadOutlined />}
            disabled={record.status === "pending"}
          >
            Скачать
          </Button>
          <Button size="small" icon={<UploadOutlined />}>
            Загрузить новую версию
          </Button>
          <Button size="small" icon={<DeleteOutlined />} danger>
            Удалить
          </Button>
        </Space>
      </div>
    );
  };

  return (
    <PageContainer title={false}>
      {/* Stats Row */}
      <Card
        size="small"
        style={{ marginBottom: 16, borderRadius: 8 }}
        styles={{ body: { padding: "12px 24px" } }}
      >
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          <Statistic
            title={<Text style={{ fontSize: 11 }}>Всего документов</Text>}
            value={stats.total}
            prefix={<FileTextOutlined />}
            valueStyle={{ fontSize: 20 }}
          />
          <Statistic
            title={<Text style={{ fontSize: 11 }}>Действительные</Text>}
            value={stats.valid}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ fontSize: 20, color: "#52c41a" }}
          />
          <Statistic
            title={<Text style={{ fontSize: 11 }}>Истекают</Text>}
            value={stats.expiring}
            prefix={<WarningOutlined />}
            valueStyle={{ fontSize: 20, color: "#fa8c16" }}
          />
          <Statistic
            title={<Text style={{ fontSize: 11 }}>Просрочены</Text>}
            value={stats.expired}
            prefix={<CloseCircleOutlined />}
            valueStyle={{ fontSize: 20, color: "#ff4d4f" }}
          />
          <Statistic
            title={<Text style={{ fontSize: 11 }}>Ожидают загрузки</Text>}
            value={stats.pending}
            prefix={<CloudUploadOutlined />}
            valueStyle={{ fontSize: 20, color: "#1677ff" }}
          />
          <Statistic
            title={<Text style={{ fontSize: 11 }}>На проверке</Text>}
            value={stats.inReview}
            prefix={<EyeOutlined />}
            valueStyle={{ fontSize: 20, color: "#722ed1" }}
          />
        </div>
      </Card>

      {/* Filters */}
      <Card
        size="small"
        style={{ marginBottom: 16, borderRadius: 8 }}
        styles={{ body: { padding: "12px 16px" } }}
      >
        <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
          <Space.Compact>
            <Button
              size="small"
              type={categoryFilter === "all" ? "primary" : "default"}
              onClick={() => setCategoryFilter("all")}
            >
              Все
            </Button>
            <Button
              size="small"
              icon={<FileDoneOutlined />}
              type={categoryFilter === "certificate" ? "primary" : "default"}
              onClick={() => setCategoryFilter("certificate")}
            >
              Сертификаты
            </Button>
            <Button
              size="small"
              icon={<FileTextOutlined />}
              type={categoryFilter === "contract" ? "primary" : "default"}
              onClick={() => setCategoryFilter("contract")}
            >
              Договоры
            </Button>
            <Button
              size="small"
              type={categoryFilter === "report" ? "primary" : "default"}
              onClick={() => setCategoryFilter("report")}
            >
              Отчёты
            </Button>
            <Button
              size="small"
              type={categoryFilter === "invoice" ? "primary" : "default"}
              onClick={() => setCategoryFilter("invoice")}
            >
              Счета
            </Button>
            <Button
              size="small"
              type={categoryFilter === "technical" ? "primary" : "default"}
              onClick={() => setCategoryFilter("technical")}
            >
              Техническая
            </Button>
          </Space.Compact>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            style={{ minWidth: 170 }}
            size="small"
          />
          <Input
            prefix={<SearchOutlined />}
            placeholder="Поиск документов..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            size="small"
            style={{ maxWidth: 300 }}
          />
        </div>
      </Card>

      {/* Documents Table */}
      <Card
        style={{ borderRadius: 8 }}
        styles={{ body: { padding: 0 } }}
      >
        <Table<Document>
          columns={columns}
          dataSource={filteredDocuments}
          rowKey="id"
          size="small"
          pagination={{
            pageSize: 8,
            showSizeChanger: false,
            showTotal: (total, range) => `${range[0]}-${range[1]} из ${total} документов`,
          }}
          expandable={{
            expandedRowRender,
            expandedRowKeys,
            onExpand: (expanded, record) => {
              setExpandedRowKeys(expanded ? [record.id] : []);
            },
            rowExpandable: () => true,
          }}
          onRow={(record) => ({
            onClick: () => {
              setExpandedRowKeys((prev) =>
                prev.includes(record.id) ? [] : [record.id]
              );
            },
            style: { cursor: "pointer" },
          })}
        />
      </Card>
    </PageContainer>
  );
}
