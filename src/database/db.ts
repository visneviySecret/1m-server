import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL ?? process.env.MYSQL_URL;
  if (!url) {
    throw new Error("DATABASE_URL or MYSQL_URL is required");
  }
  return url;
}

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(getDatabaseUrl());
  }
  return pool;
}

export async function connectDatabase(): Promise<void> {
  const db = getPool();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS persons (
      id VARCHAR(64) NOT NULL PRIMARY KEY,
      age INT NOT NULL,
      name VARCHAR(10) NOT NULL
    )
  `);
}
