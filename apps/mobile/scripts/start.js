const { spawn } = require("node:child_process");
const os = require("node:os");

const expoCli = require.resolve("expo/bin/cli");
const args = process.argv.slice(2);

const API_PORT = 4001;

function getLanAddress() {
  const interfaces = os.networkInterfaces();
  const addresses = Object.entries(interfaces).flatMap(([name, items]) =>
    (items ?? [])
      .filter((item) => item.family === "IPv4" && !item.internal)
      .map((item) => ({ name, address: item.address })),
  );

  return (
    addresses.find((item) => ["en0", "en1"].includes(item.name))?.address ??
    addresses[0]?.address ??
    "localhost"
  );
}

const apiUrl =
  process.env.EXPO_PUBLIC_API_URL ?? `http://${getLanAddress()}:${API_PORT}`;

console.log(`Using API URL: ${apiUrl}`);

const child = spawn(process.execPath, [expoCli, "start", ...args], {
  stdio: "inherit",
  env: {
    ...process.env,
    EXPO_PUBLIC_API_URL: apiUrl,
    EXPO_NO_DEPENDENCY_VALIDATION: "1",
  },
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
