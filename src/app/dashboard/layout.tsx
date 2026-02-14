"use client";

import "@ant-design/v5-patch-for-react-19";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ConfigProvider, theme as antTheme, App, Tag, Modal } from "antd";
import { ProLayout } from "@ant-design/pro-components";
import type { MenuDataItem } from "@ant-design/pro-components";
import {
  DashboardOutlined,
  PlusCircleOutlined,
  ThunderboltOutlined,
  FileTextOutlined,
  SolutionOutlined,
  CalendarOutlined,
  MessageOutlined,
  FolderOutlined,
  BarChartOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined,
  SunOutlined,
  MoonOutlined,
  ExperimentOutlined,
  AuditOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import ruRU from "antd/locale/ru_RU";
import SplashScreen from "@/components/SplashScreen";

function HeaderClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!now) return null;
  return (
    <span className="header-info" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, opacity: 0.7, fontVariantNumeric: "tabular-nums" }}>
      <ClockCircleOutlined />
      {now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      <span style={{ opacity: 0.4 }}>|</span>
      {now.toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" })}
    </span>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(localStorage.getItem("theme") === "dark");
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    return () => {
      root.classList.remove("dark");
    };
  }, [dark, mounted]);

  const basePath = "/dashboard";

  const menuData: MenuDataItem[] = [
    {
      path: basePath,
      name: "Обзор",
      icon: <DashboardOutlined />,
    },
    {
      path: `${basePath}/new-order`,
      name: "Новый заказ",
      icon: <PlusCircleOutlined />,
    },
    {
      path: `${basePath}/my-lots`,
      name: "Мои лоты",
      icon: <ThunderboltOutlined />,
    },
    {
      path: `${basePath}/orders`,
      name: "Мои заказы",
      icon: <FileTextOutlined />,
    },
    {
      path: `${basePath}/proposals`,
      name: "Предложения",
      icon: <SolutionOutlined />,
    },
    {
      path: `${basePath}/calendar`,
      name: "Календарь",
      icon: <CalendarOutlined />,
    },
    {
      path: `${basePath}/messages`,
      name: "Сообщения",
      icon: <MessageOutlined />,
    },
    {
      path: `${basePath}/documents`,
      name: "Документы",
      icon: <FolderOutlined />,
    },
    {
      path: `${basePath}/disputes`,
      name: "Споры",
      icon: <AuditOutlined />,
    },
    {
      path: `${basePath}/analytics`,
      name: "Аналитика",
      icon: <BarChartOutlined />,
    },
    {
      path: `${basePath}/company`,
      name: "Компания",
      icon: <TeamOutlined />,
    },
    {
      path: `${basePath}/settings`,
      name: "Настройки",
      icon: <SettingOutlined />,
    },
  ];

  if (!mounted) return null;

  return (
    <>
    <SplashScreen />
    <ConfigProvider
      locale={ruRU}
      theme={{
        algorithm: dark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#2563eb",
          borderRadius: 8,
        },
      }}
    >
      <App>
        <ProLayout
          title={"Рабочее пространство для закупок"}
          logo={dark ? "/zakazhi-logo-dark.svg" : "/zakazhi-logo.png"}
          headerTitleRender={(logo) => (
            <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
              <div style={{ transform: "scale(1.2)", transformOrigin: "left center" }}>{logo}</div>
              <span style={{ fontSize: 32, fontWeight: 600, position: "relative", top: -5 }}>Рабочее пространство для закупок</span>
            </div>
          )}
          layout="mix"
          fixSiderbar
          fixedHeader
          breadcrumbRender={false}
          collapsed={collapsed}
          onCollapse={setCollapsed}
          location={{ pathname }}
          selectedKeys={[pathname]}
          route={{ path: basePath, routes: menuData }}
          menuItemRender={(item, dom) => (
            <a
              onClick={(e) => {
                e.preventDefault();
                if (item.path) router.push(item.path);
              }}
              href={item.path}
            >
              {dom}
            </a>
          )}
          actionsRender={() => [
            <span key="connection" className="header-info" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}>
              <span style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#52c41a",
                display: "inline-block",
                animation: "pulse-dot 1.5s ease-in-out infinite",
              }} />
              <span style={{ color: "#52c41a", fontWeight: 500 }}>Подключено</span>
            </span>,
            <HeaderClock key="clock" />,
            <Tag key="demo" icon={<ExperimentOutlined />} color="green">
              Демо-режим
            </Tag>,
            <Tag key="level" icon={<SafetyCertificateOutlined />} color="gold">
              Верифицированный покупатель
            </Tag>,
            <button
              key="theme"
              onClick={() => setDark((d) => !d)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                color: "inherit",
              }}
              aria-label={dark ? "Переключить на светлую тему" : "Переключить на тёмную тему"}
            >
              {dark ? <SunOutlined /> : <MoonOutlined />}
            </button>,
            <button
              key="signout"
              onClick={() => setSignOutOpen(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                color: "inherit",
              }}
              aria-label="Выйти"
            >
              <LogoutOutlined />
            </button>,
          ]}
          token={{
            sider: {
              colorMenuBackground: dark ? "#141414" : "#fff",
              colorBgMenuItemSelected: dark ? "#383838" : undefined,
              colorBgMenuItemHover: dark ? "#303030" : undefined,
            },
            header: {
              colorBgHeader: dark ? "#141414" : "#fff",
              colorBgRightActionsItemHover: "transparent",
            },
          }}
        >
          {children}
          <Modal
            title="Выход"
            open={signOutOpen}
            onOk={() => router.push("/")}
            onCancel={() => setSignOutOpen(false)}
            okText="Выйти"
            cancelText="Отмена"
            okButtonProps={{ danger: true }}
            styles={{
              content: dark ? { backgroundColor: "#383838" } : undefined,
              header: dark ? { backgroundColor: "#383838" } : undefined,
            }}
          >
            <p>Вы уверены, что хотите выйти из системы?</p>
          </Modal>
        </ProLayout>
      </App>
    </ConfigProvider>
    </>
  );
}
