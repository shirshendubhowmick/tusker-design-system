import {
  Action as AlertAction,
  Cancel as AlertCancel,
  Content as AlertContent,
  Description as AlertDescription,
  Overlay as AlertOverlay,
  Portal as AlertPortal,
  Root as AlertRoot,
  Title as AlertTitle,
} from "@design-system/ui/AlertDialog";
import { Badge } from "@design-system/ui/Badge";
import { Button } from "@design-system/ui/Button";
import {
  Indicator as CheckboxIndicator,
  Root as CheckboxRoot,
} from "@design-system/ui/Checkbox";
import {
  Close as DialogClose,
  Content as DialogContent,
  Description as DialogDescription,
  Overlay as DialogOverlay,
  Portal as DialogPortal,
  Root as DialogRoot,
  Title as DialogTitle,
  Trigger as DialogTrigger,
} from "@design-system/ui/Dialog";
import {
  Content as MenuContent,
  Item as MenuItem,
  Portal as MenuPortal,
  Root as MenuRoot,
  Separator as MenuSeparator,
  Trigger as MenuTrigger,
} from "@design-system/ui/DropdownMenu";
import { Field, FieldOrientation } from "@design-system/ui/Field";
import { FormField } from "@design-system/ui/FormField";
import { IconButton } from "@design-system/ui/IconButton";
import { Input } from "@design-system/ui/Input";
import {
  Content as SelectContent,
  Group as SelectGroup,
  Icon as SelectIcon,
  Item as SelectItem,
  ItemIndicator as SelectItemIndicator,
  ItemText as SelectItemText,
  Label as SelectLabel,
  Portal as SelectPortal,
  Root as SelectRoot,
  Separator as SelectSeparator,
  Trigger as SelectTrigger,
  Value as SelectValue,
  Viewport as SelectViewport,
} from "@design-system/ui/Select";
import { Spinner } from "@design-system/ui/Spinner";
import { Text, TextColor, TextSize, TextVariant } from "@design-system/ui/Text";
import { cn } from "@design-system/ui/cn";
import { surfaceSectionClass } from "@design-system/ui/surface";
import {
  CheckIcon,
  ChevronDownIcon,
  Cross2Icon,
  DotsHorizontalIcon,
  ExitIcon,
  GearIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  PersonIcon,
  PlusIcon,
  RocketIcon,
  SunIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useEffect, useMemo, useState } from "react";

import {
  DEPLOYMENTS,
  DEPLOY_BADGE,
  PROJECTS,
  type Project,
  STATUS_BADGE,
  WORKSPACES,
} from "./app/data";

type NavId = "projects" | "deployments" | "settings";
type ThemeMode = "light" | "dark";

const NAV: { id: NavId; label: string; icon: typeof HomeIcon }[] = [
  { id: "projects", label: "Projects", icon: HomeIcon },
  { id: "deployments", label: "Deployments", icon: RocketIcon },
  { id: "settings", label: "Settings", icon: GearIcon },
];

/**
 * Dummy Dev-tool SaaS console — layout and chrome only.
 * Uses live design-system components; no real APIs or persistence.
 */
export function App() {
  const [nav, setNav] = useState<NavId>("projects");
  const [workspace, setWorkspace] = useState<string>(WORKSPACES[0].id);
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [query, setQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
    root.dataset.theme = theme;
  }, [theme]);

  const workspaceName =
    WORKSPACES.find((w) => w.id === workspace)?.name ?? "Workspace";

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((p) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q);
      const matchesRegion = regionFilter === "all" || p.region === regionFilter;
      return matchesQuery && matchesRegion;
    });
  }, [query, regionFilter]);

  return (
    <div className="bg-bg-canvas text-fg-default flex min-h-screen">
      {/* ── Sidebar ───────────────────────────────────────────── */}
      <aside className="border-border-default bg-bg-subtle z-sticky tablet:flex sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r">
        <div className="border-border-default flex items-center gap-2 border-b px-4 py-4">
          <div className="bg-accent-solid text-fg-on-accent text-label-md flex size-8 items-center justify-center rounded-md font-semibold">
            N
          </div>
          <div className="min-w-0">
            <Text as="p" variant={TextVariant.label} size={TextSize.md}>
              Northstar
            </Text>
            <Text
              as="p"
              variant={TextVariant.body}
              size={TextSize.sm}
              color={TextColor.muted}
              className="truncate"
            >
              Deploy console
            </Text>
          </div>
        </div>

        <div className="px-3 pt-3">
          <SelectRoot value={workspace} onValueChange={setWorkspace}>
            <SelectTrigger
              size="sm"
              aria-label="Workspace"
              className="bg-bg-surface"
            >
              <SelectValue placeholder="Workspace" />
              <SelectIcon>
                <ChevronDownIcon />
              </SelectIcon>
            </SelectTrigger>
            <SelectPortal>
              <SelectContent position="popper" sideOffset={4}>
                <SelectViewport>
                  <SelectGroup>
                    <SelectLabel>Workspaces</SelectLabel>
                    {WORKSPACES.map((w) => (
                      <SelectItem key={w.id} value={w.id}>
                        <SelectItemIndicator>
                          <CheckIcon />
                        </SelectItemIndicator>
                        <SelectItemText>{w.name}</SelectItemText>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectViewport>
              </SelectContent>
            </SelectPortal>
          </SelectRoot>
        </div>

        <nav
          className="mt-3 flex flex-1 flex-col gap-0.5 px-2"
          aria-label="Main"
        >
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = nav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setNav(item.id)}
                className={cn(
                  "text-label-md flex items-center gap-2 rounded-md px-2.5 py-2 text-left transition-colors",
                  "focus-visible:shadow-focus focus-visible:outline-none",
                  active
                    ? "bg-accent-subtle text-accent-text font-medium"
                    : "text-fg-muted hover:bg-bg-surface-hover hover:text-fg-default",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="border-border-default border-t p-3">
          <div className="flex items-center gap-2 px-1">
            <div className="bg-bg-surface-active flex size-8 items-center justify-center rounded-full">
              <PersonIcon className="text-fg-muted size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <Text
                as="p"
                variant={TextVariant.label}
                size={TextSize.sm}
                className="truncate"
              >
                Ada Lovelace
              </Text>
              <Text
                as="p"
                variant={TextVariant.body}
                size={TextSize.sm}
                color={TextColor.muted}
                className="truncate"
              >
                Admin
              </Text>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main column ───────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-border-default bg-bg-surface/90 z-sticky sticky top-0 border-b backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-2.5">
            <div className="tablet:hidden">
              <Text as="p" variant={TextVariant.label} size={TextSize.md}>
                Northstar
              </Text>
            </div>

            <div className="tablet:block mx-auto hidden w-full max-w-md flex-1">
              <Input
                size="sm"
                placeholder="Search projects, deploys…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                startIcon={<MagnifyingGlassIcon />}
                aria-label="Search"
              />
            </div>

            <div className="ml-auto flex items-center gap-1.5">
              <IconButton
                aria-label={
                  theme === "light"
                    ? "Switch to dark mode"
                    : "Switch to light mode"
                }
                variant="tertiary"
                size="sm"
                onClick={() =>
                  setTheme((t) => (t === "light" ? "dark" : "light"))
                }
              >
                {theme === "light" ? <MoonIcon /> : <SunIcon />}
              </IconButton>

              <MenuRoot>
                <MenuTrigger asChild>
                  <IconButton
                    aria-label="Account menu"
                    variant="secondary"
                    size="sm"
                  >
                    <PersonIcon />
                  </IconButton>
                </MenuTrigger>
                <MenuPortal>
                  <MenuContent sideOffset={4} align="end" className="min-w-44">
                    <MenuItem>
                      <PersonIcon />
                      Profile
                    </MenuItem>
                    <MenuItem onSelect={() => setNav("settings")}>
                      <GearIcon />
                      Settings
                    </MenuItem>
                    <MenuSeparator />
                    <MenuItem tone="danger">
                      <ExitIcon />
                      Sign out
                    </MenuItem>
                  </MenuContent>
                </MenuPortal>
              </MenuRoot>
            </div>
          </div>

          {/* Mobile nav */}
          <div className="border-border-default tablet:hidden flex gap-1 overflow-x-auto border-t px-2 py-1.5">
            {NAV.map((item) => (
              <Button
                key={item.id}
                size="sm"
                variant={nav === item.id ? "secondary" : "tertiary"}
                onClick={() => setNav(item.id)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </header>

        <main className="tablet:p-6 flex-1 p-4">
          <div className="mx-auto flex max-w-6xl flex-col gap-5">
            {nav === "projects" ? (
              <ProjectsView
                workspaceName={workspaceName}
                projects={filteredProjects}
                regionFilter={regionFilter}
                onRegionFilter={setRegionFilter}
                query={query}
                onQuery={setQuery}
                onSelectProject={setSelectedProject}
              />
            ) : null}
            {nav === "deployments" ? <DeploymentsView /> : null}
            {nav === "settings" ? <SettingsView /> : null}
          </div>
        </main>
      </div>

      {/* Project detail dialog (dummy) */}
      <DialogRoot
        open={selectedProject != null}
        onOpenChange={(open) => {
          if (!open) setSelectedProject(null);
        }}
      >
        <DialogPortal>
          <DialogOverlay />
          <DialogContent size="md" aria-describedby={undefined}>
            {selectedProject ? (
              <>
                <div className={surfaceSectionClass.header}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col gap-1">
                      <DialogTitle>{selectedProject.name}</DialogTitle>
                      <DialogDescription>
                        {selectedProject.slug} · {selectedProject.region}
                      </DialogDescription>
                    </div>
                    <DialogClose asChild>
                      <IconButton
                        aria-label="Close"
                        variant="tertiary"
                        size="sm"
                      >
                        <Cross2Icon />
                      </IconButton>
                    </DialogClose>
                  </div>
                </div>
                <div className={surfaceSectionClass.body}>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      color={STATUS_BADGE[selectedProject.status].color}
                      variant="soft"
                    >
                      {STATUS_BADGE[selectedProject.status].label}
                    </Badge>
                    <Badge color="neutral" variant="outline">
                      {selectedProject.framework}
                    </Badge>
                    <Badge color="primary" variant="soft">
                      {selectedProject.members} members
                    </Badge>
                  </div>
                  <Text
                    as="p"
                    variant={TextVariant.body}
                    size={TextSize.sm}
                    color={TextColor.muted}
                    className="mt-3"
                  >
                    Last deploy {selectedProject.lastDeploy}. This panel is UI
                    only — no live project data is loaded.
                  </Text>
                </div>
                <div
                  className={cn(
                    surfaceSectionClass.footer,
                    "flex justify-end gap-2",
                  )}
                >
                  <DialogClose asChild>
                    <Button variant="secondary">Close</Button>
                  </DialogClose>
                  <Button>Open dashboard</Button>
                </div>
              </>
            ) : null}
          </DialogContent>
        </DialogPortal>
      </DialogRoot>
    </div>
  );
}

// ── Projects ──────────────────────────────────────────────────────────────────

function ProjectsView({
  workspaceName,
  projects,
  regionFilter,
  onRegionFilter,
  query,
  onQuery,
  onSelectProject,
}: {
  workspaceName: string;
  projects: Project[];
  regionFilter: string;
  onRegionFilter: (v: string) => void;
  query: string;
  onQuery: (v: string) => void;
  onSelectProject: (p: Project) => void;
}) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <div className="tablet:flex-row tablet:items-end tablet:justify-between flex flex-col gap-3">
        <div>
          <Text
            as="p"
            variant={TextVariant.label}
            size={TextSize.sm}
            color={TextColor.muted}
          >
            {workspaceName}
          </Text>
          <Text as="h1" variant={TextVariant.heading} size={TextSize.sm}>
            Projects
          </Text>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
            className="mt-1"
          >
            {projects.length} project{projects.length === 1 ? "" : "s"} · manage
            apps and environments
          </Text>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CreateProjectDialog open={createOpen} onOpenChange={setCreateOpen} />
        </div>
      </div>

      {/* Filters */}
      <div className="border-border-default bg-bg-surface tablet:flex-row tablet:items-center flex flex-col gap-3 rounded-lg border p-3 shadow-sm">
        <div className="tablet:hidden min-w-0 flex-1">
          <Input
            size="sm"
            placeholder="Filter projects…"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            startIcon={<MagnifyingGlassIcon />}
            aria-label="Filter projects"
          />
        </div>
        <div className="tablet:block hidden flex-1">
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
          >
            Showing live-looking data for UI review only.
          </Text>
        </div>
        <div className="tablet:w-48 w-full">
          <SelectRoot value={regionFilter} onValueChange={onRegionFilter}>
            <SelectTrigger size="sm" aria-label="Filter by region">
              <SelectValue placeholder="Region" />
              <SelectIcon>
                <ChevronDownIcon />
              </SelectIcon>
            </SelectTrigger>
            <SelectPortal>
              <SelectContent position="popper" sideOffset={4}>
                <SelectViewport>
                  <SelectItem value="all">
                    <SelectItemIndicator>
                      <CheckIcon />
                    </SelectItemIndicator>
                    <SelectItemText>All regions</SelectItemText>
                  </SelectItem>
                  <SelectSeparator />
                  {["us-east-1", "us-west-2", "eu-west-1", "ap-south-1"].map(
                    (r) => (
                      <SelectItem key={r} value={r}>
                        <SelectItemIndicator>
                          <CheckIcon />
                        </SelectItemIndicator>
                        <SelectItemText>{r}</SelectItemText>
                      </SelectItem>
                    ),
                  )}
                </SelectViewport>
              </SelectContent>
            </SelectPortal>
          </SelectRoot>
        </div>
      </div>

      {/* Project list */}
      <div className="border-border-default bg-bg-surface overflow-hidden rounded-lg border shadow-sm">
        <div className="border-border-default text-fg-muted text-label-sm tablet:grid hidden grid-cols-[1fr_7rem_6rem_6rem_2.5rem] gap-3 border-b px-4 py-2 font-medium">
          <span>Project</span>
          <span>Status</span>
          <span>Region</span>
          <span>Last deploy</span>
          <span className="sr-only">Actions</span>
        </div>
        <ul className="divide-border-default divide-y">
          {projects.length === 0 ? (
            <li className="px-4 py-10 text-center">
              <Text
                as="p"
                variant={TextVariant.body}
                size={TextSize.sm}
                color={TextColor.muted}
              >
                No projects match your filters.
              </Text>
            </li>
          ) : (
            projects.map((project) => (
              <li
                key={project.id}
                className="hover:bg-bg-surface-hover tablet:grid-cols-[1fr_7rem_6rem_6rem_2.5rem] tablet:items-center tablet:gap-3 grid grid-cols-1 gap-2 px-4 py-3 transition-colors"
              >
                <button
                  type="button"
                  className="focus-visible:shadow-focus min-w-0 text-left focus-visible:outline-none"
                  onClick={() => onSelectProject(project)}
                >
                  <Text
                    as="p"
                    variant={TextVariant.label}
                    size={TextSize.md}
                    className="truncate"
                  >
                    {project.name}
                  </Text>
                  <Text
                    as="p"
                    variant={TextVariant.body}
                    size={TextSize.sm}
                    color={TextColor.muted}
                    className="truncate"
                  >
                    {project.framework} · {project.members} members
                  </Text>
                </button>
                <div>
                  <Badge
                    size="sm"
                    variant="soft"
                    color={STATUS_BADGE[project.status].color}
                  >
                    {STATUS_BADGE[project.status].label}
                  </Badge>
                </div>
                <Text
                  as="p"
                  variant={TextVariant.body}
                  size={TextSize.sm}
                  color={TextColor.muted}
                  className="tablet:block hidden font-mono"
                >
                  {project.region}
                </Text>
                <Text
                  as="p"
                  variant={TextVariant.body}
                  size={TextSize.sm}
                  color={TextColor.muted}
                  className="tablet:block hidden"
                >
                  {project.lastDeploy}
                </Text>
                <div className="flex justify-end">
                  <ProjectRowMenu project={project} />
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
}

function ProjectRowMenu({ project }: { project: Project }) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <MenuRoot>
        <MenuTrigger asChild>
          <IconButton
            aria-label={`Actions for ${project.name}`}
            variant="tertiary"
            size="sm"
          >
            <DotsHorizontalIcon />
          </IconButton>
        </MenuTrigger>
        <MenuPortal>
          <MenuContent sideOffset={4} align="end" className="min-w-40">
            <MenuItem>Open project</MenuItem>
            <MenuItem>Copy deploy URL</MenuItem>
            <MenuItem>View logs</MenuItem>
            <MenuSeparator />
            <MenuItem tone="danger" onSelect={() => setDeleteOpen(true)}>
              <TrashIcon />
              Delete…
            </MenuItem>
          </MenuContent>
        </MenuPortal>
      </MenuRoot>

      <AlertRoot open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertPortal>
          <AlertOverlay />
          <AlertContent size="sm">
            <div className={surfaceSectionClass.header}>
              <AlertTitle>Delete {project.name}?</AlertTitle>
              <AlertDescription>
                This removes the project and its deploy history. This cannot be
                undone. (Demo only — nothing is deleted.)
              </AlertDescription>
            </div>
            <div
              className={cn(
                surfaceSectionClass.footer,
                "flex justify-end gap-2",
              )}
            >
              <AlertCancel asChild>
                <Button variant="secondary" size="sm">
                  Cancel
                </Button>
              </AlertCancel>
              <AlertAction asChild>
                <Button color="danger" size="sm">
                  Delete project
                </Button>
              </AlertAction>
            </div>
          </AlertContent>
        </AlertPortal>
      </AlertRoot>
    </>
  );
}

function CreateProjectDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon />
          New project
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent size="md">
          <div className={surfaceSectionClass.header}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-col gap-1">
                <DialogTitle>Create project</DialogTitle>
                <DialogDescription>
                  Scaffold a new app in this workspace. Form is UI-only.
                </DialogDescription>
              </div>
              <DialogClose asChild>
                <IconButton aria-label="Close" variant="tertiary" size="sm">
                  <Cross2Icon />
                </IconButton>
              </DialogClose>
            </div>
          </div>
          <div className={cn(surfaceSectionClass.body, "flex flex-col gap-4")}>
            <FormField
              label="Project name"
              id="create-name"
              placeholder="my-service"
              message="Lowercase letters, numbers, and hyphens."
            />
            <div className="flex flex-col gap-1.5">
              <Text as="p" variant={TextVariant.label} size={TextSize.md}>
                Framework
              </Text>
              <SelectRoot defaultValue="node">
                <SelectTrigger aria-label="Framework">
                  <SelectValue />
                  <SelectIcon>
                    <ChevronDownIcon />
                  </SelectIcon>
                </SelectTrigger>
                <SelectPortal>
                  <SelectContent position="popper" sideOffset={4}>
                    <SelectViewport>
                      {(
                        [
                          ["node", "Node.js"],
                          ["react", "React"],
                          ["go", "Go"],
                          ["astro", "Astro"],
                        ] as const
                      ).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          <SelectItemIndicator>
                            <CheckIcon />
                          </SelectItemIndicator>
                          <SelectItemText>{label}</SelectItemText>
                        </SelectItem>
                      ))}
                    </SelectViewport>
                  </SelectContent>
                </SelectPortal>
              </SelectRoot>
            </div>
            <Field
              orientation={FieldOrientation.horizontal}
              label="Enable preview environments"
              htmlFor="create-previews"
              description="Spin up a URL for every pull request."
            >
              {(control) => (
                <CheckboxRoot
                  id={control.id}
                  defaultChecked
                  aria-label="Enable preview environments"
                >
                  <CheckboxIndicator>
                    <CheckIcon />
                  </CheckboxIndicator>
                </CheckboxRoot>
              )}
            </Field>
          </div>
          <div
            className={cn(surfaceSectionClass.footer, "flex justify-end gap-2")}
          >
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button>Create project</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}

// ── Deployments ───────────────────────────────────────────────────────────────

function DeploymentsView() {
  return (
    <>
      <div>
        <Text as="h1" variant={TextVariant.heading} size={TextSize.sm}>
          Deployments
        </Text>
        <Text
          as="p"
          variant={TextVariant.body}
          size={TextSize.sm}
          color={TextColor.muted}
          className="mt-1"
        >
          Recent builds across the workspace
        </Text>
      </div>

      <div className="tablet:grid-cols-3 grid gap-3">
        {[
          { label: "Success rate", value: "94%", hint: "Last 7 days" },
          { label: "Avg duration", value: "1m 38s", hint: "Production" },
          { label: "In progress", value: "1", hint: "console-web" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="border-border-default bg-bg-surface rounded-lg border p-4 shadow-sm"
          >
            <Text
              as="p"
              variant={TextVariant.label}
              size={TextSize.sm}
              color={TextColor.muted}
            >
              {stat.label}
            </Text>
            <Text
              as="p"
              variant={TextVariant.heading}
              size={TextSize.sm}
              className="mt-1"
            >
              {stat.value}
            </Text>
            <Text
              as="p"
              variant={TextVariant.body}
              size={TextSize.sm}
              color={TextColor.muted}
              className="mt-0.5"
            >
              {stat.hint}
            </Text>
          </div>
        ))}
      </div>

      <div className="border-border-default bg-bg-surface overflow-hidden rounded-lg border shadow-sm">
        <ul className="divide-border-default divide-y">
          {DEPLOYMENTS.map((d) => (
            <li
              key={d.id}
              className="tablet:flex-row tablet:items-center tablet:gap-4 flex flex-col gap-2 px-4 py-3"
            >
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <div className="mt-0.5">
                  {d.status === "running" ? (
                    <Spinner size="sm" className="text-info-text" />
                  ) : (
                    <div
                      className={cn(
                        "size-2.5 rounded-full",
                        d.status === "success" && "bg-success-solid",
                        d.status === "failed" && "bg-danger-solid",
                        d.status === "cancelled" && "bg-bg-surface-active",
                      )}
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Text as="p" variant={TextVariant.label} size={TextSize.md}>
                      {d.project}
                    </Text>
                    <Badge
                      size="sm"
                      variant="soft"
                      color={DEPLOY_BADGE[d.status].color}
                    >
                      {DEPLOY_BADGE[d.status].label}
                    </Badge>
                  </div>
                  <Text
                    as="p"
                    variant={TextVariant.body}
                    size={TextSize.sm}
                    color={TextColor.muted}
                    className="mt-0.5 font-mono"
                  >
                    {d.commit} · {d.branch}
                  </Text>
                </div>
              </div>
              <div className="tablet:pl-0 flex flex-wrap items-center gap-3 pl-5">
                <Text
                  as="p"
                  variant={TextVariant.body}
                  size={TextSize.sm}
                  color={TextColor.muted}
                >
                  {d.duration}
                </Text>
                <Text
                  as="p"
                  variant={TextVariant.body}
                  size={TextSize.sm}
                  color={TextColor.muted}
                >
                  {d.author}
                </Text>
                <Text
                  as="p"
                  variant={TextVariant.body}
                  size={TextSize.sm}
                  color={TextColor.muted}
                >
                  {d.when}
                </Text>
                <Button size="sm" variant="tertiary">
                  Logs
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

// ── Settings ──────────────────────────────────────────────────────────────────

function SettingsView() {
  const [digest, setDigest] = useState(true);
  const [slack, setSlack] = useState(false);

  return (
    <>
      <div>
        <Text as="h1" variant={TextVariant.heading} size={TextSize.sm}>
          Settings
        </Text>
        <Text
          as="p"
          variant={TextVariant.body}
          size={TextSize.sm}
          color={TextColor.muted}
          className="mt-1"
        >
          Workspace preferences · changes are not persisted
        </Text>
      </div>

      <div className="border-border-default bg-bg-surface flex max-w-xl flex-col gap-5 rounded-lg border p-5 shadow-sm">
        <Text as="h2" variant={TextVariant.heading} size={TextSize.xs}>
          General
        </Text>
        <FormField
          label="Workspace display name"
          id="settings-name"
          defaultValue="Acme Cloud"
          message="Shown in the sidebar and invoices."
        />
        <FormField
          label="Support email"
          id="settings-email"
          type="email"
          defaultValue="ops@acme.dev"
          color="default"
        />
        <div className="flex flex-col gap-1.5">
          <Text as="p" variant={TextVariant.label} size={TextSize.md}>
            Default region
          </Text>
          <SelectRoot defaultValue="us-east-1">
            <SelectTrigger aria-label="Default region">
              <SelectValue />
              <SelectIcon>
                <ChevronDownIcon />
              </SelectIcon>
            </SelectTrigger>
            <SelectPortal>
              <SelectContent position="popper" sideOffset={4}>
                <SelectViewport>
                  {["us-east-1", "us-west-2", "eu-west-1", "ap-south-1"].map(
                    (r) => (
                      <SelectItem key={r} value={r}>
                        <SelectItemIndicator>
                          <CheckIcon />
                        </SelectItemIndicator>
                        <SelectItemText>{r}</SelectItemText>
                      </SelectItem>
                    ),
                  )}
                </SelectViewport>
              </SelectContent>
            </SelectPortal>
          </SelectRoot>
        </div>
      </div>

      <div className="border-border-default bg-bg-surface flex max-w-xl flex-col gap-4 rounded-lg border p-5 shadow-sm">
        <Text as="h2" variant={TextVariant.heading} size={TextSize.xs}>
          Notifications
        </Text>
        <Field
          orientation={FieldOrientation.horizontal}
          label="Weekly digest email"
          htmlFor="settings-digest"
          description="Summary of deploys and incidents every Monday."
        >
          {(control) => (
            <CheckboxRoot
              id={control.id}
              checked={digest}
              onCheckedChange={(v) => setDigest(v === true)}
              aria-label="Weekly digest email"
            >
              <CheckboxIndicator>
                <CheckIcon />
              </CheckboxIndicator>
            </CheckboxRoot>
          )}
        </Field>
        <Field
          orientation={FieldOrientation.horizontal}
          label="Slack deploy alerts"
          htmlFor="settings-slack"
          description="Post failed production deploys to #eng-deploys."
        >
          {(control) => (
            <CheckboxRoot
              id={control.id}
              checked={slack}
              onCheckedChange={(v) => setSlack(v === true)}
              aria-label="Slack deploy alerts"
            >
              <CheckboxIndicator>
                <CheckIcon />
              </CheckboxIndicator>
            </CheckboxRoot>
          )}
        </Field>
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="secondary">Discard</Button>
          <Button>Save changes</Button>
        </div>
      </div>
    </>
  );
}
