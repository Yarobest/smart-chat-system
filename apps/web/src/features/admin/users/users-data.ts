export const userStats = [
  { label: "Total Users", value: "125,430", trend: "3.25%", tone: "purple", icon: "user", positive: true },
  { label: "Active Users", value: "98,765", trend: "4.18%", tone: "green", icon: "active", positive: true },
  { label: "New Users (Today)", value: "1,234", trend: "8.45%", tone: "blue", icon: "users", positive: true },
  { label: "Total User Balance", value: "GHS 4,562,730", trend: "5.33%", tone: "gold", icon: "wallet", positive: true },
  { label: "Suspended Users", value: "432", trend: "1.23%", tone: "orange", icon: "user", positive: false },
  { label: "Banned Users", value: "128", trend: "0.75%", tone: "red", icon: "id", positive: false },
];

export const users = [
  ["Kofi Mensah", "+233 24 123 4567", "USR-001245", "kofi.mensah@email.com", "GHS 1,245.50", "Verified", "Active", "May 20, 2024\n10:24 AM", "May 20, 2024\n02:35 PM"],
  ["Ama Boateng", "+233 54 987 6543", "USR-001246", "ama.boateng@email.com", "GHS 850.20", "Verified", "Active", "May 18, 2024\n09:15 AM", "May 20, 2024\n01:10 PM"],
  ["Yaw Appiah", "+233 20 555 7890", "USR-001247", "yaw.appiah@email.com", "GHS 320.00", "Pending", "Active", "May 17, 2024\n11:05 AM", "May 20, 2024\n12:40 PM"],
  ["Nana Adjei", "+233 27 111 2223", "USR-001248", "nana.adjei@email.com", "GHS 0.00", "Rejected", "Active", "May 15, 2024\n08:20 AM", "May 19, 2024\n07:55 PM"],
  ["Akua Darko", "+233 55 333 4445", "USR-001249", "akua.darko@email.com", "GHS 2,560.75", "Verified", "Active", "May 14, 2024\n02:30 PM", "May 20, 2024\n03:05 PM"],
  ["Daniel Baffour", "+233 24 666 8889", "USR-001250", "daniel.baffour@email.com", "GHS 145.00", "Pending", "Suspended", "May 12, 2024\n10:10 AM", "May 18, 2024\n09:30 AM"],
  ["Emmanuel Quaye", "+233 50 999 0001", "USR-001251", "emmanuel.quaye@email.com", "GHS 0.00", "Rejected", "Banned", "May 10, 2024\n05:45 PM", "May 15, 2024\n08:15 AM"],
  ["Abena Owusu", "+233 24 222 3334", "USR-001252", "abena.owusu@email.com", "GHS 780.60", "Verified", "Active", "May 9, 2024\n09:00 AM", "May 20, 2024\n11:20 AM"],
  ["Prince Asante", "+233 59 123 7896", "USR-001253", "prince.asante@email.com", "GHS 95.30", "Verified", "Active", "May 8, 2024\n01:40 PM", "May 19, 2024\n06:50 PM"],
  ["Mathew Owusu", "+233 20 777 1112", "USR-001254", "mathew.owusu@email.com", "GHS 3,120.00", "Verified", "Active", "May 7, 2024\n07:25 AM", "May 20, 2024\n02:00 PM"],
];

export const userActions = [
  ["Bulk Email Users", "chat"],
  ["Export Filtered Users", "outbox"],
  ["Add New User", "user"],
  ["Bulk Suspend Users", "shield"],
  ["Bulk Activate Users", "active"],
  ["Bulk Delete Users", "log"],
];

export const userBreakdown = [
  ["Active Users", "98,765", "78.8%", "green"],
  ["Suspended Users", "432", "0.3%", "orange"],
  ["Banned Users", "128", "0.1%", "red"],
  ["Inactive Users", "26,105", "20.8%", "blue"],
];
