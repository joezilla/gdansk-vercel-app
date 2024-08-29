'use client';

import * as React from "react";
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
                    <img alt={slide.title} key={slide.id} className="w-full h-full rounded shadow-sm min-h-48 dark:bg-gray-500 aspect-square" src={slide.src} />
                    <span className="text-xs">Source: {slide.source}</span>
                </div>
            ))}

            <Lightbox
                open={open}
                plugins={[Captions]}
                close={() => setOpen(false)}
                slides={slides}
            />
        </>);
}