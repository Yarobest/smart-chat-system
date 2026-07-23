export const kycStats = [
  { label: "Total Pending", value: "23", note: "View all pending", tone: "purple", icon: "fileCheck", positive: true },
  { label: "Verified (Today)", value: "18", trend: "12.5%", tone: "green", icon: "checkCircle", positive: true },
  { label: "Rejected (Today)", value: "5", trend: "25%", tone: "red", icon: "xCircle", positive: false },
  { label: "Avg. Verification Time", value: "2h 45m", trend: "15%", tone: "gold", icon: "clock", positive: true },
];

export const kycRows = [
  ["Kofi Mensah", "kofi.mensah@email.com", "USR-001245", "May 20, 2024\n10:24 AM", "id,address", "Pending"],
  ["Ama Boateng", "ama.boateng@email.com", "USR-001246", "May 20, 2024\n09:15 AM", "id,address", "Pending"],
  ["Yaw Appiah", "yaw.appiah@email.com", "USR-001247", "May 20, 2024\n08:50 AM", "id,bank", "Pending"],
  ["Nana Adjei", "nana.adjei@email.com", "USR-001248", "May 19, 2024\n07:55 PM", "address,bank", "Pending"],
  ["Akua Darko", "akua.darko@email.com", "USR-001249", "May 19, 2024\n07:20 PM", "id,address", "Pending"],
  ["Daniel Baffour", "daniel.baffour@email.com", "USR-001250", "May 19, 2024\n06:30 PM", "id,bank", "Pending"],
  ["Emmanuel Quaye", "emmanuel.quaye@email.com", "USR-001251", "May 18, 2024\n05:45 PM", "address,bank", "Pending"],
  ["Abena Owusu", "abena.owusu@email.com", "USR-001252", "May 18, 2024\n04:10 PM", "id,address", "Pending"],
  ["Prince Asante", "prince.asante@email.com", "USR-001253", "May 18, 2024\n03:25 PM", "id,bank", "Pending"],
  ["Mathew Owusu", "mathew.owusu@email.com", "USR-001254", "May 18, 2024\n02:40 PM", "id,address", "Pending"],
];

export const selectedKycUser = {
  name: "Kofi Mensah",
  id: "USR-001245",
  email: "kofi.mensah@email.com",
  phone: "+233 24 123 4567",
  status: "Pending Review",
  registered: "May 10, 2024 11:20 AM",
  country: "Ghana",
  tier: "Gold",
  balance: "GHS 1,245.50",
};
