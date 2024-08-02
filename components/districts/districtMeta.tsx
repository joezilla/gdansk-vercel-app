import { createDistrictURL } from "../../lib/urlutil";
import Head from "next/head";
import { isEmptyString } from "../../lib/util";
import { IDistrict } from "../../lib/contentmodel/wrappertypes";

type DistrictMetaProps = {
    district: IDistrict,
    locale: string
}

export function DistrictMeta(props: DistrictMetaProps) {
    console.log(props);
    let name = props.district?.fields?.name;
    let slug = props.district?.fields?.slug;
    let image = "";
    // if (props.post.fields.coverImage) {
    //     image = props.post.fields?.coverImage?.fields?.file?.url as string ?? "";
    // }
    return (
        <Head>
            <title>{`The Streets of Danzig: ${name}`}</title>
            <meta name="description" content={`Danzig | Streets | ${name}.`} />
            <meta property="og:url" content={`${process.env.SOD_BASE_URL}${createDistrictURL(slug)}`} />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={`The Streets of Danzig: District: ${name}`} />
            <meta property="og:description" content={`Overview of the ${name} part of Danzig`} />
            {isEmptyString(image) ?
                <meta property="og:image" content="https://www.streetsofdanzig.com/images/site-screenshot.png" />
                :
                <meta property="og:image" content={image} />
            }
            <meta name="twitter:card" content="summary_large_image" />
            <meta property="twitter:domain" content={process.env.SOD_BASE_URL} />
            <meta property="twitter:url" content={`${process.env.SOD_BASE_URL}${createDistrictURL(slug)}`} />
            <meta name="twitter:title" content={`The Districts of the Streets of Danzig: ${name}`} />
            <meta name="twitter:description" content="Danzig | Streets, People, History." />
            {isEmptyString(image) ?
                <meta name="twitter:image" content="https://www.streetsofdanzig.com/images/site-screenshot.png" />
                :
                <meta name="twitter:image" content={image} />

            }
        </Head>
    );
}