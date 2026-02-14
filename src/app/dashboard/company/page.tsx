"use client";

import { useState, useMemo, useEffect } from "react";
import { PageContainer } from "@ant-design/pro-components";
import {
  Card,
  Table,
  Tag,
  Button,
  Input,
  Select,
  Statistic,
  Modal,
  Form,
  Switch,
  Typography,
  Space,
  Popconfirm,
  Avatar,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  UserOutlined,
  TeamOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ShopOutlined,
  SafetyCertificateOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  BankOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  SendOutlined,
  IdcardOutlined,
  AuditOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Role = "purchaser" | "engineer" | "project_manager";

interface CompanyUser {
  id: string;
  name: string;
  email: string;
  telegram: string;
  role: Role;
  active: boolean;
  lastLogin: string | null;
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const companyProfile = {
  id: "CMP-01275",
  name: 'ООО "ТехноПром Групп"',
  legalName: "Общество с ограниченной ответственностью \u00ABТехноПром Групп\u00BB",
  description:
    "Производство высокоточных компонентов для машиностроения, авиакосмической и электронной промышленности. Закупка комплектующих, аутсорсинг производства.",
  inn: "7725123456",
  ogrn: "1157746789012",
  industry: "Машиностроение, Электроника",
  founded: "2015",
  employees: "80\u2013100",
  address: "г. Москва, ул. Промышленная, д. 15, стр. 2, 105187",
  phone: "+7 (495) 123-45-67",
  email: "info@technoprom.ru",
  website: "www.technoprom.ru",
  representative: {
    name: "Иванов Алексей Сергеевич",
    title: "Генеральный директор",
    phone: "+7 (495) 123-45-68",
    email: "ivanov@technoprom.ru",
    telegram: "@ivanov_as",
  },
  admin: {
    name: "Петрова Мария Ивановна",
    title: "Системный администратор",
    phone: "+7 (495) 123-45-69",
    email: "petrova@technoprom.ru",
    telegram: "@petrova_mi",
  },
  registeredAt: "2025-04-15",
  certifications: [
    { name: "ISO 9001:2015", issuer: "TUV Rheinland", issued: "2023-01-20", expires: "2026-01-19", status: "active" as const },
    { name: "ISO 14001:2015", issuer: "SGS", issued: "2023-06-10", expires: "2026-06-09", status: "active" as const },
    { name: "ГОСТ Р ИСО 9001-2015", issuer: "Ростест", issued: "2022-09-01", expires: "2025-08-31", status: "expiring" as const },
  ],
};

const initialUsers: CompanyUser[] = [
  {
    id: "u-1",
    name: "Иванов Алексей Сергеевич",
    email: "ivanov@technoprom.ru",
    telegram: "@ivanov_as",
    role: "purchaser",
    active: true,
    lastLogin: "2026-02-13 09:15",
    createdAt: "2025-04-15",
  },
  {
    id: "u-2",
    name: "Сидоров Дмитрий Олегович",
    email: "sidorov@technoprom.ru",
    telegram: "@sidorov_do",
    role: "engineer",
    active: true,
    lastLogin: "2026-02-12 17:42",
    createdAt: "2025-04-15",
  },
  {
    id: "u-3",
    name: "Петрова Мария Ивановна",
    email: "petrova@technoprom.ru",
    telegram: "@petrova_mi",
    role: "purchaser",
    active: true,
    lastLogin: "2026-02-11 11:30",
    createdAt: "2025-05-20",
  },
  {
    id: "u-4",
    name: "Козлов Андрей Викторович",
    email: "kozlov@technoprom.ru",
    telegram: "@kozlov_av",
    role: "project_manager",
    active: true,
    lastLogin: "2026-02-10 08:05",
    createdAt: "2025-06-01",
  },
  {
    id: "u-5",
    name: "Новикова Елена Павловна",
    email: "novikova@technoprom.ru",
    telegram: "",
    role: "engineer",
    active: false,
    lastLogin: "2026-01-20 14:22",
    createdAt: "2025-08-10",
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const roleConfig: Record<Role, { label: string; color: string }> = {
  purchaser: { label: "Закупщик", color: "blue" },
  engineer: { label: "Инженер-конструктор", color: "orange" },
  project_manager: { label: "Руководитель проектов", color: "green" },
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function CompanyPage() {
  const [users, setUsers] = useState<CompanyUser[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<CompanyUser | null>(null);
  const [form] = Form.useForm();
  const [dark, setDark] = useState(false);
  const companyLogo: string | null = null;

  useEffect(() => {
    const root = document.documentElement;
    setDark(root.classList.contains("dark"));
    const obs = new MutationObserver(() => setDark(root.classList.contains("dark")));
    obs.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (statusFilter === "active" && !u.active) return false;
      if (statusFilter === "inactive" && u.active) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [users, roleFilter, statusFilter, search]);

  const totalActive = users.filter((u) => u.active).length;
  const purchaserCount = users.filter((u) => u.role === "purchaser" && u.active).length;
  const engineerCount = users.filter((u) => u.role === "engineer" && u.active).length;
  const pmCount = users.filter((u) => u.role === "project_manager" && u.active).length;

  function openAddModal() {
    setEditingUser(null);
    form.resetFields();
    form.setFieldsValue({ role: "purchaser", active: true });
    setModalOpen(true);
  }

  function openEditModal(user: CompanyUser) {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      telegram: user.telegram,
      role: user.role,
      active: user.active,
    });
    setModalOpen(true);
  }

  function handleModalOk() {
    form.validateFields().then((values) => {
      if (editingUser) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingUser.id
              ? { ...u, name: values.name, email: values.email, telegram: values.telegram || "", role: values.role, active: values.active }
              : u
          )
        );
        message.success("Пользователь обновлён");
      } else {
        const newUser: CompanyUser = {
          id: `u-${Date.now()}`,
          name: values.name,
          email: values.email,
          telegram: values.telegram || "",
          role: values.role,
          active: values.active,
          lastLogin: null,
          createdAt: new Date().toISOString().slice(0, 10),
        };
        setUsers((prev) => [...prev, newUser]);
        message.success("Пользователь добавлен");
      }
      setModalOpen(false);
    });
  }

  function handleDelete(id: string) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    message.success("Пользователь удалён");
  }

  function handleToggleActive(id: string, active: boolean) {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active } : u))
    );
    message.success(active ? "Пользователь активирован" : "Пользователь деактивирован");
  }

  const columns: ColumnsType<CompanyUser> = [
    {
      title: "Пользователь",
      key: "user",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar
            size={36}
            style={{
              backgroundColor: record.active
                ? (record.role === "purchaser" ? "#1677ff" : record.role === "engineer" ? "#fa8c16" : "#52c41a")
                : "#d9d9d9",
              flexShrink: 0,
            }}
          >
            {record.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
          </Avatar>
          <div>
            <Text strong style={{ fontSize: 13 }}>{record.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Роль",
      dataIndex: "role",
      key: "role",
      width: 200,
      render: (role: Role) => (
        <Tag color={roleConfig[role].color}>{roleConfig[role].label}</Tag>
      ),
    },
    {
      title: "Telegram",
      dataIndex: "telegram",
      key: "telegram",
      width: 140,
      render: (val: string) =>
        val ? (
          <Text style={{ fontSize: 12 }}><SendOutlined style={{ color: "#229ED9", marginRight: 4 }} />{val}</Text>
        ) : (
          <Text type="secondary" style={{ fontSize: 12 }}>\u2014</Text>
        ),
    },
    {
      title: "Статус",
      dataIndex: "active",
      key: "active",
      width: 110,
      render: (active: boolean, record) => (
        <Switch
          checked={active}
          checkedChildren="Актив."
          unCheckedChildren="Откл."
          onChange={(checked) => handleToggleActive(record.id, checked)}
          size="small"
        />
      ),
    },
    {
      title: "Последний вход",
      dataIndex: "lastLogin",
      key: "lastLogin",
      width: 160,
      render: (val: string | null) =>
        val ? (
          <Text style={{ fontSize: 12 }}>{val}</Text>
        ) : (
          <Text type="secondary" style={{ fontSize: 12 }}>Никогда</Text>
        ),
    },
    {
      title: "Добавлен",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 110,
      render: (val: string) => <Text style={{ fontSize: 12 }}>{val}</Text>,
    },
    {
      title: "",
      key: "actions",
      width: 90,
      render: (_, record) => (
        <Space size={4}>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          />
          <Popconfirm
            title="Удалить пользователя?"
            description="Пользователь потеряет доступ к системе закупок."
            onConfirm={() => handleDelete(record.id)}
            okText="Удалить"
            cancelText="Отмена"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title={false}>
      {/* ================================================================ */}
      {/*  Company Profile                                                  */}
      {/* ================================================================ */}

      <Card style={{ borderRadius: 8, marginBottom: 16 }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
          <div
            style={{
              width: 200, height: 48, borderRadius: 8,
              border: "1px solid",
              borderColor: dark ? "#333" : "#e0e0e0",
              background: dark ? "#1f1f1f" : "#fafafa",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {companyLogo ? (
              <img
                src={companyLogo}
                alt="Логотип компании"
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
              />
            ) : (
              <span style={{ fontSize: 13, color: dark ? "#555" : "#bbb", fontWeight: 500, letterSpacing: 0.3 }}>
                Логотип компании
              </span>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <Title level={4} style={{ margin: 0 }}>{companyProfile.name}</Title>
            <Text type="secondary" style={{ fontSize: 13 }}>{companyProfile.legalName}</Text>
          </div>
        </div>

        {/* Description */}
        <div style={{
          padding: "10px 14px",
          borderRadius: 8,
          background: dark ? "#1f1f1f" : "#f7f8fa",
          marginBottom: 20,
          lineHeight: 1.7,
        }}>
          <Text style={{ fontSize: 13 }}>{companyProfile.description}</Text>
        </div>

        {/* Details grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 14,
          marginBottom: 16,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <BankOutlined style={{ color: "#1677ff", fontSize: 15, marginTop: 2 }} />
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>ID компании</Text>
              <br />
              <Text strong style={{ fontSize: 13 }}>{companyProfile.id}</Text>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <IdcardOutlined style={{ color: "#1677ff", fontSize: 15, marginTop: 2 }} />
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>ИНН</Text>
              <br />
              <Text strong style={{ fontSize: 13 }}>{companyProfile.inn}</Text>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <AuditOutlined style={{ color: "#1677ff", fontSize: 15, marginTop: 2 }} />
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>ОГРН</Text>
              <br />
              <Text strong style={{ fontSize: 13 }}>{companyProfile.ogrn}</Text>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <ShopOutlined style={{ color: "#1677ff", fontSize: 15, marginTop: 2 }} />
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>Отрасль</Text>
              <br />
              <Text strong style={{ fontSize: 13 }}>{companyProfile.industry}</Text>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <TeamOutlined style={{ color: "#1677ff", fontSize: 15, marginTop: 2 }} />
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>Сотрудники</Text>
              <br />
              <Text strong style={{ fontSize: 13 }}>{companyProfile.employees}</Text>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <CalendarOutlined style={{ color: "#1677ff", fontSize: 15, marginTop: 2 }} />
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>Год основания</Text>
              <br />
              <Text strong style={{ fontSize: 13 }}>{companyProfile.founded}</Text>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <EnvironmentOutlined style={{ color: "#1677ff", fontSize: 15, marginTop: 2 }} />
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>Адрес</Text>
              <br />
              <Text strong style={{ fontSize: 13 }}>{companyProfile.address}</Text>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <PhoneOutlined style={{ color: "#1677ff", fontSize: 15, marginTop: 2 }} />
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>Телефон</Text>
              <br />
              <Text strong style={{ fontSize: 13 }}>{companyProfile.phone}</Text>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <MailOutlined style={{ color: "#1677ff", fontSize: 15, marginTop: 2 }} />
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>Email</Text>
              <br />
              <Text strong style={{ fontSize: 13 }}>{companyProfile.email}</Text>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <GlobalOutlined style={{ color: "#1677ff", fontSize: 15, marginTop: 2 }} />
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>Сайт</Text>
              <br />
              <a href={`https://${companyProfile.website}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 600 }}>{companyProfile.website}</a>
            </div>
          </div>
        </div>

        {/* Authorized Representative — nested card */}
        <div style={{
          border: "1px solid",
          borderColor: dark ? "#333" : "#e8e8e8",
          borderRadius: 8,
          padding: "12px 16px",
          background: dark ? "#1a1a1a" : "#fafbfc",
          display: "flex", alignItems: "center", gap: 14,
          flexWrap: "wrap",
        }}>
          <Avatar size={36} style={{ backgroundColor: "#1677ff", flexShrink: 0, fontSize: 14 }}>
            {companyProfile.representative.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
          </Avatar>
          <div style={{ minWidth: 140 }}>
            <Text strong style={{ fontSize: 13 }}>{companyProfile.representative.name}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}> · {companyProfile.representative.title}</Text>
          </div>
          <div style={{ width: 1, height: 24, background: dark ? "#333" : "#e0e0e0", flexShrink: 0 }} />
          <Text style={{ fontSize: 12 }}><PhoneOutlined style={{ color: "#1677ff", marginRight: 4 }} />{companyProfile.representative.phone}</Text>
          <Text style={{ fontSize: 12 }}><MailOutlined style={{ color: "#1677ff", marginRight: 4 }} />{companyProfile.representative.email}</Text>
          <Text style={{ fontSize: 12 }}><SendOutlined style={{ color: "#229ED9", marginRight: 4 }} />{companyProfile.representative.telegram}</Text>
          <div style={{ flex: 1 }} />
          <Button
            size="small"
            icon={<PhoneOutlined />}
            href={`mailto:info@everypart.pro?subject=Запрос на изменение профиля компании — ${companyProfile.id}`}
          >
            Запросить изменения через поддержку
          </Button>
        </div>

        {/* Admin — nested card */}
        <div style={{
          marginTop: 8,
          border: "1px solid",
          borderColor: dark ? "#333" : "#e8e8e8",
          borderRadius: 8,
          padding: "12px 16px",
          background: dark ? "#1a1a1a" : "#fafbfc",
          display: "flex", alignItems: "center", gap: 14,
          flexWrap: "wrap",
        }}>
          <Avatar size={36} style={{ backgroundColor: "#fa8c16", flexShrink: 0, fontSize: 14 }}>
            {companyProfile.admin.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
          </Avatar>
          <div style={{ minWidth: 140 }}>
            <Text strong style={{ fontSize: 13 }}>{companyProfile.admin.name}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}> · {companyProfile.admin.title}</Text>
          </div>
          <div style={{ width: 1, height: 24, background: dark ? "#333" : "#e0e0e0", flexShrink: 0 }} />
          <Text style={{ fontSize: 12 }}><PhoneOutlined style={{ color: "#1677ff", marginRight: 4 }} />{companyProfile.admin.phone}</Text>
          <Text style={{ fontSize: 12 }}><MailOutlined style={{ color: "#1677ff", marginRight: 4 }} />{companyProfile.admin.email}</Text>
          <Text style={{ fontSize: 12 }}><SendOutlined style={{ color: "#229ED9", marginRight: 4 }} />{companyProfile.admin.telegram}</Text>
        </div>

      </Card>

      {/* ================================================================ */}
      {/*  Certifications                                                    */}
      {/* ================================================================ */}

      <Card style={{ borderRadius: 8, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <SafetyCertificateOutlined style={{ fontSize: 18, color: "#fa8c16" }} />
          <Title level={5} style={{ margin: 0 }}>Сертификации</Title>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 12,
        }}>
          {companyProfile.certifications.map((cert) => {
            const isExpiring = cert.status === "expiring";
            const borderColor = isExpiring ? "#faad14" : (dark ? "#333" : "#f0f0f0");
            return (
              <div
                key={cert.name}
                style={{
                  border: `1px solid ${borderColor}`,
                  borderRadius: 8,
                  padding: "12px 16px",
                  background: isExpiring
                    ? (dark ? "rgba(250,173,20,0.08)" : "rgba(250,173,20,0.04)")
                    : (dark ? "#1f1f1f" : "#fafafa"),
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <Text strong style={{ fontSize: 14 }}>{cert.name}</Text>
                  <Tag
                    color={isExpiring ? "warning" : "success"}
                    style={{ marginRight: 0 }}
                  >
                    {isExpiring ? "Истекает" : "Активен"}
                  </Tag>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Выдан: <Text style={{ fontSize: 12 }}>{cert.issuer}</Text>
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Действует: {cert.issued} \u2014 {cert.expires}
                  </Text>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ================================================================ */}
      {/*  User Access Management                                           */}
      {/* ================================================================ */}

      <div style={{ marginBottom: 12, marginTop: 24 }}>
        <Title level={5} style={{ margin: 0 }}>Управление доступом</Title>
        <Text type="secondary" style={{ fontSize: 13 }}>Управление пользователями и их ролями в системе закупок</Text>
      </div>

      {/* Stats */}
      <Card style={{ borderRadius: 8, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          <Statistic
            title="Всего пользователей"
            value={`${totalActive}/${users.length}`}
            prefix={<TeamOutlined style={{ color: "#1677ff" }} />}
            valueStyle={{ fontSize: 22 }}
          />
          <Statistic
            title="Закупщики"
            value={purchaserCount}
            prefix={<UserOutlined style={{ color: "#1677ff" }} />}
            valueStyle={{ fontSize: 22, color: "#1677ff" }}
          />
          <Statistic
            title="Инженеры"
            value={engineerCount}
            prefix={<UserOutlined style={{ color: "#fa8c16" }} />}
            valueStyle={{ fontSize: 22, color: "#fa8c16" }}
          />
          <Statistic
            title="Руководители проектов"
            value={pmCount}
            prefix={<UserOutlined style={{ color: "#52c41a" }} />}
            valueStyle={{ fontSize: 22, color: "#52c41a" }}
          />
        </div>
      </Card>

      {/* Filters + Add */}
      <Card size="small" style={{ borderRadius: 8, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Input
            placeholder="Поиск по имени или email..."
            prefix={<SearchOutlined />}
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 260 }}
          />
          <Select
            value={roleFilter}
            onChange={setRoleFilter}
            style={{ width: 200 }}
            options={[
              { value: "all", label: "Все роли" },
              { value: "purchaser", label: "Закупщик" },
              { value: "engineer", label: "Инженер-конструктор" },
              { value: "project_manager", label: "Руководитель проектов" },
            ]}
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 140 }}
            options={[
              { value: "all", label: "Все статусы" },
              { value: "active", label: "Активные" },
              { value: "inactive", label: "Неактивные" },
            ]}
          />
          <div style={{ flex: 1 }} />
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
            Добавить
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card style={{ borderRadius: 8 }}>
        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={false}
          size="middle"
          locale={{ emptyText: "Нет пользователей, соответствующих фильтрам" }}
        />
      </Card>

      {/* Add / Edit Modal */}
      <Modal
        title={editingUser ? "Редактировать пользователя" : "Добавить пользователя"}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        okText={editingUser ? "Сохранить" : "Добавить"}
        cancelText="Отмена"
        width={460}
        destroyOnHidden
        styles={{
          content: dark ? { backgroundColor: "#383838" } : undefined,
          header: dark ? { backgroundColor: "#383838" } : undefined,
        }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="ФИО"
            rules={[{ required: true, message: "Введите имя пользователя" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Например, Иванов Алексей Сергеевич" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Введите email" },
              { type: "email", message: "Введите корректный email" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="user@company.ru" />
          </Form.Item>
          <Form.Item name="telegram" label="Telegram">
            <Input prefix={<SendOutlined style={{ color: "#229ED9" }} />} placeholder="Например, @ivanov_as" />
          </Form.Item>
          <Form.Item
            name="role"
            label="Роль"
            rules={[{ required: true, message: "Выберите роль" }]}
          >
            <Select
              options={[
                { value: "purchaser", label: "Закупщик" },
                { value: "engineer", label: "Инженер-конструктор" },
                { value: "project_manager", label: "Руководитель проектов" },
              ]}
            />
          </Form.Item>
          <Form.Item name="active" label="Активен" valuePropName="checked">
            <Switch checkedChildren="Актив." unCheckedChildren="Откл." />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
}
