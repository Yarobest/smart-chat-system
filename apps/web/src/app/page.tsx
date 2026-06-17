import { AdminCourseAssignments } from "./AdminCourseAssignments";

export const dynamic = "force-dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4001";

type DashboardData = {
  stats: Record<string, number>;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    faculty: string | null;
    department: string | null;
    createdAt: string;
  }>;
  recentMessages: Array<{
    id: string;
    text: string;
    senderName: string;
    conversationTitle: string;
    createdAt: string;
  }>;
};

type UsersData = {
  total: number;
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    studentId: string | null;
    staffId: string | null;
    faculty: string | null;
    department: string | null;
    programme: string | null;
    yearGroup: string | null;
    awardType: string | null;
    isOnline: boolean;
    lastSeenAt: string | null;
    createdAt: string;
  }>;
};

type ReportsData = {
  usersByRole: Array<{ label: string; value: number }>;
  usersByFaculty: Array<{ label: string; value: number }>;
  usersByDepartment: Array<{ label: string; value: number }>;
  conversationsByType: Array<{ label: string; value: number }>;
  topConversations: Array<{ id: string; title: string; messages: number }>;
};

type SettingsData = {
  api: { port: number; docsPath: string; databaseConnected: boolean };
  options: Record<string, string[]>;
  sampleCourses: Array<{ code: string; name: string }>;
};

type ProfileData = {
  profile: {
    name: string;
    email: string;
    role: string;
    staffId: string | null;
    faculty: string | null;
    department: string | null;
    isOnline: boolean;
    createdAt: string;
  } | null;
  message?: string;
};

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      cache: "no-store",
    });

    if (!response.ok) return null;

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

const formatDate = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(value))
    : "Not set";

const titleCase = (value: string) =>
  value.replace(/\b\w/g, (letter) => letter.toUpperCase());

function EmptyState({ label }: { label: string }) {
  return <p className="empty-state">{label}</p>;
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value.toLocaleString()}</strong>
    </article>
  );
}

function Bars({ items }: { items: Array<{ label: string; value: number }> }) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="bars">
      {items.length === 0 ? (
        <EmptyState label="No data yet." />
      ) : (
        items.map((item) => (
          <div className="bar-row" key={item.label}>
            <span>{titleCase(item.label)}</span>
            <div className="bar-track">
              <div style={{ width: `${(item.value / max) * 100}%` }} />
            </div>
            <strong>{item.value}</strong>
          </div>
        ))
      )}
    </div>
  );
}

export default async function AdminPortal() {
  const [dashboard, users, reports, settings, profile] = await Promise.all([
    getJson<DashboardData>("/admin/dashboard"),
    getJson<UsersData>("/admin/users"),
    getJson<ReportsData>("/admin/reports"),
    getJson<SettingsData>("/admin/settings"),
    getJson<ProfileData>("/admin/profile"),
  ]);

  const stats = dashboard?.stats ?? {};

  return (
    <main className="portal-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Admin Portal</p>
          <h1>Smart Chat System</h1>
        </div>
        <nav>
          <a href="#home">Home</a>
          <a href="#users">Users</a>
          <a href="#reports">Reports</a>
          <a href="#courses">Courses</a>
          <a href="#settings">Settings</a>
          <a href="#profile">Profile</a>
        </nav>
        <p className="api-chip">API: {API_URL}</p>
      </aside>

      <section className="content">
        <section className="section-header" id="home">
          <div>
            <p className="eyebrow">Live Overview</p>
            <h2>Home</h2>
          </div>
          <span className={dashboard ? "status live" : "status offline"}>
            {dashboard ? "Database connected" : "API unavailable"}
          </span>
        </section>

        <section className="metric-grid">
          <MetricCard label="Total Users" value={stats.totalUsers ?? 0} />
          <MetricCard label="Students" value={stats.students ?? 0} />
          <MetricCard label="Lecturers" value={stats.lecturers ?? 0} />
          <MetricCard label="Admins" value={stats.admins ?? 0} />
          <MetricCard label="Online" value={stats.onlineUsers ?? 0} />
          <MetricCard label="Messages" value={stats.messages ?? 0} />
        </section>

        <section className="two-column">
          <article className="panel">
            <h3>Recent Users</h3>
            {dashboard?.recentUsers.length ? (
              <div className="list">
                {dashboard.recentUsers.map((user) => (
                  <div className="list-row" key={user.id}>
                    <div>
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </div>
                    <small>{titleCase(user.role)}</small>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState label="No registered users yet." />
            )}
          </article>

          <article className="panel">
            <h3>Recent Messages</h3>
            {dashboard?.recentMessages.length ? (
              <div className="list">
                {dashboard.recentMessages.map((message) => (
                  <div className="list-row" key={message.id}>
                    <div>
                      <strong>{message.senderName}</strong>
                      <span>{message.text || "Attachment message"}</span>
                    </div>
                    <small>{formatDate(message.createdAt)}</small>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState label="No messages yet." />
            )}
          </article>
        </section>

        <section className="section-header" id="users">
          <div>
            <p className="eyebrow">Directory</p>
            <h2>Users</h2>
          </div>
          <span className="count-label">{users?.total ?? 0} records</span>
        </section>

        <section className="table-panel">
          {users?.users.length ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Programme</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </td>
                    <td>{titleCase(user.role)}</td>
                    <td>{user.department ?? "Not set"}</td>
                    <td>{user.programme ?? user.staffId ?? "Not set"}</td>
                    <td>{user.isOnline ? "Online" : "Offline"}</td>
                    <td>{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState label="No user data found." />
          )}
        </section>

        <section className="section-header" id="reports">
          <div>
            <p className="eyebrow">Analytics</p>
            <h2>Reports</h2>
          </div>
        </section>

        <section className="report-grid">
          <article className="panel">
            <h3>Users by Role</h3>
            <Bars items={reports?.usersByRole ?? []} />
          </article>
          <article className="panel">
            <h3>Users by Faculty</h3>
            <Bars items={reports?.usersByFaculty ?? []} />
          </article>
          <article className="panel">
            <h3>Conversations by Type</h3>
            <Bars items={reports?.conversationsByType ?? []} />
          </article>
          <article className="panel">
            <h3>Top Conversations</h3>
            <div className="list">
              {(reports?.topConversations ?? []).map((item) => (
                <div className="list-row" key={item.id}>
                  <strong>{item.title}</strong>
                  <small>{item.messages} messages</small>
                </div>
              ))}
              {!reports?.topConversations.length && (
                <EmptyState label="No conversation activity yet." />
              )}
            </div>
          </article>
        </section>

        <AdminCourseAssignments />

        <section className="section-header" id="settings">
          <div>
            <p className="eyebrow">Configuration</p>
            <h2>Settings</h2>
          </div>
        </section>

        <section className="two-column">
          <article className="panel">
            <h3>API Settings</h3>
            <dl className="details">
              <div>
                <dt>Port</dt>
                <dd>{settings?.api.port ?? 4001}</dd>
              </div>
              <div>
                <dt>Docs</dt>
                <dd>{settings?.api.docsPath ?? "/docs"}</dd>
              </div>
              <div>
                <dt>Database</dt>
                <dd>{settings?.api.databaseConnected ? "Connected" : "Unknown"}</dd>
              </div>
            </dl>
          </article>
          <article className="panel">
            <h3>Academic Options</h3>
            <div className="tag-cloud">
              {Object.entries(settings?.options ?? {}).flatMap(([key, values]) =>
                values.slice(0, 8).map((value) => (
                  <span key={`${key}-${value}`}>{value}</span>
                )),
              )}
            </div>
          </article>
        </section>

        <section className="section-header" id="profile">
          <div>
            <p className="eyebrow">Account</p>
            <h2>Profile</h2>
          </div>
        </section>

        <section className="profile-panel">
          {profile?.profile ? (
            <>
              <div className="avatar">{profile.profile.name.slice(0, 1)}</div>
              <div>
                <h3>{profile.profile.name}</h3>
                <p>{profile.profile.email}</p>
                <dl className="details compact">
                  <div>
                    <dt>Role</dt>
                    <dd>{titleCase(profile.profile.role)}</dd>
                  </div>
                  <div>
                    <dt>Department</dt>
                    <dd>{profile.profile.department ?? "Not set"}</dd>
                  </div>
                  <div>
                    <dt>Joined</dt>
                    <dd>{formatDate(profile.profile.createdAt)}</dd>
                  </div>
                </dl>
              </div>
            </>
          ) : (
            <EmptyState label={profile?.message ?? "No admin profile found."} />
          )}
        </section>
      </section>
    </main>
  );
}
