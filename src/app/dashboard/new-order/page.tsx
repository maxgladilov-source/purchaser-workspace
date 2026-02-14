"use client";

import { useState } from "react";
import { PageContainer } from "@ant-design/pro-components";
import {
  Card,
  Steps,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Radio,
  Checkbox,
  Upload,
  Button,
  Descriptions,
  message,
  Typography,
  Divider,
  Tag,
} from "antd";
import {
  InfoCircleOutlined,
  ToolOutlined,
  DollarOutlined,
  SafetyCertificateOutlined,
  FileAddOutlined,
  EyeOutlined,
  InboxOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  SendOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import type { Dayjs } from "dayjs";

const { TextArea } = Input;
const { Dragger } = Upload;
const { Title, Text } = Typography;

interface FormData {
  // Шаг 1: Основная информация
  title: string;
  category: string;
  technology: string;
  material: string;
  quantity: number | null;
  unit: string;

  // Шаг 2: Технические требования
  toleranceGrade: string;
  dimensionLength: number | null;
  dimensionWidth: number | null;
  dimensionHeight: number | null;
  weight: number | null;
  additionalProcesses: string[];

  // Шаг 3: Коммерческие условия
  awardRule: string;
  budget: number | null;
  biddingDeadline: Dayjs | null;
  deliveryDays: number | null;

  // Шаг 4: Контроль качества
  qualityChecks: string[];

  // Шаг 5: Документация
  description: string;
}

const INITIAL_FORM_DATA: FormData = {
  title: "",
  category: "",
  technology: "",
  material: "",
  quantity: null,
  unit: "",
  toleranceGrade: "",
  dimensionLength: null,
  dimensionWidth: null,
  dimensionHeight: null,
  weight: null,
  additionalProcesses: [],
  awardRule: "",
  budget: null,
  biddingDeadline: null,
  deliveryDays: null,
  qualityChecks: [],
  description: "",
};

const TECHNOLOGIES = [
  "CNC фрезерование",
  "Токарная обработка",
  "Листовой металл",
  "3D печать",
  "Литьё под давлением",
  "Штамповка",
  "Лазерная резка",
  "Вакуумное литьё",
  "CAD-проектирование",
  "КЭ-анализ",
];

const UNITS = [
  { value: "шт", label: "шт" },
  { value: "кг", label: "кг" },
  { value: "м", label: "м" },
  { value: "комплект", label: "комплект" },
];

const TOLERANCE_GRADES = [
  "IT6",
  "IT7",
  "IT8",
  "IT9",
  "IT10",
  "IT11",
  "IT12",
  "IT13",
  "IT14",
];

const ADDITIONAL_PROCESSES = [
  { label: "Анодирование", value: "anodizing" },
  { label: "Покраска", value: "painting" },
  { label: "Гальваника", value: "electroplating" },
  { label: "Термообработка", value: "heat_treatment" },
  { label: "Полировка", value: "polishing" },
];

const AWARD_RULES = [
  { value: "best_price", label: "Лучшая цена" },
  { value: "instant_buy", label: "Моментальная покупка" },
  { value: "price_delivery_ratio", label: "Цена / срок" },
  { value: "fastest_delivery", label: "Быстрейшая доставка" },
];

const QUALITY_CHECKS = [
  { label: "Размерный контроль", value: "dimensional" },
  { label: "Испытание материала", value: "material_test" },
  { label: "Визуальный осмотр", value: "visual" },
  { label: "Функциональный тест", value: "functional" },
  { label: "Сертификат материала", value: "material_cert" },
];

const STEPS = [
  { title: "Основная информация", icon: <InfoCircleOutlined /> },
  { title: "Технические требования", icon: <ToolOutlined /> },
  { title: "Коммерческие условия", icon: <DollarOutlined /> },
  { title: "Контроль качества", icon: <SafetyCertificateOutlined /> },
  { title: "Документация", icon: <FileAddOutlined /> },
  { title: "Предпросмотр", icon: <EyeOutlined /> },
];

function formatPrice(n: number): string {
  return n.toLocaleString("ru-RU") + " \u20BD";
}

export default function NewOrderPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [fileList, setFileList] = useState<any[]>([]);

  const updateField = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const handlePublish = () => {
    message.success("Лот успешно опубликован!");
  };

  const handleSaveDraft = () => {
    message.info("Черновик сохранён");
  };

  const getProcessLabel = (value: string): string => {
    return (
      ADDITIONAL_PROCESSES.find((p) => p.value === value)?.label ?? value
    );
  };

  const getQualityLabel = (value: string): string => {
    return QUALITY_CHECKS.find((q) => q.value === value)?.label ?? value;
  };

  const getAwardRuleLabel = (value: string): string => {
    return AWARD_RULES.find((r) => r.value === value)?.label ?? value;
  };

  // ───── Step content renderers ─────

  const renderStep1 = () => (
    <Form layout="vertical" style={{ maxWidth: 600 }}>
      <Form.Item label="Название" required>
        <Input
          placeholder="Например: CNC фрезерование корпуса редуктора"
          value={formData.title}
          onChange={(e) => updateField("title", e.target.value)}
        />
      </Form.Item>

      <Form.Item label="Категория" required>
        <Select
          placeholder="Выберите категорию"
          value={formData.category || undefined}
          onChange={(v) => updateField("category", v)}
          options={[
            { value: "material", label: "Материальная" },
            { value: "digital", label: "Цифровая" },
          ]}
        />
      </Form.Item>

      <Form.Item label="Технология" required>
        <Select
          placeholder="Выберите технологию"
          value={formData.technology || undefined}
          onChange={(v) => updateField("technology", v)}
          options={TECHNOLOGIES.map((t) => ({ value: t, label: t }))}
          showSearch
        />
      </Form.Item>

      <Form.Item label="Материал">
        <Input
          placeholder="Например: Д16Т (алюминий)"
          value={formData.material}
          onChange={(e) => updateField("material", e.target.value)}
        />
      </Form.Item>

      <div style={{ display: "flex", gap: 16 }}>
        <Form.Item label="Количество" required style={{ flex: 1 }}>
          <InputNumber
            placeholder="0"
            value={formData.quantity}
            onChange={(v) => updateField("quantity", v)}
            min={1}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item label="Единица измерения" required style={{ flex: 1 }}>
          <Select
            placeholder="Выберите"
            value={formData.unit || undefined}
            onChange={(v) => updateField("unit", v)}
            options={UNITS}
          />
        </Form.Item>
      </div>
    </Form>
  );

  const renderStep2 = () => (
    <Form layout="vertical" style={{ maxWidth: 600 }}>
      <Form.Item label="Допуск (квалитет)">
        <Select
          placeholder="Выберите квалитет"
          value={formData.toleranceGrade || undefined}
          onChange={(v) => updateField("toleranceGrade", v)}
          options={TOLERANCE_GRADES.map((g) => ({ value: g, label: g }))}
          allowClear
        />
      </Form.Item>

      <Form.Item label="Габаритные размеры (мм)">
        <div style={{ display: "flex", gap: 12 }}>
          <InputNumber
            placeholder="Длина"
            value={formData.dimensionLength}
            onChange={(v) => updateField("dimensionLength", v)}
            min={0}
            style={{ flex: 1 }}
            suffix="мм"
          />
          <InputNumber
            placeholder="Ширина"
            value={formData.dimensionWidth}
            onChange={(v) => updateField("dimensionWidth", v)}
            min={0}
            style={{ flex: 1 }}
            suffix="мм"
          />
          <InputNumber
            placeholder="Высота"
            value={formData.dimensionHeight}
            onChange={(v) => updateField("dimensionHeight", v)}
            min={0}
            style={{ flex: 1 }}
            suffix="мм"
          />
        </div>
      </Form.Item>

      <Form.Item label="Масса единицы">
        <InputNumber
          placeholder="0"
          value={formData.weight}
          onChange={(v) => updateField("weight", v)}
          min={0}
          style={{ width: "100%" }}
          suffix="кг"
        />
      </Form.Item>

      <Form.Item label="Дополнительные процессы">
        <Checkbox.Group
          options={ADDITIONAL_PROCESSES}
          value={formData.additionalProcesses}
          onChange={(v) =>
            updateField("additionalProcesses", v as string[])
          }
        />
      </Form.Item>
    </Form>
  );

  const renderStep3 = () => (
    <Form layout="vertical" style={{ maxWidth: 600 }}>
      <Form.Item label="Правило присуждения" required>
        <Radio.Group
          value={formData.awardRule || undefined}
          onChange={(e) => updateField("awardRule", e.target.value)}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {AWARD_RULES.map((rule) => (
              <Radio key={rule.value} value={rule.value}>
                {rule.label}
              </Radio>
            ))}
          </div>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="Бюджет" required>
        <InputNumber
          placeholder="0"
          value={formData.budget}
          onChange={(v) => updateField("budget", v)}
          min={0}
          style={{ width: "100%" }}
          suffix="\u20BD"
          formatter={(value) =>
            value
              ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
              : ""
          }
          parser={(value) =>
            Number((value ?? "").replace(/\s/g, ""))
          }
        />
      </Form.Item>

      <Form.Item label="Срок сбора предложений" required>
        <DatePicker
          value={formData.biddingDeadline}
          onChange={(v) => updateField("biddingDeadline", v)}
          style={{ width: "100%" }}
          placeholder="Выберите дату"
          format="DD.MM.YYYY"
        />
      </Form.Item>

      <Form.Item label="Срок поставки">
        <InputNumber
          placeholder="0"
          value={formData.deliveryDays}
          onChange={(v) => updateField("deliveryDays", v)}
          min={1}
          style={{ width: "100%" }}
          suffix="дней"
        />
      </Form.Item>
    </Form>
  );

  const renderStep4 = () => (
    <Form layout="vertical" style={{ maxWidth: 600 }}>
      <Form.Item label="Требования к контролю качества">
        <Checkbox.Group
          value={formData.qualityChecks}
          onChange={(v) => updateField("qualityChecks", v as string[])}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {QUALITY_CHECKS.map((check) => (
              <Checkbox key={check.value} value={check.value}>
                {check.label}
              </Checkbox>
            ))}
          </div>
        </Checkbox.Group>
      </Form.Item>
    </Form>
  );

  const renderStep5 = () => (
    <Form layout="vertical" style={{ maxWidth: 600 }}>
      <Form.Item label="Загрузка файлов">
        <Dragger
          multiple
          fileList={fileList}
          onChange={({ fileList: fl }) => setFileList(fl)}
          beforeUpload={() => false}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Нажмите или перетащите файлы для загрузки
          </p>
          <p className="ant-upload-hint">
            Поддерживаются чертежи (PDF, DWG), 3D-модели (STEP, STL, IGES),
            изображения (JPG, PNG) и документы (DOCX, XLSX)
          </p>
        </Dragger>
      </Form.Item>

      <Form.Item label="Описание и дополнительные требования">
        <TextArea
          rows={6}
          placeholder="Опишите детали заказа, особые требования, условия приёмки и другую важную информацию..."
          value={formData.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </Form.Item>
    </Form>
  );

  const renderStep6 = () => (
    <div style={{ maxWidth: 700 }}>
      <Descriptions
        bordered
        column={1}
        size="middle"
        title="Сводка по лоту"
      >
        {/* Основная информация */}
        <Descriptions.Item label="Название">
          {formData.title || <Text type="secondary">Не указано</Text>}
        </Descriptions.Item>
        <Descriptions.Item label="Категория">
          {formData.category === "material"
            ? "Материальная"
            : formData.category === "digital"
              ? "Цифровая"
              : <Text type="secondary">Не указано</Text>}
        </Descriptions.Item>
        <Descriptions.Item label="Технология">
          {formData.technology || (
            <Text type="secondary">Не указано</Text>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Материал">
          {formData.material || (
            <Text type="secondary">Не указано</Text>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Количество">
          {formData.quantity != null
            ? `${formData.quantity} ${formData.unit}`
            : <Text type="secondary">Не указано</Text>}
        </Descriptions.Item>

        {/* Технические требования */}
        <Descriptions.Item label="Допуск">
          {formData.toleranceGrade || (
            <Text type="secondary">Не указано</Text>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Габариты (Д x Ш x В)">
          {formData.dimensionLength != null ||
          formData.dimensionWidth != null ||
          formData.dimensionHeight != null ? (
            `${formData.dimensionLength ?? "—"} x ${formData.dimensionWidth ?? "—"} x ${formData.dimensionHeight ?? "—"} мм`
          ) : (
            <Text type="secondary">Не указано</Text>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Масса">
          {formData.weight != null ? (
            `${formData.weight} кг`
          ) : (
            <Text type="secondary">Не указано</Text>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Доп. процессы">
          {formData.additionalProcesses.length > 0 ? (
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {formData.additionalProcesses.map((p) => (
                <Tag key={p} color="blue">
                  {getProcessLabel(p)}
                </Tag>
              ))}
            </div>
          ) : (
            <Text type="secondary">Не выбраны</Text>
          )}
        </Descriptions.Item>

        {/* Коммерческие условия */}
        <Descriptions.Item label="Правило присуждения">
          {formData.awardRule ? (
            <Tag color="green">{getAwardRuleLabel(formData.awardRule)}</Tag>
          ) : (
            <Text type="secondary">Не выбрано</Text>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Бюджет">
          {formData.budget != null ? (
            <Text strong>{formatPrice(formData.budget)}</Text>
          ) : (
            <Text type="secondary">Не указан</Text>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Срок сбора предложений">
          {formData.biddingDeadline ? (
            formData.biddingDeadline.format("DD.MM.YYYY")
          ) : (
            <Text type="secondary">Не указан</Text>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Срок поставки">
          {formData.deliveryDays != null ? (
            `${formData.deliveryDays} дней`
          ) : (
            <Text type="secondary">Не указан</Text>
          )}
        </Descriptions.Item>

        {/* Контроль качества */}
        <Descriptions.Item label="Контроль качества">
          {formData.qualityChecks.length > 0 ? (
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {formData.qualityChecks.map((q) => (
                <Tag key={q} color="purple">
                  {getQualityLabel(q)}
                </Tag>
              ))}
            </div>
          ) : (
            <Text type="secondary">Не выбраны</Text>
          )}
        </Descriptions.Item>

        {/* Документация */}
        <Descriptions.Item label="Файлы">
          {fileList.length > 0 ? (
            <div>
              {fileList.map((f) => (
                <div key={f.uid}>
                  <Tag color="cyan">{f.name}</Tag>
                </div>
              ))}
            </div>
          ) : (
            <Text type="secondary">Файлы не загружены</Text>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Описание">
          {formData.description ? (
            <Text style={{ whiteSpace: "pre-wrap" }}>
              {formData.description}
            </Text>
          ) : (
            <Text type="secondary">Не указано</Text>
          )}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
        }}
      >
        <Button
          icon={<SaveOutlined />}
          size="large"
          onClick={handleSaveDraft}
        >
          Сохранить черновик
        </Button>
        <Button
          type="primary"
          icon={<SendOutlined />}
          size="large"
          onClick={handlePublish}
        >
          Опубликовать
        </Button>
      </div>
    </div>
  );

  const stepRenderers = [
    renderStep1,
    renderStep2,
    renderStep3,
    renderStep4,
    renderStep5,
    renderStep6,
  ];

  return (
    <PageContainer
      title="Новый заказ"
      subTitle="Создание лота на закупку"
    >
      <Card>
        <Steps
          current={currentStep}
          items={STEPS.map((s) => ({
            title: s.title,
            icon: s.icon,
          }))}
          style={{ marginBottom: 32 }}
          size="small"
          responsive
        />

        <div style={{ minHeight: 360, paddingTop: 8 }}>
          {stepRenderers[currentStep]()}
        </div>

        {currentStep < STEPS.length - 1 && (
          <>
            <Divider />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                onClick={handlePrev}
                disabled={currentStep === 0}
                icon={<ArrowLeftOutlined />}
              >
                Назад
              </Button>
              <Button
                type="primary"
                onClick={handleNext}
                icon={<ArrowRightOutlined />}
                iconPosition="end"
              >
                Далее
              </Button>
            </div>
          </>
        )}

        {currentStep === STEPS.length - 1 && (
          <>
            <Divider />
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <Button
                onClick={handlePrev}
                icon={<ArrowLeftOutlined />}
              >
                Назад
              </Button>
            </div>
          </>
        )}
      </Card>
    </PageContainer>
  );
}
