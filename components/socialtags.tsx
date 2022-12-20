
type SocialTagsProps = {
    title: string,
    description: string,
    imageUrl?: string;
}

export function DefaultSocialTags(props: SocialTagsProps) {
    return (
        <>
            <title>{`The Streets of Danzig: ${name}`}</title>
            <meta name="description" content={`Danzig | Streets | People.`} />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={props.title} />
            <meta property="og:description" content={props.description} />
            <meta property="og:image" content="https://www.streetsofdanzig.com/images/site-screenshot.png" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta property="twitter:domain" content={process.env.SOD_BASE_URL} />
            <meta name="twitter:title" content={props.title} />
            <meta name="twitter:description" content="Danzig | Streets, People, History." />
            <meta name="twitter:image" content="https://www.streetsofdanzig.com/images/site-screenshot.png" />
        </>
    );
}