import { AlgoliaApi } from "./search";

// clear logs
import { log} from 'next-axiom'
afterEach(async() => {
    log.flush();
 });

// test loading by name
test('getStreetByName', async () => {
    const loader = new AlgoliaApi("en-US");

    const result = await loader.getStreetsWithImages();


    // no test yet... :()

});