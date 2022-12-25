/**
 * Metatags for streets.
 */
import { IStreet } from "../../src/@types/contentful"
import { createStreetURL, slugify } from "../../lib/urlutil";
import Head from 'next/head'

type StreetMetaProps = {
    street: IStreet
}

export function StreetMeta(props: StreetMetaProps) {
    let name = props.street.fields.germanName;
    let slug = props.street.fields.slug ?? slugify(name);
    let image = "";
    if (props.street.fields.media && props.street.fields.media.length > 0) {
        image = props.street.fields.media[0].fields?.image?.fields?.file?.url ?? "";
    }
    let polishName = props.street.fields.polishNames && props.street.fields.polishNames.length
        > 0 ? props.street.fields.polishNames[0] : "";
    return (
            <Head>
                <title>{`The Streets of Danzig: ${name}`}</title>
                <meta name="description" content={`${name} is the German name of ${polishName}, a street in Gdansk, Poland, formerly Danzig.`} />
                <meta property="og:url" content={`${process.env.SOD_BASE_URL}${createStreetURL(slug)}`} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`The Streets of Danzig: ${name}`} />
                <meta property="og:description" content="Danzig | Streets, People, History." />
                {image ?
                    <meta property="og:image" content={image} />
                    :
                    <meta property="og:image" content="https://www.streetsofdanzig.com/images/site-screenshot.png" />
                }
                <meta name="twitter:card" content="summary_large_image" />
                <meta property="twitter:domain" content={process.env.SOD_BASE_URL} />
                <meta property="twitter:url" content={`${process.env.SOD_BASE_URL}${createStreetURL(slug)}`} />
                <meta name="twitter:title" content={`The Streets of Danzig: ${name}`} />
                <meta name="twitter:description" content="Danzig | Streets, People, History." />
                {image ?
                    <meta name="twitter:image" content={image} />
                    :
                    <meta name="twitter:image" content="https://www.streetsofdanzig.com/images/site-screenshot.png" />
                }
            </Head>
    );
}