import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminSidebar, AdminTopbar, Icon } from "@/features/admin/dashboard/AdminDashboard";
import { depositRows, depositStats, selectedDeposit } from "./deposits-data";

function DepositStatCard({ stat }: { stat: (typeof depositStats)[number] }) {
  return (
    <Card className="aw-stat deposit-stat-card">
      <div className={`aw-stat-icon ${stat.tone}`}>
        <Icon name={stat.icon} />
      </div>
      <div>
        <span>{stat.label}</span>
        <strong>{stat.value}</strong>
        <small className={stat.positive ? "positive" : "negative"}>
          {stat.positive ? "↑" : "↓"} {stat.trend} <em>{stat.compare ?? "vs yesterday"}</em>
        </small>
      </div>
    </Card>
  );
}

function PaymentMethod({ method }: { method: string }) {
  const short = method.includes("MTN")
    ? "MTN"
    : method.includes("Telecel")
      ? "T"
      : method.includes("Visa")
        ? "VISA"
        : method.includes("Mastercard")
          ? "MC"
          : method.includes("Vodafone")
            ? "V"
            : "BANK";

  return (
    <span className="deposit-method">
      <i className={short.toLowerCase()}>{short}</i>
      {method}
    </span>
  );
}

function DepositStatus({ status }: { status: string }) {
  const tone = status === "Completed" ? "completed" : status === "Pending" ? "pending" : "rejected";
  return <span className={`deposit-status ${tone}`}><i />{status}</span>;
}

function DepositsTable() {
  return (
    <Card className="aw-panel deposits-table-card">
      <div className="deposits-table-controls">
        <button className="deposit-date-button" type="button"><Icon name="calendar" /> May 14, 2024 - May 20, 2024 <Icon name="chevron" /></button>
        <label className="users-search">
          <Icon name="search" />
          <Input placeholder="Search by user, email, transaction ID..." />
        </label>
        <Button type="button" variant="outline"><Icon name="settings" /> Filters</Button>
        <select defaultValue="All Status"><option>All Status</option></select>
        <select defaultValue="All Methods"><option>All Methods</option></select>
        <Button type="button" variant="outline">Reset</Button>
      </div>
      <div className="deposits-table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Transaction ID</th>
              <th>Date & Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {depositRows.map(([id, name, email, amount, method, status, transactionId, dateTime]) => (
              <tr key={id}>
                <td>{id}</td>
                <td>
                  <span className="admin-user-cell">
                    <span className="aw-mini-avatar">{name.slice(0, 1)}</span>
                    <span>
                      <strong>{name}</strong>
                      <small>{email}</small>
                    </span>
                  </span>
                </td>
                <td>{amount}</td>
                <td><PaymentMethod method={method} /></td>
                <td><DepositStatus status={status} /></td>
                <td>{transactionId}</td>
                <td>{dateTime.split("\n").map((line) => <span key={line}>{line}</span>)}</td>
                <td>
                  <div className="user-row-actions">
                    <Button type="button" variant="outline" size="icon" aria-label={`View ${id}`}><Icon name="search" /></Button>
                    <Button type="button" variant="outline" size="icon" aria-label={`More actions for ${id}`}><Icon name="menu" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer className="users-pagination">
        <span>Showing 1 to 10 of 1,245 entries</span>
        <div>
          <Button type="button" variant="outline" size="icon"><Icon name="chevron" /></Button>
          {["1", "2", "3", "4", "5"].map((page) => (
            <Button className={page === "1" ? "active" : undefined} type="button" variant="outline" key={page}>{page}</Button>
          ))}
          <span>...</span>
          <Button type="button" variant="outline">125</Button>
          <Button type="button" variant="outline" size="icon"><Icon name="arrow" /></Button>
          <select defaultValue="10 / page"><option>10 / page</option></select>
        </div>
      </footer>
    </Card>
  );
}

function DepositDetails() {
  const details = [
    ["Transaction ID", selectedDeposit.transactionId, true],
    ["Deposit ID", selectedDeposit.depositId, true],
    ["Status", selectedDeposit.status],
    ["Date & Time", selectedDeposit.dateTime],
    ["Fees", selectedDeposit.fees],
    ["Net Amount", selectedDeposit.netAmount],
    ["Reference", selectedDeposit.reference],
    ["IP Address", selectedDeposit.ipAddress],
    ["Device", selectedDeposit.device],
    ["Location", selectedDeposit.location],
  ] as const;

  return (
    <Card className="aw-panel deposit-side-card">
      <header className="deposit-panel-heading">
        <h2>Deposit Details</h2>
        <Badge tone="green">Completed</Badge>
        <button type="button" aria-label="Close details"><Icon name="x" /></button>
      </header>
      <div className="deposit-amount-row">
        <strong>{selectedDeposit.amount}</strong>
        <PaymentMethod method={selectedDeposit.method} />
      </div>
      <dl className="deposit-details-list">
        {details.map(([label, value, copy]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd className={label === "Status" ? "positive" : undefined}>
              {value}
              {copy ? <Icon name="copy" /> : null}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

function DepositUserInfo() {
  const user = selectedDeposit.user;
  return (
    <Card className="aw-panel deposit-side-card">
      <header className="deposit-section-heading">
        <h2>User Information</h2>
      </header>
      <div className="deposit-user-summary">
        <span className="kyc-large-avatar">KM</span>
        <div>
          <strong>{user.name}</strong>
          <small>User ID: {user.id}</small>
          <small>{user.email}</small>
          <small>{user.phone}</small>
        </div>
        <Badge tone="green">Active</Badge>
      </div>
      <dl className="deposit-details-list">
        <div><dt>Wallet Balance</dt><dd>{user.walletBalance}</dd></div>
        <div><dt>Total Deposits</dt><dd>{user.totalDeposits}</dd></div>
        <div><dt>Total Withdrawals</dt><dd>{user.totalWithdrawals}</dd></div>
        <div><dt>Member Since</dt><dd>{user.memberSince}</dd></div>
      </dl>
    </Card>
  );
}

function DepositActions() {
  return (
    <Card className="aw-panel deposit-side-card">
      <header className="deposit-section-heading"><h2>Actions</h2></header>
      <div className="deposit-actions-grid">
        <Button className="deposit-action-wallet" type="button"><Icon name="wallet" /> View in Wallet</Button>
        <Button className="deposit-action-receipt" type="button"><Icon name="receipt" /> Resend Receipt</Button>
        <Button className="deposit-action-note" type="button"><Icon name="chat" /> Add Admin Note</Button>
        <Button className="deposit-action-flag" type="button"><Icon name="shield" /> Flag as Suspicious</Button>
      </div>
    </Card>
  );
}

function DepositNotes() {
  return (
    <Card className="aw-panel deposit-side-card">
      <header className="deposit-section-heading">
        <h2>Admin Notes</h2>
        <button type="button">View All</button>
      </header>
      <textarea placeholder="Add a note about this deposit..." />
    </Card>
  );
}

export function DepositsManagementPage() {
  return (
    <main className="aw-shell" id="deposits-management">
      <AdminSidebar active="Deposits" />
      <section className="aw-main">
        <AdminTopbar title="Deposits Management" subtitle="View and manage all user deposits" />
        <div className="aw-content">
          <section className="deposit-stats-grid">
            {depositStats.map((stat) => (
              <DepositStatCard stat={stat} key={stat.label} />
            ))}
          </section>
          <section className="deposits-layout">
            <DepositsTable />
            <aside className="deposit-side-column">
              <DepositDetails />
              <DepositUserInfo />
              <DepositActions />
              <DepositNotes />
            </aside>
          </section>
        </div>
      </section>
    </main>
  );
}
