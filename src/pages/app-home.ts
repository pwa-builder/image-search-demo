import { LitElement, css, html } from 'lit';
import { property, state, customElement } from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';

import { fluentButton, fluentTextArea, provideFluentDesignSystem } from '@fluentui/web-components';

provideFluentDesignSystem().register(fluentButton(), fluentTextArea());

import { styles } from '../styles/shared-styles';

import "../components/photo-list";
import "../components/app-search";

@customElement('app-home')
export class AppHome extends LitElement {

  // For more information on using properties and state in lit
  // check out this link https://lit.dev/docs/components/properties/
  @property() message = 'Welcome!';

  @state() photoFiles: any[] = [];

  static styles = [
    styles,
    css`
      main {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      #load-files {
          position: fixed;
    top: 10px;
    right: 10px;
      }

      fluent-button svg {
        width: 11px;
        height: 11px;
      }

      fluent-text-area {
        width: 100%;
        height: 100%;
      }

      fluent-text-area::part(control) {
        height: 50vh;
        border: none;
        border-radius: 8px;
        overflow-y: hidden;
      }

      #actions-menu {
        display: flex;
        gap: 8px;
        flex-direction: row;
        justify-content: space-between;
      }

      #main-action-block {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      #file-data-block {
        display: flex;
        gap: 4px;
      }

      #file-size {
        color: grey;
        font-size: 10px;
      }

      #file-name {
        color: grey;
        font-size: 12px;
        font-weight: bold;

        max-width: 169px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow-x: hidden;
      }

      #file-data-block {
        display: flex;
        flex-direction: column;
      }

      @media(prefers-color-scheme: dark) {
        fluent-text-area::part(control) {
            background: #ffffff0f;
            color: white;
        }

        fluent-button.neutral::part(control) {
          background: #ffffff14;
          color: white;
        }
      }

      @media(max-width: 640px) {
        main {
          display: flex;
          flex-direction: column-reverse;
          gap: 10px;
        }
      }
  `];

  async firstUpdated() {
    const { getFromDB } = await import("../services/files");
    const files = await getFromDB();
    if (files) {
      this.photoFiles = files;
    }
  }

  async handleSearchFiles(files: any) {
    if (files.length > 0) {
      console.log("found files", files);
      this.photoFiles = files;
    }
    else {
      const { getFromDB } = await import("../services/files");
      const files = await getFromDB();
      if (files) {
        this.photoFiles = files;
      }
    }
  }

  async loadFiles() {
    const { getLocalFiles } = await import('../services/files');
    const files = await getLocalFiles();
    if (files) {
      this.photoFiles = [...files, ...this.photoFiles];
      console.log(files);
    }
  }


  render() {
    return html`
      <app-header></app-header>

      <app-search @search-results="${($event: any) => this.handleSearchFiles($event.detail.results)}"></app-search>

      <fluent-button id="load-files" @click="${() => this.loadFiles()}" appearance="accent">Add Files</fluent-button>

      <main>
        <photo-list .files="${this.photoFiles || []}"></photo-list>
      </main>
    `;
  }
}
