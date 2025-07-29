"use client";

import { useEffect, useState, useRef } from "react";
import { getReport, ReportType } from "@/app/lib/api";

export function useReportData<T = unknown>(reportType: ReportType) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Track latest reportType to avoid race conditions
  const latestTypeRef = useRef<ReportType>(reportType);

  // Keep ref updated with the most recent type
  useEffect(() => {
    latestTypeRef.current = reportType;
  }, [reportType]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getReport<any>(reportType);

      // Extract first (and typically only) property which should be the array
      const list = Object.values(result)[0] as T[];

      // Only apply if this response matches the latest request
      if (latestTypeRef.current === reportType) {
        setData(Array.isArray(list) ? list : []);
      }
    } catch (err) {
      console.error(`Failed to fetch report ${reportType}:`, err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Clear previous data to avoid showing stale results while loading
    setData([]);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportType]);

  return { data, loading, error, refetch: fetchData };
} 