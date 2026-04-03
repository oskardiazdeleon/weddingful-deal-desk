export type ActivitySeverity = "info" | "success" | "warning" | "error";

export interface ActivityItem {
  id: string;
  at: string;
  title: string;
  detail: string;
  severity: ActivitySeverity;
  metric?: string;
}

export interface HealthCheckItem {
  id: string;
  label: string;
  status: "healthy" | "warning" | "degraded";
  detail: string;
}

export interface ModelBreakdownItem {
  model: string;
  share: number;
  tokens: number;
  colorClass: string;
}

export interface UsagePoint {
  label: string;
  input: number;
  output: number;
}

export interface ClawwatchSnapshot {
  headline: {
    totalTokens: number;
    estimatedCostUsd: number;
    taskThroughput: number;
    healthySystems: number;
    totalSystems: number;
  };
  usage: UsagePoint[];
  models: ModelBreakdownItem[];
  activities: ActivityItem[];
  healthChecks: HealthCheckItem[];
  taskSummary: {
    active: number;
    blocked: number;
    completedToday: number;
    queueDepth: number;
  };
}

const usage: UsagePoint[] = [
  { label: "00:00", input: 3200, output: 1800 },
  { label: "04:00", input: 5600, output: 2600 },
  { label: "08:00", input: 9100, output: 4300 },
  { label: "12:00", input: 12600, output: 6200 },
  { label: "16:00", input: 16200, output: 7900 },
  { label: "20:00", input: 19800, output: 9800 },
  { label: "Now", input: 24000, output: 14000 },
];

const models: ModelBreakdownItem[] = [
  { model: "openai-codex/gpt-5.4", share: 72, tokens: 27360, colorClass: "bg-emerald-400" },
  { model: "claude-code", share: 18, tokens: 6840, colorClass: "bg-violet-400" },
  { model: "support tasks", share: 10, tokens: 3800, colorClass: "bg-amber-400" },
];

const activities: ActivityItem[] = [
  {
    id: "act-1",
    at: "2m ago",
    title: "Gateway pairing repaired",
    detail: "OpenClaw device was approved and local control path resumed.",
    severity: "success",
    metric: "paired",
  },
  {
    id: "act-2",
    at: "9m ago",
    title: "Website repo access confirmed",
    detail: "Weddingful repo and Next.js app structure were verified for direct work.",
    severity: "success",
    metric: "repo ok",
  },
  {
    id: "act-3",
    at: "18m ago",
    title: "Exec approvals still gated",
    detail: "Command access works, but some requests still trigger manual approval outside Telegram.",
    severity: "warning",
    metric: "approval",
  },
  {
    id: "act-4",
    at: "27m ago",
    title: "Dashboard build requested",
    detail: "Operator dashboard requested for task visibility, token tracking, and health.",
    severity: "info",
    metric: "new",
  },
  {
    id: "act-5",
    at: "44m ago",
    title: "Weddingful deploy workflow validated",
    detail: "Vercel linkage and local project path confirmed in environment screenshots.",
    severity: "info",
    metric: "deploy",
  },
];

const healthChecks: HealthCheckItem[] = [
  {
    id: "hc-1",
    label: "OpenClaw session",
    status: "healthy",
    detail: "Main Telegram direct session responding normally.",
  },
  {
    id: "hc-2",
    label: "Task queue",
    status: "healthy",
    detail: "No backlog or background subagent queue detected.",
  },
  {
    id: "hc-3",
    label: "Command execution",
    status: "warning",
    detail: "Reachable, but approvals may still interrupt uninterrupted operations.",
  },
  {
    id: "hc-4",
    label: "Website workspace",
    status: "healthy",
    detail: "Weddingful repo detected with active Next.js application structure.",
  },
  {
    id: "hc-5",
    label: "Cost telemetry",
    status: "degraded",
    detail: "Exact provider dollar cost is not surfaced yet; dashboard uses estimates for now.",
  },
];

export function getClawwatchSnapshot(): ClawwatchSnapshot {
  const totalInput = usage[usage.length - 1]?.input ?? 0;
  const totalOutput = usage[usage.length - 1]?.output ?? 0;
  const totalTokens = totalInput + totalOutput;

  return {
    headline: {
      totalTokens,
      estimatedCostUsd: 4.2,
      taskThroughput: 14.5,
      healthySystems: healthChecks.filter((item) => item.status === "healthy").length,
      totalSystems: healthChecks.length,
    },
    usage,
    models,
    activities,
    healthChecks,
    taskSummary: {
      active: 3,
      blocked: 1,
      completedToday: 5,
      queueDepth: 0,
    },
  };
}
