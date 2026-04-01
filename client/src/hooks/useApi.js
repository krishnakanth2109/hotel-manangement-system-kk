import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Generic hook for making authenticated API calls.
 * Falls back gracefully when VITE_API_BASE_URL is not set.
 *
 * Usage:
 *   const { data, loading, error, request } = useApi();
 *   await request('/rooms');           // GET
 *   await request('/rooms', 'POST', body);
 */
export function useApi() {
  const { getToken, API_BASE } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);
  const [data, setData]     = useState(null);

  const request = useCallback(async (path, method = 'GET', body = null) => {
    if (!API_BASE) {
      // No backend configured — callers should use mock data instead
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        ...(body ? { body: JSON.stringify(body) } : {}),
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => 'Request failed');
        throw new Error(msg || `HTTP ${res.status}`);
      }

      const json = await res.json();
      setData(json);
      return json;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [API_BASE, getToken]);

  return { data, loading, error, request };
}

/**
 * useLocalSearch — filters an array by a search term across given keys.
 * Keeps filtering logic out of components.
 */
export function useLocalSearch(items = [], keys = []) {
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? items.filter(item =>
        keys.some(key =>
          String(item[key] ?? '').toLowerCase().includes(search.toLowerCase())
        )
      )
    : items;

  return { search, setSearch, filtered };
}
