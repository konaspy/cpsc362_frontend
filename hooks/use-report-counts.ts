"use client";

import { useEffect, useState } from "react";
import { getReport, ReportType } from "@/app/lib/api";

export function useReportCounts(map: Record<string, ReportType>) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCounts() {
      setLoading(true);
      setError(null);
      
      try {
        const entries = await Promise.all(
          Object.entries(map).map(async ([key, type]) => {
            const data = await getReport<any>(type);
            // Get the first (and typically only) property which should be the array
            const list = Object.values(data)[0] as unknown[];
            return [key, Array.isArray(list) ? list.length : 0] as const;
          })
        );
        
        setCounts(Object.fromEntries(entries));
      } catch (err) {
        console.error('Failed to fetch report counts:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchCounts();
  }, [JSON.stringify(map)]);

  return { loading, error, counts };
} 