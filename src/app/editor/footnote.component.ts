import { Component, Input } from '@angular/core';
import { Editor } from 'ngx-editor';

@Component({
  selector: 'app-footnote',
  template: `
    <div class="NgxEditor__Seperator"></div>
    <span class="NgxEditor__MenuItem NgxEditor__MenuItem--Text" (click)="addFootnote()">Add Footnote</span>
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
