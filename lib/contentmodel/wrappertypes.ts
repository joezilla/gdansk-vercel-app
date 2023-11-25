//
// Typescript content model wrappers. 
// 
// Hand-coded becase non of the generator librabries appear to be maintained anymore.
// 
import * as contentful from 'contentful'
import { Asset } from 'contentful'
import { Metadata } from 'contentful'
import { EntitySys } from 'contentful';
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
        image: Asset // contentful.EntryFieldTypes.AssetLink
    }
} & IBaseEntry

export type IImageWithFocalPoint = {
    contentTypeId: 'imageWithFocalPoint'
    fields: {
        title: string, //contentful.EntryFieldTypes.Text,
        image: Asset, // contentful.EntryFieldTypes.AssetLink,
        focalPoint: contentful.EntryFieldTypes.Object,
        location: EntryFields.Location, //contentful.EntryFieldTypes.Location,
        dateTaken: EntryFields.Date, // string, // contentful.EntryFieldTypes.Date,
        source: string, // contentful.EntryFieldTypes.Text,
        sourceUrl: string, // contentful.EntryFieldTypes.Text,
        aiTags: string[], // contentful.EntryFieldTypes.Array<contentful.EntryFieldTypes.Symbol>,
        alignment: string[], //contentful.EntryFieldTypes.Array<contentful.EntryFieldTypes.Symbol>,
        float: string[], //contentful.EntryFieldTypes.Array<contentful.EntryFieldTypes.Symbol>,
        embbedSize: string[], //contentful.EntryFieldTypes.Array<contentful.EntryFieldTypes.Symbol>,
    }
} & IBaseEntry

export type IPerson = {
    contentTypeId: 'person',
    fields: {
        name: string, // contentful.EntryFieldTypes.Text,
        birthDate: EntryFields.Date, // contentful.EntryFieldTypes.Date,
        slug: string, //contentful.EntryFieldTypes.Text,
        bornIn: ICity /* contentful.EntryFieldTypes.Array<
            contentful.EntryFieldTypes.EntryLink<ICity>
        >, */
        diedIn: ICity, /* contentful.EntryFieldTypes.Array<
            contentful.EntryFieldTypes.EntryLink<ICity>
        >, */
        deathDate: EntryFields.Date, // contentful.EntryFieldTypes.Date,
        description: Document, // contentful.EntryFieldTypes.RichText,
        pictures: IImageWithFocalPoint[], /*contentful.EntryFieldTypes.Array<
            contentful.EntryFieldTypes.EntryLink<IImageWithFocalPoint>
        >, */
        livedAt: IStreet[], /*contentful.EntryFieldTypes.Array<
            contentful.EntryFieldTypes.EntryLink<IStreet>
        >,*/
    }
} & IBaseEntry

export type ICity = {
    contentTypeId: 'city',
    fields: {
        name: string, //contentful.EntryFieldTypes.Text,
    }
} & IBaseEntry

export type IStreet = {
    contentTypeId: 'street'
    fields: {
        germanName: string, // contentful.EntryFieldTypes.Text,
        slug: string, // contentful.EntryFieldTypes.Text,
        polishNames: string[], // contentful.EntryFieldTypes.Array<contentful.EntryFieldTypes.Symbol>,
        district: string, // contentful.EntryFieldTypes.Text,
        previousNames: string, // contentful.EntryFieldTypes.Text,
        history: Document, // contentful.EntryFieldTypes.RichText,
        source: string, // contentful.EntryFieldTypes.Text,
        city: ICity,  /*contentful.EntryFieldTypes.Array<
            contentful.EntryFieldTypes.EntryLink<ICity>
        >, */
        media: IImageWithFocalPoint[], /* contentful.EntryFieldTypes.Array<
            contentful.EntryFieldTypes.EntryLink<IImageWithFocalPoint>
        >, */
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
        title: string, //contentful.EntryFieldTypes.Text,
        slug: string, //contentful.EntryFieldTypes.Text,
        content: Document, // contentful.EntryFieldTypes.RichText,
        excerpt: string, //contentful.EntryFieldTypes.Text,
        coverImage: Asset, // contentful.EntryFieldTypes.AssetLink,
        date: EntryFields.Date, // contentful.EntryFieldTypes.Date,
        author: IPerson, // contentful.EntryFieldTypes.EntryLink<IPerson>,
        showIn: string[] // contentful.EntryFieldTypes.Array<contentful.EntryFieldTypes.Symbol>
    }
} & IBaseEntry

export type IEntry =
    | IAuthor
    | ICity
    | IImageWithFocalPoint
    | IPerson
    | IPost
    | IStreet;

