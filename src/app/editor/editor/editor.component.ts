import { Component, OnDestroy, OnInit } from '@angular/core';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import {
  ySyncPlugin,
  yUndoPlugin,
  yCursorPlugin,
} from 'y-prosemirror';
import { Editor, Toolbar, toHTML } from 'ngx-editor';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FormGroup, FormControl } from '@angular/forms';
import schema from '../schema';
import { Plugin, PluginKey } from "prosemirror-state";


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
  docValue: any;
  unsubscribe$: Subject<void> = new Subject<void>();
  wordCount: number = 0;

  showPopup: boolean = false;
  position: { [Key: string]: string } = {};
  selectionText: string = "";

  form = new FormGroup({
    editorContent: new FormControl(""),
  });

  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  googleSearchPlugin = new Plugin({
    key: new PluginKey("selection-google"),
    view: () => ({
      update: (view) => {
        // Details about the API and usage of the EditorView object are available in the
        // ProseMirror documentation - https://prosemirror.net/docs/ref/#view
        const state = view.state;
        const selectionCollapsed = state.selection.empty;

        if (!selectionCollapsed) {
          const { from, to } = state.selection;
          const start = view.coordsAtPos(from),
            end = view.coordsAtPos(to);
          const left = Math.max((start.left + end.left) / 2, start.left);
          // The Editor is initialized outside of the Angular Zone for better performance.
          // Run any plugin code that needs to trigger the Angular Change Detection in the zone.
          // this.ngZone.run(() => {
            this.showPopup = true;
            this.position = {
              top: start.top + "px",
              left: left + "px",
            };
            this.selectionText = "selection ehre"
          // });
        } else {
          this.showPopup = false;
          // this.ngZone.run(() => {
          // });
        }
      },
    }),
  });



  ngOnInit(): void {
    this.yText = this.ydoc.getXmlFragment('prosemirror');

    // Initialize the provider
    this.provider = new WebsocketProvider(
      environment.webSocketUri,
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
      inputRules: true,
      schema: schema,
      plugins: [
        ySyncPlugin(this.yText),
        yCursorPlugin(this.provider.awareness),
        yUndoPlugin(),
        // this.googleSearchPlugin,
      ]
    });

    this.monitorUpdates();
  }

  ngOnDestroy(): void {
    // Destroy the editor and provider to clean up resources
    this.editor.destroy();
    this.provider.destroy();
    this.ydoc.destroy();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  monitorUpdates(): void {
    this.editor.update.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.docValue = data.state.doc.toJSON();
      this.countWords(data.state.doc);
      // const contentToSave = JSON.stringify(this.docValue);
      // this.saveDocument(contentToSave);
    });
  }

  saveDocument(content: string): void {
    // this content is what gets saved in the database
    // {"type":"doc","content":[{"type":"paragraph","attrs":{"align":null}}]}
    console.log(content);
  }

  docToHtml(): void {
    const html = toHTML(this.docValue);
    console.log(html);
  }

  countWords(doc: any): void {
    let count = 0;
    doc.descendants((node: any) => {
      if (node.isText) {
        let text = node.text;
        if (text) {
          // Split text on spaces, tabs, new lines, etc., and filter out empty strings
          count += text.split(/\s+/).filter((word: string) => word.length > 0).length;
        }
      }
    });

    this.wordCount = count;
  }

}