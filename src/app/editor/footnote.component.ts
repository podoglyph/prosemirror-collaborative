import { Component, Input } from '@angular/core';
import { Editor } from 'ngx-editor';

@Component({
  selector: 'app-footnote',
  template: `
    <div class="NgxEditor__Seperator"></div>
    <span class="NgxEditor__MenuItem NgxEditor__MenuItem--Text" (click)="addFootnote()">Insert Footnote</span>
  `,
  styles: [':host {display: flex}'],
})
export class FootnoteComponent {
  @Input() editor!: Editor;

  constructor() { }

  // @TODO: this needs to open a modal or something and allow the person to create a new reference or place an existing one
  addFootnote(): void {
    const id = `footnote-${Date.now()}`;
    const footnoteNode = this.editor.schema.nodes['footnote'].create({ id: id });
    const transaction = this.editor.view.state.tr.insert(this.editor.view.state.selection.anchor, footnoteNode);
    this.editor.view.dispatch(transaction);
    window.alert("Add a new reference")
  }
  
}