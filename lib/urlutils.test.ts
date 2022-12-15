import { loadDefaultErrorComponents } from "next/dist/server/load-components";
import { slugify, unslugify } from "./urlutil";


import { log} from 'next-axiom'
afterEach(async() => {
    log.flush();
 });

// turn off logging, it's async and messes with the tests
process.env.AXIOM_LOG_LEVEL = "off";

test('getSlugify', async () => {
    expect(slugify("Am Brausenden Wasser")).toBe("am-brausenden-wasser");
});


test('unSlugify', async () => {
    expect(unslugify("am-brausenden-wasser")).toBe("am brausenden wasser");
});