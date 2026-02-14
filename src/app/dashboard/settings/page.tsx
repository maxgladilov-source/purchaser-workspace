"use client";

import { useState, useEffect } from "react";
import { PageContainer } from "@ant-design/pro-components";
import {
  Card,
  Typography,
  Switch,
  Select,
  Radio,
  Divider,
  Row,
  Col,
  Button,
  App,
} from "antd";
import {
  SunOutlined,
  MoonOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  LayoutOutlined,
  BellOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
  MessageOutlined,
  AuditOutlined,
  FolderOutlined,
  SoundOutlined,
  DesktopOutlined,
  AppstoreOutlined,
  SaveOutlined,
  UndoOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

// --- Types ---

type ThemeMode = "light" | "dark";
type DateFormat = "ДД.ММ.ГГГГ" | "ММ/ДД/ГГГГ" | "ГГГГ-ММ-ДД";
type NumberFormat = "1 234,56" | "1,234.56" | "1.234,56";
type DefaultPage = "overview" | "orders" | "lots" | "messages" | "calendar";
type DisplayCurrency = "RUB" | "USD" | "EUR" | "CNY";

interface Settings {
  theme: ThemeMode;
  fontSize: number;
  timezone: string;
  dateFormat: DateFormat;
  numberFormat: NumberFormat;
  displayCurrency: DisplayCurrency;
  defaultPage: DefaultPage;
  sidebarCollapsed: boolean;
  notifyOrders: boolean;
  notifyLots: boolean;
  notifyDisputes: boolean;
  notifyMessages: boolean;
  notifyDocuments: boolean;
  notifyBrowser: boolean;
  notifySound: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  theme: "light",
  fontSize: 14,
  timezone: "Europe/Moscow",
  dateFormat: "ДД.ММ.ГГГГ",
  numberFormat: "1 234,56",
  displayCurrency: "RUB",
  defaultPage: "overview",
  sidebarCollapsed: false,
  notifyOrders: true,
  notifyLots: true,
  notifyDisputes: true,
  notifyMessages: true,
  notifyDocuments: false,
  notifyBrowser: true,
  notifySound: false,
};

const TIMEZONES = [
  { value: "Europe/Moscow", label: "Москва (UTC+3)" },
  { value: "Europe/Samara", label: "Самара (UTC+4)" },
  { value: "Asia/Yekaterinburg", label: "Екатеринбург (UTC+5)" },
  { value: "Asia/Omsk", label: "Омск (UTC+6)" },
  { value: "Asia/Krasnoyarsk", label: "Красноярск (UTC+7)" },
  { value: "Asia/Irkutsk", label: "Иркутск (UTC+8)" },
  { value: "Asia/Vladivostok", label: "Владивосток (UTC+10)" },
  { value: "Europe/Kaliningrad", label: "Калининград (UTC+2)" },
  { value: "Europe/Minsk", label: "Минск (UTC+3)" },
  { value: "Asia/Almaty", label: "Алматы (UTC+6)" },
];

// --- Setting Row ---

function SettingRow({
  icon,
  label,
  description,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 0",
        gap: 24,
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flex: 1 }}>
        <span style={{ fontSize: 16, marginTop: 2, opacity: 0.65 }}>{icon}</span>
        <div>
          <Text strong style={{ fontSize: 13 }}>
            {label}
          </Text>
          {description && (
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {description}
              </Text>
            </div>
          )}
        </div>
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

// --- Section Header ---

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 2 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <Title level={5} style={{ margin: 0 }}>
          {title}
        </Title>
      </div>
      <Text type="secondary" style={{ fontSize: 12 }}>
        {description}
      </Text>
    </div>
  );
}

// --- Main Page ---

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(true);
  const { message } = App.useApp();

  useEffect(() => {
    const stored = localStorage.getItem("dashboard-settings");
    if (stored) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      } catch {
        // ignore
      }
    }
  }, []);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem("dashboard-settings", JSON.stringify(settings));
    setSaved(true);
    message.success("Настройки сохранены");
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem("dashboard-settings");
    setSaved(true);
    message.info("Настройки сброшены");
  };

  return (
    <PageContainer title={false}>
      <Row gutter={[16, 16]}>
        {/* Left column */}
        <Col xs={24} lg={12}>
          {/* Appearance */}
          <Card
            size="small"
            style={{ marginBottom: 16, borderRadius: 8 }}
            styles={{ body: { padding: "12px 20px" } }}
          >
            <SectionHeader
              icon={<SunOutlined />}
              title="Внешний вид"
              description="Тема, цвета и размер шрифта"
            />
            <Divider style={{ margin: "12px 0 4px" }} />

            <SettingRow
              icon={<SunOutlined />}
              label="Тема"
              description="Выберите светлую или тёмную тему оформления"
            >
              <Radio.Group
                value={settings.theme}
                onChange={(e) => update("theme", e.target.value)}
                optionType="button"
                buttonStyle="solid"
                size="small"
              >
                <Radio.Button value="light">
                  <SunOutlined /> Светлая
                </Radio.Button>
                <Radio.Button value="dark">
                  <MoonOutlined /> Тёмная
                </Radio.Button>
              </Radio.Group>
            </SettingRow>

            <SettingRow
              icon={<span style={{ fontSize: 16, fontWeight: 700 }}>A</span>}
              label="Размер шрифта"
              description="Размер текста во всём интерфейсе"
            >
              <div style={{ display: "flex", gap: 8 }}>
                {([
                  { value: 12, label: "Мелкий", size: 12 },
                  { value: 14, label: "Средний", size: 14 },
                  { value: 16, label: "Крупный", size: 16 },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update("fontSize", opt.value)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "6px 14px",
                      borderRadius: 8,
                      border: settings.fontSize === opt.value
                        ? "2px solid var(--ant-color-primary, #1677ff)"
                        : "1.5px solid var(--ant-color-border, #d9d9d9)",
                      background: settings.fontSize === opt.value
                        ? "var(--ant-color-primary-bg, #e6f4ff)"
                        : "transparent",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      fontSize: opt.size,
                      fontWeight: 500,
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </SettingRow>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                background: "var(--ant-color-bg-container-disabled, #fafafa)",
                fontSize: settings.fontSize,
                lineHeight: 1.6,
                marginBottom: 8,
              }}
            >
              Заказ <strong>ОРД-1042</strong> — Корпуса из алюминия ЧПУ, 85 000 ₽
            </div>
          </Card>

          {/* Region */}
          <Card
            size="small"
            style={{ marginBottom: 16, borderRadius: 8 }}
            styles={{ body: { padding: "12px 20px" } }}
          >
            <SectionHeader
              icon={<ClockCircleOutlined />}
              title="Регион и формат"
              description="Часовой пояс, формат даты и валюта"
            />
            <Divider style={{ margin: "12px 0 4px" }} />

            <SettingRow
              icon={<ClockCircleOutlined />}
              label="Часовой пояс"
              description="Используется для отображения дат и дедлайнов"
            >
              <Select
                value={settings.timezone}
                onChange={(v) => update("timezone", v)}
                size="small"
                style={{ width: 220 }}
                options={TIMEZONES}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
              />
            </SettingRow>

            <SettingRow
              icon={<CalendarOutlined />}
              label="Формат даты"
              description="Как отображаются даты в интерфейсе"
            >
              <Select
                value={settings.dateFormat}
                onChange={(v) => update("dateFormat", v)}
                size="small"
                style={{ width: 180 }}
                options={[
                  { value: "ДД.ММ.ГГГГ", label: "ДД.ММ.ГГГГ" },
                  { value: "ММ/ДД/ГГГГ", label: "ММ/ДД/ГГГГ" },
                  { value: "ГГГГ-ММ-ДД", label: "ГГГГ-ММ-ДД (ISO)" },
                ]}
              />
            </SettingRow>

            <SettingRow
              icon={<span style={{ fontWeight: 600 }}>#</span>}
              label="Формат чисел"
              description="Разделители тысяч и десятичных"
            >
              <Select
                value={settings.numberFormat}
                onChange={(v) => update("numberFormat", v)}
                size="small"
                style={{ width: 140 }}
                options={[
                  { value: "1 234,56", label: "1 234,56" },
                  { value: "1,234.56", label: "1,234.56" },
                  { value: "1.234,56", label: "1.234,56" },
                ]}
              />
            </SettingRow>

            <SettingRow
              icon={<span style={{ fontWeight: 600 }}>₽</span>}
              label="Валюта"
              description="Валюта для отображения цен в заказах, лотах и спорах"
            >
              <Select
                value={settings.displayCurrency}
                onChange={(v) => update("displayCurrency", v)}
                size="small"
                style={{ width: 160 }}
                options={[
                  { value: "RUB", label: "₽ RUB (Рубль)" },
                  { value: "USD", label: "$ USD (Доллар)" },
                  { value: "EUR", label: "€ EUR (Евро)" },
                  { value: "CNY", label: "¥ CNY (Юань)" },
                ]}
              />
            </SettingRow>
          </Card>
        </Col>

        {/* Right column */}
        <Col xs={24} lg={12}>
          {/* Layout */}
          <Card
            size="small"
            style={{ marginBottom: 16, borderRadius: 8 }}
            styles={{ body: { padding: "12px 20px" } }}
          >
            <SectionHeader
              icon={<LayoutOutlined />}
              title="Интерфейс"
              description="Навигация и поведение страниц"
            />
            <Divider style={{ margin: "12px 0 4px" }} />

            <SettingRow
              icon={<AppstoreOutlined />}
              label="Страница по умолчанию"
              description="Страница, отображаемая после входа"
            >
              <Select
                value={settings.defaultPage}
                onChange={(v) => update("defaultPage", v)}
                size="small"
                style={{ width: 180 }}
                options={[
                  { value: "overview", label: "Обзор" },
                  { value: "orders", label: "Мои заказы" },
                  { value: "lots", label: "Мои лоты" },
                  { value: "messages", label: "Сообщения" },
                  { value: "calendar", label: "Календарь" },
                ]}
              />
            </SettingRow>

            <SettingRow
              icon={<LayoutOutlined />}
              label="Свёрнутое меню"
              description="Запускать с минимизированным боковым меню"
            >
              <Switch
                checked={settings.sidebarCollapsed}
                onChange={(v) => update("sidebarCollapsed", v)}
                size="small"
              />
            </SettingRow>
          </Card>

          {/* Notifications */}
          <Card
            size="small"
            style={{ marginBottom: 16, borderRadius: 8 }}
            styles={{ body: { padding: "12px 20px" } }}
          >
            <SectionHeader
              icon={<BellOutlined />}
              title="Уведомления"
              description="Выберите, какие события отправляют уведомления"
            />
            <Divider style={{ margin: "12px 0 4px" }} />

            <Text
              type="secondary"
              style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}
            >
              Категории событий
            </Text>

            <SettingRow
              icon={<FileTextOutlined />}
              label="Заказы"
              description="Новые заказы, изменения статуса, дедлайны"
            >
              <Switch
                checked={settings.notifyOrders}
                onChange={(v) => update("notifyOrders", v)}
                size="small"
              />
            </SettingRow>

            <SettingRow
              icon={<ThunderboltOutlined />}
              label="Лоты"
              description="Новые предложения, завершение сбора, присуждение"
            >
              <Switch
                checked={settings.notifyLots}
                onChange={(v) => update("notifyLots", v)}
                size="small"
              />
            </SettingRow>

            <SettingRow
              icon={<AuditOutlined />}
              label="Споры"
              description="Новые споры, обновления статуса, сообщения медиатора"
            >
              <Switch
                checked={settings.notifyDisputes}
                onChange={(v) => update("notifyDisputes", v)}
                size="small"
              />
            </SettingRow>

            <SettingRow
              icon={<MessageOutlined />}
              label="Сообщения"
              description="Новые сообщения от операторов и поставщиков"
            >
              <Switch
                checked={settings.notifyMessages}
                onChange={(v) => update("notifyMessages", v)}
                size="small"
              />
            </SettingRow>

            <SettingRow
              icon={<FolderOutlined />}
              label="Документы"
              description="Истекающие сертификаты, напоминания о загрузке"
            >
              <Switch
                checked={settings.notifyDocuments}
                onChange={(v) => update("notifyDocuments", v)}
                size="small"
              />
            </SettingRow>

            <Divider style={{ margin: "8px 0" }} />
            <Text
              type="secondary"
              style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}
            >
              Способы доставки
            </Text>

            <SettingRow
              icon={<DesktopOutlined />}
              label="Уведомления в браузере"
              description="Push-уведомления в браузере"
            >
              <Switch
                checked={settings.notifyBrowser}
                onChange={(v) => update("notifyBrowser", v)}
                size="small"
              />
            </SettingRow>

            <SettingRow
              icon={<SoundOutlined />}
              label="Звук"
              description="Воспроизводить звук при новых уведомлениях"
            >
              <Switch
                checked={settings.notifySound}
                onChange={(v) => update("notifySound", v)}
                size="small"
              />
            </SettingRow>
          </Card>
        </Col>
      </Row>

      {/* Action buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
          padding: "8px 0 16px",
        }}
      >
        <Button icon={<UndoOutlined />} onClick={handleReset}>
          Сбросить
        </Button>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSave}
          disabled={saved}
        >
          {saved ? "Сохранено" : "Сохранить"}
        </Button>
      </div>
    </PageContainer>
  );
}
