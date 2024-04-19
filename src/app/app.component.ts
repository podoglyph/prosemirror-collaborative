import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import Quill from 'quill';
import { QuillBinding } from 'y-quill'
import QuillCursors from 'quill-cursors';

Quill.register('modules/cursors', QuillCursors as any)
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'quill-collaborative';
  quill!: Quill;
  ydoc: Y.Doc;
  provider: WebrtcProvider;
  yarray: Y.Array<any>;

  constructor() {
    this.ydoc = new Y.Doc();
    // clients connected to the same room-name share document updates
    this.provider = new WebrtcProvider('your-room-name', this.ydoc, { password: 'optional-room-password' })
    this.yarray = this.ydoc.get('array', Y.Array)
  }

  ngOnInit(): void {
    const type = this.ydoc.getText('quill')

    var editor = new Quill('#editor', {
      modules: {
        cursors: true,
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          ['image', 'code-block']
        ]
      },
      placeholder: 'Start collaborating...',
      theme: 'snow' // or 'bubble'
    })

    // Optionally specify an Awareness instance, if supported by the Provider
    const binding = new QuillBinding(type, editor, this.provider.awareness)
  }
}
