const { spawn } = require("node:child_process");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");

const expoCli = require.resolve("expo/bin/cli");
const args = process.argv.slice(2);

const API_PORT = 4001;
const API_HOST = "127.0.0.1";

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

function isApiRunning() {
  return new Promise((resolve) => {
    const socket = net.createConnection(API_PORT, API_HOST);
    socket.setTimeout(1000);
    socket.on("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.on("error", () => resolve(false));
    socket.on("timeout", () => {
      socket.destroy();
      resolve(false);
    });
  });
}

async function main() {
  const children = [];

  if (!(await isApiRunning())) {
    console.log("API is not running. Starting API on port 4001...");

    const api = spawn("npm", ["run", "start:dev"], {
      cwd: path.resolve(__dirname, "../../api"),
      stdio: "inherit",
      env: process.env,
    });

    children.push(api);
  }

  const expo = spawn(process.execPath, [expoCli, "start", ...args], {
    stdio: "inherit",
    env: {
      ...process.env,
      EXPO_PUBLIC_API_URL: apiUrl,
      EXPO_NO_DEPENDENCY_VALIDATION: "1",
    },
  });

  children.push(expo);

  const cleanup = () => {
    children.forEach((child) => {
      if (!child.killed) child.kill();
    });
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  expo.on("exit", (code, signal) => {
    cleanup();

    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
