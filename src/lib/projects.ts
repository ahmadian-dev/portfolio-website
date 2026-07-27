import { projectHref } from "@/lib/project-routes";
export type ProjectSlug =
  | "predictive-maintenance"
  | "document-intelligence"
  | "business-forecasting"
  | "ai-sql-copilot"
  | "computer-vision-inspection";

export type ProxyId = "predmaint" | "docintel" | "forecast" | "sqlcopilot" | "cvinspect";

export type EndpointSpec = {
  method: "GET" | "POST";
  path: string;
  summary: string;
  bodyExample?: unknown;
  multipart?: boolean;
  queryExample?: Record<string, string | boolean>;
};

export type MetricRow = {
  label: string;
  primary: string;
  baseline?: string;
};

export type EngineeringItem = {
  label: string;
  detail: string;
  href: string;
};

export type ProjectConfig = {
  slug: ProjectSlug;
  proxyId: ProxyId;
  name: string;
  shortName: string;
  subtitle: string;
  /** One-line outcome for hiring managers (hero). */
  heroInsight: string;
  domain: string;
  github: string;
  swaggerPath: string;
  architectureSrc: string;
  apiEnvKey: string;
  version: string;
  status: "Released";
  pipeline: { id: string; title: string; detail: string }[];
  problem: { title: string; points: string[] };
  solution: { title: string; points: string[] };
  endpoints: EndpointSpec[];
  metrics: MetricRow[];
  chart: { labels: string[]; values: number[]; yLabel: string };
  engineering: EngineeringItem[];
  integrity: string[];
  repoLinks: { label: string; href: string }[];
  interactive: ProxyId;
};

export const PROJECTS: ProjectConfig[] = [
  {
    slug: "predictive-maintenance",
    proxyId: "predmaint",
    name: "Production ML Platform for Predictive Maintenance",
    shortName: "Production ML Platform",
    subtitle:
      "End-to-end failure-risk scoring: leakage-safe features, chronological evaluation, LightGBM vs baseline, FastAPI serving.",
    heroInsight:
      "End-to-end predictive maintenance platform demonstrating production ML engineering, evaluation discipline, MLOps, and API deployment.",
    domain: "Predictive Maintenance · MLOps",
    github: "https://github.com/ahmadian-dev/predictive-maintenance-ml-platform",
    swaggerPath: "/docs",
    architectureSrc: "/assets/projects/predmaint/architecture-diagram.png",
    apiEnvKey: "API_PREDMAINT_URL",
    version: "1.0.0",
    status: "Released",
    pipeline: [
      { id: "data", title: "AI4I CSV", detail: "Load and validate machine telemetry records." },
      { id: "validate", title: "Validate", detail: "Schema checks; exclude failure-mode leakage flags." },
      { id: "features", title: "Features", detail: "Leakage-safe engineered signals for risk scoring." },
      { id: "train", title: "Train / Eval", detail: "Chronological UDI split; baseline vs LightGBM." },
      { id: "artifacts", title: "Artifacts", detail: "MLflow logging and production model bundle." },
      { id: "api", title: "FastAPI", detail: "Versioned /v1/predict inference with OpenAPI." },
    ],
    problem: {
      title: "Unplanned downtime is expensive",
      points: [
        "Failure signals hide in noisy sensor streams",
        "Notebook models rarely reach production packaging",
        "Hiring managers need evaluation discipline, not accuracy theater",
      ],
    },
    solution: {
      title: "A production-shaped failure-risk platform",
      points: [
        "Validated data → features → baselines → primary model",
        "Chronological holdout with F1 / PR-AUC focus",
        "FastAPI + Docker + presentation pack for review",
      ],
    },
    endpoints: [
      { method: "GET", path: "/health", summary: "Service and model readiness" },
      { method: "GET", path: "/v1/model", summary: "Artifact metadata and threshold" },
      {
        method: "POST",
        path: "/v1/predict",
        summary: "Score one machine entity",
        bodyExample: {
          entity_id: "M14860",
          features: {
            type_L: 0,
            type_M: 1,
            type_H: 0,
            air_temperature_k: 298.1,
            process_temperature_k: 308.6,
            rotational_speed_rpm: 1551,
            torque_nm: 42.8,
            tool_wear_min: 0,
            temp_diff_k: 10.5,
            mechanical_power: 6954.8,
            wear_torque_product: 0,
            speed_over_torque: 36.24,
          },
        },
      },
      {
        method: "POST",
        path: "/v1/predict/batch",
        summary: "Batch score multiple entities",
        bodyExample: { items: [] },
      },
    ],
    metrics: [
      { label: "Test F1", primary: "0.800", baseline: "0.222" },
      { label: "ROC-AUC", primary: "0.944", baseline: "0.901" },
      { label: "PR-AUC", primary: "0.781", baseline: "0.323" },
      { label: "Precision", primary: "0.952", baseline: "0.571" },
    ],
    chart: { labels: ["LogReg F1", "LightGBM F1"], values: [0.222, 0.8], yLabel: "F1" },
    engineering: [
      {
        label: "Docker",
        detail: "Dockerfile",
        href: "https://github.com/ahmadian-dev/predictive-maintenance-ml-platform/blob/main/Dockerfile",
      },
      {
        label: "CI",
        detail: "GitHub Actions",
        href: "https://github.com/ahmadian-dev/predictive-maintenance-ml-platform/tree/main/.github/workflows",
      },
      {
        label: "MLflow",
        detail: "Experiment tracking",
        href: "https://github.com/ahmadian-dev/predictive-maintenance-ml-platform/blob/main/docs/16_MLOPS_PIPELINE.md",
      },
      {
        label: "Artifacts",
        detail: "Production model bundle",
        href: "https://github.com/ahmadian-dev/predictive-maintenance-ml-platform/tree/main/models/artifacts/production",
      },
      {
        label: "OpenAPI",
        detail: "FastAPI /docs",
        href: "https://github.com/ahmadian-dev/predictive-maintenance-ml-platform/blob/main/docs/10_API_SPECIFICATION.md",
      },
      {
        label: "Docs",
        detail: "Engineering docs 00–28",
        href: "https://github.com/ahmadian-dev/predictive-maintenance-ml-platform/tree/main/docs",
      },
    ],
    integrity: [
      "Failure-mode target flags excluded from features (no leakage)",
      "Chronological split by UDI — not random shuffle",
      "AI4I 2020 is synthetic — not a live plant warranty",
      "Rare failures: F1 / PR-AUC prioritized over accuracy",
      "Optional X-API-Key; disabled when API_KEY=change-me",
    ],
    repoLinks: [
      { label: "README", href: projectHref("predictive-maintenance", "readme") },
      { label: "Architecture", href: projectHref("predictive-maintenance", "architecture") },
      { label: "Presentation", href: projectHref("predictive-maintenance", "presentation") },
      { label: "Dashboard", href: projectHref("predictive-maintenance", "dashboard") },
      { label: "Repository", href: "https://github.com/ahmadian-dev/predictive-maintenance-ml-platform" },
      { label: "Release v1.0.0", href: "https://github.com/ahmadian-dev/predictive-maintenance-ml-platform/releases/tag/v1.0.0" },
    ],
    interactive: "predmaint",
  },
  {
    slug: "document-intelligence",
    proxyId: "docintel",
    name: "Enterprise Document Intelligence Platform",
    shortName: "Document Intelligence",
    subtitle:
      "IDP with ingest, retrieval, RAG citations, field extraction, evaluation harness, and FastAPI delivery.",
    heroInsight:
      "Enterprise document intelligence with retrieval, citation-backed answers, evaluation harness, and production FastAPI packaging.",
    domain: "Document AI · RAG · LLM",
    github: "https://github.com/ahmadian-dev/enterprise-document-intelligence-platform",
    swaggerPath: "/docs",
    architectureSrc: "/assets/projects/docintel/architecture-diagram.png",
    apiEnvKey: "API_DOCINTEL_URL",
    version: "1.0.0",
    status: "Released",
    pipeline: [
      { id: "ingest", title: "Ingest", detail: "Accept PDF/TXT into the document store." },
      { id: "extract", title: "Extract", detail: "Text extraction for indexing." },
      { id: "chunk", title: "Chunk", detail: "Split into retrieval-ready passages." },
      { id: "embed", title: "Embed", detail: "Sentence-transformer embeddings." },
      { id: "retrieve", title: "Retrieve", detail: "Semantic search over the corpus." },
      { id: "cite", title: "Cite / Answer", detail: "Extractive RAG with citations by default." },
    ],
    problem: {
      title: "Enterprise knowledge is trapped in documents",
      points: [
        "Search alone does not produce grounded answers",
        "Black-box chatbots without citations fail trust reviews",
        "IDP needs evaluation — not prompt demos",
      ],
    },
    solution: {
      title: "Document intelligence with measurable retrieval",
      points: [
        "Ingest → chunk → embed → retrieve → cite",
        "Hit-rate, citation coverage, faithfulness checks",
        "FastAPI contracts for integration demos",
      ],
    },
    endpoints: [
      { method: "GET", path: "/health", summary: "Index and embedding readiness" },
      { method: "POST", path: "/v1/ingest", summary: "Upload a document", multipart: true },
      {
        method: "POST",
        path: "/v1/search",
        summary: "Semantic search",
        bodyExample: { query: "retention policy", top_k: 5 },
      },
      {
        method: "POST",
        path: "/v1/ask",
        summary: "Ask with citations",
        bodyExample: { question: "What is the document retention period?", top_k: 5 },
      },
      {
        method: "POST",
        path: "/v1/extract",
        summary: "Structured field extraction",
        bodyExample: { document_id: "sample" },
      },
    ],
    metrics: [
      { label: "Hit-rate@5", primary: "1.00" },
      { label: "Citation coverage", primary: "1.00" },
      { label: "Faithfulness", primary: "1.00" },
    ],
    chart: { labels: ["Hit-rate@5", "Citation", "Faithfulness"], values: [1, 1, 1], yLabel: "Score" },
    engineering: [
      {
        label: "RAG pipeline",
        detail: "Custom retrieval stack",
        href: "https://github.com/ahmadian-dev/enterprise-document-intelligence-platform/blob/main/docs/13_DOCUMENT_PROCESSING_PIPELINE.md",
      },
      {
        label: "Evaluation",
        detail: "Fixture harness",
        href: "https://github.com/ahmadian-dev/enterprise-document-intelligence-platform/tree/main/data/eval",
      },
      {
        label: "Docker",
        detail: "Dockerfile",
        href: "https://github.com/ahmadian-dev/enterprise-document-intelligence-platform/blob/main/Dockerfile",
      },
      {
        label: "CI",
        detail: "GitHub Actions",
        href: "https://github.com/ahmadian-dev/enterprise-document-intelligence-platform/tree/main/.github/workflows",
      },
      {
        label: "OpenAPI",
        detail: "FastAPI contracts",
        href: "https://github.com/ahmadian-dev/enterprise-document-intelligence-platform/blob/main/docs/10_API_SPECIFICATION.md",
      },
      {
        label: "Docs",
        detail: "Engineering docs 00–28",
        href: "https://github.com/ahmadian-dev/enterprise-document-intelligence-platform/tree/main/docs",
      },
    ],
    integrity: [
      "Citations required for answers",
      "Sample/public corpus — not a customer archive",
      "Extractive default unless LLM_API_KEY is set",
      "Metrics from labeled evaluation fixtures",
      "Optional API key gate for demos",
    ],
    repoLinks: [
      { label: "README", href: projectHref("document-intelligence", "readme") },
      { label: "Architecture", href: projectHref("document-intelligence", "architecture") },
      { label: "Presentation", href: projectHref("document-intelligence", "presentation") },
      { label: "Dashboard", href: projectHref("document-intelligence", "dashboard") },
      { label: "Repository", href: "https://github.com/ahmadian-dev/enterprise-document-intelligence-platform" },
      { label: "Release v1.0.0", href: "https://github.com/ahmadian-dev/enterprise-document-intelligence-platform/releases/tag/v1.0.0" },
    ],
    interactive: "docintel",
  },
  {
    slug: "business-forecasting",
    proxyId: "forecast",
    name: "Enterprise Business Analytics & Forecasting Platform",
    shortName: "Business Analytics & Forecasting",
    subtitle:
      "Chronological KPI forecasting with baselines vs LightGBM, MAPE/RMSE reporting, and FastAPI decision support.",
    heroInsight:
      "Business forecasting platform with chronological evaluation, baseline comparisons, and decision-support API packaging.",
    domain: "Forecasting · Analytics",
    github: "https://github.com/ahmadian-dev/forecast-platform",
    swaggerPath: "/docs",
    architectureSrc: "/assets/projects/forecast/architecture-diagram.png",
    apiEnvKey: "API_FORECAST_URL",
    version: "1.0.0",
    status: "Released",
    pipeline: [
      { id: "panel", title: "KPI Panel", detail: "Store × SKU daily demand panel." },
      { id: "split", title: "Chronological split", detail: "70/15/15 time-ordered holdout." },
      { id: "feat", title: "Lags / rolling", detail: "Tabular time-series features." },
      { id: "base", title: "Baselines", detail: "Seasonal naive and moving average." },
      { id: "lgbm", title: "LightGBM", detail: "Primary model selected on validation." },
      { id: "eval", title: "MAPE eval", detail: "Test metrics + FastAPI forecast." },
    ],
    problem: {
      title: "Plans fail when forecasts are opaque",
      points: [
        "Spreadsheets hide baseline comparisons",
        "Random splits leak future information",
        "Decision support needs API packaging",
      ],
    },
    solution: {
      title: "Classical DS forecasting with production packaging",
      points: [
        "Chronological evaluation discipline",
        "Baselines vs primary reported honestly",
        "Horizon forecasts via FastAPI",
      ],
    },
    endpoints: [
      { method: "GET", path: "/health", summary: "Model and panel readiness" },
      { method: "GET", path: "/v1/series", summary: "List forecastable series" },
      {
        method: "POST",
        path: "/v1/forecast",
        summary: "Generate horizon forecast",
        bodyExample: { store_id: "S01", sku_id: "SKU01", horizon_days: 14, model: "primary" },
      },
      { method: "GET", path: "/v1/metrics", summary: "Measured evaluation metrics" },
    ],
    metrics: [
      { label: "Primary MAPE", primary: "0.055", baseline: "0.074" },
      { label: "Primary RMSE", primary: "3.17", baseline: "4.20" },
      { label: "Primary MAE", primary: "2.46", baseline: "3.29" },
    ],
    chart: {
      labels: ["Seasonal naive", "Moving average", "LightGBM"],
      values: [0.074, 0.079, 0.055],
      yLabel: "MAPE",
    },
    engineering: [
      {
        label: "Chronological split",
        detail: "Leakage-safe holdout",
        href: "https://github.com/ahmadian-dev/forecast-platform/blob/main/docs/14_MODEL_DEVELOPMENT.md",
      },
      {
        label: "MLflow",
        detail: "Experiment logging",
        href: "https://github.com/ahmadian-dev/forecast-platform/blob/main/docs/16_MLOPS_PIPELINE.md",
      },
      {
        label: "Docker",
        detail: "Dockerfile",
        href: "https://github.com/ahmadian-dev/forecast-platform/blob/main/Dockerfile",
      },
      {
        label: "CI",
        detail: "GitHub Actions",
        href: "https://github.com/ahmadian-dev/forecast-platform/tree/main/.github/workflows",
      },
      {
        label: "Dashboard",
        detail: "Performance pack",
        href: "/projects/business-forecasting/dashboard",
      },
      {
        label: "Docs",
        detail: "Engineering docs 00–28",
        href: "https://github.com/ahmadian-dev/forecast-platform/tree/main/docs",
      },
    ],
    integrity: [
      "Chronological splits — no random leakage",
      "Seeded synthetic panel — methodology demo, not live ERP",
      "Primary beats baseline on validation before test report",
      "Recursive multi-step at serve; one-step tabular eval documented",
      "Real metrics only after training runs",
    ],
    repoLinks: [
      { label: "README", href: projectHref("business-forecasting", "readme") },
      { label: "Architecture", href: projectHref("business-forecasting", "architecture") },
      { label: "Presentation", href: projectHref("business-forecasting", "presentation") },
      { label: "Dashboard", href: projectHref("business-forecasting", "dashboard") },
      { label: "Repository", href: "https://github.com/ahmadian-dev/forecast-platform" },
      { label: "Release v1.0.0", href: "https://github.com/ahmadian-dev/forecast-platform/releases/tag/v1.0.0" },
    ],
    interactive: "forecast",
  },
  {
    slug: "ai-sql-copilot",
    proxyId: "sqlcopilot",
    name: "AI SQL Copilot",
    shortName: "AI SQL Copilot",
    subtitle:
      "Schema-aware NL→SQL with validation, explanation, and safe SELECT-only execution — not a chatbot wrapper.",
    heroInsight:
      "Schema-aware NL→SQL copilot with validation, safety gates, explanation, and safe read-only execution.",
    domain: "NL→SQL · Data Engineering",
    github: "https://github.com/ahmadian-dev/ai-sql-copilot",
    swaggerPath: "/docs",
    architectureSrc: "/assets/projects/sqlcopilot/architecture-diagram.png",
    apiEnvKey: "API_SQLCOPILOT_URL",
    version: "1.0.0",
    status: "Released",
    pipeline: [
      { id: "schema", title: "Schema catalog", detail: "Introspect demo analytics schema." },
      { id: "nl", title: "NL question", detail: "Analyst asks in natural language." },
      { id: "gen", title: "Generate SQL", detail: "Schema-grounded generation + fallback." },
      { id: "val", title: "Validate", detail: "SELECT-only, banlist, LIMIT enforcement." },
      { id: "explain", title: "Explain", detail: "Human-readable query explanation." },
      { id: "exec", title: "Safe execute", detail: "Read-oriented execution with row caps." },
    ],
    problem: {
      title: "Analysts need SQL help without write risk",
      points: [
        "Chatbots invent tables and run unsafe SQL",
        "Schema ignorance produces quiet failures",
        "Safety gates must be first-class",
      ],
    },
    solution: {
      title: "An enterprise analytics assistant",
      points: [
        "Catalog → generate → validate → explain → execute",
        "Honest offline fallback mode",
        "Fixture evaluation for safety and execution",
      ],
    },
    endpoints: [
      { method: "GET", path: "/health", summary: "DB and catalog readiness" },
      { method: "GET", path: "/v1/schema", summary: "Return schema catalog" },
      {
        method: "POST",
        path: "/v1/generate",
        summary: "NL → SQL",
        bodyExample: { question: "Top 5 products by revenue last month", dialect: "postgresql" },
      },
      {
        method: "POST",
        path: "/v1/explain",
        summary: "Explain SQL",
        bodyExample: { sql: "SELECT 1" },
      },
      {
        method: "POST",
        path: "/v1/execute",
        summary: "Safe execute",
        bodyExample: { sql: "SELECT 1", max_rows: 100 },
      },
    ],
    metrics: [
      { label: "Execution accuracy", primary: "1.00" },
      { label: "Syntax valid rate", primary: "1.00" },
      { label: "Safety block rate", primary: "1.00" },
    ],
    chart: { labels: ["Execution", "Syntax", "Safety block"], values: [1, 1, 1], yLabel: "Rate" },
    engineering: [
      {
        label: "Validator",
        detail: "SELECT-only safety",
        href: "https://github.com/ahmadian-dev/ai-sql-copilot/blob/main/docs/13_SQL_GENERATION_PIPELINE.md",
      },
      {
        label: "Schema catalog",
        detail: "Introspection",
        href: "https://github.com/ahmadian-dev/ai-sql-copilot/blob/main/docs/09_DATABASE_DESIGN.md",
      },
      {
        label: "Docker",
        detail: "Dockerfile",
        href: "https://github.com/ahmadian-dev/ai-sql-copilot/blob/main/Dockerfile",
      },
      {
        label: "CI",
        detail: "GitHub Actions",
        href: "https://github.com/ahmadian-dev/ai-sql-copilot/tree/main/.github/workflows",
      },
      {
        label: "Evaluation",
        detail: "Fixture harness",
        href: "https://github.com/ahmadian-dev/ai-sql-copilot/tree/main/tests",
      },
      {
        label: "Docs",
        detail: "Engineering docs 00–28",
        href: "https://github.com/ahmadian-dev/ai-sql-copilot/tree/main/docs",
      },
    ],
    integrity: [
      "Not positioned as a SQL chatbot",
      "DDL/DML banned; LIMIT enforced",
      "Sample demo DB — not a customer warehouse",
      "Offline fallback labeled mode=fallback",
      "Unsafe SQL never reaches execute",
    ],
    repoLinks: [
      { label: "README", href: projectHref("ai-sql-copilot", "readme") },
      { label: "Architecture", href: projectHref("ai-sql-copilot", "architecture") },
      { label: "Presentation", href: projectHref("ai-sql-copilot", "presentation") },
      { label: "Dashboard", href: projectHref("ai-sql-copilot", "dashboard") },
      { label: "Repository", href: "https://github.com/ahmadian-dev/ai-sql-copilot" },
      { label: "Release v1.0.0", href: "https://github.com/ahmadian-dev/ai-sql-copilot/releases/tag/v1.0.0" },
    ],
    interactive: "sqlcopilot",
  },
  {
    slug: "computer-vision-inspection",
    proxyId: "cvinspect",
    name: "Computer Vision Inspection Platform",
    shortName: "Computer Vision Inspection",
    subtitle:
      "Multi-task industrial inspection: classification, segmentation, segment-then-box detection, Grad-CAM, FastAPI.",
    heroInsight:
      "Multi-task computer vision inspection platform: classification, detection, segmentation, XAI, and FastAPI serving.",
    domain: "Computer Vision · Deep Learning",
    github: "https://github.com/ahmadian-dev/computer-vision-inspection-platform",
    swaggerPath: "/docs",
    architectureSrc: "/assets/projects/cvinspect/architecture-diagram.png",
    apiEnvKey: "API_CVINSPECT_URL",
    version: "1.0.0",
    status: "Released",
    pipeline: [
      { id: "panel", title: "Synthetic panel", detail: "Industrial-style inspection imagery." },
      { id: "prep", title: "Preprocess", detail: "Shared train/serve transforms." },
      { id: "cls", title: "ResNet18", detail: "Transfer classification primary." },
      { id: "seg", title: "U-Net", detail: "Compact semantic segmentation." },
      { id: "det", title: "Segment→box", detail: "Detection from mask postprocess." },
      { id: "xai", title: "Grad-CAM", detail: "Classification explainability." },
    ],
    problem: {
      title: "Quality inspection needs more than a notebook",
      points: [
        "YOLO demos alone do not prove platform skill",
        "Multi-task CV needs shared serving contracts",
        "Baselines and honesty matter for trust",
      ],
    },
    solution: {
      title: "A CV inspection platform, not a single model",
      points: [
        "Classify · detect · segment · explain",
        "Baselines vs primary with real metrics",
        "FastAPI multipart inference",
      ],
    },
    endpoints: [
      { method: "GET", path: "/health", summary: "Task model readiness" },
      { method: "GET", path: "/v1/model", summary: "Artifact metadata and metrics" },
      {
        method: "POST",
        path: "/v1/classify",
        summary: "Classify inspection image",
        multipart: true,
        queryExample: { explain: true },
      },
      { method: "POST", path: "/v1/detect", summary: "Detect defect boxes", multipart: true },
      { method: "POST", path: "/v1/segment", summary: "Segment defect mask", multipart: true },
    ],
    metrics: [
      { label: "Primary F1", primary: "1.000", baseline: "0.933" },
      { label: "Det mAP@0.5", primary: "0.958", baseline: "0.958" },
      { label: "Seg mIoU", primary: "0.993" },
    ],
    chart: {
      labels: ["LogReg F1", "ResNet18 F1", "Det mAP", "Seg mIoU"],
      values: [0.933, 1.0, 0.958, 0.993],
      yLabel: "Score",
    },
    engineering: [
      {
        label: "PyTorch",
        detail: "Multi-task models",
        href: "https://github.com/ahmadian-dev/computer-vision-inspection-platform/blob/main/docs/13_COMPUTER_VISION_PIPELINE.md",
      },
      {
        label: "Grad-CAM",
        detail: "Explainability",
        href: "https://github.com/ahmadian-dev/computer-vision-inspection-platform/blob/main/docs/08_UI_UX_SPECIFICATION.md",
      },
      {
        label: "Docker",
        detail: "Dockerfile",
        href: "https://github.com/ahmadian-dev/computer-vision-inspection-platform/blob/main/Dockerfile",
      },
      {
        label: "CI",
        detail: "GitHub Actions",
        href: "https://github.com/ahmadian-dev/computer-vision-inspection-platform/tree/main/.github/workflows",
      },
      {
        label: "MLflow",
        detail: "Metrics logging",
        href: "https://github.com/ahmadian-dev/computer-vision-inspection-platform/blob/main/docs/16_MLOPS_PIPELINE.md",
      },
      {
        label: "Docs",
        detail: "Engineering docs 00–28",
        href: "https://github.com/ahmadian-dev/computer-vision-inspection-platform/tree/main/docs",
      },
    ],
    integrity: [
      "Synthetic industrial sample — not a live plant warranty",
      "Baselines reported for classification and detection",
      "Detection primary uses documented segment-then-box",
      "Compact CPU-friendly models for reproducible demos",
      "Real metrics only after training runs",
    ],
    repoLinks: [
      { label: "README", href: projectHref("computer-vision-inspection", "readme") },
      { label: "Architecture", href: projectHref("computer-vision-inspection", "architecture") },
      { label: "Presentation", href: projectHref("computer-vision-inspection", "presentation") },
      { label: "Dashboard", href: projectHref("computer-vision-inspection", "dashboard") },
      { label: "Repository", href: "https://github.com/ahmadian-dev/computer-vision-inspection-platform" },
      { label: "Release v1.0.0", href: "https://github.com/ahmadian-dev/computer-vision-inspection-platform/releases/tag/v1.0.0" },
    ],
    interactive: "cvinspect",
  },
];

export function getProject(slug: string): ProjectConfig | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getProjectByProxyId(proxyId: string): ProjectConfig | undefined {
  return PROJECTS.find((p) => p.proxyId === proxyId);
}
