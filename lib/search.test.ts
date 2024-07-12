import { AlgoliaApi } from "./search";

// clear logs
import { log} from 'next-axiom'
afterEach(async() => {
    log.flush();
 });

// test loading by name
test('getStreetByName', async () => {
    let loader = new AlgoliaApi("en-US");

    var result = await loader.getStreetsWithImages();


    // no test yet... :()

});