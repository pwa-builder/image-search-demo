import { LitElement, css, html } from 'lit';
import { property, state, customElement } from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/drawer/drawer.js';

import { fluentButton, fluentTextField, fluentProgressRing, provideFluentDesignSystem } from '@fluentui/web-components';

provideFluentDesignSystem().register(fluentButton(), fluentTextField(), fluentProgressRing());

import { styles } from '../styles/shared-styles';

import "../components/photo-list";
import "../components/app-search";

@customElement('app-home')
export class AppHome extends LitElement {

  // For more information on using properties and state in lit
  // check out this link https://lit.dev/docs/components/properties/
  @property() message = 'Welcome!';

  @state() photoFiles: any[] = [];

  @state() selected: any[] = [];

  @state() loading: boolean = false;

  static styles = [
    styles,
    css`
      main {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      #home-actions {
          position: fixed;
          top: 7px;
          right: 10px;
      }

      #load-files {
        width: 64px;
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

      fluent-progress-ring {
        width: 22px;
        height: 22px;
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
    this.loading = true;
    const { getLocalFiles } = await import('../services/files');
    const files = await getLocalFiles();
    if (files) {
      this.photoFiles = [...files, ...this.photoFiles];
      console.log(files);
    }

    this.loading = false;
  }

  handleSelectedFiles(selectedImages: any) {
    console.log("selected images", selectedImages);
    this.selected = selectedImages;
  }

  async deleteSelectedFiles() {
    const { deleteFromDB } = await import('../services/files');
    for (const file of this.selected) {
      await deleteFromDB(file.id);
    }

    this.selected = [];

    const { getFromDB } = await import("../services/files");
    const files = await getFromDB();
    if (files) {
      this.photoFiles = files;
    }
  }

  async analyzeSelectedFiles() {
    console.log("analyze selected files", this.selected);
    const drawer: any = this.shadowRoot?.querySelector('.dialog-overview');
    await drawer!.show();
  }


  render() {
    return html`
      <app-header></app-header>

      <app-search @search-results="${($event: any) => this.handleSearchFiles($event.detail.results)}"></app-search>

      <div id="home-actions">
        ${this.selected && this.selected.length > 0 ? html`
          <fluent-button appearance="accent" @click="${() => this.analyzeSelectedFiles()}">Analyze</fluent-button>
          <fluent-button appearance="stealth" @click="${() => this.deleteSelectedFiles()}">Delete Files</fluent-button>
          ` : null}
        <fluent-button ?disabled="${this.loading}" id="load-files" @click="${() => this.loadFiles()}">
          ${this.loading ? html`
              <fluent-progress-ring></fluent-progress-ring>
            ` : "Import"}
        </fluent-button>
      </div>

      <main>
        <photo-list @import="${() => this.loadFiles()}" @select="${($event: CustomEvent) => this.handleSelectedFiles($event.detail.selectedImages)}" .files="${this.photoFiles || []}"></photo-list>
      </main>
    `;
  }
}
