"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { fetchJson } from "@/lib/fetcher";

export interface Comic {
  id: string;
  title: string;
  cover: string;
  description?: string;
  author?: string;
  status?: string;
  genres?: string[];
  lastChapter?: string;
}

interface ComicResponse {
  success: boolean;
  data: Comic[];
}

export function useKomikRecommended(page = 1) {
  return useQuery<ComicResponse>({
    queryKey: ["komik", "recommended", page],
    queryFn: () => fetchJson<ComicResponse>(`/api/komik/recommended?page=${page}`),
    staleTime: 5 * 60 * 1000,
  });
}

export function useKomikLatest(page = 1) {
  return useQuery<ComicResponse>({
    queryKey: ["komik", "latest", page],
    queryFn: () => fetchJson<ComicResponse>(`/api/komik/latest?page=${page}`),
    staleTime: 5 * 60 * 1000,
  });
}

export function useKomikPopular(page = 1) {
  return useQuery<ComicResponse>({
    queryKey: ["komik", "popular", page],
    queryFn: () => fetchJson<ComicResponse>(`/api/komik/popular?page=${page}`),
    staleTime: 5 * 60 * 1000,
  });
}

export function useKomikSearch(query: string, page = 1) {
  return useQuery<ComicResponse>({
    queryKey: ["komik", "search", query, page],
    queryFn: () => fetchJson<ComicResponse>(`/api/komik/search?query=${encodeURIComponent(query)}&page=${page}`),
    enabled: query.length > 0,
    staleTime: 2 * 60 * 1000,
  });
}

export function useInfiniteKomikRecommended() {
  return useInfiniteQuery<ComicResponse>({
    queryKey: ["komik", "recommended", "infinite"],
    queryFn: ({ pageParam = 1 }) => fetchJson<ComicResponse>(`/api/komik/recommended?page=${pageParam}`),
    initialPageParam: 1,
    getNextPageParam: (_, allPages) => {
      if (allPages.length >= 10) return undefined;
      return allPages.length + 1;
    },
    staleTime: 5 * 60 * 1000,
  });
}
