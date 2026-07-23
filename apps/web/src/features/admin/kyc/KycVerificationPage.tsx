import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminSidebar, AdminTopbar, Icon } from "@/features/admin/dashboard/AdminDashboard";
import type { ReactNode } from "react";
import { kycRows, kycStats, selectedKycUser } from "./kyc-data";

function KycStatCard({ stat }: { stat: (typeof kycStats)[number] }) {
  return (
    <Card className="aw-stat kyc-stat-card">
      <div className={`aw-stat-icon ${stat.tone}`}>
        <Icon name={stat.icon} />
      </div>
      <div>
        <span>{stat.label}</span>
        <strong>{stat.value}</strong>
        {stat.trend ? (
          <small className={stat.positive ? "positive" : "negative"}>
            {stat.positive ? "↓" : "↑"} {stat.trend} <em>vs yesterday</em>
          </small>
        ) : (
          <small><em>{stat.note}</em></small>
        )}
      </div>
    </Card>
  );
}

function DocumentBadges({ value }: { value: string }) {
  return (
    <span className="kyc-doc-badges">
      {value.split(",").map((type) => (
        <span className={type} key={type}>
          <Icon name={type === "id" ? "badge" : type === "address" ? "fileCheck" : "wallet"} />
        </span>
      ))}
    </span>
  );
}

function KycQueueTable() {
  return (
    <Card className="aw-panel kyc-queue-card">
      <div className="kyc-tabs">
        <button className="active" type="button">Pending Review <Badge tone="gold">23</Badge></button>
        <button type="button">Verified</button>
        <button type="button">Rejected</button>
        <button type="button">All</button>
      </div>
      <div className="kyc-table-controls">
        <label className="users-search">
          <Icon name="search" />
          <Input placeholder="Search by name, email or user ID..." />
        </label>
        <Button type="button" variant="outline"><Icon name="settings" /> Filters</Button>
        <select defaultValue="Newest First">
          <option>Newest First</option>
        </select>
        <Button type="button" variant="outline" size="icon" aria-label="Refresh KYC queue"><Icon name="refresh" /></Button>
      </div>
      <div className="kyc-table-wrap">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>User ID</th>
              <th>Submitted On</th>
              <th>Document Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {kycRows.map(([name, email, id, submitted, docs, status]) => (
              <tr key={id}>
                <td>
                  <span className="admin-user-cell">
                    <span className="aw-mini-avatar">{name.slice(0, 1)}</span>
                    <span>
                      <strong>{name}</strong>
                      <small>{email}</small>
                    </span>
                  </span>
                </td>
                <td>{id}</td>
                <td>{submitted.split("\n").map((line) => <span key={line}>{line}</span>)}</td>
                <td><DocumentBadges value={docs} /></td>
                <td><span className="aw-status pending">{status}</span></td>
                <td>
                  <Button type="button" variant="outline" size="icon" aria-label={`Review ${name}`}>
                    <Icon name="search" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer className="users-pagination">
        <span>Showing 1 to 10 of 23 entries</span>
        <div>
          <Button type="button" variant="outline" size="icon"><Icon name="chevron" /></Button>
          {["1", "2", "3"].map((page) => (
            <Button className={page === "1" ? "active" : undefined} type="button" variant="outline" key={page}>
              {page}
            </Button>
          ))}
          <Button type="button" variant="outline" size="icon"><Icon name="arrow" /></Button>
          <select defaultValue="10 / page">
            <option>10 / page</option>
          </select>
        </div>
      </footer>
    </Card>
  );
}

function GhanaIdMockup() {
  return (
    <div className="ghana-card">
      <div>
        <strong>REPUBLIC OF GHANA</strong>
        <span>National Identity Card</span>
      </div>
      <div className="ghana-chip" />
      <dl>
        <div><dt>Surname</dt><dd>MENSAH</dd></div>
        <div><dt>First Name</dt><dd>KOFI</dd></div>
        <div><dt>Date of Birth</dt><dd>15/05/1995</dd></div>
        <div><dt>Card Number</dt><dd>GHA-123456789-0</dd></div>
      </dl>
      <div className="ghana-photo">KM</div>
      <b>GHANA</b>
    </div>
  );
}

function UtilityBillMockup() {
  return (
    <div className="bill-card">
      <strong>ELECTRICITY COMPANY OF GHANA</strong>
      <span>Customer Copy</span>
      <div>
        <p><b>Customer Name</b>KOFI MENSAH</p>
        <p><b>Account Number</b>1234567890</p>
        <p><b>Address</b>123 Adenta Road, Accra</p>
      </div>
      <div className="bill-qr" />
      <footer>Total Amount <b>GHS 215.50</b></footer>
    </div>
  );
}

function DocumentPreview({
  title,
  tag,
  type,
  children,
}: {
  title: string;
  tag: string;
  type: string;
  children: ReactNode;
}) {
  return (
    <Card className="kyc-document">
      <header>
        <div>
          <h3>{title}</h3>
          <Badge tone={tag === "Government ID" ? "green" : "blue"}>{tag}</Badge>
        </div>
        <button type="button">View Fullscreen</button>
      </header>
      <div className="kyc-document-body">
        {children}
        <dl>
          <div><dt>Document Type</dt><dd>{type}</dd></div>
          <div><dt>{type === "National ID" ? "Document Number" : "Account Number"}</dt><dd>{type === "National ID" ? "GHA-123456789-0" : "1234567890"}</dd></div>
          <div><dt>{type === "National ID" ? "Issue Date" : "Bill Date"}</dt><dd>{type === "National ID" ? "15/05/2020" : "05/05/2024"}</dd></div>
          {type === "National ID" ? <div><dt>Expiry Date</dt><dd>15/05/2030</dd></div> : null}
          <div><dt>Uploaded On</dt><dd>May 20, 2024 10:24 AM</dd></div>
        </dl>
      </div>
    </Card>
  );
}

function ReviewPanel() {
  return (
    <Card className="aw-panel kyc-review-panel">
      <header className="kyc-review-user">
        <div className="kyc-review-profile">
          <span className="kyc-large-avatar">KM<i /></span>
          <div>
            <h2>{selectedKycUser.name}</h2>
            <Badge tone="gold">{selectedKycUser.status}</Badge>
            <p>User ID: {selectedKycUser.id}</p>
            <p>{selectedKycUser.email}</p>
            <p>{selectedKycUser.phone}</p>
          </div>
        </div>
        <dl>
          <div><dt>Registered On</dt><dd>{selectedKycUser.registered}</dd></div>
          <div><dt>Country</dt><dd>{selectedKycUser.country}</dd></div>
          <div><dt>User Tier</dt><dd>{selectedKycUser.tier}</dd></div>
          <div><dt>Wallet Balance</dt><dd>{selectedKycUser.balance}</dd></div>
        </dl>
      </header>

      <div className="kyc-review-tabs">
        <button className="active" type="button">Documents</button>
        <button type="button">User Info</button>
        <button type="button">Verification History</button>
      </div>

      <DocumentPreview title="Identity Document" tag="Government ID" type="National ID">
        <GhanaIdMockup />
      </DocumentPreview>
      <DocumentPreview title="Proof of Address" tag="Utility Bill" type="Utility Bill">
        <UtilityBillMockup />
      </DocumentPreview>

      <Card className="kyc-admin-note">
        <h3>Admin Notes <span>(Optional)</span></h3>
        <textarea placeholder="Add a note here..." />
      </Card>

      <div className="kyc-review-actions">
        <Button type="button" variant="outline"><Icon name="userCheck" /> Request Resubmission</Button>
        <Button className="kyc-reject-button" type="button" variant="outline"><Icon name="xCircle" /> Reject</Button>
        <Button className="kyc-approve-button" type="button"><Icon name="check" /> Approve & Verify</Button>
      </div>
    </Card>
  );
}

export function KycVerificationPage() {
  return (
    <main className="aw-shell" id="kyc-verification">
      <AdminSidebar active="KYC Verification" />
      <section className="aw-main">
        <AdminTopbar title="KYC Verification" subtitle="Review and verify user identity documents" />
        <div className="aw-content">
          <section className="kyc-layout">
            <div>
              <section className="kyc-stats-grid">
                {kycStats.map((stat) => (
                  <KycStatCard stat={stat} key={stat.label} />
                ))}
              </section>
              <KycQueueTable />
            </div>
            <ReviewPanel />
          </section>
        </div>
      </section>
    </main>
  );
}
