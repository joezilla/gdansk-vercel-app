/*
 * Cache storage layer (backed by Reddis / Upstash.com)
 */
import { Redis } from '@upstash/redis'

import { log } from 'next-axiom'

type AssetCacheEntry = {
    id: string,
    timestamp: number,
    value: string
}

const redisClient = Redis.fromEnv();
const defaultTimeout = +(process.env.CACHE_DEFAULT_TTL ?? "0");

/**
 * Generic object cache backed by a simple redis db.
 */
export class ObjectCache {

    /**
     * Cached lookup of objects
     * 
     * @param id identifier, string
     * @param fn function to call to get the value
     * @param timeout timeout in seconds. 0 always caches, -1 never caches.
     * @returns cached or retrieved value
     */
    async getCachedEntry<Any>(id: string, fn: (id: string) => any, timeout: number = defaultTimeout) {
        if (!id) {
            throw new Error("id is required");
        }
        log.debug(`Cache timeout is ${timeout}`);
        if(process.env.CACHE_DISABLED == "true") {
            log.warn("CACHE DISABLED");
            timeout = -1;
        }
        //  
        // retrieve the object from redis
        const key = `${id}`;
        const entry = timeout < 0 ? null : await redisClient.get(key) as AssetCacheEntry;
        if (entry) {
            if (timeout > 0 && entry.timestamp + timeout * 1000 < Date.now()) {
                log.debug(`refreshing stale cache entry ${key}`);
                // cache expired, reload the docume
                var value = await fn(id);
                // save back into cache
                if (value)
                    await redisClient.set(key, JSON.stringify({ id, timestamp: Date.now(), value }));
                return value;
            } else {
                log.debug(`cache hit for ${key} yielded ${entry.value}`);
                return entry.value;
            }
        } else {
            log.debug(`cache miss for ${key}`);
            var value = await fn(id);
            if (value)
                await redisClient.set(key, JSON.stringify({ id, timestamp: Date.now(), value }));
            return value;
        }
    }

    /**
     * Clear the entire cache
     */
    public async clearCache() {
        await redisClient.flushdb();
    }

    /**
    * Clear an entry form the cache.
    * @param id  the id
    */
    public async invalidate(id: string) {
        await redisClient.del(id);
    }

    /**
     * Manually add something to the cache
     * @param id 
     * @param toCache 
     */
    public async put(id: string, toCache: any) {
        await redisClient.set(id, JSON.stringify({ id, timestamp: Date.now(), value: toCache }));
    }

    /**
     * Check if an entry is stale (i.e. not cached or expired)
     * @param id
     * @returns 
     */
    public async isStale(id: string, timeout: number = defaultTimeout) {
        if (timeout < 0)
            return true;
        const entry = await redisClient.get(id) as AssetCacheEntry;
        if (entry) {
            return timeout == 0 ? false : entry.timestamp + timeout * 1000 < Date.now();
        }
        console.log("no etnry");
        return true;
    }
}