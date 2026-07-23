export const depositStats = [
  { label: "Total Deposits (Today)", value: "GHS 2,458,720", trend: "12.45%", tone: "blue", icon: "wallet", positive: true },
  { label: "Completed (Today)", value: "GHS 2,105,300", trend: "12.12%", tone: "green", icon: "inbox", positive: true },
  { label: "Pending", value: "GHS 241,850", trend: "8.67%", tone: "gold", icon: "coins", positive: true },
  { label: "Failed", value: "GHS 111,570", trend: "15.23%", tone: "red", icon: "xCircle", positive: false },
  { label: "Total Deposits (This Month)", value: "GHS 58,745,230", trend: "18.35%", tone: "purple", icon: "fileCheck", positive: true, compare: "vs last month" },
];

export const depositRows = [
  ["#DEP-2024-001245", "Kofi Mensah", "kofi.mensah@email.com", "GHS 500.00", "MTN Mobile Money", "Completed", "MTN-8247362910", "May 20, 2024\n10:24 AM"],
  ["#DEP-2024-001244", "Ama Boateng", "ama.boateng@email.com", "GHS 1,200.00", "Telecel Cash", "Completed", "TEL-9318273645", "May 20, 2024\n09:15 AM"],
  ["#DEP-2024-001243", "Yaw Appiah", "yaw.appiah@email.com", "GHS 750.00", "Visa Card", "Pending", "VISA-6627382910", "May 20, 2024\n08:50 AM"],
  ["#DEP-2024-001242", "Nana Adjei", "nana.adjei@email.com", "GHS 300.00", "AirtelTigo Money", "Completed", "AT-7738291028", "May 19, 2024\n11:10 PM"],
  ["#DEP-2024-001241", "Akua Darko", "akua.darko@email.com", "GHS 450.00", "Mastercard", "Failed", "MC-5528283738", "May 19, 2024\n09:35 PM"],
  ["#DEP-2024-001240", "Daniel Baffour", "daniel.baffour@email.com", "GHS 950.00", "Bank Transfer", "Completed", "BNK-8291028373", "May 19, 2024\n07:20 PM"],
  ["#DEP-2024-001239", "Emmanuel Quaye", "emmanuel.quaye@email.com", "GHS 200.00", "Vodafone Cash", "Pending", "VOD-2829102736", "May 19, 2024\n06:45 PM"],
  ["#DEP-2024-001238", "Abena Owusu", "abena.owusu@email.com", "GHS 600.00", "MTN Mobile Money", "Completed", "MTN-7391029837", "May 19, 2024\n05:15 PM"],
  ["#DEP-2024-001237", "Prince Asante", "prince.asante@email.com", "GHS 1,500.00", "Visa Card", "Completed", "VISA-9928371029", "May 19, 2024\n04:01 PM"],
  ["#DEP-2024-001236", "Mathew Owusu", "mathew.owusu@email.com", "GHS 350.00", "Telecel Cash", "Failed", "TEL-2839102837", "May 19, 2024\n02:20 PM"],
];

export const selectedDeposit = {
  amount: "GHS 500.00",
  method: "MTN Mobile Money",
  transactionId: "MTN-8247362910",
  depositId: "#DEP-2024-001245",
  status: "Completed",
  dateTime: "May 20, 2024 10:24 AM",
  fees: "GHS 0.00",
  netAmount: "GHS 500.00",
  reference: "Deposit to wallet",
  ipAddress: "197.210.45.12",
  device: "Chrome on Windows",
  location: "Accra, Greater Accra, Ghana",
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
