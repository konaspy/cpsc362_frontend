"use client";

export type ReportType =
  | "transactions"
  | "transactions-overdue"
  | "transactions-compliant"
  | "members"
  | "members-overdue"
  | "members-borrowing"
  | "books"
  | "books-overdue"
  | "books-available"
  | "overdue-summary"
  | "borrowing-summary";

const API_BASE = "http://localhost:80";

export async function getReport<T = unknown>(type: ReportType): Promise<T> {
  const res = await fetch(`${API_BASE}/api/reports/${type}`, { 
    cache: "no-store" 
  });
  
  if (!res.ok) {
    throw new Error(`Report ${type} failed: ${res.status} ${res.statusText}`);
  }
  
  const json = await res.json();
  return json.data as T;
} 