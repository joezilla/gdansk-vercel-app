//
// renders contentful richtext field
//
// Also see https://www.npmjs.com/package/@contentful/rich-text-react-renderer
//
import { documentToReactComponents, Options, RenderText } from '@contentful/rich-text-react-renderer'
import { BLOCKS, MARKS, Document, Node, Block, Inline } from '@contentful/rich-text-types'
import markdownStyles from './richtextComponent.module.css'
import { ReactNode } from 'react';
import { SmallCard } from '../cards/smallCard'
import { ImageComponent, NaturalImageComponent } from './imageComponent';
import { log } from 'next-axiom'
import { unwatchFile } from 'fs';
import Link from 'next/link'
import { IImageWithFocalPoint } from '../../../lib/contentmodel/wrappertypes';

function renderLink(target: any, locale: string) {
    if (target.sys?.contentType?.sys?.id === "street") {
        return <Link locale={locale} href={`/streets/${target.fields.slug}`} className="text-accent underline">{target.fields.germanName}</Link>
    } else if (target.sys?.contentType?.sys?.id === "post") {
        return <Link locale={locale} href={`/posts/${target.fields.slug}`} className="text-accent underline">{target.fields.title}</Link>
    } else {
        log.warn("Refusing to render a link to type ", target.sys?.contentType?.sys?.id);
    }

}

export function renderEmbeddedEntry(node: Block | Inline, children: any, locale: string) {
    const { data } = node;

    return (
        <>
            {node.data.target.sys.contentType.sys.id === "street" &&
                <SmallCard
                    headline={node.data.target.fields.germanName}
                    excerpt={node.data.target.fields.polishNames}
                    targetLink={`/streets/${node.data.target.fields.slug}`}
                    imageUrl="https://source.unsplash.com/100x100/?portrait?1"
                />
            }
            {node.data.target.sys.contentType.sys.id === "post" &&
                <SmallCard
                    headline={node.data.target.fields.headline}
                    excerpt={node.data.target.fields.excerpt}
                    targetLink={`/posts/${node.data.target.fields.slug}`}
                    imageUrl="https://source.unsplash.com/100x100/?portrait?1"

                />
            }
        </>
    );
}

export function renderEmbeddedAsset(node: Block | Inline, children: any, locale: string) {
    const { data } = node;
    if (data.target) {
        return (
            <div className="mx-6 ml-12 mt-6 mb-6 flex-shrink-0 overflow-hidden">
                <Link locale={locale} className="example-image-link" href={data.target.fields.file.url} data-lightbox="street-pics" data-title={`${data.target.fields.title}, ${data.target.fields.description ?? "-"}`}>
                    <NaturalImageComponent image={data.target} layout={'responsive'} objectFit={'scale-down'} className="w-full h-full rounded shadow-sm min-h-48 dark:bg-gray-500" />
                    <div className="text-xs ml-1">{data.target.fields.title}{data.target.fields.source && <>, source: {data.target.fields.source}</>}</div>
                </Link> </div>
        );
    }
    else {
        return (<></>)
    }
}

export function renderImageWithFocalPoint(image: IImageWithFocalPoint) {
    // embeddedAlign: left, right, center
    // embeddedSize : small, medium, large
    let size = 72;
    if (image.fields.embeddedSize === "medium") {
        size = 144;
    } else if (image.fields.embeddedSize === "large") {
        size = 288;
    }
    // embeddedAlign: left, right, center
    let align = "float-none"
    if (image.fields.embeddedAlign === "left") {
        align = "float-left"
    } else if (image.fields.embeddedAlign === "right") {
        align = "float-right"
    }

    return (
        <>
            <NaturalImageComponent image={image.fields.image} width={size} height={size} layout={'responsive'} objectFit={'scale-down'} className={`${align} rounded mx-2 shadow-sm dark:bg-gray-500`} />
        </>
    );
}


export function renderInlineEntry(node: Block | Inline, children: any, locale: string) {
    const { data } = node;
    return (
        <>
            {
                node.data.target.sys.contentType.sys.id === "street" &&
                <span className="border-l-4 border-y border-r text-l rounded-md border-accent px-4">
                    <Link locale={locale} href={`/streets/${node.data.target.fields.slug}`} className="text-accent underline">{node.data.target.fields.germanName}</Link>
                </span>
            }
            {
                node.data.target.sys.contentType.sys.id === "post" &&
                <span className="border-l-4 border-y border-r text-l rounded-md border-accent px-4">
                    <Link locale={locale} href={`/posts/${node.data.target.fields.slug}`} className="text-accent underline">{node.data.target.fields.title}</Link>
                </span>
            }
            {
                node.data.target.sys.contentType.sys.id === "imageWithFocalPoint" &&
                renderImageWithFocalPoint(node.data.target)
            }
        </>
    );
}

class MyOptions implements Options {
    locale: string;

    constructor(locale: string) {
        this.locale = locale;
    }


    renderText(text: string) {
        return <>{text}</>;
    }

    renderMark = {
        [MARKS.BOLD]: (text: ReactNode) => <strong>{text}</strong>,
        [MARKS.CODE]: (text: ReactNode) => <code className="border-l-4 text-l rounded-md border-accent mx-8 p-4  bg-mybg-300 text-mytxt-900 dark:text-mytxt-100 dark:bg-slate-900">{text}</code>,
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
            <p className="py-1">{children}</p>
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
            <ol className="mx-8 py- list-decimal">{children}</ol>
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
        ["entry-hyperlink"]: (node: Block | Inline, children: ReactNode) => (
            renderLink(node.data.target, this.locale)
        ),
        /// tables
        [BLOCKS.TABLE]: (node: Block | Inline, children: ReactNode) => (
            <table className="table-auto m-4"><tbody>{children}</tbody></table>
        ),
        [BLOCKS.TABLE_HEADER_CELL]: (node: Block | Inline, children: ReactNode) => (
            <th className="bg-slate-200 dark:bg-slate-900 border">{children}</th>
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
    let options = new MyOptions(props.locale);
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
