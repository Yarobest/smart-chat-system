import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminSidebar, AdminTopbar, Icon } from "@/features/admin/dashboard/AdminDashboard";
import { bonusRows, bonusStats } from "./bonuses-data";

function BonusStatCard({ stat }: { stat: (typeof bonusStats)[number] }) {
  return (
    <Card className="aw-stat betting-stat-card">
      <div className={`aw-stat-icon ${stat.tone}`}><Icon name={stat.icon} /></div>
      <div>
        <span>{stat.label}</span>
        <strong>{stat.value}</strong>
        <small className={stat.positive ? "positive" : "negative"}>{stat.positive ? "↑" : "↓"} {stat.trend} <em>{stat.compare ?? "vs yesterday"}</em></small>
      </div>
    </Card>
  );
}

function BonusTile({ label }: { label: string }) {
  return <span className="bonus-tile">{label.split(" ").map((word) => <b key={word}>{word}</b>)}</span>;
}

function BonusStatus({ status }: { status: string }) {
  const tone = status === "Active" ? "completed" : status === "Scheduled" ? "pending" : "rejected";
  return <span className={`aw-status ${tone}`}>{status}</span>;
}

function BonusTable() {
  return (
    <Card className="aw-panel bonus-table-card">
      <div className="betting-tabs">
        {["All Bonuses", "Active", "Scheduled", "Expired", "Draft", "Bonus Types", "Bonus Usage"].map((tab, index) => (
          <button className={index === 0 ? "active" : undefined} type="button" key={tab}>{tab}</button>
        ))}
      </div>
      <div className="bonus-tools">
        <label className="users-search"><Icon name="search" /><Input placeholder="Search bonus name, code..." /></label>
        <select defaultValue="All Types"><option>All Types</option></select>
        <select defaultValue="All Status"><option>All Status</option></select>
        <Button type="button" variant="outline"><Icon name="settings" /> Filters</Button>
        <Button className="admin-primary-button" type="button"><Icon name="plus" /> Create Bonus</Button>
      </div>
      <div className="bonus-table-wrap">
        <table>
          <colgroup>
            <col className="bonus-col-name" />
            <col className="bonus-col-code" />
            <col className="bonus-col-type" />
            <col className="bonus-col-amount" />
            <col className="bonus-col-wagering" />
            <col className="bonus-col-date" />
            <col className="bonus-col-date" />
            <col className="bonus-col-status" />
            <col className="bonus-col-actions" />
          </colgroup>
          <thead><tr><th>Bonus Name</th><th>Code</th><th>Type</th><th>Amount / Value</th><th>Wagering</th><th>Start Date</th><th>End Date</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {bonusRows.map(([tile, name, desc, code, type, amount, wagering, start, end, status]) => (
              <tr key={code}>
                <td><span className="bonus-name-cell"><BonusTile label={tile} /><span><strong>{name}</strong><small>{desc}</small></span></span></td>
                <td className="blue-text">{code}</td>
                <td>{type}</td>
                <td>{amount.split("\n").map((line) => <span key={line}>{line}</span>)}</td>
                <td>{wagering.split("\n").map((line) => <span key={line}>{line}</span>)}</td>
                <td>{start.split("\n").map((line) => <span key={line}>{line}</span>)}</td>
                <td>{end.split("\n").map((line) => <span key={line}>{line}</span>)}</td>
                <td><BonusStatus status={status} /></td>
                <td><div className="odds-row-actions"><Button variant="outline" size="icon" type="button"><Icon name="pencil" /></Button><Button variant="outline" size="icon" type="button"><Icon name="menu" /></Button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer className="users-pagination"><span>Showing 1 to 10 of 58 bonuses</span><div><Button type="button" variant="outline" size="icon"><Icon name="chevron" /></Button>{["1", "2", "3", "4", "5"].map((page) => <Button className={page === "1" ? "active" : undefined} type="button" variant="outline" key={page}>{page}</Button>)}<span>...</span><Button type="button" variant="outline">6</Button><Button type="button" variant="outline" size="icon"><Icon name="arrow" /></Button><select defaultValue="10 / page"><option>10 / page</option></select></div></footer>
    </Card>
  );
}

function BonusDetails() {
  return (
    <aside className="betting-side">
      <Card className="aw-panel betting-side-card">
        <header className="deposit-panel-heading"><h2>Bonus Details</h2><button type="button"><Icon name="x" /></button></header>
        <div className="bonus-detail-hero">
          <BonusTile label="WELCOME BONUS" />
          <div>
            <span className="bonus-detail-title"><h2>Welcome Bonus 100%</h2><Badge tone="green">Active</Badge></span>
            <small>For new registered users</small>
          </div>
        </div>
        <dl className="deposit-details-list">
          <div><dt>Code</dt><dd>WELCOME100 <Icon name="copy" /></dd></div>
          <div><dt>Type</dt><dd>Welcome Bonus</dd></div>
          <div><dt>Amount</dt><dd>100% up to $100</dd></div>
          <div><dt>Wagering</dt><dd>10x (Deposit + Bonus)</dd></div>
          <div><dt>Start Date</dt><dd>May 10, 2024 12:00 AM</dd></div>
          <div><dt>End Date</dt><dd>May 31, 2024 11:59 PM</dd></div>
          <div><dt>Applicable To</dt><dd>New Users Only</dd></div>
          <div><dt>Status</dt><dd className="positive">Active</dd></div>
        </dl>
      </Card>
      <Card className="aw-panel betting-side-card">
        <header className="deposit-section-heading"><h2>Bonus Usage (This Month)</h2><button>View All</button></header>
        <div className="bonus-usage-grid">
          <span><Icon name="user" /><b>1,245</b><small>Users Claimed</small></span>
          <span><Icon name="wallet" /><b>$98,450.00</b><small>Total Bonus Given</small></span>
          <span><Icon name="gift" /><b>$784,550.20</b><small>Total Bonus Wagered</small></span>
          <span><Icon name="checkCircle" /><b>842</b><small>Bonus Completed</small></span>
        </div>
      </Card>
      <Card className="aw-panel betting-side-card"><header className="deposit-section-heading"><h2>Bonus Claims Over Time</h2><button>View Report</button></header><div className="bonus-line-chart" /></Card>
      <Card className="aw-panel betting-side-card"><header className="deposit-section-heading"><h2>Quick Actions</h2></header><div className="bonus-actions-grid"><Button className="deposit-action-wallet"><Icon name="plus" /> Create Bonus</Button><Button className="deposit-action-receipt"><Icon name="gift" /> Bonus Types</Button><Button className="deposit-action-note"><Icon name="report" /> Bonus Usage Report</Button><Button className="deposit-action-flag"><Icon name="trash" /> Expired Bonuses</Button></div></Card>
    </aside>
  );
}

export function BonusManagementPage() {
  return (
    <main className="aw-shell betting-page" id="bonus-management">
      <AdminSidebar active="Bonus Management" />
      <section className="aw-main">
        <AdminTopbar title="Bonus Management" subtitle="Create, manage and monitor all bonus and promotions" />
        <div className="aw-content">
          <section className="betting-stats six">{bonusStats.map((stat) => <BonusStatCard stat={stat} key={stat.label} />)}</section>
          <section className="betting-layout sports">
            <BonusTable />
            <BonusDetails />
          </section>
        </div>
      </section>
    </main>
  );
}
