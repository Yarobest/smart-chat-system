"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:4000")
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch(() => setMessage("Error connecting to backend"));
  }, []);

  return (
    <main style={{ padding: 40 }}>
      <h1>Frontend</h1>
      <p>API says: {message}</p>
    </main>
  );
}

