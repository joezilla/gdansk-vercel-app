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

    await expect(result).toBe("Abbegg-Gasse");




    // let street = await loader.getStreetBySlug("abbegg-gasse");
    // await expect(street.fields.germanName).toBe("Abbegg-Gasse");

    // // check the attached media items
    // await expect(street.fields.media.length).toBeGreaterThan(0);
    // await expect(street.fields.media[0].fields.title).toBe("Dobra (Abegg-Gasse)");
    // await expect(street.fields.media[0].fields.image.fields.file?.url).toBe("//images.ctfassets.net/9ieso0n2yz5w/1TxV2nAp1kTG8CKYsVzAGa/c1ad09d4046c615e9ddb2b1c6e6f8170/Ulica_Abegg_Gasse_z_logo.jpg");

});