export const withdrawalStats = [
  { label: "Total Withdrawals (Today)", value: "GHS 1,217,350", trend: "9.21%", tone: "gold", icon: "outbox", positive: true },
  { label: "Completed (Today)", value: "GHS 892,750", trend: "11.45%", tone: "green", icon: "wallet", positive: true },
  { label: "Pending", value: "GHS 245,600", trend: "5.34%", tone: "orange", icon: "withdraw", positive: true },
  { label: "Rejected", value: "GHS 46,200", trend: "12.75%", tone: "red", icon: "xCircle", positive: false },
  { label: "Total Withdrawals (This Month)", value: "GHS 28,654,890", trend: "15.32%", tone: "blue", icon: "wallet", positive: true, compare: "vs last month" },
];

export const withdrawalRows = [
  ["#WDR-2024-001245", "Kofi Mensah", "kofi.mensah@email.com", "GHS 1,500.00", "Bank Transfer", "Pending Review", "Absa Bank Ghana\n**** 5678", "May 20, 2024\n10:24 AM"],
  ["#WDR-2024-001244", "Ama Boateng", "ama.boateng@email.com", "GHS 750.00", "MTN Mobile Money", "Pending Review", "024 123 4567", "May 20, 2024\n09:15 AM"],
  ["#WDR-2024-001243", "Yaw Appiah", "yaw.appiah@email.com", "GHS 300.00", "Telecel Cash", "Approved", "020 987 6543", "May 20, 2024\n08:50 AM"],
  ["#WDR-2024-001242", "Nana Adjei", "nana.adjei@email.com", "GHS 1,200.00", "Bank Transfer", "Approved", "GCB Bank\n**** 1234", "May 19, 2024\n11:10 PM"],
  ["#WDR-2024-001241", "Akua Darko", "akua.darko@email.com", "GHS 450.00", "AirtelTigo Money", "Rejected", "055 345 6789", "May 19, 2024\n09:35 PM"],
  ["#WDR-2024-001240", "Daniel Baffour", "daniel.baffour@email.com", "GHS 950.00", "Bank Transfer", "Approved", "Access Bank\n**** 7890", "May 19, 2024\n07:20 PM"],
  ["#WDR-2024-001239", "Emmanuel Quaye", "emmanuel.quaye@email.com", "GHS 200.00", "Vodafone Cash", "Pending Review", "050 123 9876", "May 19, 2024\n06:45 PM"],
  ["#WDR-2024-001238", "Abena Owusu", "abena.owusu@email.com", "GHS 600.00", "MTN Mobile Money", "Approved", "024 654 3210", "May 19, 2024\n05:15 PM"],
  ["#WDR-2024-001237", "Prince Asante", "prince.asante@email.com", "GHS 2,000.00", "Bank Transfer", "Pending Review", "Zenith Bank\n**** 2468", "May 19, 2024\n04:01 PM"],
  ["#WDR-2024-001236", "Mathew Owusu", "mathew.owusu@email.com", "GHS 350.00", "Telecel Cash", "Rejected", "020 111 2222", "May 19, 2024\n02:20 PM"],
];

export const selectedWithdrawal = {
  amount: "GHS 1,500.00",
  method: "Bank Transfer",
  transactionId: "#WDR-2024-001245",
  userId: "USR-001245",
  status: "Pending Review",
  requestedOn: "May 20, 2024 10:24 AM",
  bankName: "Absa Bank Ghana",
  accountNumber: "**** 5678",
  accountName: "Kofi Mensah",
  fees: "GHS 0.00",
  netAmount: "GHS 1,500.00",
  reference: "Withdrawal to bank",
  ipAddress: "197.210.45.12",
  device: "Chrome on Windows",
  user: {
    name: "Kofi Mensah",
    id: "USR-001245",
    email: "kofi.mensah@email.com",
    phone: "+233 24 123 4567",
    walletBalance: "GHS 1,245.50",
    totalDeposits: "GHS 12,450.00",
    totalWithdrawals: "GHS 8,750.00",
    memberSince: "Apr 12, 2024",
  },
};
