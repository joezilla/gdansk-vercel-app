import { IPost } from "../../src/@types/contentful"
import { createPostURL } from "../../lib/urlutil";
import { Head } from "next/document";

type PostMetaProps = {
    post: IPost
}

export function PostMeta(props: PostMetaProps) {
    let name = props.post.fields.title;
    let image = "";
    if (props.post.fields.coverImage) {
        image = props.post.fields.coverImage.fields?.file?.url ?? "";
    }
    return (
        <Head>
            <title>{`The Streets of Danzig: ${name}`}</title>
            <meta name="description" content={`Danzig | Streets | ${name}.`} />
            <meta property="og:url" content={`${process.env.SOD_BASE_URL}${createPostURL(name)}`} />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={`The Streets of Danzig: ${name}`} />
            <meta property="og:description" content={props.post.fields.excerpt} />
            {image ?
                <meta property="og:image" content={image} />
                :
                <meta property="og:image" content="https://www.streetsofdanzig.com/images/site-screenshot.png" />
            }
            <meta name="twitter:card" content="summary_large_image" />
            <meta property="twitter:domain" content={process.env.SOD_BASE_URL} />
            <meta property="twitter:url" content={`${process.env.SOD_BASE_URL}${createPostURL(name)}`} />
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