import { nodes as basicNodes, marks } from 'ngx-editor';
import { Schema } from 'prosemirror-model';
import { node as codeMirrorNode } from 'prosemirror-codemirror-6';
import { schema } from 'ngx-editor';

const footnoteNode: any = {
  content: 'inline*',
  group: 'inline',
  inline: true,
  defining: true,
  attrs: {
    id: {default: ''},
  },
  parseDOM: [{
    tag: 'footnote[data-id]',
    getAttrs: (dom: Element) => ({
      id: dom.getAttribute('data-id'),
    }),
  }],
  toDOM: (node: { attrs: { id: any; }; }) => ['footnote', { 'data-id': node.attrs.id }, 0],
};

const extendedSchema = new Schema({
  nodes: schema.spec.nodes.append({ footnote: footnoteNode, code_mirror: codeMirrorNode, }),
  marks,
});

export default extendedSchema;