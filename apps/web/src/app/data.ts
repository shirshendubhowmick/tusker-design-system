export type ProjectStatus = "healthy" | "degraded" | "offline" | "provisioning";
export type DeployStatus = "success" | "failed" | "running" | "cancelled";

export interface Project {
  id: string;
  name: string;
  slug: string;
  region: string;
  status: ProjectStatus;
  framework: string;
  lastDeploy: string;
  members: number;
}

export interface Deployment {
  id: string;
  project: string;
  commit: string;
  branch: string;
  status: DeployStatus;
  duration: string;
  author: string;
  when: string;
}

export const WORKSPACES = [
  { id: "acme", name: "Acme Cloud" },
  { id: "northstar", name: "Northstar Labs" },
  { id: "sandbox", name: "Sandbox" },
] as const;

export const PROJECTS: Project[] = [
  {
    id: "p1",
    name: "edge-api",
    slug: "edge-api",
    region: "us-east-1",
    status: "healthy",
    framework: "Node",
    lastDeploy: "12 min ago",
    members: 8,
  },
  {
    id: "p2",
    name: "console-web",
    slug: "console-web",
    region: "eu-west-1",
    status: "healthy",
    framework: "React",
    lastDeploy: "2 hr ago",
    members: 14,
  },
  {
    id: "p3",
    name: "billing-worker",
    slug: "billing-worker",
    region: "us-west-2",
    status: "degraded",
    framework: "Go",
    lastDeploy: "45 min ago",
    members: 5,
  },
  {
    id: "p4",
    name: "docs-site",
    slug: "docs-site",
    region: "us-east-1",
    status: "provisioning",
    framework: "Astro",
    lastDeploy: "Just now",
    members: 3,
  },
  {
    id: "p5",
    name: "legacy-admin",
    slug: "legacy-admin",
    region: "ap-south-1",
    status: "offline",
    framework: "Node",
    lastDeploy: "6 days ago",
    members: 2,
  },
];

export const DEPLOYMENTS: Deployment[] = [
  {
    id: "d1",
    project: "edge-api",
    commit: "a3f9c21",
    branch: "main",
    status: "success",
    duration: "1m 42s",
    author: "ada@acme.dev",
    when: "12 min ago",
  },
  {
    id: "d2",
    project: "console-web",
    commit: "8bc104e",
    branch: "feat/nav",
    status: "running",
    duration: "—",
    author: "grace@acme.dev",
    when: "3 min ago",
  },
  {
    id: "d3",
    project: "billing-worker",
    commit: "f01e992",
    branch: "main",
    status: "failed",
    duration: "48s",
    author: "alan@acme.dev",
    when: "45 min ago",
  },
  {
    id: "d4",
    project: "docs-site",
    commit: "c77a0b4",
    branch: "main",
    status: "success",
    duration: "2m 08s",
    author: "ada@acme.dev",
    when: "2 hr ago",
  },
  {
    id: "d5",
    project: "edge-api",
    commit: "91dd3aa",
    branch: "hotfix/timeout",
    status: "cancelled",
    duration: "12s",
    author: "grace@acme.dev",
    when: "Yesterday",
  },
];

export const STATUS_BADGE: Record<
  ProjectStatus,
  {
    color: "success" | "warning" | "danger" | "info" | "neutral";
    label: string;
  }
> = {
  healthy: { color: "success", label: "Healthy" },
  degraded: { color: "warning", label: "Degraded" },
  offline: { color: "danger", label: "Offline" },
  provisioning: { color: "info", label: "Provisioning" },
};

export const DEPLOY_BADGE: Record<
  DeployStatus,
  {
    color: "success" | "warning" | "danger" | "info" | "neutral";
    label: string;
  }
> = {
  success: { color: "success", label: "Success" },
  failed: { color: "danger", label: "Failed" },
  running: { color: "info", label: "Running" },
  cancelled: { color: "neutral", label: "Cancelled" },
};
