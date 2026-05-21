import Database from "better-sqlite3";
import path from "path";

export function getDB() {
  const dbPath = path.join(process.cwd(), "backend/database.sqlite");
  return new Database(dbPath);
}