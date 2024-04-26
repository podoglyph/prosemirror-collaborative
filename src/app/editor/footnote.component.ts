import { Component, Input } from '@angular/core';
import { Editor } from 'ngx-editor';

@Component({
  selector: 'app-footnote',
  template: `
    <button (click)="addFootnote()">Add Footnote</button>
  `,
  styles: [':host {display: flex}'],
})
export class FootnoteComponent {
  @Input() editor!: Editor;

  constructor() { }

  addFootnote(): void {
    const id = `footnote-${Date.now()}`;
    const footnoteNode = this.editor.schema.nodes['footnote'].create({ id: id });
    const transaction = this.editor.view.state.tr.insert(this.editor.view.state.selection.anchor, footnoteNode);
    this.editor.view.dispatch(transaction);
  }
  
}
