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
    const [slideIndex, setSlideIndex] = React.useState(0);
    return (
        <>
            {slides.map((slide, index) => (
                <button
                    type="button"
                    className={`space-y-4 cursor-pointer text-left w-full ${index % 2 === 1 ? 'mt-12 md:mt-24' : ''}`}
                    key={slide.id}
                    onClick={() => { setSlideIndex(index); setOpen(true); }}
                    aria-label={`View ${slide.title} in gallery`}
                >
                    <Image
                        alt={slide.title}
                        className="w-full aspect-square object-cover hover:opacity-90 transition-opacity"
                        src={normalizeContentfulImageUrl(slide.src)}
                        width={400}
                        height={400}
                        sizes="(max-width: 768px) 100vw, 40vw"
                    />
                    <div className="pt-4 border-t border-outline-variant/20">
                        <p className="font-headline italic text-sm">
                            {slide.title}
                        </p>
                        {slide.source && (
                            <span className="text-xs text-on-surface/50 mt-1 block">
                                Source: {slide.source}
                            </span>
                        )}
                    </div>
                </button>
            ))}

            <Lightbox
                open={open}
                index={slideIndex}
                plugins={[Captions]}
                close={() => setOpen(false)}
                slides={slides.map(s => ({ ...s, src: normalizeContentfulImageUrl(s.src) }))}
            />
        </>);
}
