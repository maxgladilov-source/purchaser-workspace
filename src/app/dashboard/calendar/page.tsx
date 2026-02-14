"use client";

import { useState, useCallback } from "react";
import { PageContainer } from "@ant-design/pro-components";
import {
  Card,
  Tag,
  Typography,
  Empty,
  Divider,
  Descriptions,
  Steps,
  Badge,
  Button,
  Space,
} from "antd";
import {
  ClockCircleOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  UserOutlined,
  FileTextOutlined,
  ShoppingOutlined,
  VideoCameraOutlined,
  PhoneOutlined,
  TeamOutlined,
  AuditOutlined,
  LinkOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  ThunderboltOutlined,
  FlagOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventClickArg, EventDropArg } from "@fullcalendar/core";
import type { EventInput } from "@fullcalendar/core";
import {
  calendarEvents,
  EVENT_TYPE_LABELS,
  EVENT_COLORS,
  type EventType,
  type EventExtendedProps,
  type OrderProps,
  type LotProps,
  type QcProps,
  type MeetingProps,
  type DocumentProps,
} from "@/lib/calendar-mock-data";
import "./calendar.css";

const { Text, Title, Paragraph } = Typography;

const TAG_COLORS: Record<EventType, string> = {
  order: "blue",
  lot: "orange",
  qc: "green",
  meeting: "purple",
  document: "red",
};

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "red",
  high: "orange",
  normal: "blue",
  low: "default",
};

const PRIORITY_LABELS: Record<string, string> = {
  urgent: "СРОЧНО",
  high: "ВЫСОКИЙ",
  normal: "ОБЫЧНЫЙ",
  low: "НИЗКИЙ",
};

const CALL_TYPE_ICONS: Record<string, React.ReactNode> = {
  video: <VideoCameraOutlined />,
  phone: <PhoneOutlined />,
  "in-person": <TeamOutlined />,
};

const CALL_TYPE_LABELS: Record<string, string> = {
  video: "Видеозвонок",
  phone: "Телефон",
  "in-person": "Очная встреча",
};

function formatDateTime(iso: string): string {
  const dt = new Date(iso);
  return dt.toLocaleString("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTime(iso: string): string {
  const dt = new Date(iso);
  return dt.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

// --- Type-specific detail panels ---

function OrderDetails({ props }: { props: OrderProps }) {
  return (
    <>
      <Descriptions column={2} size="small" colon={false}>
        <Descriptions.Item label={<><ShoppingOutlined /> Заказ</>}>
          <Text strong>{props.orderId}</Text>
        </Descriptions.Item>
        <Descriptions.Item label={<><FlagOutlined /> Приоритет</>}>
          <Tag color={PRIORITY_COLORS[props.priority]}>{PRIORITY_LABELS[props.priority]}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label={<><UserOutlined /> Поставщик</>}>
          {props.supplier}
        </Descriptions.Item>
        <Descriptions.Item label="Статус">
          <Badge status="processing" text={props.status} />
        </Descriptions.Item>
        <Descriptions.Item label="Технология">{props.technology}</Descriptions.Item>
        <Descriptions.Item label="Материал">{props.material}</Descriptions.Item>
        <Descriptions.Item label="Количество" span={2}>{props.quantity}</Descriptions.Item>
      </Descriptions>
      <Divider style={{ margin: "12px 0" }} />
      <div>
        <Text type="secondary" style={{ fontSize: 12 }}><InfoCircleOutlined /> Примечания</Text>
        <Paragraph style={{ margin: "4px 0 0" }}>{props.description}</Paragraph>
      </div>
    </>
  );
}

function LotDetails({ props }: { props: LotProps }) {
  const statusMap: Record<string, { color: string; label: string }> = {
    open: { color: "green", label: "Открыт" },
    closing_soon: { color: "orange", label: "Скоро закрытие" },
    closed: { color: "default", label: "Закрыт" },
  };
  const s = statusMap[props.status] || statusMap.open;

  return (
    <>
      <Descriptions column={2} size="small" colon={false}>
        <Descriptions.Item label={<><ThunderboltOutlined /> Лот</>}>
          <Text strong>{props.lotId}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Статус">
          <Tag color={s.color}>{s.label}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Название" span={2}>{props.lotTitle}</Descriptions.Item>
        <Descriptions.Item label="Технология">{props.technology}</Descriptions.Item>
        <Descriptions.Item label="Количество">{props.quantity}</Descriptions.Item>
        <Descriptions.Item label="Предложений">{props.currentBids}</Descriptions.Item>
        {props.budget && (
          <Descriptions.Item label={<><DollarOutlined /> Бюджет</>}>
            <Text strong style={{ color: "#2563eb" }}>{props.budget}</Text>
          </Descriptions.Item>
        )}
      </Descriptions>
      <Divider style={{ margin: "12px 0" }} />
      <div>
        <Text type="secondary" style={{ fontSize: 12 }}><InfoCircleOutlined /> Примечания</Text>
        <Paragraph style={{ margin: "4px 0 0" }}>{props.description}</Paragraph>
      </div>
    </>
  );
}

function QcDetails({ props }: { props: QcProps }) {
  return (
    <>
      <Descriptions column={2} size="small" colon={false}>
        <Descriptions.Item label={<><AuditOutlined /> Тип</>}>
          {props.inspectionType}
        </Descriptions.Item>
        <Descriptions.Item label={<><ShoppingOutlined /> Заказ</>}>
          <Text strong>{props.orderId}</Text>
        </Descriptions.Item>
        <Descriptions.Item label={<><EnvironmentOutlined /> Место</>} span={2}>
          {props.location}
        </Descriptions.Item>
      </Descriptions>
      <Divider style={{ margin: "12px 0" }} />
      <div>
        <Text type="secondary" style={{ fontSize: 12, marginBottom: 8, display: "block" }}>
          <CheckCircleOutlined /> Чек-лист
        </Text>
        <Steps
          direction="vertical"
          size="small"
          current={-1}
          items={props.checklist.map((item) => ({
            title: item,
            status: "wait" as const,
          }))}
          style={{ marginTop: 4 }}
        />
      </div>
      <Divider style={{ margin: "12px 0" }} />
      <div>
        <Text type="secondary" style={{ fontSize: 12 }}><InfoCircleOutlined /> Примечания</Text>
        <Paragraph style={{ margin: "4px 0 0" }}>{props.description}</Paragraph>
      </div>
    </>
  );
}

function MeetingDetails({ props }: { props: MeetingProps }) {
  return (
    <>
      <Descriptions column={2} size="small" colon={false}>
        <Descriptions.Item label="Тип связи">
          <Space size={4}>
            {CALL_TYPE_ICONS[props.callType]}
            <Text>{CALL_TYPE_LABELS[props.callType]}</Text>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Участников">
          {props.participants.length}
        </Descriptions.Item>
      </Descriptions>

      {props.meetingLink && (
        <>
          <Divider style={{ margin: "12px 0" }} />
          <Button
            type="primary"
            icon={<LinkOutlined />}
            href={props.meetingLink}
            target="_blank"
            block
          >
            Присоединиться к встрече
          </Button>
        </>
      )}

      <Divider style={{ margin: "12px 0" }} />
      <div>
        <Text type="secondary" style={{ fontSize: 12, marginBottom: 8, display: "block" }}>
          <TeamOutlined /> Участники
        </Text>
        {props.participants.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <UserOutlined style={{ color: "#8c8c8c", fontSize: 12 }} />
            <Text>{p}</Text>
          </div>
        ))}
      </div>

      <Divider style={{ margin: "12px 0" }} />
      <div>
        <Text type="secondary" style={{ fontSize: 12, marginBottom: 8, display: "block" }}>
          <FileTextOutlined /> Повестка
        </Text>
        <ol style={{ margin: 0, paddingLeft: 18 }}>
          {props.agenda.map((item, i) => (
            <li key={i} style={{ marginBottom: 4 }}>
              <Text>{item}</Text>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

function DocumentDetails({ props }: { props: DocumentProps }) {
  const statusMap: Record<string, { color: string; label: string }> = {
    pending: { color: "blue", label: "Ожидает" },
    in_review: { color: "orange", label: "На проверке" },
    overdue: { color: "red", label: "Просрочен" },
  };
  const s = statusMap[props.status] || statusMap.pending;

  return (
    <>
      <Descriptions column={2} size="small" colon={false}>
        <Descriptions.Item label={<><FileTextOutlined /> Тип</>}>
          {props.documentType}
        </Descriptions.Item>
        <Descriptions.Item label="Статус">
          <Tag color={s.color}>{s.label}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label={<><UserOutlined /> Требуется от</>} span={2}>
          {props.requiredBy}
        </Descriptions.Item>
        {props.relatedOrder && (
          <Descriptions.Item label={<><ShoppingOutlined /> Заказ</>} span={2}>
            <Text strong>{props.relatedOrder}</Text>
          </Descriptions.Item>
        )}
      </Descriptions>
      <Divider style={{ margin: "12px 0" }} />
      <div>
        <Text type="secondary" style={{ fontSize: 12 }}><InfoCircleOutlined /> Примечания</Text>
        <Paragraph style={{ margin: "4px 0 0" }}>{props.description}</Paragraph>
      </div>
    </>
  );
}

function EventDetailsPanel({ props }: { props: EventExtendedProps }) {
  switch (props.type) {
    case "order":
      return <OrderDetails props={props} />;
    case "lot":
      return <LotDetails props={props} />;
    case "qc":
      return <QcDetails props={props} />;
    case "meeting":
      return <MeetingDetails props={props} />;
    case "document":
      return <DocumentDetails props={props} />;
  }
}

// --- Main page ---

interface SelectedEvent {
  title: string;
  start: string;
  end?: string;
  extendedProps: EventExtendedProps;
  color: string;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<EventInput[]>(calendarEvents);
  const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(null);

  const handleEventClick = useCallback((info: EventClickArg) => {
    const { event } = info;
    setSelectedEvent({
      title: event.title,
      start: event.startStr,
      end: event.endStr || undefined,
      extendedProps: event.extendedProps as EventExtendedProps,
      color: event.backgroundColor,
    });
  }, []);

  const handleEventDrop = useCallback((info: EventDropArg) => {
    const { event } = info;
    setEvents((prev) =>
      prev.map((e) =>
        e.id === event.id
          ? { ...e, start: event.startStr, end: event.endStr || undefined }
          : e
      )
    );
  }, []);

  return (
    <PageContainer title={false}>
      <div style={{ display: "flex", gap: 16 }}>
        {/* Календарь — слева */}
        <div
          style={{
            flex: "1 1 50%",
            minWidth: 0,
            background: "var(--fc-page-bg-color)",
            borderRadius: 8,
            padding: 16,
          }}
        >
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            buttonText={{
              today: "Сегодня",
              month: "Месяц",
              week: "Неделя",
              day: "День",
              list: "Список",
            }}
            events={events}
            locale="ru"
            editable
            eventStartEditable
            droppable={false}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            height="auto"
            dayMaxEvents={3}
            nowIndicator
            weekNumbers={false}
            firstDay={1}
          />
        </div>

        {/* Панель деталей — справа */}
        <div style={{ flex: "1 1 50%", minWidth: 0 }}>
          <Card
            style={{ height: "100%", borderRadius: 8 }}
            styles={{ body: { padding: 20 } }}
          >
            {selectedEvent ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {/* Заголовок */}
                <div style={{ marginBottom: 16 }}>
                  <Tag color={TAG_COLORS[selectedEvent.extendedProps.type]} style={{ marginBottom: 8 }}>
                    {EVENT_TYPE_LABELS[selectedEvent.extendedProps.type]}
                  </Tag>
                  <Title level={5} style={{ margin: 0 }}>
                    {selectedEvent.title}
                  </Title>
                </div>

                {/* Блок времени */}
                <div
                  style={{
                    display: "flex",
                    gap: 24,
                    flexWrap: "wrap",
                    padding: "10px 0",
                    borderTop: "1px solid var(--fc-border-color)",
                    borderBottom: "1px solid var(--fc-border-color)",
                    marginBottom: 16,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CalendarOutlined style={{ color: "#8c8c8c" }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: 11, display: "block" }}>Начало</Text>
                      <Text style={{ fontSize: 13 }}>{formatDateTime(selectedEvent.start)}</Text>
                    </div>
                  </div>
                  {selectedEvent.end && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <ClockCircleOutlined style={{ color: "#8c8c8c" }} />
                      <div>
                        <Text type="secondary" style={{ fontSize: 11, display: "block" }}>Окончание</Text>
                        <Text style={{ fontSize: 13 }}>{formatDateTime(selectedEvent.end)}</Text>
                      </div>
                    </div>
                  )}
                  {selectedEvent.start && selectedEvent.end && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <ClockCircleOutlined style={{ color: "#8c8c8c", visibility: "hidden" }} />
                      <div>
                        <Text type="secondary" style={{ fontSize: 11, display: "block" }}>Длительность</Text>
                        <Text style={{ fontSize: 13 }}>
                          {formatTime(selectedEvent.start)} — {formatTime(selectedEvent.end)}
                        </Text>
                      </div>
                    </div>
                  )}
                </div>

                {/* Содержимое по типу */}
                <EventDetailsPanel props={selectedEvent.extendedProps} />
              </div>
            ) : (
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
                    <Text type="secondary">Нажмите на событие для просмотра деталей</Text>
                  }
                />
                <div>
                  <Text type="secondary" style={{ fontSize: 12, marginBottom: 8, display: "block", textAlign: "center" }}>
                    Легенда
                  </Text>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
                    {Object.entries(EVENT_COLORS).map(([type]) => (
                      <Tag key={type} color={TAG_COLORS[type as EventType]} style={{ margin: 0 }}>
                        {EVENT_TYPE_LABELS[type as EventType]}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
