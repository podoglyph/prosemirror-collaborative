import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import {
  ySyncPlugin,
  yUndoPlugin,
  undo,
  redo,
  yCursorPlugin,
  ProsemirrorBinding,
} from 'y-prosemirror';
import { Editor, Toolbar, schema } from 'ngx-editor';
import { keymap } from 'prosemirror-keymap';
import { history } from 'prosemirror-history';
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Awareness } from 'y-protocols/awareness';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent implements OnInit, OnDestroy {
  editor!: Editor;
  ydoc: Y.Doc = new Y.Doc();
  provider!: WebsocketProvider;
  yText!: Y.XmlFragment;

  ngOnInit(): void {
    this.yText = this.ydoc.getXmlFragment('prosemirror');

    // Initialize the provider
    this.provider = new WebsocketProvider(
      'ws://localhost:1234/',
      'ws',
      this.ydoc,
      { connect: true }
    );

    this.initEditor();
  }

  initEditor(): void {
    const toolbar: Toolbar = [
      ['bold', 'italic', 'underline', 'code'],
      ['ordered_list', 'bullet_list'],
      ['link', 'image', 'blockquote'],
    ];

    this.editor = new Editor({
      content: '<p>Hello World from ngx-editor with Yjs!</p>',
      history: true,
      keyboardShortcuts: true,
      plugins: [
        ySyncPlugin(this.yText),
        yCursorPlugin(this.provider.awareness),
        yUndoPlugin(),
      ]
    });
  }


  ngOnDestroy(): void {
    // Destroy the editor and provider to clean up resources
    this.editor.destroy();
    this.provider.destroy();
    this.ydoc.destroy();
  }


}

