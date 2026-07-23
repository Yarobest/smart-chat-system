import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminSidebar, AdminTopbar, Icon } from "@/features/admin/dashboard/AdminDashboard";
import { oddsRows, oddsStats } from "./odds-data";

function OddsStatCard({ stat }: { stat: (typeof oddsStats)[number] }) {
  return (
    <Card className="aw-stat betting-stat-card">
      <div className={`aw-stat-icon ${stat.tone}`}><Icon name={stat.icon} /></div>
      <div>
        <span>{stat.label}</span>
        <strong>{stat.value}</strong>
        <small className={stat.positive ? "positive" : "negative"}>{stat.positive ? "↑" : "↓"} {stat.trend} <em>vs yesterday</em></small>
      </div>
    </Card>
  );
}

function OddsTable() {
  const eventSpan = (rowIndex: number) => oddsRows.filter((row) => row[1] === oddsRows[rowIndex][1]).length;
  const marketSpan = (rowIndex: number) => oddsRows.filter((row) => row[1] === oddsRows[rowIndex][1] && row[2] === oddsRows[rowIndex][2]).length;

  return (
    <Card className="aw-panel betting-table-card">
      <div className="betting-tabs">
        {["Odds", "Odds Changes", "Bulk Update", "Margin Rules", "Hold Management", "Suspended Odds"].map((tab, index) => (
          <button className={index === 0 ? "active" : undefined} type="button" key={tab}>{tab}</button>
        ))}
      </div>
      <div className="odds-tools">
        <button className="deposit-date-button" type="button"><Icon name="calendar" /> May 14, 2024 - May 20, 2024 <Icon name="chevron" /></button>
        <label className="users-search"><Icon name="search" /><Input placeholder="Search event, league, market..." /></label>
        <select defaultValue="All Sports"><option>All Sports</option></select>
        <select defaultValue="All Markets"><option>All Markets</option></select>
        <select defaultValue="All Status"><option>All Status</option></select>
        <Button type="button" variant="outline"><Icon name="settings" /> Filters</Button>
        <Button className="admin-primary-button" type="button"><Icon name="plus" /> Add Odds</Button>
      </div>
      <div className="odds-table-wrap">
        <table>
          <colgroup>
            <col className="odds-col-event" />
            <col className="odds-col-market" />
            <col className="odds-col-selection" />
            <col className="odds-col-odds" />
            <col className="odds-col-old" />
            <col className="odds-col-book" />
            <col className="odds-col-hold" />
            <col className="odds-col-status" />
            <col className="odds-col-updated" />
            <col className="odds-col-actions" />
          </colgroup>
          <thead>
            <tr><th>Event</th><th>Market</th><th>Selection</th><th>Odds</th><th>Old Odds</th><th>Book %</th><th>Hold %</th><th>Status</th><th>Last Updated</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {oddsRows.map(([emoji, event, market, selection, odds, oldOdds, book, hold, status, updated], index) => (
              <tr key={`${event}-${selection}`}>
                {index === 0 || oddsRows[index - 1][1] !== event ? (
                  <td className="odds-event-cell" rowSpan={eventSpan(index)}>
                    <span className="odds-event">
                      <i>{emoji}</i>
                      <span>{event.split("\n").map((line) => <strong key={line}>{line}</strong>)}</span>
                    </span>
                  </td>
                ) : null}
                {index === 0 || oddsRows[index - 1][1] !== event || oddsRows[index - 1][2] !== market ? (
                  <td className="odds-market-cell" rowSpan={marketSpan(index)}>
                    {market.split("\n").map((line) => <span className="blue-text" key={line}>{line}</span>)}
                  </td>
                ) : null}
                <td>{selection}</td>
                <td className="blue-text">{odds}</td>
                <td>{oldOdds}</td>
                <td>{book}</td>
                <td>{hold}</td>
                <td><span className={`aw-status ${status === "Active" ? "completed" : "pending"}`}>{status}</span></td>
                <td>{updated.split("\n").map((line) => <span key={line}>{line}</span>)}</td>
                <td>
                  <div className="odds-row-actions">
                    <Button variant="outline" size="icon" type="button" aria-label={`Edit ${selection} odds`}><Icon name="pencil" /></Button>
                    <Button variant="outline" size="icon" type="button" aria-label={`More actions for ${selection}`}><Icon name="menu" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer className="users-pagination"><span>Showing 1 to 10 of 18,542 odds</span><div><Button type="button" variant="outline" size="icon"><Icon name="chevron" /></Button>{["1", "2", "3", "4", "5"].map((page) => <Button className={page === "1" ? "active" : undefined} type="button" variant="outline" key={page}>{page}</Button>)}<span>...</span><Button type="button" variant="outline">1855</Button><Button type="button" variant="outline" size="icon"><Icon name="arrow" /></Button><select defaultValue="10 / page"><option>10 / page</option></select></div></footer>
    </Card>
  );
}

function OddsEditor() {
  return (
    <aside className="betting-side">
      <Card className="aw-panel betting-side-card">
        <header className="deposit-panel-heading"><h2>Odds Editor</h2><button><Icon name="x" /></button></header>
        <Badge tone="blue">1X2 (Full Time)</Badge>
        <div className="odds-editor-match"><span>⚽</span><div><strong>Man City vs Arsenal</strong><small>English Premier League</small></div><time>May 20, 2024 08:00 PM</time></div>
        <div className="odds-editor-grid header"><span>Selection</span><span>Odds</span><span>Book %</span><span>Hold %</span></div>
        {[
          ["Man City", "1.85", "56.21%", "6.45%"],
          ["Draw", "3.90", "26.18%", "6.45%"],
          ["Arsenal", "4.20", "17.61%", "6.45%"],
        ].map(([selection, odds, book, hold]) => (
          <div className="odds-editor-grid" key={selection}><strong>{selection}</strong><input defaultValue={odds} /><span>{book}</span><span>{hold}</span></div>
        ))}
        <div className="odds-quick-settings">
          <h3>Quick Settings</h3>
          <div><Button className="deposit-action-receipt">Balanced</Button><Button variant="outline">Favorites</Button><Button variant="outline">Underdog</Button></div>
          <label>Hold % <input defaultValue="6.45" /> <small>Recommended: 6% - 8%</small></label>
          <label>Status <select defaultValue="Active"><option>Active</option></select></label>
        </div>
        <div className="odds-editor-actions"><Button variant="outline">Reset</Button><Button className="admin-primary-button">Save Changes</Button></div>
      </Card>
      <Card className="aw-panel betting-side-card">
        <header className="deposit-section-heading"><h2>Odds Summary</h2></header>
        <dl className="deposit-details-list"><div><dt>Total Book %</dt><dd>100.00%</dd></div><div><dt>Average Hold %</dt><dd>6.45%</dd></div><div><dt>Vig (House Edge)</dt><dd>6.45%</dd></div><div><dt>Potential Payout</dt><dd>See Individual</dd></div></dl>
      </Card>
      <Card className="aw-panel betting-side-card">
        <header className="deposit-section-heading"><h2>Recent Odds Changes</h2><button>View All</button></header>
        <div className="recent-mini-list"><p><b>Man City vs Arsenal - 1X2</b> 1.83 → 1.85</p><p><b>Lakers vs Warriors - Moneyline</b> 1.95 → 1.92</p><p><b>Real Madrid vs Barcelona</b> 1.88 → 1.91</p></div>
      </Card>
    </aside>
  );
}

export function OddsManagementPage() {
  return (
    <main className="aw-shell betting-page" id="odds-management">
      <AdminSidebar active="Odds Management" />
      <section className="aw-main">
        <AdminTopbar title="Odds Management" subtitle="Manage and configure odds across all sports and markets" />
        <div className="aw-content">
          <section className="betting-stats six">{oddsStats.map((stat) => <OddsStatCard stat={stat} key={stat.label} />)}</section>
          <section className="betting-layout sports">
            <OddsTable />
            <OddsEditor />
          </section>
        </div>
      </section>
    </main>
  );
}
