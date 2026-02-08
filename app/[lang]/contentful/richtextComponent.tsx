//
// renders contentful richtext field
//
// Also see https://www.npmjs.com/package/@contentful/rich-text-react-renderer
//
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer'
import { BLOCKS, INLINES, MARKS, Document, Block, Inline } from '@contentful/rich-text-types'
import markdownStyles from './richtextComponent.module.css'
import React, { ReactNode } from 'react';
import { SmallCard } from '../cards/smallCard'
import { NaturalImageComponent } from './imageComponent';
import { log } from 'next-axiom'
import Link from 'next/link'
import { IImageWithFocalPoint } from '../../../lib/contentmodel/wrappertypes';

function getContentTypeId(target: any): string | undefined {
    return target?.sys?.contentType?.sys?.id;
}

function renderLink(target: any, children: ReactNode, locale: string) {
    const typeId = getContentTypeId(target);
    if (typeId === "street") {
        return <Link href={`/${locale}/streets/${target.fields.slug}`} className="text-accent underline">{children ?? target.fields.germanName}</Link>
    } else if (typeId === "post") {
        return <Link href={`/${locale}/posts/${target.fields.slug}`} className="text-accent underline">{children ?? target.fields.title}</Link>
    } else {
        log.warn(`Refusing to render a link to type ${typeId}`);
        return <span>{children}</span>;
    }
}

function getEntryImageUrl(target: any): string {
    const coverImage = target?.fields?.coverImage ?? target?.fields?.media?.[0]?.fields?.image;
    if (coverImage?.fields?.file?.url) {
        const url = coverImage.fields.file.url as string;
        return url.startsWith('//') ? `https:${url}` : url;
    }
    return '';
}

export function renderEmbeddedEntry(node: Block | Inline, children: any, locale: string) {
    const target = node.data?.target;
    if (!target) return null;

    const typeId = getContentTypeId(target);

    if (typeId === "street") {
        return (
            <SmallCard
                headline={target.fields.germanName}
                excerpt={target.fields.polishNames}
                targetLink={`/${locale}/streets/${target.fields.slug}`}
                imageUrl={getEntryImageUrl(target)}
            />
        );
    }
    if (typeId === "post") {
        return (
            <SmallCard
                headline={target.fields.title}
                excerpt={target.fields.excerpt}
                targetLink={`/${locale}/posts/${target.fields.slug}`}
                imageUrl={getEntryImageUrl(target)}
            />
        );
    }
    return null;
}

export function renderEmbeddedAsset(node: Block | Inline, children: any, locale: string) {
    const target = node.data?.target;
    if (!target?.fields?.file) return null;

    return (
        <div className="mx-6 ml-12 mt-6 mb-6 flex-shrink-0 overflow-hidden">
            <Link className="example-image-link" href={target.fields.file.url} data-lightbox="street-pics" data-title={`${target.fields.title}, ${target.fields.description ?? "-"}`}>
                <NaturalImageComponent image={target} layout={'responsive'} objectFit={'scale-down'} className="w-full h-full rounded shadow-sm min-h-48 dark:bg-gray-500" />
                <div className="text-xs ml-1">{target.fields.title}{target.fields.source && <>, source: {target.fields.source}</>}</div>
            </Link>
        </div>
    );
}

export function renderImageWithFocalPoint(image: IImageWithFocalPoint) {
    let size = 72;
    if (image.fields.embeddedSize === "medium") {
        size = 144;
    } else if (image.fields.embeddedSize === "large") {
        size = 288;
    }

    let align = "float-none"
    if (image.fields.embeddedAlign === "left") {
        align = "float-left"
    } else if (image.fields.embeddedAlign === "right") {
        align = "float-right"
    }

    return (
        <NaturalImageComponent image={image.fields.image} width={size} height={size} layout={'responsive'} objectFit={'scale-down'} className={`${align} rounded mx-2 shadow-sm dark:bg-gray-500`} />
    );
}


export function renderInlineEntry(node: Block | Inline, children: any, locale: string) {
    const target = node.data?.target;
    if (!target) return null;

    const typeId = getContentTypeId(target);

    if (typeId === "street") {
        return (
            <span className="border-l-4 border-y border-r text-l rounded-md border-accent px-4">
                <Link href={`/${locale}/streets/${target.fields.slug}`} className="text-accent underline">{target.fields.germanName}</Link>
            </span>
        );
    }
    if (typeId === "post") {
        return (
            <span className="border-l-4 border-y border-r text-l rounded-md border-accent px-4">
                <Link href={`/${locale}/posts/${target.fields.slug}`} className="text-accent underline">{target.fields.title}</Link>
            </span>
        );
    }
    if (typeId === "imageWithFocalPoint") {
        return renderImageWithFocalPoint(target);
    }
    return null;
}

class MyOptions implements Options {
    locale: string;

    constructor(locale: string) {
        this.locale = locale;
    }

    renderText = (text: string): ReactNode => {
        return text.split('\n').reduce((acc: ReactNode[], part, i) => {
            if (i > 0) acc.push(<br key={`br-${i}`} />);
            acc.push(part);
            return acc;
        }, []);
    }

    renderMark = {
        [MARKS.BOLD]: (text: ReactNode) => <strong>{text}</strong>,
        [MARKS.CODE]: (text: ReactNode) => <code className="bg-gray-100 dark:bg-slate-800 text-accent px-1.5 py-0.5 rounded text-sm font-mono">{text}</code>,
        [MARKS.ITALIC]: (text: ReactNode) => <em>{text}</em>,
        [MARKS.UNDERLINE]: (text: ReactNode) => <u>{text}</u>,
    }

    renderNode = {
        [BLOCKS.EMBEDDED_ENTRY]: (node: Block | Inline, children: any) => (
            renderEmbeddedEntry(node, children, this.locale)
        ),
        [BLOCKS.EMBEDDED_ASSET]: (node: Block | Inline, children: any) => (
            renderEmbeddedAsset(node, children, this.locale)
        ),
        [BLOCKS.PARAGRAPH]: (node: Block | Inline, children: ReactNode) => (
            <p className="py-2">{children}</p>
        ),
        ["embedded-entry-inline"]: (node: Block | Inline, children: any) => (
            renderInlineEntry(node, children, this.locale)
        ),
        [BLOCKS.QUOTE]: (node: Block | Inline, children: ReactNode) => (
            <blockquote className="text-l mx-8 italic font-semibold text-gray-900 dark:text-white">
                <svg aria-hidden="true" className="w-10 h-10 text-gray-400 dark:text-gray-600" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" fill="currentColor" /></svg>
                <div>{children}</div>
            </blockquote>),
        [BLOCKS.UL_LIST]: (node: Block | Inline, children: ReactNode) => (
            <ul className="mx-8 py-2 list-disc">{children}</ul>
        ),
        [BLOCKS.OL_LIST]: (node: Block | Inline, children: ReactNode) => (
            <ol className="mx-8 py-2 list-decimal">{children}</ol>
        ),
        [BLOCKS.HEADING_1]: (node: Block | Inline, children: ReactNode) => (
            <h1 className="text-5xl mx-0 font-extrabold text-accent">{children}</h1>
        ),
        [BLOCKS.HEADING_2]: (node: Block | Inline, children: ReactNode) => (
            <h2 className="text-4xl font-bold dark:text-white my-2">{children}</h2>
        ),
        [BLOCKS.HEADING_3]: (node: Block | Inline, children: ReactNode) => (
            <h3 className="text-3xl font-bold dark:text-white">{children}</h3>
        ),
        [BLOCKS.HEADING_4]: (node: Block | Inline, children: ReactNode) => (
            <h4 className="text-2xl font-bold dark:text-white">{children}</h4>
        ),
        [BLOCKS.HEADING_5]: (node: Block | Inline, children: ReactNode) => (
            <h5 className="text-xl font-bold dark:text-white">{children}</h5>
        ),
        [BLOCKS.HEADING_6]: (node: Block | Inline, children: ReactNode) => (
            <h6 className="text-lg font-bold dark:text-white">{children}</h6>
        ),
        [BLOCKS.HR]: (node: Block | Inline, children: ReactNode) => (
            <hr className="mx-6 text-lg font-bold border-accent py-4 dark:text-white" />
        ),
        [INLINES.HYPERLINK]: (node: Block | Inline, children: ReactNode) => (
            <a href={node.data.uri} target="_blank" rel="noopener noreferrer" className="text-accent underline">{children}</a>
        ),
        [INLINES.ENTRY_HYPERLINK]: (node: Block | Inline, children: ReactNode) => (
            renderLink(node.data?.target, children, this.locale)
        ),
        [INLINES.ASSET_HYPERLINK]: (node: Block | Inline, children: ReactNode) => {
            const url = node.data?.target?.fields?.file?.url;
            if (!url) return <span>{children}</span>;
            const href = (url as string).startsWith('//') ? `https:${url}` : url;
            return <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent underline">{children}</a>;
        },
        // tables
        [BLOCKS.TABLE]: (node: Block | Inline, children: ReactNode) => (
            <table className="table-auto m-4"><tbody>{children}</tbody></table>
        ),
        [BLOCKS.TABLE_ROW]: (node: Block | Inline, children: ReactNode) => (
            <tr>{children}</tr>
        ),
        [BLOCKS.TABLE_HEADER_CELL]: (node: Block | Inline, children: ReactNode) => (
            <th className="bg-slate-200 dark:bg-slate-900 border p-2">{children}</th>
        ),
        [BLOCKS.TABLE_CELL]: (node: Block | Inline, children: ReactNode) => (
            <td className="border p-2">{children}</td>
        ),
    }

}

export type RichtextProps = {
    content: Document | undefined,
    locale: string
}

export function RichtextComponent(props: RichtextProps) {
    const options = new MyOptions(props.locale);
    if (props.content) {
        return (
            <div className={markdownStyles['markdown']}>
                {documentToReactComponents(
                    props.content, options
                )}
            </div>
        )
    } else {
        return <></>;
    }
}
