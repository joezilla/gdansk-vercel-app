//
// Typescript content model wrappers. 
// 
// Hand-coded becase non of the generator librabries appear to be maintained anymore.
// 
import * as contentful from 'contentful'
import { Asset } from 'contentful'
import { Metadata } from 'contentful'
import { EntrySys } from 'contentful'
import { EntrySkeletonType } from 'contentful'
import { Document, Node } from '@contentful/rich-text-types'
import { EntryFields } from 'contentful';

export type IBaseEntry = {
    sys: EntrySys
    metadata: Metadata
}  & EntrySkeletonType;

export type IAuthor = {
    contentTypeId: 'author'
    fields: {
        title: contentful.EntryFieldTypes.Text,
        image: Asset 
    }
} & IBaseEntry

export type IImageWithFocalPoint = {
    contentTypeId: 'imageWithFocalPoint'
    fields: {
        title: string,
        image: Asset, 
        focalPoint: contentful.EntryFieldTypes.Object,
        location: EntryFields.Location, 
        dateTaken: EntryFields.Date, 
        source: string,
        sourceUrl: string, 
        aiTags: string[], 
        alignment: string[], 
        float: string[], 
        embbedSize: string[], 
    }
} & IBaseEntry

export type IPerson = {
    contentTypeId: 'person',
    fields: {
        name: string, 
        birthDate: EntryFields.Date, 
        slug: string, 
        bornIn: ICity 
        diedIn: ICity,
        deathDate: EntryFields.Date, 
        description: Document, 
        pictures: IImageWithFocalPoint[], 
        livedAt: IStreet[], 
    }
} & IBaseEntry

export type ICity = {
    contentTypeId: 'city',
    fields: {
        name: string, 
    }
} & IBaseEntry

export type IStreet = {
    contentTypeId: 'street'
    fields: {
        germanName: string, 
        slug: string, 
        polishNames: string[], 
        district: string,
        previousNames: string, 
        history: Document, 
        source: string, 
        city: ICity,  
        media: IImageWithFocalPoint[], 
        location: EntryFields.Location,
    }
} & IBaseEntry


/// shortform of streets
// todo - probably best to eliminate these
export type StreetSummary = {
    germanName: string,
    polishNames: string[],
    slug: string,
    sys: {
        id: string
    }
}

// shortform of posts
// todo - probably best to eliminate these
export type PostSummary = {
    title: string,
    slug: string,
    sys: {
        id: string
    }
} 

export type IPost = {
    contentTypeId: 'post',
    fields: {
        title: string, 
        slug: string,
        content: Document,
        excerpt: string, 
        coverImage: Asset, 
        date: EntryFields.Date, 
        author: IPerson,
        showIn: string[] 
    }
} & IBaseEntry

export type IEntry =
    | IAuthor
    | ICity
    | IImageWithFocalPoint
    | IPerson
    | IPost
    | IStreet;

