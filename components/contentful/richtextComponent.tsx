//
// renders contentful richtext field
//
// Also see https://www.npmjs.com/package/@contentful/rich-text-react-renderer
//
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, Document, Node } from '@contentful/rich-text-types'
import markdownStyles from './markdown-styles.module.css'

/*
const customMarkdownOptions = (content: Document) => ({
    renderNode: {
        [BLOCKS.EMBEDDED_ASSET]: (node: Node) => (
            <RichTextAsset
                id={node.data.target.sys.id}
                assets={content.links.assets.block}
            />
        ),
    },
}) */

type RichtextProps = {
    content: Document | undefined
}

export function RichtextComponent(props: RichtextProps) {

    if (props.content) {
        return (
            <div className={markdownStyles['markdown']}>
                {documentToReactComponents(
                    props.content,
                    // customMarkdownOptions(props.content)
                )}
            </div>
        )
    } else {
        return <></>;
    }
}
