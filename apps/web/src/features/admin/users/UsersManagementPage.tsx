import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminSidebar, AdminTopbar, Icon } from "@/features/admin/dashboard/AdminDashboard";
import { userActions, userBreakdown, users, userStats } from "./users-data";

function UsersStatCard({ stat }: { stat: (typeof userStats)[number] }) {
  return (
    <Card className="aw-stat users-stat-card">
      <div className={`aw-stat-icon ${stat.tone}`}>
        <Icon name={stat.icon} />
      </div>
      <div>
        <span>{stat.label}</span>
        <strong>{stat.value}</strong>
        <small className={stat.positive ? "positive" : "negative"}>
          {stat.positive ? "↑" : "↓"} {stat.trend} <em>vs yesterday</em>
        </small>
      </div>
    </Card>
  );
}

function StatusPill({ value }: { value: string }) {
  const tone =
    value === "Verified" || value === "Active"
      ? "completed"
      : value === "Pending" || value === "Suspended"
        ? "pending"
        : "rejected";

  return <span className={`aw-status ${tone}`}>{value}</span>;
}

function FilterCard() {
  return (
    <Card className="aw-panel user-side-panel">
      <header className="user-panel-heading">
        <h2>Filter Users</h2>
        <button type="button">Clear All</button>
      </header>
      <label>
        <span>Registration Date</span>
        <div className="admin-field">Select date range <Icon name="calendar" /></div>
      </label>
      <div className="user-filter-grid">
        <label>
          <span>Status</span>
          <select defaultValue="All Status">
            <option>All Status</option>
          </select>
        </label>
        <label>
          <span>KYC Status</span>
          <select defaultValue="All KYC Status">
            <option>All KYC Status</option>
          </select>
        </label>
        <label>
          <span>User Type</span>
          <select defaultValue="All User Types">
            <option>All User Types</option>
          </select>
        </label>
        <label>
          <span>Country</span>
          <select defaultValue="All Countries">
            <option>All Countries</option>
          </select>
        </label>
      </div>
      <label>
        <span>Referral Code</span>
        <Input placeholder="Enter referral code" />
      </label>
      <Button className="user-apply-button" type="button">Apply Filters</Button>
    </Card>
  );
}

function UserActionsCard() {
  return (
    <Card className="aw-panel user-side-panel">
      <header className="user-panel-heading">
        <h2>User Actions</h2>
      </header>
      <div className="user-action-list">
        {userActions.map(([label, icon]) => (
          <button className={label.includes("Delete") ? "danger" : undefined} type="button" key={label}>
            <Icon name={icon} />
            {label}
          </button>
        ))}
      </div>
    </Card>
  );
}

function UserStatisticsCard() {
  return (
    <Card className="aw-panel user-side-panel">
      <header className="user-panel-heading">
        <h2>User Statistics</h2>
      </header>
      <div className="user-stats-layout">
        <div className="user-donut" aria-label="User statistics chart" />
        <div className="user-breakdown">
          {userBreakdown.map(([label, value, percent, tone]) => (
            <div key={label}>
              <span className={tone}>{label}</span>
              <strong>{value}</strong>
              <small>({percent})</small>
            </div>
          ))}
        </div>
      </div>
      <div className="user-total">
        <span>Total Users</span>
        <strong>125,430</strong>
      </div>
    </Card>
  );
}

function UsersTable() {
  return (
    <Card className="aw-panel users-table-card">
      <header className="users-table-header">
        <h2>All Users (125,430)</h2>
        <div className="users-table-controls">
          <label className="users-search">
            <Icon name="search" />
            <Input placeholder="Search by user ID, name, email or phone..." />
          </label>
          <Button type="button" variant="outline"><Icon name="settings" /> Filters</Button>
          <select defaultValue="All Status">
            <option>All Status</option>
          </select>
          <select defaultValue="All KYC Status">
            <option>All KYC Status</option>
          </select>
          <Button type="button" variant="outline">Reset</Button>
        </div>
      </header>
      <div className="users-table-wrap">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>User ID</th>
              <th>Email / Phone</th>
              <th>Wallet Balance</th>
              <th>KYC Status</th>
              <th>Status</th>
              <th>Registered On</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(([name, phone, id, email, balance, kyc, status, registered, login]) => (
              <tr key={id}>
                <td>
                  <span className="admin-user-cell">
                    <span className="aw-mini-avatar">{name.slice(0, 1)}</span>
                    <span>
                      <strong>{name}</strong>
                      <small>{phone}</small>
                    </span>
                  </span>
                </td>
                <td>{id}</td>
                <td>{email}</td>
                <td>{balance}</td>
                <td><StatusPill value={kyc} /></td>
                <td><StatusPill value={status} /></td>
                <td>{registered.split("\n").map((line) => <span key={line}>{line}</span>)}</td>
                <td>{login.split("\n").map((line) => <span key={line}>{line}</span>)}</td>
                <td>
                  <div className="user-row-actions">
                    <Button type="button" variant="outline" size="icon" aria-label={`View ${name}`}>
                      <Icon name="search" />
                    </Button>
                    <Button type="button" variant="outline" size="icon" aria-label={`More actions for ${name}`}>
                      <Icon name="menu" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer className="users-pagination">
        <span>Showing 1 to 10 of 125,430 users</span>
        <div>
          <Button type="button" variant="outline" size="icon"><Icon name="chevron" /></Button>
          {["1", "2", "3", "4", "5"].map((page) => (
            <Button className={page === "1" ? "active" : undefined} type="button" variant="outline" key={page}>
              {page}
            </Button>
          ))}
          <span>...</span>
          <Button type="button" variant="outline">12543</Button>
          <Button type="button" variant="outline" size="icon"><Icon name="arrow" /></Button>
          <select defaultValue="10 / page">
            <option>10 / page</option>
          </select>
        </div>
      </footer>
    </Card>
  );
}

export function UsersManagementPage() {
  return (
    <main className="aw-shell" id="users-management">
      <AdminSidebar active="Users" />
      <section className="aw-main">
        <AdminTopbar
          title="Users Management"
          subtitle="Manage and monitor all platform users"
          actions={
            <>
              <Button type="button" variant="outline"><Icon name="outbox" /> Export Users</Button>
              <Button type="button" variant="outline"><Icon name="inbox" /> Import Users</Button>
              <Button className="admin-primary-button" type="button"><Icon name="user" /> Add New User</Button>
            </>
          }
        />
        <div className="aw-content">
          <section className="users-stats-grid">
            {userStats.map((stat) => (
              <UsersStatCard stat={stat} key={stat.label} />
            ))}
          </section>
          <section className="users-page-grid">
            <UsersTable />
            <aside className="users-side-column">
              <FilterCard />
              <UserActionsCard />
              <UserStatisticsCard />
            </aside>
          </section>
        </div>
      </section>
    </main>
  );
}
