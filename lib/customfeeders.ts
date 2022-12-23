/**
* single feed endoint, triggered by webhook from contentful.
* accepts DELETE, POST, UPDATE operations
*
* expects body for POST and UPDATE of the following format:
*
* {
*  "sys": {
*   "type": "Entry|Asset",
*    "id": "k4bhCnJD1eqMBwQ76jJVt",
*    "contentType": {
*      "sys": {
*        "id": "street"
*      }
*    }
*   }
* }
**/
import { IStreet, IPost } from "../src/@types/contentful";
import { Asset } from 'contentful';
import { AbstractIndexObject, AbstractFeeder,DependencyManager } from "./indexer";
import { isEmptyString } from "./util";
import { log } from 'next-axiom'

type IndexImage = {
  url: string;
  title?: string;
  description?: string;
  source?: string;
  sourceUrl?: string;
}

// street object
class StreetIndexObject extends AbstractIndexObject {
    constructor(init?: Partial<StreetIndexObject>) {
      // super(init?.objectID ?? "", init?.type ?? "")
      super({
        objectID: init?.objectID ?? "",
        type: init?.type ?? "",
        locale: init?.locale ?? "en-US",
        tags: init?.tags ?? []
      });
      Object.assign(this, init);
    }
  
    firstLetter: string | undefined;
    germanName: string | undefined;
    polishNames: string[] = [];
    district: string | undefined;
    history: any; /* richtext */
    city: string | undefined;
    source: string | undefined;
    images: IndexImage[] = []; /* array of images */
    slug: string | undefined;
  
    validate(): boolean {
      if (isEmptyString(this.germanName)) {
        log.error("Missing germanName");
        return false
      }
      return super.validate();
    }
  
  }
  

export class StreetFeeder extends AbstractFeeder<IStreet> {
  async index(sourceObject: IStreet, dependencyManager: DependencyManager) {

    var myTags: string[] = [];
    sourceObject.metadata?.tags?.forEach(tag => {
      myTags.push(tag.sys.id);
    });

    var imagesToIndex: IndexImage[] = [];
    sourceObject.fields?.media?.forEach(image => {
      var i = {
        url: image.fields.image.fields.file.url,
        title: image.fields.title,
        source: image.fields.source,
        sourceUrl: image.fields.sourceUrl
      } as IndexImage;
      imagesToIndex.push(i);
    });
   
    var toIndex = new StreetIndexObject({
      objectID: sourceObject.sys.id,
      type: sourceObject.sys.contentType.sys.id,
      firstLetter: sourceObject.fields.germanName.charAt(0).toUpperCase(),
      germanName: sourceObject.fields.germanName,
      polishNames: sourceObject.fields.polishNames,
      district: sourceObject.fields.district,
      history: sourceObject.fields.history,
      tags: myTags,
      slug: sourceObject.fields.slug,
      city: sourceObject.fields.city?.fields.name as string,
      source: sourceObject.fields.source,
      images: imagesToIndex
    });
    // delegate to super
    this.doIndex(toIndex);
  }
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// post object
class PostIndexObject extends AbstractIndexObject {
    constructor(init?: Partial<PostIndexObject>) {
      // super(init?.objectID ?? "", init?.type ?? "")
      // Object.assign(this, init);
      super({
        objectID: init?.objectID ?? "",
        type: init?.type ?? "",
        locale: init?.locale ?? "en-US",
        tags: init?.tags ?? []
      });
      Object.assign(this, init);
    }
    title: string | undefined;
    content: any;
    excerpt: any;
    coverImage: any;
    createDate: string | undefined;
    author: any;
  
    validate(): boolean {
      if (isEmptyString(this.title)) {
        log.error("Missing title");
        return false
      }
      return super.validate();
    }
  }

export class PostFeeder extends AbstractFeeder<IPost> {
  async index(sourceObject: IPost, dependencyManager: DependencyManager) {

    var myTags: string[] = [];
    sourceObject.metadata?.tags?.forEach(tag => {
      myTags.push(tag.sys.id);
    });

    var toIndex = new PostIndexObject({
      objectID: sourceObject.sys.id,
      type: sourceObject.sys.contentType.sys.id,
      title: sourceObject.fields.title,
      content: sourceObject.fields.content,
      excerpt: sourceObject.fields.excerpt,
      tags: myTags,
      coverImage: sourceObject.fields.coverImage,
      createDate: sourceObject.fields.date,
      author: sourceObject.fields.date
    });

    // delegate to super
    this.doIndex(toIndex);
  }
}