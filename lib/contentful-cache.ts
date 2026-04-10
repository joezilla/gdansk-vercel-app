/**
 * Cache utility using Next.js Data Cache (replaces Upstash Redis ObjectCache).
 *
 * On Vercel, the Data Cache persists across deployments and is co-located
 * with the runtime — no external network hops. Invalidation is granular
 * via revalidateTag() instead of nuclear flushdb().
 */
import { unstable_cache } from 'next/cache';
import { log } from 'next-axiom';

/**
 * Wraps an async function with Next.js data cache.
 *
 * Logs a MISS line when the function actually executes (cache miss),
 * so Contentful API consumption can be monitored in Axiom logs.
 *
 * @param fn         - The async function to cache
 * @param cacheKey   - Array of strings forming the cache key
 * @param tags       - Cache tags for invalidation via revalidateTag()
 * @param revalidate - TTL in seconds. undefined = cache until tag invalidation.
 */
export function cached<T>(
  fn: () => Promise<T>,
  cacheKey: string[],
  tags: string[],
  revalidate?: number
): Promise<T> {
  const cachedFn = unstable_cache(
    async () => {
      log.info(`[cache MISS] ${cacheKey.join('/')}`);
      return fn();
    },
    cacheKey,
    {
      tags: [...tags, 'cf'],
      revalidate: revalidate && revalidate > 0 ? revalidate : undefined,
    }
  );
  return cachedFn() as Promise<T>;
}
