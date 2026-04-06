'use client';

import * as React from "react";
import Image from "next/image";
import { normalizeContentfulImageUrl } from "../../../lib/imageUrl";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/captions.css";


type LightboxProps = {
    src: string,
    title: string,
    source: string,
    description: string,
    id: string
}


export default function Lightbox2({ slides }: { slides: LightboxProps[] }) {
    const [open, setOpen] = React.useState(false);
    return (
        <>
            {slides.map((slide) => (
                <div className="mb-4" key={slide.id} onClick={() => setOpen(true)}>
                    <Image alt={slide.title} key={slide.id} className="w-full h-full rounded shadow-sm min-h-48 dark:bg-gray-500 aspect-square object-cover" src={normalizeContentfulImageUrl(slide.src)} width={400} height={400} sizes="(max-width: 768px) 50vw, 25vw" />
                    <span className="text-xs">Source: {slide.source}</span>
                </div>
            ))}

            <Lightbox
                open={open}
                plugins={[Captions]}
                close={() => setOpen(false)}
                slides={slides.map(s => ({ ...s, src: normalizeContentfulImageUrl(s.src) }))}
            />
        </>);
}