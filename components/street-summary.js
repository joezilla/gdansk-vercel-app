import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS } from '@contentful/rich-text-types'
import markdownStyles from './markdown-styles.module.css'
import RichTextAsset from './rich-text-asset'

const customMarkdownOptions = (content) => ({
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node) => (
      <RichTextAsset
        id={node.data.target.sys.id}
        assets={content.links.assets.block}
      />
    ),
  },
})

export default function StreetSummary({ content }) {
  return (
    <div className="max-w-2xl mx-auto">
        <table>
            <tr><td>German Name</td><td>{content.germanName}</td></tr>
            <tr><td>Polish Name</td><td>{content.polishNames}</td></tr>
            <tr><td>ID</td><td> {content.sys.id} </td></tr>

        </table>
       <br />
     
      
    </div>
  )
}
