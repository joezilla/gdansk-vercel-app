import { loadDefaultErrorComponents } from "next/dist/server/load-components";
import { ObjectCache } from "./objectcache";


// test loading by name
test('testCacheDisabled', async () => {
    let loader = new ObjectCache();

    await loader.invalidate("test");
   
    let first = await loader.getCachedEntry("test", () => {
        return Date.now();
    }, -1);

    let second = await loader.getCachedEntry("test", () => {
        return Date.now();
    }, -1);

    expect(first).not.toBe(second);
    
});

test('testCacheAlways', async () => {
    let loader = new ObjectCache();
   
    await loader.invalidate("test");

    let first = await loader.getCachedEntry("test", () => {
        return Date.now();
    }, 0);

    let second = await loader.getCachedEntry("test", () => {
        return Date.now();
    }, 0);


    console.debug("first", first);

    expect(first).toBe(second);
    
});


test('testInvalidation', async () => {
    let loader = new ObjectCache();
   
    let first = await loader.getCachedEntry("test", () => {
        return Date.now();
    }, 0);

    await loader.invalidate("test");

    let second = await loader.getCachedEntry("test", () => {
        return Date.now();
    }, 0);

    expect(first).not.toBe(second);
    
});

test('manualCache', async () => {
    let loader = new ObjectCache();

    await loader.invalidate("test");

    await loader.put("test", "testvalue");

    expect(await loader.isStale("test", 0)).toBe(false);
    
    expect(await loader.isStale("test", -1)).toBe(true);

    expect(await loader.isStale("test", 10)).toBe(false);
    
    loader.invalidate("test");
    
    expect(await loader.isStale("test", 10)).toBe(true);
});
