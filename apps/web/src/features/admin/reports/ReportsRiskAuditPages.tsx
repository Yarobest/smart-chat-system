import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminSidebar, AdminTopbar, Icon } from "@/features/admin/dashboard/AdminDashboard";
import type { ReactNode } from "react";

type Stat = { label: string; value: string; trend: string; tone: string; icon: string; positive?: boolean };

const reportStats: Stat[] = [
  { label: "Total Revenue (Today)", value: "GHS 2,458,720", trend: "12.45%", tone: "green", icon: "coins" },
  { label: "Total Profit (Today)", value: "GHS 1,245,390", trend: "10.32%", tone: "purple", icon: "wallet" },
  { label: "Total Bets (Today)", value: "18,542", trend: "8.72%", tone: "blue", icon: "report" },
  { label: "Total Deposits (Today)", value: "GHS 2,105,300", trend: "8.12%", tone: "green", icon: "inbox" },
  { label: "Total Withdrawals (Today)", value: "GHS 892,750", trend: "11.45%", tone: "orange", icon: "outbox" },
  { label: "Active Users (Today)", value: "12,845", trend: "6.23%", tone: "blue", icon: "user" },
];

const riskStats: Stat[] = [
  { label: "High Risk Alerts", value: "12", trend: "20%", tone: "red", icon: "shield", positive: false },
  { label: "Medium Risk Alerts", value: "28", trend: "7.69%", tone: "orange", icon: "badge" },
  { label: "Low Risk Alerts", value: "45", trend: "12.50%", tone: "gold", icon: "ticket" },
  { label: "Blocked Accounts", value: "16", trend: "14.29%", tone: "purple", icon: "users" },
  { label: "Suspicious Bets (Today)", value: "32", trend: "18.52%", tone: "blue", icon: "target" },
  { label: "Flagged Transactions", value: "26", trend: "8.33%", tone: "green", icon: "report" },
];

const auditStats: Stat[] = [
  { label: "Total Logs (Today)", value: "1,245", trend: "15.32%", tone: "blue", icon: "wallet" },
  { label: "Admin Actions", value: "324", trend: "8.71%", tone: "green", icon: "report" },
  { label: "User Logins", value: "647", trend: "12.08%", tone: "purple", icon: "user" },
  { label: "Data Changes", value: "198", trend: "3.26%", tone: "orange", icon: "outbox", positive: false },
  { label: "Failed Logins", value: "76", trend: "6.45%", tone: "red", icon: "cash", positive: false },
  { label: "System Events", value: "156", trend: "9.21%", tone: "blue", icon: "admin" },
];

const riskRows = [
  ["#RISK-2024-000125", "Kofi Mensah", "USR-001245", "Multiple Accounts", "High", "Multiple accounts created\nusing same device & IP", "May 20, 2024\n10:24 AM"],
  ["#RISK-2024-000124", "Ama Boateng", "USR-001246", "Large Bet", "High", "Placed a large bet above\nusual limit", "May 20, 2024\n09:15 AM"],
  ["#RISK-2024-000123", "Yaw Appiah", "USR-001247", "Unusual Betting Pattern", "High", "Unusual betting pattern\ndetected", "May 20, 2024\n08:50 AM"],
  ["#RISK-2024-000122", "Nana Adjei", "USR-001248", "Bonus Abuse", "Medium", "Multiple bonus claims\nfrom same device", "May 19, 2024\n11:10 PM"],
  ["#RISK-2024-000121", "Akua Darko", "USR-001249", "Rapid Deposit/Withdrawal", "Medium", "Rapid deposit and\nwithdrawal behavior", "May 19, 2024\n09:35 PM"],
  ["#RISK-2024-000120", "Daniel Baffour", "USR-001250", "High Withdrawal", "Medium", "Withdrawal amount significantly\nhigher than deposits", "May 19, 2024\n07:20 PM"],
  ["#RISK-2024-000119", "Emmanuel Quaye", "USR-001251", "Failed KYC", "Medium", "KYC verification failed\nmultiple times", "May 19, 2024\n06:45 PM"],
  ["#RISK-2024-000118", "Abena Owusu", "USR-001252", "Suspicious IP", "Low", "Login from high risk\ngeographical location", "May 19, 2024\n05:15 PM"],
  ["#RISK-2024-000117", "Prince Asante", "USR-001253", "Deposit Structuring", "Low", "Multiple small deposits\nstructured", "May 19, 2024\n04:01 PM"],
  ["#RISK-2024-000116", "Mathew Owusu", "USR-001254", "Odds Manipulation", "Low", "Possible attempt to exploit\nodds movement", "May 19, 2024\n02:20 PM"],
];

const auditRows = [
  ["May 20, 2024\n10:24:31 AM", "Michael Owusu", "Super Admin", "Updated User", "User", "USR-001245", "197.210.45.12", "Success"],
  ["May 20, 2024\n10:21:18 AM", "Akua Darko", "Admin", "Approved KYC", "KYC Verification", "KYC-009876", "197.210.45.18", "Success"],
  ["May 20, 2024\n10:18:05 AM", "Kofi Mensah", "Admin", "Rejected Withdrawal", "Withdrawal", "WDR-004512", "197.210.45.22", "Success"],
  ["May 20, 2024\n10:15:42 AM", "Yaw Appiah", "Admin", "Updated Odds", "Match Odds", "ODD-125478", "197.210.45.15", "Success"],
  ["May 20, 2024\n10:12:33 AM", "Nana Adjei", "Admin", "Created Bonus", "Bonus", "BON-00674", "197.210.45.11", "Success"],
  ["May 20, 2024\n10:05:19 AM", "System", "System", "System Backup", "System", "SYS-BKP-778", "-", "Success"],
  ["May 20, 2024\n10:02:47 AM", "Unknown", "Unknown", "Failed Login", "Admin Panel", "-", "178.62.45.67", "Failed"],
  ["May 20, 2024\n09:58:11 AM", "Abena Owusu", "Admin", "Suspended User", "User", "USR-000987", "197.210.45.21", "Success"],
  ["May 20, 2024\n09:54:32 AM", "Prince Asante", "Admin", "Edited Match", "Match", "MAT-008765", "197.210.45.19", "Success"],
  ["May 20, 2024\n09:50:08 AM", "Daniel Baffour", "Admin", "Approved Withdrawal", "Withdrawal", "WDR-004511", "197.210.45.17", "Success"],
];

const summaryRows = [
  ["Metric", "This Period (May 14 - May 20)", "Previous Period (May 7 - May 13)", "Change"],
  ["Total Revenue", "GHS 15,245,320", "GHS 13,210,450", "↑ 15.40%"],
  ["Total Profit", "GHS 7,812,550", "GHS 6,715,230", "↑ 16.33%"],
  ["Total Bets", "128,654", "115,230", "↑ 11.65%"],
  ["Total Stake", "GHS 18,542,320", "GHS 16,320,450", "↑ 13.62%"],
  ["Total Payouts", "GHS 10,729,770", "GHS 9,605,220", "↑ 11.71%"],
  ["Total Deposits", "GHS 14,736,210", "GHS 12,982,300", "↑ 13.51%"],
  ["Total Withdrawals", "GHS 6,249,120", "GHS 5,402,800", "↑ 15.66%"],
  ["Active Users", "54,210", "48,332", "↑ 12.17%"],
  ["New Users", "8,954", "7,412", "↑ 20.81%"],
];

const dailyRows = [
  ["Date", "Revenue (GHS)", "Profit (GHS)", "Bets", "Deposits (GHS)", "Withdrawals (GHS)", "Active Users"],
  ["May 20, 2024", "2,458,720", "1,245,390", "18,542", "2,105,300", "892,750", "12,845"],
  ["May 19, 2024", "2,215,430", "1,102,240", "17,320", "1,985,450", "812,140", "12,210"],
  ["May 18, 2024", "2,324,880", "1,186,770", "16,875", "2,012,340", "845,210", "11,985"],
  ["May 17, 2024", "2,145,210", "1,031,120", "15,642", "1,865,300", "789,450", "11,420"],
  ["May 16, 2024", "2,128,340", "999,450", "15,210", "1,745,210", "756,320", "11,220"],
  ["May 15, 2024", "2,085,320", "986,520", "14,852", "1,695,210", "712,320", "10,895"],
  ["May 14, 2024", "1,887,420", "860,050", "14,213", "1,327,400", "645,980", "10,320"],
];

function StatCard({ stat }: { stat: Stat }) {
  const positive = stat.positive ?? true;
  return (
    <Card className="aw-stat betting-stat-card">
      <div className={`aw-stat-icon ${stat.tone}`}><Icon name={stat.icon} /></div>
      <div>
        <span>{stat.label}</span>
        <strong>{stat.value}</strong>
        <small className={positive ? "positive" : "negative"}>{positive ? "↑" : "↓"} {stat.trend} <em>vs yesterday</em></small>
      </div>
    </Card>
  );
}

function Shell({ active, title, subtitle, children }: { active: string; title: string; subtitle: string; children: ReactNode }) {
  return (
    <main className="aw-shell betting-page report-admin-page">
      <AdminSidebar active={active} />
      <section className="aw-main">
        <AdminTopbar title={title} subtitle={subtitle} />
        <div className="aw-content">{children}</div>
      </section>
    </main>
  );
}

function Status({ value }: { value: string }) {
  const tone = value === "Success" || value === "Low" ? "completed" : value === "Medium" ? "pending" : "rejected";
  return <span className={`aw-status ${tone}`}>{value}</span>;
}

function Split({ text }: { text: string }) {
  return <>{text.split("\n").map((line) => <span key={line}>{line}</span>)}</>;
}

function Actions() {
  return <div className="user-row-actions"><Button variant="outline" size="icon" type="button"><Icon name="search" /></Button><Button variant="outline" size="icon" type="button"><Icon name="menu" /></Button></div>;
}

function Pagination({ label }: { label: string }) {
  return <footer className="users-pagination"><span>{label}</span><div><Button type="button" variant="outline" size="icon"><Icon name="chevron" /></Button>{["1", "2", "3", "4", "5"].map((page) => <Button className={page === "1" ? "active" : undefined} type="button" variant="outline" key={page}>{page}</Button>)}<span>...</span><Button type="button" variant="outline">13</Button><Button type="button" variant="outline" size="icon"><Icon name="arrow" /></Button><select defaultValue="10 / page"><option>10 / page</option></select></div></footer>;
}

export function ReportsPage() {
  return (
    <Shell active="Reports" title="Reports" subtitle="Comprehensive analytics and platform reports">
      <section className="betting-stats six">{reportStats.map((stat) => <StatCard stat={stat} key={stat.label} />)}</section>
      <Card className="aw-panel reports-main-card">
        <div className="betting-tabs">{["Overview", "Financial", "Users", "Bets", "Deposits & Withdrawals", "Sports", "Bonuses & Promotions"].map((tab, i) => <button className={i === 0 ? "active" : undefined} type="button" key={tab}>{tab}</button>)}</div>
        <div className="reports-filter-row">
          <button className="deposit-date-button" type="button"><Icon name="calendar" /> May 14, 2024 - May 20, 2024 <Icon name="chevron" /></button>
          {["Today", "Yesterday", "7D", "30D", "90D", "Custom"].map((item) => <button className={item === "7D" ? "active" : undefined} type="button" key={item}>{item}</button>)}
          <select defaultValue="All Sports"><option>All Sports</option></select>
          <select defaultValue="All Currencies (GHS)"><option>All Currencies (GHS)</option></select>
          <Button type="button" variant="outline"><Icon name="outbox" /> Export Report</Button>
        </div>
        <section className="reports-chart-grid">
          <ChartPanel title="Revenue Trend (GHS)" kind="line" />
          <ChartPanel title="Deposits vs Withdrawals" kind="bars" />
          <ChartPanel title="Profit by Day" kind="area" />
        </section>
        <section className="reports-summary-grid">
          <ReportTable title="Summary Overview" rows={summaryRows} />
          <Bars title="Top Sports (By Revenue)" labels={["Football", "Basketball", "Tennis", "Esports", "Cricket", "Others"]} values={["GHS 10,245,320", "GHS 2,125,450", "GHS 1,245,320", "GHS 845,210", "GHS 412,450", "GHS 371,570"]} />
          <Bars title="Top Markets (By Handle)" labels={["Match Winner", "Over/Under", "Both Teams to Score", "Correct Score", "Double Chance", "Others"]} values={["GHS 8,542,310", "GHS 4,125,650", "GHS 2,145,320", "GHS 1,542,210", "GHS 1,025,410", "GHS 1,161,420"]} purple />
        </section>
        <section className="reports-bottom-grid">
          <ReportTable title="Recent Daily Summary" rows={dailyRows} wide />
          <Card className="aw-panel report-distribution"><h2 className="mini-panel-title">Revenue Distribution</h2><div><div className="report-donut"><span>GHS<br />15,245,320<small>Total Revenue</small></span></div><ul><li><b />Sports Betting <span>GHS 12,245,320</span> 80.32%</li><li><b />Live Betting <span>GHS 1,854,120</span> 12.16%</li><li><b />Esports Betting <span>GHS 652,410</span> 4.28%</li><li><b />Others <span>GHS 493,470</span> 3.24%</li></ul></div></Card>
          <QuickReports />
        </section>
        <p className="reports-note">All reports are displayed in Ghana Cedis (GHS)</p>
      </Card>
    </Shell>
  );
}

function ChartPanel({ title, kind }: { title: string; kind: "line" | "bars" | "area" }) {
  const yLabels = kind === "area" ? ["2M", "1.5M", "1M", "500K", "0"] : ["3M", "2.5M", "2M", "1.5M", "1M", "500K", "0"];
  const legend = kind === "line" ? ["Revenue", "Profit"] : kind === "bars" ? ["Deposits", "Withdrawals"] : [];

  return (
    <Card className="aw-panel report-chart-card">
      <header className="deposit-section-heading"><h2>{title}</h2><select defaultValue="Daily"><option>Daily</option></select></header>
      {legend.length ? (
        <div className="report-chart-legend">
          {legend.map((item, index) => <span className={index === 0 ? (kind === "line" ? "gold" : "green") : (kind === "line" ? "green" : "red")} key={item}>{item}</span>)}
        </div>
      ) : null}
      <div className="report-chart-frame">
        <svg viewBox="0 0 560 230" role="img" aria-label={title}>
          <g className="report-grid-lines">
            {[24, 50, 76, 102, 128, 154, 180].map((y) => <line key={`h${y}`} x1="54" x2="540" y1={y} y2={y} />)}
            {[74, 146, 218, 290, 362, 434, 506].map((x) => <line key={`v${x}`} x1={x} x2={x} y1="24" y2="180" />)}
          </g>
          <g className="report-y-labels">
            {yLabels.map((label, i) => <text key={label} x="18" y={kind === "area" ? 37 + i * 36 : 28 + i * 26}>{label}</text>)}
          </g>
          {kind === "bars" ? <BarsSvg /> : kind === "area" ? <AreaSvg /> : <LineSvg />}
          {["May 14", "May 15", "May 16", "May 17", "May 18", "May 19", "May 20"].map((d, i) => <text className="report-x-label" key={d} x={60 + i * 72} y="213">{d}</text>)}
        </svg>
      </div>
    </Card>
  );
}

function LineSvg() {
  const xs = [74, 146, 218, 290, 362, 434, 506];
  const revenue = [118, 92, 84, 109, 105, 78, 94];
  const profit = [156, 132, 123, 148, 140, 118, 132];
  return <><polyline className="yellow" points={xs.map((x, i) => `${x},${revenue[i]}`).join(" ")} /><polyline className="green" points={xs.map((x, i) => `${x},${profit[i]}`).join(" ")} />{xs.map((x, i) => <circle className="yellow-dot" key={`y${x}`} cx={x} cy={revenue[i]} r="4" />)}{xs.map((x, i) => <circle className="green-dot" key={`g${x}`} cx={x} cy={profit[i]} r="4" />)}</>;
}

function BarsSvg() {
  const xs = [74, 146, 218, 290, 362, 434, 506];
  const deposits = [72, 60, 72, 84, 69, 77, 88];
  const withdrawals = [101, 96, 103, 114, 97, 108, 116];
  return <>{xs.map((x, i) => <g key={x}><rect className="bar-green" x={x - 12} y={deposits[i]} width="17" height={180 - deposits[i]} rx="2" /><rect className="bar-red" x={x + 11} y={withdrawals[i]} width="17" height={180 - withdrawals[i]} rx="2" /></g>)}</>;
}

function AreaSvg() {
  const xs = [74, 146, 218, 290, 362, 434, 506];
  const ys = [128, 76, 104, 134, 84, 82, 78];
  return <><defs><linearGradient id="profitFill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#7c3aed" stopOpacity=".78" /><stop offset="1" stopColor="#7c3aed" stopOpacity=".08" /></linearGradient></defs><polygon className="area-fill" points={`${xs.map((x, i) => `${x},${ys[i]}`).join(" ")} 506,180 74,180`} /><polyline className="purple" points={xs.map((x, i) => `${x},${ys[i]}`).join(" ")} />{xs.map((x, i) => <circle className="purple-dot" key={x} cx={x} cy={ys[i]} r="4" />)}</>;
}

function ReportTable({ title, rows, wide }: { title: string; rows: string[][]; wide?: boolean }) {
  return <Card className={`aw-panel report-mini-table ${wide ? "wide" : ""}`}><h2 className="mini-panel-title">{title}</h2>{rows.map((row, index) => <p className={index === 0 ? "head" : undefined} key={row.join("-")}>{row.map((cell) => <span className={cell.startsWith("↑") ? "positive" : undefined} key={cell}>{cell}</span>)}</p>)}</Card>;
}

function Bars({ title, labels, values, purple }: { title: string; labels: string[]; values: string[]; purple?: boolean }) {
  return <Card className="aw-panel"><h2 className="mini-panel-title">{title}</h2><div className={`report-bars ${purple ? "purple" : ""}`}>{labels.map((label, i) => <p key={label}><span>{label}</span><b style={{ width: `${92 - i * 11}%` }} /><span>{values[i]}</span><em>{i === 0 ? (purple ? "46.08%" : "67.22%") : `${Math.max(2.42, 22.26 - i * 4.7).toFixed(2)}%`}</em></p>)}</div></Card>;
}

function QuickReports() {
  return <Card className="aw-panel quick-report-card"><h2 className="mini-panel-title">Quick Reports</h2>{["Financial Report", "User Activity Report", "Betting Activity Report", "Deposit & Withdrawal Report"].map((item) => <button type="button" key={item}><Icon name="report" /><span>{item}<small>Download detailed platform report</small></span></button>)}</Card>;
}

export function RiskManagementPage() {
  return (
    <Shell active="Risk Management" title="Risk Management" subtitle="Monitor and manage risks across the platform">
      <section className="betting-stats six">{riskStats.map((stat) => <StatCard stat={stat} key={stat.label} />)}</section>
      <section className="risk-focus-layout">
        <Card className="aw-panel betting-table-card risk-alert-card">
          <div className="betting-tabs">{["Risk Overview", "Suspicious Accounts", "Large Bets", "Unusual Transactions", "Failed KYC", "IP Monitoring"].map((tab, i) => <button className={i === 0 ? "active" : undefined} type="button" key={tab}>{tab}{i > 0 ? <Badge tone="blue">{[12,18,15,9,7][i - 1]}</Badge> : null}</button>)}</div>
          <div className="risk-tools"><button className="deposit-date-button" type="button"><Icon name="calendar" /> May 14, 2024 - May 20, 2024 <Icon name="chevron" /></button><label className="users-search"><Icon name="search" /><Input placeholder="Search by user, email, IP or ID..." /></label><Button variant="outline"><Icon name="settings" /> Filters</Button><select><option>All Risk Levels</option></select><select><option>All Alert Types</option></select><Button variant="outline">Reset</Button></div>
          <h2 className="risk-table-title">Risk Alerts</h2>
          <div className="risk-table-wrap"><table><thead><tr><th>ID</th><th>User</th><th>Risk Type</th><th>Risk Level</th><th>Description</th><th>Detected On</th><th>Actions</th></tr></thead><tbody>{riskRows.map(([id, name, userId, type, level, desc, date]) => <tr key={id}><td>{id}</td><td><span className="admin-user-cell"><span className="aw-mini-avatar">{name[0]}</span><span><strong>{name}</strong><small>{userId}</small></span></span></td><td><span className="risk-dot" />{type}</td><td><Status value={level} /></td><td><Split text={desc} /></td><td><Split text={date} /></td><td><Actions /></td></tr>)}</tbody></table></div>
          <Pagination label="Showing 1 to 10 of 125 alerts" />
        </Card>
      </section>
    </Shell>
  );
}

function RiskSide() {
  return (
    <aside className="betting-side">
      <Card className="aw-panel betting-side-card risk-distribution-card">
        <h2 className="mini-panel-title">Risk Distribution</h2>
        <div>
          <div className="risk-donut"><span>Total<br />85<small>Alerts</small></span></div>
          <ul className="risk-legend">
            <li><b className="red-dot" />High Risk <span>12 (14.12%)</span></li>
            <li><b className="orange-dot" />Medium Risk <span>28 (32.94%)</span></li>
            <li><b className="gold-dot" />Low Risk <span>45 (52.94%)</span></li>
          </ul>
        </div>
      </Card>
      <Card className="aw-panel betting-side-card">
        <h2 className="mini-panel-title">Top Risk Reasons</h2>
        <div className="report-bars risk">{["Multiple Accounts", "Large Bets", "Unusual Betting Pattern", "Bonus Abuse", "High Withdrawals", "Others"].map((label, i) => <p key={label}><span>{label}</span><b style={{ width: `${90 - i * 9}%` }} /><em>{[22,18,15,12,8,10][i]} ({[25.88,21.18,17.65,14.12,9.41,11.76][i]}%)</em></p>)}</div>
      </Card>
      <Card className="aw-panel betting-side-card">
        <h2 className="mini-panel-title">Recent High Risk Alerts</h2>
        <div className="risk-recent-list">
          {["Kofi Mensah|Multiple Accounts|10:24 AM", "Ama Boateng|Large Bet|09:15 AM", "Yaw Appiah|Unusual Pattern|08:50 AM"].map((row) => {
            const [name, reason, time] = row.split("|");
            return <p key={name}><span className="aw-mini-avatar">{name[0]}</span><strong>{name}<small>{reason}</small></strong><time>{time}</time><Badge tone="red">High</Badge></p>;
          })}
          <button type="button">View All High Risk Alerts <Icon name="arrow" /></button>
        </div>
      </Card>
      <Card className="aw-panel betting-side-card">
        <h2 className="mini-panel-title">Quick Actions</h2>
        <div className="risk-actions"><Button className="deposit-action-flag">Review Alerts (12)</Button><Button className="deposit-action-receipt">Block Account</Button><Button className="deposit-action-note">Add to Watchlist</Button><Button className="deposit-action-wallet">Risk Report</Button></div>
      </Card>
      <Card className="aw-panel betting-side-card risk-settings-card"><div><h2 className="mini-panel-title">Risk Settings</h2><small>Configure risk rules, thresholds and alerts</small></div><Button variant="outline">Manage Settings</Button></Card>
    </aside>
  );
}

export function AuditLogsPage() {
  return (
    <Shell active="Audit Logs" title="Audit Logs" subtitle="Track and review all system activities and admin actions">
      <section className="betting-stats six">{auditStats.map((stat) => <StatCard stat={stat} key={stat.label} />)}</section>
      <section className="risk-layout audit">
        <Card className="aw-panel betting-table-card">
          <div className="betting-tabs">{["All Logs", "Admin Actions", "User Activities", "System Events", "Security Events"].map((tab, i) => <button className={i === 0 ? "active" : undefined} type="button" key={tab}>{tab}</button>)}</div>
          <div className="audit-tools"><button className="deposit-date-button" type="button"><Icon name="calendar" /> May 14, 2024 - May 20, 2024 <Icon name="chevron" /></button><label className="users-search"><Icon name="search" /><Input placeholder="Search by user, action, resource, IP..." /></label><select><option>All Actions</option></select><select><option>All Resources</option></select><select><option>All Admins</option></select><select><option>All Status</option></select><Button variant="outline"><Icon name="settings" /> Filters</Button></div>
          <div className="audit-table-wrap"><table><thead><tr><th>Time</th><th>Admin / User</th><th>Action</th><th>Resource</th><th>Resource ID</th><th>IP Address</th><th>Status</th><th>Details</th></tr></thead><tbody>{auditRows.map(([time, name, role, action, resource, resourceId, ip, status]) => <tr key={`${time}-${action}`}><td><Split text={time} /></td><td><span className="admin-user-cell"><span className="aw-mini-avatar">{name[0]}</span><span><strong>{name}</strong><small>{role}</small></span></span></td><td><Badge tone={action.includes("Failed") || action.includes("Rejected") ? "red" : action.includes("Updated") || action.includes("Edited") ? "blue" : "green"}>{action}</Badge></td><td>{resource}</td><td>{resourceId}</td><td>{ip}</td><td><Status value={status} /></td><td><Button variant="outline" size="icon" type="button"><Icon name="search" /></Button></td></tr>)}</tbody></table></div>
          <Pagination label="Showing 1 to 10 of 12,458 logs" />
        </Card>
        <AuditSide />
      </section>
    </Shell>
  );
}

function AuditSide() {
  return (
    <aside className="betting-side">
      <Card className="aw-panel betting-side-card audit-detail-card">
        <header className="deposit-panel-heading"><h2>Log Details</h2><Badge tone="green">Success</Badge><button><Icon name="x" /></button></header>
        <h3>Overview</h3>
        <dl className="deposit-details-list">
          <div><dt>Time</dt><dd>May 20, 2024 10:24:31 AM (GMT)</dd></div>
          <div><dt>Admin</dt><dd><span className="admin-user-cell"><span className="aw-mini-avatar">M</span><span><strong>Michael Owusu</strong><small>Super Admin</small></span></span></dd></div>
          <div><dt>Action</dt><dd>Updated User</dd></div>
          <div><dt>Resource</dt><dd>User</dd></div>
          <div><dt>Resource ID</dt><dd>USR-001245</dd></div>
          <div><dt>IP Address</dt><dd>197.210.45.12</dd></div>
          <div><dt>User Agent</dt><dd>Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36</dd></div>
          <div><dt>Status</dt><dd className="positive">Success</dd></div>
        </dl>
      </Card>
      <Card className="aw-panel betting-side-card"><h2 className="mini-panel-title">Change Summary</h2><div className="audit-change-grid"><span /> <span>Before</span><span>After</span><b>Status</b><p>Active</p><p className="negative">Suspended</p><b>Email</b><p>kofi.mensah@email.com</p><p>kofi.mensah@email.com</p><b>Phone</b><p>+233 24 123 4567</p><p>+233 24 123 4567</p><b>Wallet Balance</b><p>GHS 1,245.50</p><p>GHS 1,245.50</p><b>KYC Status</b><p className="positive">Verified</p><p>Verified</p></div></Card>
      <Card className="aw-panel betting-side-card"><h2 className="mini-panel-title">Additional Information</h2><dl className="deposit-details-list"><div><dt>Reason</dt><dd>User violated terms and conditions</dd></div><div><dt>Note</dt><dd>Multiple suspicious bets detected from same IP</dd></div><div><dt>Reference</dt><dd>RISK-ALERT-2024-0519</dd></div><div><dt>Performed On</dt><dd>Web Admin Panel</dd></div></dl></Card>
      <Card className="aw-panel betting-side-card"><header className="deposit-section-heading"><h2>Related Logs</h2><button>View All</button></header><div className="audit-related-list"><p><span>May 20, 2024 10:21:45 AM</span><b className="positive">Login Success</b></p><p><span>May 20, 2024 10:15:32 AM</span><b className="blue-text">Viewed User Details</b></p><p><span>May 19, 2024 08:45:11 PM</span><b className="warning-text">Flagged as High Risk</b></p></div></Card>
    </aside>
  );
}
