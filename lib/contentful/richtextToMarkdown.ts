import { Document, BLOCKS, MARKS, Node, Block, Inline, Text, Mark } from '@contentful/rich-text-types';
// Required for markdown parsing
// Install with: npm install unified remark-parse
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { Root } from 'mdast';

export function richtextToMarkdown(document: Document): string {
    if (!document || !document.content) {
        return '';
    }

    function processNode(node: Node, depth: number = 0, orderedIndex?: number): string {
        switch (node.nodeType) {
            case 'text': {
                const textNode = node as Text;
                let text = textNode.value;
                if (textNode.marks) {
                    textNode.marks.forEach((mark: Mark) => {
                        switch (mark.type) {
                            case MARKS.BOLD:
                                text = `**${text}**`;
                                break;
                            case MARKS.ITALIC:
                                text = `*${text}*`;
                                break;
                            case MARKS.CODE:
                                text = `\`${text}\``;
                                break;
                            case MARKS.UNDERLINE:
                                text = `<u>${text}</u>`;
                                break;
                        }
                    });
                }
                return text;
            }

            case BLOCKS.PARAGRAPH: {
                const block = node as Block;
                return block.content ? block.content.map(c => processNode(c, depth)).join('') + '\n\n' : '\n\n';
            }

            case BLOCKS.HEADING_1: {
                const block = node as Block;
                return '# ' + block.content.map(c => processNode(c, depth)).join('') + '\n\n';
            }

            case BLOCKS.HEADING_2: {
                const block = node as Block;
                return '## ' + block.content.map(c => processNode(c, depth)).join('') + '\n\n';
            }

            case BLOCKS.HEADING_3: {
                const block = node as Block;
                return '### ' + block.content.map(c => processNode(c, depth)).join('') + '\n\n';
            }

            case BLOCKS.HEADING_4: {
                const block = node as Block;
                return '#### ' + block.content.map(c => processNode(c, depth)).join('') + '\n\n';
            }

            case BLOCKS.HEADING_5: {
                const block = node as Block;
                return '##### ' + block.content.map(c => processNode(c, depth)).join('') + '\n\n';
            }

            case BLOCKS.HEADING_6: {
                const block = node as Block;
                return '###### ' + block.content.map(c => processNode(c, depth)).join('') + '\n\n';
            }

            case BLOCKS.UL_LIST: {
                const block = node as Block;
                return block.content ? block.content.map(c => processNode(c, depth)).join('') + '\n' : '';
            }

            case BLOCKS.OL_LIST: {
                const block = node as Block;
                if (!block.content) return '';
                return block.content.map((c, i) => processNode(c, depth, i + 1)).join('') + '\n';
            }

            case BLOCKS.LIST_ITEM: {
                const block = node as Block;
                const indent = '  '.repeat(depth);
                const marker = orderedIndex !== undefined ? `${orderedIndex}. ` : '- ';
                const content = block.content.map(child => {
                    if (child.nodeType === BLOCKS.UL_LIST || child.nodeType === BLOCKS.OL_LIST) {
                        return processNode(child, depth + 1);
                    }
                    if (child.nodeType === BLOCKS.PARAGRAPH) {
                        const para = child as Block;
                        return para.content ? para.content.map(c => processNode(c, depth)).join('') : '';
                    }
                    return processNode(child, depth);
                }).join('');
                return indent + marker + content + '\n';
            }

            case BLOCKS.QUOTE: {
                const block = node as Block;
                const inner = block.content ? block.content.map(c => processNode(c, depth)).join('') : '';
                return inner.split('\n').filter(l => l.length > 0).map(line => `> ${line}`).join('\n') + '\n\n';
            }

            case BLOCKS.HR:
                return '---\n\n';

            case BLOCKS.EMBEDDED_ASSET: {
                const block = node as Block;
                const asset = block.data.target;
                if (asset?.fields?.file?.url) {
                    return `![${asset.fields.title || ''}](${asset.fields.file.url})\n\n`;
                }
                return '';
            }

            case BLOCKS.EMBEDDED_ENTRY: {
                const block = node as Block;
                const entry = block.data.target;
                if (entry?.fields?.title) {
                    return `**[${entry.fields.title}]**\n\n`;
                }
                return '';
            }

            case 'hyperlink': {
                const inline = node as Inline;
                const url = inline.data.uri;
                const text = inline.content.map(c => processNode(c, depth)).join('');
                return `[${text}](${url})`;
            }

            default: {
                const block = node as Block;
                return block.content ? block.content.map(c => processNode(c, depth)).join('') : '';
            }
        }
    }

    const markdown = document.content.map(c => processNode(c)).join('');
    return markdown.trim();
}

/**
 * Converts a Markdown string to a Contentful Rich Text Document object.
 * @param markdown Markdown string
 * @returns Contentful Rich Text Document
 */
export function markdownToRichtext(markdown: string): Document {
  // Parse markdown to mdast
  let ast: Root;
  try {
    ast = unified().use(remarkParse).parse(markdown);
  } catch (err) {
    throw new Error('Failed to parse markdown. Make sure unified and remark-parse are installed.');
  }

  // Helper to map mdast nodes to Contentful Rich Text nodes
  function mdastToRichText(node: any, parentMarks: Array<{ type: string }> = []): any {
    switch (node.type) {
      case 'root':
        return {
          nodeType: 'document',
          data: {},
          content: node.children.map((c: any) => mdastToRichText(c)).flat(),
        };
      case 'paragraph':
        return {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: node.children.map((c: any) => mdastToRichText(c, parentMarks)).flat(),
        };
      case 'heading': {
        const blockMap = {
          1: BLOCKS.HEADING_1,
          2: BLOCKS.HEADING_2,
          3: BLOCKS.HEADING_3,
          4: BLOCKS.HEADING_4,
          5: BLOCKS.HEADING_5,
          6: BLOCKS.HEADING_6,
        };
        const headingType = blockMap[node.depth as keyof typeof blockMap] || BLOCKS.HEADING_1;
        return {
          nodeType: headingType,
          data: {},
          content: node.children.map((c: any) => mdastToRichText(c, parentMarks)).flat(),
        };
      }
      case 'list':
        return {
          nodeType: node.ordered ? BLOCKS.OL_LIST : BLOCKS.UL_LIST,
          data: {},
          content: node.children.map((c: any) => mdastToRichText(c)).flat(),
        };
      case 'listItem':
        return {
          nodeType: BLOCKS.LIST_ITEM,
          data: {},
          content: node.children.map((c: any) => mdastToRichText(c)).flat(),
        };
      case 'blockquote':
        return {
          nodeType: BLOCKS.QUOTE,
          data: {},
          content: node.children.map((c: any) => mdastToRichText(c)).flat(),
        };
      case 'thematicBreak':
        return {
          nodeType: BLOCKS.HR,
          data: {},
          content: [],
        };
      case 'link':
        return {
          nodeType: 'hyperlink',
          data: { uri: node.url },
          content: node.children.map((c: any) => mdastToRichText(c, parentMarks)).flat(),
        };
      case 'image':
        return {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [{
            nodeType: 'text',
            value: node.alt || node.url || '',
            marks: [],
            data: {},
          }],
        };
      case 'strong':
        return node.children.map((child: any) => {
          return mdastToRichText(child, [...parentMarks, { type: MARKS.BOLD }]);
        }).flat();
      case 'emphasis':
        return node.children.map((child: any) => {
          return mdastToRichText(child, [...parentMarks, { type: MARKS.ITALIC }]);
        }).flat();
      case 'inlineCode':
        return {
          nodeType: 'text',
          value: node.value,
          marks: [...parentMarks, { type: MARKS.CODE }],
          data: {},
        };
      case 'code':
        return {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [{
            nodeType: 'text',
            value: node.value,
            marks: [{ type: MARKS.CODE }],
            data: {},
          }],
        };
      case 'text':
        return {
          nodeType: 'text',
          value: node.value,
          marks: [...parentMarks],
          data: {},
        };
      case 'break':
        return {
          nodeType: 'text',
          value: '\n',
          marks: [...parentMarks],
          data: {},
        };
      default:
        return [];
    }
  }

  const richDoc = mdastToRichText(ast);
  // Ensure top-level is a Document object
  return richDoc as Document;
}
