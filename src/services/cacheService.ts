/**
 * Simple client-side cache service for API responses
 */

interface CacheItem<T> {
  data: T;
  expiry: number;
}

class ApiCacheService {
  private cache: Map<string, CacheItem<any>> = new Map();
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutes in milliseconds

  /**
   * Get an item from the cache
   * @param key Cache key
   * @returns The cached data or undefined if not found or expired
   */
  get<T>(key: string): T | undefined {
    const item = this.cache.get(key);
    const now = Date.now();

    // Return undefined if item doesn't exist or is expired
    if (!item || now > item.expiry) {
      if (item) {
        this.delete(key); // Clean up expired item
      }
      return undefined;
    }

    return item.data as T;
  }

  /**
   * Set an item in the cache
   * @param key Cache key
   * @param data Data to cache
   * @param ttl Time to live in milliseconds (default: 5 minutes)
   */
  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { data, expiry });
  }

  /**
   * Delete an item from the cache
   * @param key Cache key
   * @returns true if item was deleted, false otherwise
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all items from the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clear all expired items from the cache
   * @returns Number of items cleared
   */
  clearExpired(): number {
    const now = Date.now();
    let count = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
        count++;
      }
    }

    return count;
  }

  /**
   * Check if an item exists in the cache and is not expired
   * @param key Cache key
   * @returns true if item exists and is not expired, false otherwise
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    const now = Date.now();
    return !!item && now <= item.expiry;
  }

  /**
   * Set the default TTL for cache items
   * @param ttl Time to live in milliseconds
   */
  setDefaultTTL(ttl: number): void {
    this.defaultTTL = ttl;
  }

  /**
   * Get the size of the cache
   * @returns Number of items in the cache
   */
  size(): number {
    return this.cache.size;
  }
}

// Export a singleton instance
export const apiCache = new ApiCacheService();

/**
 * Enhanced function to get data from cache or fetch from API
 * @param cacheKey Cache key
 * @param fetchFn Function to fetch data if not in cache
 * @param ttl Time to live in milliseconds (optional)
 * @returns Promise with the data
 */
export async function getCachedData<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Try to get from cache first
  const cachedData = apiCache.get<T>(cacheKey);
  if (cachedData !== undefined) {
    return cachedData;
  }

  // If not in cache, fetch fresh data
  const freshData = await fetchFn();

  // Cache the fresh data
  apiCache.set(cacheKey, freshData, ttl);

  return freshData;
}

/**
 * Invalidate a specific cache entry or entries matching a prefix
 * @param key Cache key or prefix to match
 * @param isPrefix Whether to treat key as a prefix
 */
export function invalidateCache(key: string, isPrefix: boolean = false): void {
  if (!isPrefix) {
    apiCache.delete(key);
    return;
  }

  // If isPrefix is true, delete all keys that start with the specified prefix
  for (const cacheKey of Array.from(apiCache['cache'].keys())) {
    if (cacheKey.startsWith(key)) {
      apiCache.delete(cacheKey);
    }
  }
}
