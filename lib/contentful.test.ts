import { ContentfulLoader } from "./contentful";

// clear logs
import { log} from 'next-axiom'
afterEach(async() => {
    log.flush();
 });

// test loading by name
test('getStreetByName', async () => {
    let loader = new ContentfulLoader( - 1 );
    let street = await loader.getStreetBySlug("abbegg-gasse");
    await expect(street.fields.germanName).toBe("Abbegg-Gasse");

    // check the attached media items
    await expect(street.fields.media.length).toBeGreaterThan(0);
    await expect(street.fields.media[0].fields.title).toBe("Dobra (Abegg-Gasse)");
    await expect(street.fields.media[0].fields.image.fields.file?.url).toBe("//images.ctfassets.net/9ieso0n2yz5w/1TxV2nAp1kTG8CKYsVzAGa/c1ad09d4046c615e9ddb2b1c6e6f8170/Ulica_Abegg_Gasse_z_logo.jpg");

console.log(">>>>>>>");
console.log(street.fields.media[0]);
console.log("<<<<<<<");
});

// lower case fun
test('getStreeyByName-lowercase', async () => {
    let loader = new ContentfulLoader( - 1 );
    let street = await loader.getStreetBySlug("am-brausenden-wasser");
    await expect(street.fields.germanName).toBe("Am Brausenden Wasser");
});

// test loading all streets
test('getAllStreets', async () => {
    let loader = new ContentfulLoader( -1 );
    let streets = await loader.getAllStreets();
    await expect(streets.length).toBeGreaterThan(0);
    await expect(streets.length).toBe(1222);
    await expect(streets[0].germanName).toBeDefined();
    await expect(streets[0].slug).toBeDefined();

});


// test loading all posts
test('getAllPosts', async () => {
    let loader = new ContentfulLoader( -1 );
    let posts = await loader.getAllPosts();
    await expect(posts.length).toBeGreaterThan(0);
    if(posts[0])
     await expect(posts[0].slug).toBeDefined();
     else fail("posts[0] is not defined");
});

test('getHomepagePosts', async () => {
    let loader = new ContentfulLoader( -1 );
    let posts = await loader.getHomepagePosts();
    await expect(posts.length).toBeGreaterThan(0);
    await expect(posts[0].fields.title).toBeDefined();
});

test('getNavigationPosts', async () => {
    let loader = new ContentfulLoader( -1 );
    let posts = await loader.getNavigationPosts();

    await expect(posts.length).toBeGreaterThan(0);
    await expect(posts[0].fields.title).toBeDefined();

    await expect(posts[0].fields.showIn.length).toBe(1);
    if (posts[0].fields?.showIn)
        await expect(posts[0].fields?.showIn[0]).toBe("Navigation");
  
        else fail("showIn is not defined");


});

test('getPostBySlug', async () => {
    let loader = new ContentfulLoader( -1 );
    let post = await loader.getPostBySlug("about");
    await expect(post.fields.title).toBe("About");
});

test('getHomepageHeroPost', async () => {
    let loader = new ContentfulLoader( -1 );
    let post = await loader.getHomepageHeroPost();
    await expect(post).toBeDefined();
    if (post.fields?.showIn)
        await expect(post.fields?.showIn[0]).toBe("Homepage");
});


// test loading all streets
test('getAllDistricts', async () => {
    let loader = new ContentfulLoader( -1 );
    let streets = await loader.getAllDistricts();
    await expect(streets.length).toBeGreaterThan(1);
    await expect(streets[0].name).toBeDefined();
});