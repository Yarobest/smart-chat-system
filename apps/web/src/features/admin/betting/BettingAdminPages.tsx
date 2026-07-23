import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminSidebar, AdminTopbar, Icon } from "@/features/admin/dashboard/AdminDashboard";
import type { ReactNode } from "react";
import { betRows, betStats, matchRows, matchStats, sportRows, sportStats } from "./betting-data";

type Stat = { label: string; value: string; trend: string; tone: string; icon: string; positive: boolean };

function CompactStat({ stat }: { stat: Stat }) {
  return (
    <Card className="aw-stat betting-stat-card">
      <div className={`aw-stat-icon ${stat.tone}`}><Icon name={stat.icon} /></div>
      <div>
        <span>{stat.label}</span>
        <strong>{stat.value}</strong>
        {stat.trend ? (
          <small className={stat.positive ? "positive" : "negative"}>{stat.positive ? "↑" : "↓"} {stat.trend} <em>vs yesterday</em></small>
        ) : null}
      </div>
    </Card>
  );
}

function Status({ value }: { value: string }) {
  const tone = ["Won", "Active", "Approved", "Completed", "In-Play"].includes(value)
    ? "completed"
    : ["Pending Review", "Live", "Upcoming", "Suspended"].includes(value)
      ? "pending"
      : "rejected";
  return <span className={`aw-status ${tone}`}>{value}</span>;
}

function PageShell({
  active,
  title,
  subtitle,
  search,
  children,
}: {
  active: string;
  title: string;
  subtitle: string;
  search: string;
  children: ReactNode;
}) {
  return (
    <main className="aw-shell betting-page">
      <AdminSidebar active={active} />
      <section className="aw-main">
        <AdminTopbar title={title} subtitle={subtitle} />
        <div className="aw-content">{children}</div>
      </section>
    </main>
  );
}

function ToolRow({ placeholder, addLabel }: { placeholder: string; addLabel?: string }) {
  return (
    <div className="betting-tools">
      <button className="deposit-date-button" type="button"><Icon name="calendar" /> May 14, 2024 - May 20, 2024 <Icon name="chevron" /></button>
      <label className="users-search"><Icon name="search" /><Input placeholder={placeholder} /></label>
      <Button type="button" variant="outline"><Icon name="settings" /> Filters</Button>
      <select defaultValue="All Status"><option>All Status</option></select>
      {addLabel ? <Button className="admin-primary-button" type="button"><Icon name="plus" /> {addLabel}</Button> : <Button className="admin-primary-button" type="button">Export <Icon name="chevron" /></Button>}
    </div>
  );
}

export function BetsManagementPage() {
  return (
    <PageShell active="Bets" title="Bet Management" subtitle="View, monitor and manage all bets on the platform" search="Search bet ID, user, match...">
      <section className="betting-stats six">{betStats.map((stat) => <CompactStat stat={stat} key={stat.label} />)}</section>
      <section className="betting-layout">
        <Card className="aw-panel betting-table-card">
          <div className="betting-tabs">
            {["All Bets", "Live/Open Bets", "Settled Bets", "Won Bets", "Lost Bets", "Suspicious Bets", "Canceled Bets"].map((tab, index) => (
              <button className={index === 0 ? "active" : undefined} type="button" key={tab}>{tab}{tab === "Suspicious Bets" ? <Badge tone="red">32</Badge> : null}</button>
            ))}
          </div>
          <ToolRow placeholder="Search by bet ID, user, match, market..." />
          <div className="betting-table-wrap bets">
            <table>
              <thead><tr><th>Bet ID</th><th>User</th><th>Match / Market</th><th>Stake (GHS)</th><th>Odds</th><th>Potential Win</th><th>Status</th><th>Placed On</th><th>Actions</th></tr></thead>
              <tbody>
                {betRows.map(([id, name, userId, match, stake, odds, win, status, placed]) => (
                  <tr key={id}>
                    <td>{id}</td><td><span className="admin-user-cell"><span className="aw-mini-avatar">{name.slice(0, 1)}</span><span><strong>{name}</strong><small>{userId}</small></span></span></td>
                    <td>{match.split("\n").map((line) => <span key={line}>{line}</span>)}</td><td>{stake}</td><td className="blue-text">{odds}</td><td className="positive">{win}</td><td><Status value={status} /></td><td>{placed.split("\n").map((line) => <span key={line}>{line}</span>)}</td>
                    <td><div className="user-row-actions"><Button variant="outline" size="icon" type="button"><Icon name="search" /></Button><Button variant="outline" size="icon" type="button"><Icon name="menu" /></Button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination label="Showing 1 to 10 of 18,542 bets" />
        </Card>
        <BetDetailsPanel />
      </section>
      <BottomInsights />
    </PageShell>
  );
}

function BetDetailsPanel() {
  return (
    <aside className="betting-side">
      <Card className="aw-panel betting-side-card">
        <header className="deposit-panel-heading"><h2>Bet Details</h2><Badge tone="green">Won</Badge><button><Icon name="x" /></button></header>
        <div className="bet-side-grid"><span>Bet ID</span><strong>#BET-2024-001245</strong><span>Placed On</span><strong>May 20, 2024 10:24 AM</strong></div>
        <div className="deposit-user-summary"><span className="kyc-large-avatar">KM</span><div><strong>Kofi Mensah</strong><small>USR-001245</small><small>View Profile</small></div></div>
        <div className="bet-match-card"><span>⚽</span><strong>Man City vs Arsenal</strong><small>Match Winner</small><Badge tone="blue">Man City</Badge></div>
      </Card>
      <Card className="aw-panel betting-side-card"><header className="deposit-section-heading"><h2>Bet Summary</h2></header><dl className="deposit-details-list"><div><dt>Bet Type</dt><dd>Single</dd></div><div><dt>Status</dt><dd className="positive">Won</dd></div><div><dt>Sport</dt><dd>Football</dd></div><div><dt>League</dt><dd>English Premier League</dd></div></dl></Card>
      <Card className="aw-panel betting-side-card"><header className="deposit-section-heading"><h2>Actions</h2></header><div className="bet-action-grid"><Button className="deposit-action-wallet">Settle Bet</Button><Button className="deposit-action-note">Void Bet</Button><Button className="deposit-action-receipt">Refund Bet</Button><Button className="deposit-action-flag">Flag as Suspicious</Button><Button variant="outline">Add Admin Note</Button></div></Card>
    </aside>
  );
}

function BottomInsights() {
  return (
    <section className="betting-bottom-grid">
      <Card className="aw-panel"><h2 className="mini-panel-title">Bet Volume (Last 7 Days)</h2><div className="mini-line-chart" /></Card>
      <Card className="aw-panel"><h2 className="mini-panel-title">Bets by Status (Today)</h2><div className="mini-donut" /></Card>
      <Card className="aw-panel"><h2 className="mini-panel-title">Top Sports (By Stake Today)</h2><div className="sports-bars"><p><span>Football</span><b /></p><p><span>Basketball</span><b /></p><p><span>Tennis</span><b /></p></div></Card>
      <Card className="aw-panel"><h2 className="mini-panel-title">Recent Activity</h2><div className="recent-mini-list"><p>Bet #BET-2024-001245 settled as <b>WON</b></p><p>Bet #BET-2024-001242 pending review</p><p>Bet #BET-2024-001239 live update</p></div></Card>
    </section>
  );
}

export function SportsManagementPage() {
  return (
    <PageShell active="Sports Management" title="Sports Management" subtitle="Manage all sports and configure betting settings" search="Search sport, category, status...">
      <section className="betting-stats six">{sportStats.map((stat) => <CompactStat stat={stat} key={stat.label} />)}</section>
      <section className="betting-layout sports">
        <Card className="aw-panel betting-table-card">
          <div className="betting-tabs">{["All Sports (32)", "Active (28)", "Inactive (4)"].map((tab, i) => <button className={i === 0 ? "active" : undefined} type="button" key={tab}>{tab}</button>)}</div>
          <ToolRow placeholder="Search sport name..." addLabel="Add Sport" />
          <div className="betting-table-wrap sports">
            <table><thead><tr><th>Sport</th><th>Category</th><th>Total Leagues</th><th>Total Events (30D)</th><th>Total Markets</th><th>Status</th><th>Featured</th><th>Actions</th></tr></thead>
              <tbody>{sportRows.map(([emoji, sport, category, leagues, events, markets, status, featured]) => <tr key={sport}><td><span className="sport-name"><i>{emoji}</i><strong>{sport}</strong></span></td><td>{category}</td><td>{leagues}</td><td>{events}</td><td>{markets}</td><td><Status value={status} /></td><td><Icon name="star" /></td><td><div className="user-row-actions"><Button variant="outline" size="icon" type="button"><Icon name="pencil" /></Button><Button variant="outline" size="icon" type="button"><Icon name="menu" /></Button></div></td></tr>)}</tbody></table>
          </div>
          <Pagination label="Showing 1 to 10 of 32 sports" />
        </Card>
        <SportsDetailsPanel />
      </section>
    </PageShell>
  );
}

function SportsDetailsPanel() {
  return <aside className="betting-side"><Card className="aw-panel betting-side-card"><header className="deposit-panel-heading"><h2>Sport Details</h2><button><Icon name="x" /></button></header><div className="sport-detail-hero"><span>⚽</span><div><h2>Football</h2><Badge tone="green">Active</Badge><small>Team Sports</small></div></div><div className="kyc-review-tabs"><button className="active">Information</button><button>Settings</button><button>Leagues (152)</button><button>Markets</button></div><dl className="deposit-details-list"><div><dt>Category</dt><dd>Team Sports</dd></div><div><dt>Status</dt><dd className="positive">Active</dd></div><div><dt>Featured</dt><dd>Yes</dd></div><div><dt>Code</dt><dd>FOOTBALL</dd></div><div><dt>Created By</dt><dd>Michael Owusu</dd></div></dl></Card><Card className="aw-panel betting-side-card"><header className="deposit-section-heading"><h2>Quick Actions</h2></header><div className="sport-actions-grid"><Button className="deposit-action-receipt"><Icon name="pencil" /> Edit Sport</Button><Button className="deposit-action-wallet"><Icon name="trophy" /> Manage Leagues</Button><Button className="deposit-action-note"><Icon name="clock" /> Manage Markets</Button><Button className="deposit-action-flag"><Icon name="trash" /> Delete Sport</Button></div></Card></aside>;
}

export function MatchesManagementPage() {
  return (
    <PageShell active="Matches" title="Matches Management" subtitle="Manage, schedule and monitor all sports matches" search="Search match, team, league...">
      <section className="betting-stats six">{matchStats.map((stat) => <CompactStat stat={stat} key={stat.label} />)}</section>
      <section className="betting-layout sports">
        <Card className="aw-panel betting-table-card">
          <div className="betting-tabs">{["All Matches", "Live (In-Play)", "Upcoming", "Completed", "Suspended", "Cancelled"].map((tab, i) => <button className={i === 0 ? "active" : undefined} type="button" key={tab}>{tab}</button>)}</div>
          <ToolRow placeholder="Search match, team, league..." addLabel="Add Match" />
          <div className="betting-table-wrap matches"><table><thead><tr><th>Match</th><th>Sport / League</th><th>Date & Time</th><th>Status</th><th>Score</th><th>Markets</th><th>Actions</th></tr></thead><tbody>{matchRows.map(([tag, teams, league, date, status, score, markets]) => <tr key={`${teams}-${date}`}><td><span className="match-cell"><Badge tone={status === "In-Play" ? "red" : status === "Completed" ? "green" : "blue"}>{tag.split("\n")[0]}</Badge>{teams.split("\n").map((line) => <strong key={line}>{line}</strong>)}</span></td><td>{league.split("\n").map((line) => <span key={line}>{line}</span>)}</td><td>{date.split("\n").map((line) => <span key={line}>{line}</span>)}</td><td><Status value={status} /></td><td>{score.split("\n").map((line) => <span key={line}>{line}</span>)}</td><td>{markets}</td><td><div className="user-row-actions"><Button variant="outline" size="icon" type="button"><Icon name="search" /></Button><Button variant="outline" size="icon" type="button"><Icon name="menu" /></Button></div></td></tr>)}</tbody></table></div>
          <Pagination label="Showing 1 to 10 of 5,432 matches" />
        </Card>
        <MatchDetailsPanel />
      </section>
    </PageShell>
  );
}

function MatchDetailsPanel() {
  return <aside className="betting-side"><Card className="aw-panel betting-side-card"><header className="deposit-panel-heading"><h2>Match Details</h2><button><Icon name="x" /></button></header><div className="match-score-card"><Badge tone="red">LIVE 78'</Badge><small>English Premier League - Round 37</small><div><span>Man City</span><strong>2 - 1</strong><span>Arsenal</span></div></div><div className="kyc-review-tabs"><button className="active">Overview</button><button>Markets (128)</button><button>Statistics</button><button>Events</button></div><dl className="deposit-details-list"><div><dt>Status</dt><dd className="positive">In-Play</dd></div><div><dt>Match ID</dt><dd>MAT-0008765</dd></div><div><dt>Sport</dt><dd>Football</dd></div><div><dt>League</dt><dd>English Premier League</dd></div><div><dt>Venue</dt><dd>Etihad Stadium</dd></div></dl></Card><Card className="aw-panel betting-side-card"><header className="deposit-section-heading"><h2>Quick Actions</h2></header><div className="sport-actions-grid"><Button className="deposit-action-receipt">Edit Match</Button><Button className="deposit-action-note">Suspend Match</Button><Button className="deposit-action-flag">Cancel Match</Button><Button variant="outline">Go To Odds</Button><Button className="deposit-action-wallet">View Match Page</Button></div></Card></aside>;
}

function Pagination({ label }: { label: string }) {
  return <footer className="users-pagination"><span>{label}</span><div><Button type="button" variant="outline" size="icon"><Icon name="chevron" /></Button>{["1", "2", "3", "4", "5"].map((page) => <Button className={page === "1" ? "active" : undefined} type="button" variant="outline" key={page}>{page}</Button>)}<span>...</span><Button type="button" variant="outline">125</Button><Button type="button" variant="outline" size="icon"><Icon name="arrow" /></Button><select defaultValue="10 / page"><option>10 / page</option></select></div></footer>;
}
