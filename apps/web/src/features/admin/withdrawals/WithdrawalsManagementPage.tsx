import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminSidebar, AdminTopbar, Icon } from "@/features/admin/dashboard/AdminDashboard";
import { selectedWithdrawal, withdrawalRows, withdrawalStats } from "./withdrawals-data";

function WithdrawalStatCard({ stat }: { stat: (typeof withdrawalStats)[number] }) {
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

function WithdrawalMethod({ method }: { method: string }) {
  const short = method.includes("Bank")
    ? "BANK"
    : method.includes("MTN")
      ? "MTN"
      : method.includes("Telecel")
        ? "T"
        : method.includes("Vodafone")
          ? "V"
          : "AT";

  return (
    <span className="deposit-method">
      <i className={short.toLowerCase()}>{short}</i>
      {method}
    </span>
  );
}

function WithdrawalStatus({ status }: { status: string }) {
  const tone = status === "Approved" ? "completed" : status === "Pending Review" ? "pending" : "rejected";
  return <span className={`deposit-status ${tone}`}><i />{status}</span>;
}

function WithdrawalTabs() {
  return (
    <div className="withdrawal-tabs">
      <button className="active" type="button">All Withdrawals <span>1,245</span></button>
      <button type="button">Pending Review <span>18</span></button>
      <button type="button">Approved <span>892</span></button>
      <button type="button">Rejected <span>143</span></button>
    </div>
  );
}

function WithdrawalsTable() {
  return (
    <Card className="aw-panel deposits-table-card">
      <WithdrawalTabs />
      <div className="deposits-table-controls withdrawal-table-controls">
        <button className="deposit-date-button" type="button"><Icon name="calendar" /> May 14, 2024 - May 20, 2024 <Icon name="chevron" /></button>
        <label className="users-search">
          <Icon name="search" />
          <Input placeholder="Search by user, email or transaction ID..." />
        </label>
        <Button type="button" variant="outline"><Icon name="settings" /> Filters</Button>
        <select defaultValue="All Status"><option>All Status</option></select>
        <select defaultValue="All Methods"><option>All Methods</option></select>
        <Button type="button" variant="outline">Reset</Button>
      </div>
      <div className="withdrawals-table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Bank / Wallet</th>
              <th>Requested On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {withdrawalRows.map(([id, name, email, amount, method, status, bank, requested]) => (
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
                <td><WithdrawalMethod method={method} /></td>
                <td><WithdrawalStatus status={status} /></td>
                <td>{bank.split("\n").map((line) => <span key={line}>{line}</span>)}</td>
                <td>{requested.split("\n").map((line) => <span key={line}>{line}</span>)}</td>
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

function WithdrawalDetails() {
  const details = [
    ["Transaction ID", selectedWithdrawal.transactionId, true],
    ["User ID", selectedWithdrawal.userId, true],
    ["Status", selectedWithdrawal.status],
    ["Requested On", selectedWithdrawal.requestedOn],
    ["Method", selectedWithdrawal.method],
    ["Bank Name", selectedWithdrawal.bankName],
    ["Account Number", selectedWithdrawal.accountNumber],
    ["Account Name", selectedWithdrawal.accountName],
    ["Fees", selectedWithdrawal.fees],
    ["Net Amount", selectedWithdrawal.netAmount],
    ["Reference", selectedWithdrawal.reference],
    ["IP Address", selectedWithdrawal.ipAddress],
    ["Device", selectedWithdrawal.device],
  ] as const;

  return (
    <Card className="aw-panel deposit-side-card">
      <header className="deposit-panel-heading">
        <h2>Withdrawal Details</h2>
        <Badge tone="gold">Pending Review</Badge>
        <button type="button" aria-label="Close details"><Icon name="x" /></button>
      </header>
      <div className="deposit-amount-row">
        <strong>{selectedWithdrawal.amount}</strong>
        <WithdrawalMethod method={selectedWithdrawal.method} />
      </div>
      <dl className="deposit-details-list">
        {details.map(([label, value, copy]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd className={label === "Status" ? "warning-text" : undefined}>
              {value}
              {copy ? <Icon name="copy" /> : null}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

function WithdrawalUserInfo() {
  const user = selectedWithdrawal.user;
  return (
    <Card className="aw-panel deposit-side-card">
      <header className="deposit-section-heading"><h2>User Information</h2></header>
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

function RiskCheck() {
  return (
    <Card className="aw-panel deposit-side-card withdrawal-risk-card">
      <span><Icon name="shield" /></span>
      <div>
        <strong>No risk issues detected</strong>
        <small>This withdrawal passed all security checks.</small>
      </div>
      <Icon name="arrow" />
    </Card>
  );
}

function WithdrawalActions() {
  return (
    <Card className="aw-panel deposit-side-card">
      <header className="deposit-section-heading"><h2>Actions</h2></header>
      <div className="withdrawal-actions-grid">
        <Button className="deposit-action-wallet" type="button"><Icon name="check" /> Approve</Button>
        <Button className="deposit-action-flag" type="button"><Icon name="xCircle" /> Reject</Button>
        <Button className="deposit-action-receipt" type="button"><Icon name="badge" /> Request Info</Button>
        <Button type="button" variant="outline"><Icon name="chat" /> Add Note</Button>
      </div>
    </Card>
  );
}

function WithdrawalNotes() {
  return (
    <Card className="aw-panel deposit-side-card">
      <header className="deposit-section-heading">
        <h2>Admin Notes</h2>
        <button type="button">View All</button>
      </header>
      <textarea placeholder="Add a note about this withdrawal..." />
    </Card>
  );
}

export function WithdrawalsManagementPage() {
  return (
    <main className="aw-shell" id="withdrawals-management">
      <AdminSidebar active="Withdrawals" />
      <section className="aw-main">
        <AdminTopbar title="Withdrawals Management" subtitle="Review and manage all user withdrawals" />
        <div className="aw-content">
          <section className="deposit-stats-grid">
            {withdrawalStats.map((stat) => (
              <WithdrawalStatCard stat={stat} key={stat.label} />
            ))}
          </section>
          <section className="deposits-layout">
            <WithdrawalsTable />
            <aside className="deposit-side-column">
              <WithdrawalDetails />
              <WithdrawalUserInfo />
              <RiskCheck />
              <WithdrawalActions />
              <WithdrawalNotes />
            </aside>
          </section>
        </div>
      </section>
    </main>
  );
}
