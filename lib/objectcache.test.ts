import { ObjectCache } from "./objectcache";

import { log } from 'next-axiom'
afterEach(async () => {
    log.flush();
});

// test loading by name
test('testCacheDisabled', async () => {
    const loader = new ObjectCache();

    await loader.invalidate("test");

    const first = await loader.getCachedEntry("test", [], () => {
        return Date.now();
    }, -1);

    const second = await loader.getCachedEntry("test", [], () => {
        return Date.now();
    }, -1);

    expect(first).not.toBe(second);
});

test('testCacheAlways', async () => {
    const loader = new ObjectCache();

    await loader.invalidate("test");

    const first = await loader.getCachedEntry("test", [], () => {
        return Date.now();
    }, 0);

    const second = await loader.getCachedEntry("test", [], () => {
        return Date.now();
    }, 0);


    console.debug("first", first);

    expect(first).toBe(second);
});


test('testInvalidation', async () => {
    const loader = new ObjectCache();

    const first = await loader.getCachedEntry("test", [], () => {
        return Date.now();
    }, 0);

    await loader.invalidate("test");

    const second = await loader.getCachedEntry("test", [], () => {
        return Date.now();
    }, 0);

    // console.log(`fist: ${first}, second: ${second}`);

    expect(first != second).toBe(true);

});

test('manualCache', async () => {
    const loader = new ObjectCache(500);

    await loader.invalidate("test");

    await loader.put("test", "testvalue");

    expect(await loader.isStale("test", 0)).toBe(false);

    expect(await loader.isStale("test", -1)).toBe(true);

    expect(await loader.isStale("test", 10)).toBe(false);

    loader.invalidate("test");

    expect(await loader.isStale("test", 10)).toBe(true);
});
