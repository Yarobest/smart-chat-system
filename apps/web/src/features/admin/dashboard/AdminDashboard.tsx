import {
  alertCards,
  chartDays,
  deposits,
  navGroups,
  platformStatus,
  quickActions,
  riskAlerts,
  sportsRows,
  statCards,
  supportIssues,
  withdrawals,
} from "./dashboard-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Activity,
  BadgeCheck,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  CircleDot,
  Clock3,
  Coins,
  Copy,
  CreditCard,
  FileBarChart,
  FileCheck2,
  FileText,
  Gift,
  Headphones,
  LayoutDashboard,
  Menu,
  PauseCircle,
  Pencil,
  Plus,
  Radio,
  Search,
  Settings,
  ShieldAlert,
  Star,
  Target,
  Ticket,
  Trash2,
  Trophy,
  User,
  UserCheck,
  UserRoundCog,
  UsersRound,
  Wallet,
  X,
  XCircle,
  RefreshCw,
  ReceiptText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function Icon({ name }: { name: string }) {
  const icons = {
    active: Activity,
    admin: UserRoundCog,
    arrow: ChevronRight,
    badge: BadgeCheck,
    bag: BriefcaseBusiness,
    ball: Trophy,
    bell: Bell,
    bonus: Gift,
    calendar: CalendarDays,
    cash: CreditCard,
    chat: Headphones,
    check: Check,
    checkCircle: CheckCircle2,
    chevron: ChevronDown,
    clock: Clock3,
    coins: Coins,
    copy: Copy,
    collapse: ChevronsLeft,
    dashboard: LayoutDashboard,
    gear: Settings,
    gift: Gift,
    fileCheck: FileCheck2,
    id: BadgeCheck,
    inbox: Wallet,
    log: FileText,
    menu: Menu,
    pause: PauseCircle,
    pencil: Pencil,
    plus: Plus,
    radio: Radio,
    odds: CircleDot,
    outbox: Wallet,
    report: FileBarChart,
    search: Search,
    shield: ShieldAlert,
    star: Star,
    status: CircleDot,
    swap: CreditCard,
    target: Target,
    ticket: Ticket,
    trophy: Trophy,
    trash: Trash2,
    user: User,
    userCheck: UserCheck,
    users: UsersRound,
    wallet: Wallet,
    withdraw: CreditCard,
    x: X,
    xCircle: XCircle,
    refresh: RefreshCw,
    receipt: ReceiptText,
  } satisfies Record<string, LucideIcon>;
  const LucideIcon = icons[name as keyof typeof icons] ?? CircleDot;

  return <LucideIcon size={18} strokeWidth={2.2} aria-hidden="true" />;
}

function Logo() {
  return (
    <div className="aw-logo">
      <div className="aw-mark">A</div>
      <div>
        <strong>
          APEX<span>WIN</span>
        </strong>
        <small>BET SMART. WIN BIG.</small>
      </div>
    </div>
  );
}

export function AdminSidebar({ active = "Dashboard" }: { active?: string }) {
  return (
    <aside className="aw-sidebar">
      <div>
        <Logo />
        <nav className="aw-nav" aria-label="Admin navigation">
          <a className={active === "Dashboard" ? "active" : undefined} href="/admin">
            <Icon name="dashboard" />
            Dashboard
          </a>
          {navGroups.map((group) => (
            <section key={group.title}>
              <h2>{group.title}</h2>
              {group.items.map((item) => (
                <a
                  className={active === item.label ? "active" : undefined}
                  href={item.href ?? `#${item.label.toLowerCase().replaceAll(" ", "-")}`}
                  key={item.label}
                >
                  <Icon name={item.icon} />
                  {item.label}
                  {item.badge ? (
                    <Badge tone={item.badgeTone ?? "gold"}>
                      {item.badge}
                    </Badge>
                  ) : null}
                </a>
              ))}
            </section>
          ))}
        </nav>
      </div>
      <div className="aw-sidebar-footer">
        <Button type="button" variant="ghost">
          <Icon name="collapse" />
          Collapse Menu
        </Button>
        <p>© 2024 ApexWin. All rights reserved.</p>
      </div>
    </aside>
  );
}

export function AdminTopbar({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="aw-topbar">
      <div className="aw-title-row">
        <Button className="aw-menu-button" type="button" variant="outline" size="icon" aria-label="Toggle navigation">
          <Icon name="menu" />
        </Button>
        <div>
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </div>
      <div className="aw-topbar-actions">
        <label className="aw-search">
          <Icon name="search" />
          <Input aria-label="Search anything" placeholder="Search anything..." />
          <kbd>CTRL /</kbd>
        </label>
        <Button className="aw-alert-button" type="button" variant="ghost" size="icon" aria-label="Notifications">
          <Icon name="bell" />
          <span>12</span>
        </Button>
        <Button className="aw-profile-button" type="button" variant="ghost">
          <span className="aw-avatar">MO</span>
          <span>
            <strong>Michael Owusu</strong>
            <small>Super Admin</small>
          </span>
          <Icon name="chevron" />
        </Button>
        {actions ? <div className="aw-page-actions">{actions}</div> : null}
      </div>
    </header>
  );
}

function StatCard({
  card,
}: {
  card: { label: string; value: string; trend: string; tone: string; icon: string };
}) {
  return (
    <Card className="aw-stat">
      <div className={`aw-stat-icon ${card.tone}`}>
        <Icon name={card.icon} />
      </div>
      <div>
        <span>{card.label}</span>
        <strong>{card.value}</strong>
        <small>↑ {card.trend} <em>vs yesterday</em></small>
      </div>
    </Card>
  );
}

function AlertCard({
  card,
}: {
  card: { label: string; value: string; tone: string; icon: string };
}) {
  return (
    <Card className="aw-alert-card">
      <div className={`aw-mini-icon ${card.tone}`}>
        <Icon name={card.icon} />
      </div>
      <span>{card.label}</span>
      <strong>{card.value}</strong>
      <a href="#view">View All <Icon name="arrow" /></a>
    </Card>
  );
}

function RevenueChart() {
  const revenue = [800, 1020, 1040, 920, 1120, 1400, 1210];
  const depositsLine = [560, 720, 760, 610, 810, 1000, 870];
  const withdrawalsLine = [300, 410, 420, 320, 430, 620, 510];
  const yLabels = ["1.5M", "1.2M", "900K", "600K", "300K", "0"];

  return (
    <Card className="aw-panel aw-revenue-panel">
      <PanelHeader title="Revenue Overview" action="Last 7 Days" />
      <div className="aw-legend">
        <span className="gold">Revenue (GHS)</span>
        <span className="green">Deposits (GHS)</span>
        <span className="blue">Withdrawals (GHS)</span>
      </div>
      <div className="aw-line-chart">
        <div className="aw-y-axis">
          {yLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        <div className="aw-chart-grid">
          <svg viewBox="0 0 760 286" role="img" aria-label="Revenue line chart">
            {[0, 1, 2, 3, 4, 5].map((line) => {
              const yPosition = chartTop + line * ((chartBottom - chartTop) / 5);
              return (
              <line
                className="chart-guide"
                x1={chartLeft}
                x2={chartRight}
                y1={yPosition}
                y2={yPosition}
                key={`guide-${line}`}
              />
            )})}
            {chartDays.map((day, index) => (
              <line
                className="chart-guide vertical"
                x1={x(index)}
                x2={x(index)}
                y1={chartTop}
                y2={chartBottom}
                key={`v-${day}`}
              />
            ))}
            <polyline className="line revenue" points={points(revenue)} />
            <polyline className="line deposits" points={points(depositsLine)} />
            <polyline className="line withdrawals" points={points(withdrawalsLine)} />
            {revenue.map((value, index) => (
              <circle className="dot revenue" cx={x(index)} cy={y(value)} r="4" key={`r-${index}`} />
            ))}
            {depositsLine.map((value, index) => (
              <circle className="dot deposits" cx={x(index)} cy={y(value)} r="4" key={`d-${index}`} />
            ))}
            {withdrawalsLine.map((value, index) => (
              <circle className="dot withdrawals" cx={x(index)} cy={y(value)} r="4" key={`w-${index}`} />
            ))}
            <text className="chart-value revenue" x="676" y={y(revenue[6]) - 12}>1.21M</text>
            <text className="chart-value deposits" x="676" y={y(depositsLine[6]) + 18}>870K</text>
            <text className="chart-value withdrawals" x="676" y={y(withdrawalsLine[6]) + 18}>510K</text>
          </svg>
          <div className="aw-x-axis">
            {chartDays.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

const chartLeft = 34;
const chartRight = 724;
const chartTop = 24;
const chartBottom = 242;
const chartMax = 1500;

function x(index: number) {
  return chartLeft + index * ((chartRight - chartLeft) / 6);
}

function y(value: number) {
  return chartBottom - (value / chartMax) * (chartBottom - chartTop);
}

function points(values: number[]) {
  return values.map((value, index) => `${x(index)},${y(value)}`).join(" ");
}

function DonutPanel() {
  return (
    <Card className="aw-panel">
      <PanelHeader title="Deposits vs Withdrawals" action="Last 7 Days" />
      <div className="aw-donut-layout">
        <div className="aw-donut">
          <div>
            <strong>GHS 7.21M</strong>
            <span>Total Value</span>
          </div>
        </div>
        <div className="aw-donut-legend">
          <div>
            <span className="green">Deposits</span>
            <strong>GHS 4,128,760</strong>
            <small>57.27%</small>
          </div>
          <div>
            <span className="red">Withdrawals</span>
            <strong>GHS 3,081,240</strong>
            <small>42.73%</small>
          </div>
        </div>
      </div>
    </Card>
  );
}

function PanelHeader({ title, action }: { title: string; action?: string }) {
  return (
    <CardHeader className="aw-panel-header">
      <CardTitle>{title}</CardTitle>
      {action ? <Button type="button" variant="outline" size="sm">{action} <Icon name="chevron" /></Button> : null}
    </CardHeader>
  );
}

function QuickActions() {
  return (
    <Card className="aw-panel">
      <PanelHeader title="Quick Actions" />
      <div className="aw-action-grid">
        {quickActions.map((action) => (
          <Button type="button" variant="tile" className="aw-action" key={action.label}>
            {action.badge ? <Badge tone="red">{action.badge}</Badge> : null}
            <span className={`aw-action-icon ${action.tone}`}>
              <Icon name={action.icon} />
            </span>
            {action.label}
          </Button>
        ))}
      </div>
    </Card>
  );
}

function ActivityTable({
  title,
  rows,
  status,
  footer,
}: {
  title: string;
  rows: string[][];
  status: "Completed" | "Pending";
  footer: string;
}) {
  return (
    <Card className="aw-panel aw-table-panel">
      <PanelHeader title={title} />
      <div className="aw-tabs">
        <Button className="active" type="button" variant="ghost">Deposits</Button>
        <Button type="button" variant="ghost">Withdrawals</Button>
        <Button type="button" variant="ghost">Registrations</Button>
        <Button type="button" variant="ghost">Bets</Button>
      </div>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Amount</th>
            <th>Payment Method</th>
            <th>Status</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, email, amount, method, time]) => (
            <tr key={`${name}-${amount}`}>
              <td>
                <span className="aw-user-cell">
                  <span className="aw-mini-avatar">{name.slice(0, 1)}</span>
                  <span>
                    <strong>{name}</strong>
                    <small>{email}</small>
                  </span>
                </span>
              </td>
              <td>{amount}</td>
              <td>{method}</td>
              <td><span className={`aw-status ${status.toLowerCase()}`}>{status}</span></td>
              <td>{time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <a className="aw-panel-link" href="#all">{footer} <Icon name="arrow" /></a>
    </Card>
  );
}

function PlatformStatus() {
  return (
    <Card className="aw-panel">
      <PanelHeader title="Platform Status" />
      <div className="aw-status-list">
        {platformStatus.map((item) => (
          <div key={item}>
            <span><Icon name="status" /> {item}</span>
            <strong><i /> Operational</strong>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SportsPerformance() {
  return (
    <Card className="aw-panel aw-table-panel">
      <PanelHeader title="Sports Performance (Today)" />
      <table>
        <thead>
          <tr>
            <th>Sport</th>
            <th>Total Stakes</th>
            <th>% of Total</th>
            <th>Profit (GHS)</th>
            <th>ROI</th>
          </tr>
        </thead>
        <tbody>
          {sportsRows.map((row) => (
            <tr key={row[0]}>
              <td><strong>{row[0]}</strong></td>
              <td>{row[1]}</td>
              <td>{row[2]}</td>
              <td className="positive">{row[3]}</td>
              <td className="positive">{row[4]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <a className="aw-panel-link" href="#sports">View Full Sports Report <Icon name="arrow" /></a>
    </Card>
  );
}

function RiskAlerts() {
  return (
    <Card className="aw-panel">
      <PanelHeader title="Risk Alerts" />
      <div className="aw-risk-list">
        {riskAlerts.map(([title, body, time, tone]) => (
          <div key={title}>
            <span className={`aw-risk-icon ${tone}`}>!</span>
            <span>
              <strong>{title}</strong>
              <small>{body}</small>
            </span>
            <time>{time}</time>
          </div>
        ))}
      </div>
      <a className="aw-panel-link" href="#risk">View All Risk Alerts <Icon name="arrow" /></a>
    </Card>
  );
}

function SupportOverview() {
  return (
    <Card className="aw-panel">
      <PanelHeader title="Support Overview" />
      <div className="aw-support-metrics">
        <span><strong>8</strong>Open Tickets</span>
        <span><strong>5</strong>In Progress</span>
        <span><strong>23</strong>Waiting on User</span>
        <span><strong>98%</strong>Satisfaction Rate</span>
      </div>
      <div className="aw-support-layout">
        <table>
          <thead>
            <tr>
              <th>Top Issues</th>
              <th>Tickets</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {supportIssues.map((row) => (
              <tr key={row[0]}>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="aw-small-donut" aria-label="Support issues chart" />
      </div>
      <a className="aw-panel-link" href="#tickets">View All Tickets <Icon name="arrow" /></a>
    </Card>
  );
}

export function AdminDashboard() {
  return (
    <main className="aw-shell" id="dashboard">
      <AdminSidebar active="Dashboard" />
      <section className="aw-main">
        <AdminTopbar title="Overview Dashboard" />
        <div className="aw-content">
          <section className="aw-stats-grid" aria-label="Dashboard metrics">
            {statCards.map((card) => (
              <StatCard card={card} key={card.label} />
            ))}
            {alertCards.map((card) => (
              <AlertCard card={card} key={card.label} />
            ))}
          </section>

          <section className="aw-grid aw-grid-top">
            <RevenueChart />
            <DonutPanel />
            <QuickActions />
          </section>

          <section className="aw-grid aw-grid-middle">
            <ActivityTable title="Recent Activity" rows={deposits} status="Completed" footer="View All Deposits" />
            <ActivityTable title="Recent Withdrawals" rows={withdrawals} status="Pending" footer="View All Withdrawals" />
            <PlatformStatus />
          </section>

          <section className="aw-grid aw-grid-bottom">
            <SportsPerformance />
            <RiskAlerts />
            <SupportOverview />
          </section>
        </div>
        <footer className="aw-version">Version 1.0.0</footer>
      </section>
    </main>
  );
}
