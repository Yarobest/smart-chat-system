type NavItem = {
  label: string;
  icon: string;
  href?: string;
  badge?: string;
  badgeTone?: "gold" | "blue" | "red";
};

export const statCards = [
  {
    label: "Total Users",
    value: "125,430",
    trend: "3.25%",
    tone: "purple",
    icon: "users",
  },
  {
    label: "Active Users",
    value: "18,765",
    trend: "5.18%",
    tone: "green",
    icon: "active",
  },
  {
    label: "Total Deposits",
    value: "GHS 2,458,720",
    trend: "12.45%",
    tone: "blue",
    icon: "wallet",
  },
  {
    label: "Total Withdrawals",
    value: "GHS 1,217,350",
    trend: "8.32%",
    tone: "orange",
    icon: "withdraw",
  },
  {
    label: "Total Bets",
    value: "28,654",
    trend: "9.21%",
    tone: "violet",
    icon: "bag",
  },
  {
    label: "Revenue (Gross)",
    value: "GHS 1,241,370",
    trend: "11.73%",
    tone: "gold",
    icon: "coins",
  },
];

export const alertCards = [
  { label: "Pending KYC", value: "23", tone: "red", icon: "id" },
  { label: "Pending Withdrawals", value: "15", tone: "cyan", icon: "cash" },
];

export const navGroups: Array<{ title: string; items: NavItem[] }> = [
  {
    title: "Management",
    items: [
      { label: "Users", icon: "user", href: "/admin/users" },
      { label: "KYC Verification", icon: "badge", href: "/admin/kyc", badge: "23" },
      { label: "Deposits", icon: "inbox", href: "/admin/deposits", badge: "15" },
      { label: "Withdrawals", icon: "outbox", href: "/admin/withdrawals", badge: "18" },
      { label: "Transactions", icon: "swap" },
      { label: "Bets", icon: "target", href: "/admin/bets" },
      { label: "Sports Management", icon: "ball", href: "/admin/sports" },
      { label: "Matches", icon: "calendar", href: "/admin/matches" },
      { label: "Odds Management", icon: "odds", href: "/admin/odds" },
    ],
  },
  {
    title: "Business",
    items: [
      { label: "Promotions", icon: "gift" },
      { label: "Bonus Management", icon: "bonus", href: "/admin/bonuses" },
      { label: "Reports", icon: "report", href: "/admin/reports" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Support Tickets", icon: "ticket", badge: "8", badgeTone: "blue" },
      { label: "Live Chat", icon: "chat" },
    ],
  },
  {
    title: "Risk & Compliance",
    items: [
      { label: "Risk Management", icon: "shield", href: "/admin/risk", badge: "4", badgeTone: "red" },
      { label: "Audit Logs", icon: "log", href: "/admin/audit-logs" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings", icon: "gear" },
      { label: "Admins", icon: "admin" },
    ],
  },
];

export const chartDays = ["May 14", "May 15", "May 16", "May 17", "May 18", "May 19", "May 20"];

export const quickActions = [
  { label: "Approve Withdrawals", icon: "wallet", badge: "15", tone: "green" },
  { label: "Review KYC", icon: "user", badge: "23", tone: "gold" },
  { label: "Create Promotion", icon: "gift", tone: "purple" },
  { label: "Add Match", icon: "ticket", tone: "blue" },
  { label: "Manage Odds", icon: "odds", tone: "cyan" },
  { label: "View Reports", icon: "report", tone: "gold" },
];

export const deposits = [
  ["Kofi Mensah", "kofi.mensah@email.com", "GHS 500.00", "MTN Mobile Money", "10:24 AM"],
  ["Ama Boateng", "ama.boateng@email.com", "GHS 1,200.00", "Telecel Cash", "10:18 AM"],
  ["Yaw Appiah", "yaw.appiah@email.com", "GHS 300.00", "Visa Card", "10:15 AM"],
  ["Nana Akoto", "nana.akoto@email.com", "GHS 750.00", "AirtelTigo Money", "10:12 AM"],
  ["Akua Darko", "akua.darko@email.com", "GHS 450.00", "Mastercard", "10:05 AM"],
];

export const withdrawals = [
  ["Kwame Asare", "kwame.asare@gmail.com", "GHS 1,000.00", "MTN Mobile Money", "10:22 AM"],
  ["Abena Owusu", "abena.owusu@gmail.com", "GHS 2,500.00", "Bank Transfer", "10:16 AM"],
  ["Kojo Mensah", "kojo.mensah@gmail.com", "GHS 750.00", "Telecel Cash", "10:11 AM"],
  ["Esi Owusu", "esi.owusu@gmail.com", "GHS 1,200.00", "AirtelTigo Money", "10:03 AM"],
  ["Daniel Baffour", "daniel.baffour@gmail.com", "GHS 950.00", "Bank Transfer", "09:58 AM"],
];

export const sportsRows = [
  ["Football", "GHS 1,245,870", "45.2%", "GHS 248,170", "19.93%"],
  ["Basketball", "GHS 654,320", "23.8%", "GHS 98,145", "15.00%"],
  ["Tennis", "GHS 321,450", "11.7%", "GHS 42,230", "13.14%"],
  ["Esports", "GHS 285,600", "10.4%", "GHS 35,230", "12.34%"],
  ["Others", "GHS 252,780", "8.9%", "GHS 28,765", "11.38%"],
];

export const riskAlerts = [
  ["Large Bet Detected", "User: Kwame123 placed a bet of GHS 25,000 on Football.", "10:20 AM", "danger"],
  ["Multiple Failed KYC Attempts", "User: benjamin55 has failed KYC verification 3 times.", "09:45 AM", "warning"],
  ["Unusual Deposit Activity", "User: adjel09 made 5 deposits within 1 hour.", "09:30 AM", "warning"],
  ["Suspicious Betting Pattern", "User: smartbettor88 showing unusual betting behavior.", "09:10 AM", "danger"],
];

export const platformStatus = [
  "Website",
  "Mobile App (Android)",
  "Mobile App (iOS)",
  "Live Betting Feed",
  "Payment Gateway",
  "Odds Feed",
];

export const supportIssues = [
  ["Withdrawal Issues", "42", "52.5%"],
  ["KYC Verification", "21", "26.3%"],
  ["Deposit Issues", "10", "12.5%"],
  ["Bonus & Promotions", "7", "8.7%"],
];
