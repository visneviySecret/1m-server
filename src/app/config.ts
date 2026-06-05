const envOrigins = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const allowedOrigins = [
  "http://localhost:3000",
  "https://1m-client.vercel.app",
  ...envOrigins,
];